"use client";

import { useState } from "react";
import { useToReadList } from "@/hooks/useToReadList";
import { CsvUpload } from "@/components/CsvUpload";
import { BlindDate } from "@/components/BlindDate";

export default function Home() {
  const { books, importBooks, toggleReveal } = useToReadList();
  const [csvVersion, setCsvVersion] = useState(0);
  const [started, setStarted] = useState(false);

  function handleImport(imported: typeof books) {
    importBooks(imported);
    setCsvVersion((v) => v + 1);
    setStarted(false);
  }

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

      {!started && <CsvUpload onImport={handleImport} />}

      {books.length > 0 && (
        <BlindDate
          key={csvVersion}
          books={books}
          onMarkRevealed={(id) => toggleReveal(id, true)}
          onStart={() => setStarted(true)}
        />
      )}
    </main>
  );
}