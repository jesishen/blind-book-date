"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { Book } from "@/types/book";

interface GoodreadsRow {
  "Book Id"?: string;
  Title?: string;
  Author?: string;
  "Exclusive Shelf"?: string;
}

export function CsvUpload({
  onImport,
}: {
  onImport: (books: Book[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    setFileName(file.name);

    Papa.parse<GoodreadsRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const toReadRows = results.data.filter(
            (row) => row["Exclusive Shelf"]?.trim() === "to-read"
          );

          if (toReadRows.length === 0) {
            setError(
              'No "to-read" books found in this file. Make sure this is a Goodreads library export CSV.'
            );
            return;
          }

          const books: Book[] = toReadRows
            .filter((row) => row.Title && row.Author)
            .map((row) => ({
              id: row["Book Id"] || crypto.randomUUID(),
              title: row.Title!.trim(),
              author: row.Author!.trim(),
              revealed: false,
              createdAt: new Date().toISOString(),
            }));

          onImport(books);
        } catch {
          setError("Couldn't read that file. Make sure it's a valid CSV.");
        }
      },
      error: () => {
        setError("Couldn't read that file. Make sure it's a valid CSV.");
      },
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-stone-200 bg-white/60 p-6 shadow-sm">
      <h2 className="font-serif text-lg text-stone-800">
        Upload your to-read list
      </h2>
      <p className="text-xs text-stone-500">
        Export your library from Goodreads (My Books → Import/Export → Export
        Library) and upload the CSV here. Nothing is saved — you&rsquo;ll
        upload it again next time.
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white px-4 py-8 text-center transition hover:border-amber-700/50 hover:bg-amber-50/40"
      >
        <p className="text-2xl">📄</p>
        <p className="text-sm text-stone-600">
          Click to choose a file, or drag it here
        </p>
        {fileName && (
          <p className="text-xs text-stone-400">Selected: {fileName}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}