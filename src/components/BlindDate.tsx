"use client";

import { useState } from "react";
import { Book } from "@/types/book";
import { BookSlot } from "./BookSlot";
import { fetchCoverUrl } from "@/lib/googleBooks";

export function BlindDate({
  books,
  onMarkRevealed,
}: {
  books: Book[];
  onMarkRevealed: (id: string) => void;
}) {
  const [current, setCurrent] = useState<Book | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  function pickRandomBook(): Book | null {
    if (books.length === 0) return null;
    const notSeen = books.filter((b) => !seenIds.has(b.id));

    // Once every book has come up this cycle, start a fresh cycle
    // rather than getting stuck with an empty pool.
    if (notSeen.length === 0) {
      setSeenIds(new Set());
      return books[Math.floor(Math.random() * books.length)];
    }

    return notSeen[Math.floor(Math.random() * notSeen.length)];
  }

  async function fetchTeaser(book: Book): Promise<string[]> {
    const res = await fetch("/api/generate-teaser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        description: book.description,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data.keywords as string[];
  }

  async function handleReroll() {
    const picked = pickRandomBook();
    if (!picked) return;

    setSeenIds((prev) => new Set(prev).add(picked.id));
    setError(null);
    setRevealed(false);
    setCoverUrl(null);
    setCurrent(picked);
    setLoading(true);

    try {
      const keywords = await fetchTeaser(picked);
      setCurrent({ ...picked, teaserKeywords: keywords });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate teaser"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUnwrap() {
    if (!current) return;
    setRevealed(true);
    onMarkRevealed(current.id);

    setCoverLoading(true);
    const url = await fetchCoverUrl(current.title, current.author);
    setCoverUrl(url);
    setCoverLoading(false);
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleReroll}
          disabled={books.length === 0}
          className="rounded-full bg-amber-800 px-6 py-3 text-base font-medium text-white transition hover:bg-amber-900 disabled:opacity-50"
        >
          Surprise me
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  const ready = !!current.teaserKeywords;

  return (
    <div className="flex flex-col items-center gap-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <BookSlot
        book={current}
        revealed={revealed}
        coverUrl={coverUrl}
        coverLoading={coverLoading}
      />

      {loading && <p className="text-sm text-stone-500">Generating teaser…</p>}

      <div className="flex gap-3">
        {!revealed && ready && (
          <button
            onClick={handleUnwrap}
            className="rounded-full bg-amber-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-900"
          >
            Unwrap
          </button>
        )}
        <button
          onClick={handleReroll}
          disabled={loading}
          className="rounded-full border border-amber-800/40 px-5 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-50 disabled:opacity-50"
        >
          Reroll
        </button>
      </div>
    </div>
  );
}