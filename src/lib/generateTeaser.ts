import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildTeaserPrompt } from "./prompts/teaser";

const TeaserSchema = z.array(z.string().min(3).max(60)).length(3);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function isRateLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("RESOURCE_EXHAUSTED") || msg.includes('"code":429');
}

async function callGemini(
  title: string,
  author: string,
  description: string
): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: buildTeaserPrompt(title, author, description),
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      maxOutputTokens: 150,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No text content returned from Gemini");
  }

  const cleaned = stripMarkdownFences(text);
  const parsed = JSON.parse(cleaned);
  return TeaserSchema.parse(parsed);
}

export async function generateTeaser(
  title: string,
  author: string,
  description: string = "",
  maxRetries: number = 2
): Promise<string[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callGemini(title, author, description);
    } catch (err) {
      lastError = err;

      // Don't retry rate-limit errors at all — retrying just spends
      // another attempt against the same tight quota and makes the
      // situation worse. Fail immediately and let the client-side
      // cooldown handle waiting instead.
      if (isRateLimitError(err)) break;

      if (attempt === maxRetries) break;
    }
  }

  console.error("Teaser generation failed after retries:", lastError);

  if (isRateLimitError(lastError)) {
    throw new Error(
      "The free AI tier is rate-limited right now — please wait about 30 seconds and try again."
    );
  }

  throw new Error(
    "Failed to generate a valid teaser after retrying. Please try again."
  );
}