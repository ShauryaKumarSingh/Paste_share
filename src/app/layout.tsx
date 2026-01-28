import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "Paste Share - Instant Code & Text Sharing",
  description: "Share code snippets and text with expiration options, syntax highlighting, and view tracking",
  keywords: "pastebin, paste, code sharing, snippets, text sharing",
  openGraph: {
    title: "Paste Share",
    description: "Instantly share code snippets with expiration controls",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
