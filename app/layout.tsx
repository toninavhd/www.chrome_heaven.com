import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chromeheaven.com"),
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
