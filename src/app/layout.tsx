import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://alexmatosolive.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alex Matos Olive — iOS Developer & CTO",
    template: "%s — Alex Matos Olive",
  },
  description:
    "Computer Engineering student at UB, iOS developer, and Co-founder & CTO at WRDB. I build real product end to end — a native iOS AI app live on the App Store, serverless backends, and web.",
  keywords: [
    "Alex Matos Olive",
    "iOS Developer",
    "Swift",
    "SwiftUI",
    "WRDB",
    "Barcelona",
    "University of Barcelona",
  ],
  authors: [{ name: "Alex Matos Olive" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Alex Matos Olive — iOS Developer & CTO",
    description:
      "iOS developer and Co-founder & CTO at WRDB. Building real product end to end.",
    siteName: "Alex Matos Olive",
  },
  alternates: {
    canonical: siteUrl,
    types: { "application/rss+xml": `${siteUrl}/blog/rss.xml` },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-brand-contrast"
        >
          Skip to content
        </a>
        <LenisProvider>
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LenisProvider>
      </body>
    </html>
  );
}
