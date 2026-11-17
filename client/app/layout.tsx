import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velvet Protocol — The Nocturne Heist",
  description:
    "2.5D Gothic Prompt-Injection Heist Game — outsmart C.O.R.V.U.S., the AI warden.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
