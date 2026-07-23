export function buildTeaserPrompt(
  title: string,
  author: string,
  description: string
) {
  return `You are generating a "blind date with a book" teaser. The goal is to capture the VIBE and MOOD of a book in exactly 3 short phrases, without giving away the title, author, genre labels, or specific plot details (no character names, no spoilers).

Book: "${title}" by ${author}
Description/reviews: ${description || "No description available."}

Rules:
- Return exactly 3 short phrases (3-5 words each, under 30 characters), evocative and sensory rather than descriptive
- Do NOT mention the title, author name, or genre category directly (e.g. avoid "romance", "thriller", "sci-fi" as literal words)
- Do NOT reveal plot twists, character names, or specific events
- If no description is available, infer a plausible vibe from the title and author's typical style/genre conventions, but stay vague enough to avoid being wrong
- Think of these like "vibe check" tags a friend would text you before recommending a book blind

Return a JSON array of exactly 3 strings — nothing else.

Example: ["slow burn feeling", "for rainy afternoons", "will wreck you softly"]`;
}
