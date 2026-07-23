"use client";

import { Book } from "@/types/book";
import { KeywordChip } from "./KeywordChip";

export function BookSlot({
  book,
  revealed,
  coverUrl,
  coverLoading,
}: {
  book: Book;
  revealed: boolean;
  coverUrl?: string | null;
  coverLoading?: boolean;
}) {
  return (
    <div className="flex w-64 aspect-[1/1.6] flex-col items-center justify-center gap-4 rounded-2xl border border-amber-800/20 bg-gradient-to-b from-amber-50 to-stone-50 p-6 shadow-md">
      {revealed ? (
        <>
          <div className="flex w-32 items-center justify-center overflow-hidden rounded-lg bg-stone-200 aspect-[1/1.6]">
            {coverLoading ? (
              <p className="text-2xl">📖</p>
            ) : coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <p className="text-2xl">📖</p>
            )}
          </div>
          <div className="text-center">
            <p className="font-serif text-xl text-stone-800">{book.title}</p>
            <p className="mt-1 text-sm text-stone-500">{book.author}</p>
          </div>
        </>
      ) : (
        <>
          <p className="text-3xl">🎁</p>
          <div className="flex flex-col items-center gap-3">
            {book.teaserKeywords?.map((k, i) => (
              <KeywordChip key={i} text={k} />
            )) ?? (
              <>
                <KeywordChip text="" loading />
                <KeywordChip text="" loading />
                <KeywordChip text="" loading />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}