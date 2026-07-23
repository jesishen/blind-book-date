import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blind Date with a Book",
  description: "Meet your next read blind — vibes only, no spoilers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
