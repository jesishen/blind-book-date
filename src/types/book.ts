export interface Book {
  id: string; // crypto.randomUUID()
  title: string;
  author: string;
  description?: string;
  teaserKeywords?: string[]; // cached after generation
  revealed?: boolean; // UI state for blind-date reveal
  createdAt: string;
}
