export function KeywordChip({
  text,
  loading = false,
}: {
  text: string;
  loading?: boolean;
}) {
  return (
    <span className="inline-block rounded-full border border-amber-800/20 bg-amber-50 px-4 py-2 text-center font-serif text-sm text-amber-900 shadow-sm">
      {loading ? (
        <span className="inline-flex gap-1">
          <span className="animate-bounce [animation-delay:0ms]">.</span>
          <span className="animate-bounce [animation-delay:150ms]">.</span>
          <span className="animate-bounce [animation-delay:300ms]">.</span>
        </span>
      ) : (
        text
      )}
    </span>
  );
}