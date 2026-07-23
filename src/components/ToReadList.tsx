"use client";

import { Book } from "@/types/book";

export function ToReadList({
  books,
  onRemove,
}: {
  books: Book[];
  onRemove: (id: string) => void;
}) {
  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white/40 p-6 text-center text-sm text-stone-500">
        Your to-read list is empty. Upload a CSV above to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-serif text-lg text-stone-800">To-read list</h2>
      <ul className="flex flex-col gap-2">
        {books.map((book) => (
          <li
            key={book.id}
            className={`rounded-xl border px-4 py-3 ${
              book.revealed
                ? "border-stone-200 bg-stone-100 opacity-60"
                : "border-stone-200 bg-white/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-stone-800">{book.title}</p>
                <p className="text-xs text-stone-500">{book.author}</p>
              </div>
              <button
                onClick={() => onRemove(book.id)}
                className="text-xs text-stone-400 hover:text-red-500"
                aria-label={`Remove ${book.title}`}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}