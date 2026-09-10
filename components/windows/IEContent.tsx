'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const LINKS = [
  {
    label: '◄ HOMEPAGE ►',
    sublabel: '主页 / INICIO',
    href: '/',
    bg: '#c45000',
    accent: '#ffcc00',
    glyph: '⊕',
    internal: true,
  },
  {
    label: '♪ BANDCAMP',
    sublabel: '音乐 / MÚSICA',
    href: 'https://bandcamp.com',
    bg: '#008870',
    accent: '#00fff0',
    glyph: '◈',
    internal: false,
  },
  {
    label: '★ INSTAGRAM',
    sublabel: '照片 / FOTOS',
    href: 'https://www.instagram.com/chrome.heaven',
    bg: '#99009a',
    accent: '#ff77ff',
    glyph: '◉',
    internal: false,
  },
  {
    label: '✦ TUMBLR',
    sublabel: '博客 / BLOG',
    href: 'https://chromeheaven.tumblr.com',
    bg: '#0000cc',
    accent: '#77aaff',
    glyph: '⬡',
    internal: false,
  },
  {
    label: '▶ YOUTUBE',
    sublabel: '视频 / VIDEO',
    href: 'https://www.youtube.com/@chrome_heaven',
    bg: '#990000',
    accent: '#ff5555',
    glyph: '◐',
    internal: false,
  },
  {
    label: '✿ TIKTOK',
    sublabel: '短视频 / CLIPS',
    href: 'https://www.tiktok.com/@chrome_heaven',
    bg: '#111111',
    accent: '#00f0d0',
    glyph: '⬟',
    internal: false,
  },
];

