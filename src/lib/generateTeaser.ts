import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildTeaserPrompt } from "./prompts/teaser";

// Slightly more headroom than the prompt asks for, since LLMs occasionally
// run a phrase a bit long — better to accept it than throw the whole
// generation away over a few extra characters.
const TeaserSchema = z.array(z.string().min(3).max(60)).length(3);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

// Gemini's free tier returns a 429 with a suggested retryDelay (e.g. "26s")
// embedded in the error message. Extract it so our retry actually waits
// long enough instead of immediately re-hitting the same quota wall.
function parseRetryDelayMs(message: string): number {
  const match = message.match(/"retryDelay":"(\d+(?:\.\d+)?)s"/);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000) + 500; // small buffer
  return 15000; // sensible fallback if we can't parse one
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
    model: "gemini-flash-latest",
    contents: buildTeaserPrompt(title, author, description),
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

      if (attempt === maxRetries) break;

      if (isRateLimitError(err)) {
        const msg = err instanceof Error ? err.message : String(err);
        const delay = parseRetryDelayMs(msg);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      // For malformed JSON / validation errors, retry immediately — those
      // are usually just LLM formatting noise, not a real backoff situation.
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