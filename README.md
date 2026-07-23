# Blind Date with a Book

A stateless-on-the-server web app: manage a to-read list (stored only in your browser's localStorage — nothing saved on any server), then generate a "blind date" teaser for any book using Claude. The teaser is 3 vibe phrases that hint at the mood of the book without revealing the title, author, or spoilers. Click "Reveal" when you're ready to see what you're actually reading.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env example and add your Anthropic API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and set:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   Get a key at https://console.anthropic.com/settings/keys

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## How it works

- Add books (title, author, optional description) to your to-read list — this list lives only in your browser's `localStorage`, never sent anywhere except when you click "Generate teaser."
- Click a book (or "Surprise me" for a random pick) to open the blind-date card.
- Click "Generate teaser" — this calls `/api/generate-teaser`, which sends the book info to Claude and gets back 3 short vibe phrases.
- The card shows only those 3 phrases — no title/author until you click "Reveal."
- "Regenerate" clears the cached teaser and asks Claude for a fresh one.

## Deploying

This is a standard Next.js app, so it deploys cleanly to Vercel:

1. Push this project to a GitHub repo.
2. Import the repo on vercel.com.
3. In the Vercel project's Environment Variables settings, add `ANTHROPIC_API_KEY` with your key.
4. Deploy.

No database is used — every visitor's to-read list lives only in their own browser.

## Project structure

```
src/
  app/
    page.tsx                        # main UI
    api/generate-teaser/route.ts     # server-only API route calling Claude
  components/
    BookForm.tsx
    ToReadList.tsx
    BlindDateCard.tsx
    KeywordChip.tsx
  hooks/
    useToReadList.ts                 # localStorage-backed book list state
  lib/
    generateTeaser.ts                # Claude call + validation + retry
    prompts/teaser.ts                # prompt template
  types/
    book.ts
```