function MarqueeTicker({ text }: { text: string }) {
  const content = text.repeat(6);
  // Use pure CSS animation — no JS re-renders
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', height: 14 }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: 9,
          color: '#ffcc00',
          fontFamily: 'monospace',
          letterSpacing: 3,
          animation: 'marquee-scroll 18s linear infinite',
        }}
      >
        {content}
      </span>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export const IEContent: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0a0a0a', fontFamily: "'MS Gothic', monospace" }}
    >
      {/* IE toolbar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1a0030 0%, #00001a 100%)',
          borderBottom: '2px solid #ff00ff',
          padding: '4px 6px',
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        <button
          className="win2k-btn"
          style={{ fontSize: 10, padding: '2px 8px', background: '#330044', color: '#ff77ff', border: '1px solid #ff00ff' }}
          onClick={() => alert('Back navigation simulation')}
        >
          ◄ BACK
        </button>
        <button
          className="win2k-btn"
          style={{ fontSize: 10, padding: '2px 8px', background: '#330044', color: '#ff77ff', border: '1px solid #ff00ff' }}
          onClick={() => alert('Forward navigation simulation')}
        >
          FWD ►
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: '#ff77ff', fontFamily: 'monospace' }}>URL:</span>
          <div
            style={{
              flex: 1,
              background: '#050010',
              border: '1px solid #7700aa',
              fontFamily: 'monospace',
              fontSize: 10,
              padding: '2px 6px',
              color: '#00ffcc',
              letterSpacing: 1,
            }}
          >
            http://www.chromeheaven.com/links
          </div>
        </div>
      </div>

      {/* Main scroll area */}
      <div
        className="flex-1 overflow-y-auto win2k-scroll"
        style={{
          background:
            'repeating-linear-gradient(180deg, transparent, transparent 36px, #63f800ff 23px, #00ff00ff 24px),' +
            'repeating-linear-gradient(90deg, transparent, transparent 23px, #121213ff 23px, #1eff00a6 24px), #000000ff',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Banner strip */}
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: 'linear-gradient(90deg, #ff0080 0%, #ff6600 50%, #ffcc00 100%)',
            border: '3px solid #fff',
            outline: '2px solid #000',
            padding: '3px 8px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: 9,
            fontWeight: 'bold',
            color: '#000',
            letterSpacing: 3,
          }}
        >
          ★★ CHROME HEAVEN WEB PORTAL 网络门户 ★★
        </div>

        {/* Main card */}
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: '#0a0809ff',
            border: '3px solid #ff00ff',
            outline: '2px solid #000',
            boxShadow: glitch
              ? '4px 0 0 #ff0000, -4px 0 0 #00ffff, 0 0 30px #ff00ff88'
              : '0 0 18px #ff00ff44, inset 0 0 30px #00002244',
            transition: glitch ? 'none' : 'box-shadow 0.3s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scanlines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Title bar */}
          <div
            style={{
              background: 'linear-gradient(90deg, #330066 0%, #110022 60%, #330000 100%)',
              borderBottom: '2px solid #ff00ff',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ff77ff', letterSpacing: 3, fontWeight: 'bold' }}>
                ▓ LINKS.网站链接 ▓
              </div>
              <div style={{ fontSize: 8, color: '#7755aa', letterSpacing: 2 }}>
                影が届くまで · CHROME HEAVEN
              </div>
            </div>
            <div style={{ fontSize: 18, color: '#ff00ff', opacity: 0.6 }}>⬡</div>
          </div>

          {/* Marquee */}
          <div
            style={{
              borderBottom: '1px solid #330033',
              padding: '2px 6px',
              background: '#0a000f',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <MarqueeTicker text="★ CHROME HEAVEN ★ 网络天堂 ★ MUSIC ★ 艺术 ★ 视觉 ★ 银色铬天堂 ★ " />
          </div>

          {/* Profile block */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderBottom: '2px solid #220033',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  border: '2px solid #ff00ff',
                  outline: '1px solid #000',
                  boxShadow: '0 0 10px #ff00ff66, inset 0 0 8px #00000088',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Image
                  src="/images/Captura_de_pantalla_2026-09-10_143748.png"
                  alt="Uloe avatar"
                  width={58}
                  height={58}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    filter: glitch
                      ? 'hue-rotate(180deg) saturate(2)'
                      : 'saturate(1.3) contrast(1.1)',
                    transition: glitch ? 'none' : 'filter 0.3s',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute', top: -3, left: -3,
                  width: 8, height: 8, background: '#ffcc00', border: '1px solid #000',
                }}
              />
              <div
                style={{
                  position: 'absolute', bottom: -3, right: -3,
                  width: 8, height: 8, background: '#ff0080', border: '1px solid #000',
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  textShadow: '0 0 8px #ff00ff, 1px 1px 0 #000',
                }}
              >
                CHROME HEAVEN
              </div>
              <div style={{ fontSize: 9, color: '#ffcc00', fontFamily: 'monospace', letterSpacing: 2, marginTop: 2 }}>
                ⬡ 网络天堂 ⬡
              </div>
              <div style={{ fontSize: 8, color: '#7755aa', fontFamily: 'monospace', marginTop: 3, letterSpacing: 1 }}>
                影が届くまで
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div
            style={{
              padding: '6px 14px',
              fontSize: 9,
              color: '#8888bb',
              fontFamily: 'monospace',
              letterSpacing: 1,
              borderBottom: '1px dashed #220033',
              position: 'relative',
              zIndex: 3,
            }}
          >
            ► CLICK ANY DESTINATION TO ACCESS OFFICIAL PROFILES AND STREAMING
          </div>

          {/* Links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 10px',
              gap: 5,
              position: 'relative',
              zIndex: 3,
            }}
          >
            {LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target={link.internal ? undefined : '_blank'}
                rel={link.internal ? undefined : 'noopener noreferrer'}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 10px',
                  background: hovered === i ? link.bg : 'linear-gradient(90deg, #14001f 0%, #100018 100%)',
                  border: hovered === i ? `2px solid ${link.accent}` : '2px solid #330033',
                  outline: '1px solid #000',
                  boxShadow: hovered === i ? `0 0 16px ${link.bg}99, inset 0 0 10px #00000066` : 'none',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glyph box */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: `2px solid ${hovered === i ? link.accent : '#440055'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: hovered === i ? link.accent : '#c000a6ff',
                    flexShrink: 0,
                    background: '#050005',
                    fontFamily: 'monospace',
                    transition: 'all 0.12s',
                  }}
                >
                  {link.glyph}
                </div>

                {/* Labels */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      color: hovered === i ? '#fff' : '#ddaaff',
                      letterSpacing: 2,
                      textShadow: hovered === i ? `0 0 8px ${link.accent}, 1px 1px 0 #000` : 'none',
                      transition: 'all 0.12s',
                    }}
                  >
                    {link.label}
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      fontFamily: 'monospace',
                      color: hovered === i ? link.accent : '#5500aa',
                      letterSpacing: 1,
                      marginTop: 1,
                    }}
                  >
                    {link.sublabel}
                  </div>
                </div>

                {/* Arrow */}
                <div
                  style={{
                    fontSize: 12,
                    color: hovered === i ? link.accent : '#440055',
                    fontFamily: 'monospace',
                    transition: 'all 0.12s',
                    transform: hovered === i ? 'translateX(3px)' : 'translateX(0)',
                  }}
                >
                  ►
                </div>

                {/* Hover accent stripe */}
                {hovered === i && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0, top: 0, bottom: 0, width: 3,
                      background: link.accent,
                      boxShadow: `0 0 6px ${link.accent}`,
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Bottom badges */}
          <div
            style={{
              borderTop: '2px solid #220033',
              padding: '6px 10px',
              display: 'flex',
              gap: 6,
              justifyContent: 'center',
              position: 'relative',
              zIndex: 3,
              flexWrap: 'wrap',
            }}
          >
            {['NETSCAPE', 'HTML4', 'Y2K', '中文WEB', 'FLASH'].map((badge) => (
              <div
                key={badge}
                style={{
                  fontSize: 7,
                  fontFamily: 'monospace',
                  color: '#000',
                  background: 'linear-gradient(135deg, #ffcc00, #ff6600)',
                  border: '1px solid #000',
                  padding: '2px 5px',
                  letterSpacing: 1,
                  fontWeight: 'bold',
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 8,
            fontFamily: 'monospace',
            color: '#fc019cff',
            letterSpacing: 2,
            textAlign: 'center',
          }}
        >
          ©2000 CHROME HEAVEN · 网络天堂 · ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
};
