'use client';

import { useState } from 'react';
import { ChromeHeavenSection } from '../../components/desktop/ChromeHeavenSection';

const THEMES = [
  { id: 'midnight', name: 'Midnight', accent: '#a7ff98', gradient: 'linear-gradient(135deg, #0f172a 0%, #111827 35%, #151b2d 100%)' },
  { id: 'sunset', name: 'Sunset', accent: '#ffb36b', gradient: 'linear-gradient(135deg, #3b0f1d 0%, #3a2a5f 45%, #1e1f3c 100%)' },
  { id: 'sky', name: 'Sky', accent: '#6be6ff', gradient: 'linear-gradient(135deg, #091d2d 0%, #0d2f3d 42%, #121d32 100%)' },
];

export default function SystemPage() {
  const [theme, setTheme] = useState(THEMES[0]);

  return (
    <ChromeHeavenSection title="system" subtitle="display / set-up" accent="#a7ff98">
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 16 }}>backgrounds</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {THEMES.map((item) => (
              <button
                key={item.id}
                onClick={() => setTheme(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 16,
                  border: item.id === theme.id ? '1px solid #a7ff98' : '1px solid rgba(255,255,255,0.12)',
                  background: item.gradient,
                  color: '#fff',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.name}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>preset</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 16 }}>preview</div>
          <div
            style={{
              minHeight: 250,
              borderRadius: 18,
              padding: 18,
              background: theme.gradient,
              display: 'flex',
              alignItems: 'flex-end',
              boxShadow: 'inset 0 0 30px rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>
              chrome heaven
            </div>
          </div>
        </div>
      </div>
    </ChromeHeavenSection>
  );
}
