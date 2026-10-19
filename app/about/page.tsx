'use client';

import { ChromeHeavenSection } from '../../components/desktop/ChromeHeavenSection';

export default function AboutPage() {
  return (
    <ChromeHeavenSection title="about" subtitle="profile" accent="#ffe15f">
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ margin: 0, lineHeight: 1.9, fontSize: 17 }}>
            Chrome Heaven is a creative project born from late-night synth textures, visual edits, and atmospheric storytelling.
            It blends music, digital photography, and personal archives into a single dreamlike space.
          </p>
          <p style={{ marginTop: 18, lineHeight: 1.9, fontSize: 17 }}>
            The goal is simple: create a small world where every sound, image, and written note feels like a memory suspended in the glow of an old screen.
          </p>
        </div>

        <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'linear-gradient(180deg, rgba(255,225,95,0.09), rgba(255,255,255,0.02))' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75 }}>labels</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 12 }}>
            <li>Music</li>
            <li>Visual edits</li>
            <li>Diary</li>
            <li>Web links</li>
          </ul>
        </div>
      </div>
    </ChromeHeavenSection>
  );
}
