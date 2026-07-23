export async function fetchCoverUrl(
  title: string,
  author: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const item = data.items?.[0];
    const imageLinks = item?.volumeInfo?.imageLinks;
    if (!imageLinks) return null;

    const raw = imageLinks.thumbnail || imageLinks.smallThumbnail;
    if (!raw) return null;
    return raw.replace(/^http:/, "https:");
  } catch {
    return null;
  }
}