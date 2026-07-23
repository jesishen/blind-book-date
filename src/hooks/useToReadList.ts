"use client";

import { useCallback, useState } from "react";
import { Book } from "@/types/book";

export function useToReadList() {
  const [books, setBooks] = useState<Book[]>([]);

  const importBooks = useCallback((imported: Book[]) => {
    setBooks(imported);
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const setTeaserKeywords = useCallback(
    (id: string, keywords: string[]) => {
      updateBook(id, { teaserKeywords: keywords });
    },
    [updateBook]
  );

  const toggleReveal = useCallback(
    (id: string, revealed: boolean) => {
      updateBook(id, { revealed });
    },
    [updateBook]
  );

  const clearTeaser = useCallback(
    (id: string) => {
      updateBook(id, { teaserKeywords: undefined, revealed: false });
    },
    [updateBook]
  );

  return {
    books,
    importBooks,
    removeBook,
    updateBook,
    setTeaserKeywords,
    toggleReveal,
    clearTeaser,
  };
}