import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ℭ𝔥𝔯𝔬𝔪𝔢 ℌ𝔢𝔞𝔳𝔢𝔫 — 影が届くまで",
  description: "Official music website for Chrome Heaven / Uloe / Till I Die. Ambient, Breakcore, Witch House, heavenly sounds from Tenerife. Listen to tracks, explore visuals and connect.",
  keywords: ["Chrome Heaven", "Uloe", "Till I Die", "ambient", "breakcore", "dreamcore",  "witch house", "heavenly", "music", "soundcloud", "Tenerife"],
  authors: [{ name: "Chrome Heaven" }],
  openGraph: {
    type: "website",
    title: "ℭ𝔥𝔯𝔬𝔪𝔢 ℌ𝔢𝔞𝔳𝔢𝔫",
    description: "影が届くまで — until the shadow reaches",
    url: "https://www.chromeheaven.com",
    siteName: "Chrome Heaven",
    images: [{ url: "/images/malice_ep_cover.png", width: 1200, height: 630, alt: "Chrome Heaven" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ℭ𝔥𝔯𝔬𝔪𝔢 ℌ𝔢𝔞𝔳𝔢𝔫",
    description: "影が届くまで — until the shadow reaches",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Inter:wght@300;400;500;600&family=Noto+Serif+JP:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
