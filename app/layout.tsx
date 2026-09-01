import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamwatch.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ScamWatch — Registre public des sites signalés pour fraude en ligne",
    template: "%s — ScamWatch",
  },
  description:
    "ScamWatch recense les sites web signalés par des internautes pour arnaque, phishing ou fraude en ligne. Consultez le registre avant de faire confiance à un site.",
  openGraph: {
    type: "website",
    siteName: "ScamWatch",
    title: "ScamWatch — Registre public des sites signalés pour fraude en ligne",
    description:
      "Consultez et signalez les sites web suspects. Modération automatique, aucun compte requis.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamWatch — Registre public des sites signalés pour fraude en ligne",
    description:
      "Consultez et signalez les sites web suspects. Modération automatique, aucun compte requis.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ScamWatch",
    url: SITE_URL,
    description:
      "Registre public des sites web signalés par des internautes pour fraude ou arnaque en ligne.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/site/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="fr" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
