"use client";

import { useToReadList } from "@/hooks/useToReadList";
import { CsvUpload } from "@/components/CsvUpload";
import { BlindDate } from "@/components/BlindDate";

export default function Home() {
  const { books, importBooks, toggleReveal } = useToReadList();

  function handleImport(imported: typeof books) {
    importBooks(imported);
  }

  const hasBooks = books.length > 0;

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 bg-stone-100 px-4 py-10">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-stone-800">
          Blind Date with a Book
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Upload your Goodreads to-read list, then meet a book blind — vibes
          only, no spoilers.
        </p>
      </div>

      {!hasBooks && <CsvUpload onImport={handleImport} />}

      {hasBooks && (
        <BlindDate
          books={books}
          onMarkRevealed={(id) => toggleReveal(id, true)}
        />
      )}
    </main>
  );
}