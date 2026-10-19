'use client';

import { ChromeHeavenSection } from '../../components/desktop/ChromeHeavenSection';

const LINKS = [
  { label: 'Bandcamp', href: 'https://bandcamp.com', accent: '#00ffcc', note: 'Official releases' },
  { label: 'Instagram', href: 'https://www.instagram.com/chrome.heaven', accent: '#ff66ff', note: 'Visuals and updates' },
  { label: 'Tumblr archive', href: 'https://chromeheaven.tumblr.com', accent: '#66aaff', note: 'Aesthetic journal' },
  { label: 'YouTube', href: 'https://www.youtube.com/@chrome_heaven', accent: '#ff5555', note: 'Videos and streams' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@chrome_heaven', accent: '#00f0d0', note: 'Short clips' },
];

export default function LinksPage() {
  return (
    <ChromeHeavenSection title="links" subtitle="web / socials" accent="#6be6ff">
      <div style={{ display: 'grid', gap: 16 }}>
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: 18,
              padding: '18px 20px',
              border: `1px solid ${link.accent}55`,
              background: `linear-gradient(90deg, ${link.accent}1f, rgba(255,255,255,0.02))`,
              boxShadow: `0 0 18px ${link.accent}2c`,
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: link.accent }}>{link.note}</div>
            <div style={{ marginTop: 8, fontSize: 'clamp(1.1rem, 2vw, 1.7rem)', fontWeight: 700, color: '#fff' }}>{link.label}</div>
          </a>
        ))}
      </div>
    </ChromeHeavenSection>
  );
}
