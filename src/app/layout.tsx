import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobSwipe Dashboard",
  description: "Live view of scraped jobs from LinkedIn, Indeed, Mustakbil, and Rozee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-background text-zinc-900">
        {children}
      </body>
    </html>
  );
}
