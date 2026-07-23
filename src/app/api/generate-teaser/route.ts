import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateTeaser } from "@/lib/generateTeaser";

const RequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Server misconfiguration: GEMINI_API_KEY is not set. Add it to your .env.local file.",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 }
    );
  }

  const { title, author, description } = parsed.data;

  try {
    const keywords = await generateTeaser(title, author, description ?? "");
    return NextResponse.json({ keywords });
  } catch (err) {
    console.error("generate-teaser route error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to generate teaser from the LLM. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}