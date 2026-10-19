'use client';

import Link from 'next/link';
import React from 'react';

interface ChromeHeavenSectionProps {
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
}

export function ChromeHeavenSection({ title, subtitle, accent, children }: ChromeHeavenSectionProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#05070a',
        backgroundImage: `
          radial-gradient(circle at 50% 18%, rgba(255,255,255,0.08), transparent 18%),
          linear-gradient(180deg, rgba(14,13,18,0.96), rgba(6,8,11,1)),
          repeating-linear-gradient(0deg, rgba(255,0,60,0.07), rgba(255,0,60,0.07) 1px, transparent 1px, transparent 14px),
          repeating-linear-gradient(90deg, rgba(255,0,60,0.07), rgba(255,0,60,0.07) 1px, transparent 1px, transparent 14px)
        `,
        color: '#f5f7ff',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${accent}33 0%, transparent 38%)`,
          filter: 'blur(80px)',
          opacity: 0.85,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.02)',
              padding: '10px 18px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: 11,
              borderRadius: 999,
              boxShadow: `0 0 20px ${accent}55`,
            }}
          >
            back to menu
          </Link>

          <div
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.26em',
              fontSize: 12,
              opacity: 0.75,
              fontFamily: 'Orbitron, sans-serif',
            }}
          >
            {subtitle}
          </div>
        </header>

        <main
          style={{
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(8,10,18,0.7)',
            borderRadius: 24,
            boxShadow: `0 0 30px ${accent}33`,
            backdropFilter: 'blur(12px)',
            padding: '28px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2.2rem, 4vw, 4rem)',
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#fff',
              textShadow: `0 0 28px ${accent}`,
            }}
          >
            {title}
          </h1>

          <div style={{ marginTop: 28 }}>{children}</div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Orbitron:wght@400;500;700;800;900&display=swap');
        h1 { font-family: 'Cinzel', 'Georgia', serif; }
        a, button { font-family: 'Orbitron', 'Segoe UI', sans-serif; }
      `}</style>
    </div>
  );
}
