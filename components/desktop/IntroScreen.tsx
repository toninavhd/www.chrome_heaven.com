'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MenuItem {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  glowColor: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'music', label: 'music', sublabel: 'player', icon: '♪', color: '#ff5630', glowColor: 'rgba(255,86,48,0.82)' },
  { id: 'gallery', label: 'gallery', sublabel: 'photos', icon: '⬡', color: '#dfe5ef', glowColor: 'rgba(223,229,239,0.72)' },
  { id: 'blog', label: 'diary', sublabel: 'entries', icon: '✦', color: '#ff4fa0', glowColor: 'rgba(255,79,160,0.76)' },
  { id: 'links', label: 'links', sublabel: 'web', icon: '◈', color: '#6be6ff', glowColor: 'rgba(107,230,255,0.76)' },
  { id: 'welcome', label: 'about', sublabel: 'profile', icon: '◉', color: '#ffe15f', glowColor: 'rgba(255,225,95,0.76)' },
  { id: 'settings', label: 'system', sublabel: 'setup', icon: '⚙', color: '#a7ff98', glowColor: 'rgba(167,255,152,0.7)' },
];

interface IntroScreenProps {
  onEnter: (windowId: string) => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(800);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight || 800);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleSelect = (index: number, id: string) => {p
    if (isExiting) return;
    setSelectedIndex(index);
    setIsExiting(true);
    setTimeout(() => onEnter(id), 700);
  };

  const radius = viewportHeight * 0.6;
  const borderSize = radius * 0.021;
  const totalArea = 48;
  const increment = totalArea / (MENU_ITEMS.length - 1);
  const startPoint = 0 - (totalArea / 2);
  const fontSize = radius * 0.12;
  const linkSize = radius * 0.25;
  const backgroundColor = hoveredIndex !== null ? MENU_ITEMS[hoveredIndex].color : '#b71f1f';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle at 50% 32%, rgba(255,255,255,0.14), transparent 22%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.25) 52%, rgba(0,0,0,0.55) 100%), ${backgroundColor}`,
        fontFamily: "'Economica', 'Arial Narrow', sans-serif",
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        WebkitBackfaceVisibility: 'hidden',
        transition: 'background 0.22s ease-out',
      }}
    >
      {isExiting && (
        <div
          className="absolute inset-0 z-50 bg-black"
          style={{ animation: 'fadeInBlack 0.7s ease forwards' }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          border: `${borderSize}px solid rgba(255,255,255,0.9)`,
          top: `-${radius * 0.2}px`,
          left: `${radius * -1}px`,
          boxSizing: 'border-box',
          boxShadow: '0 0 30px rgba(255,255,255,0.12), inset 0 0 18px rgba(255,255,255,0.08)',
        }}
      />

      {MENU_ITEMS.map((item, index) => {
        const deg = startPoint + (index * increment);
        const isHovered = hoveredIndex === index;
        const isSelected = selectedIndex === index;

        return (
          <div key={item.id} style={{ position: 'absolute', inset: 0 }}>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: `${borderSize}px`,
                top: `${viewportHeight * 0.4 + borderSize}px`,
                width: `${radius + (borderSize / 2)}px`,
                height: `${linkSize}px`,
                borderRight: `${borderSize * 2}px solid rgba(255,255,255,0.92)`,
                opacity: isHovered || isSelected ? 1 : 0,
                transition: 'all 0.2s ease-out',
                transform: `rotate(${deg}deg)`,
                transformOrigin: `0px ${linkSize * 0.5}px`,
                boxShadow: isHovered || isSelected ? `0 0 18px ${item.glowColor}` : 'none',
              }}
            />

            <a
              href="#"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(event) => {
                event.preventDefault();
                handleSelect(index, item.id);
              }}
              style={{
                position: 'absolute',
                left: `${borderSize}px`,
                top: `${(viewportHeight / 2) - (viewportHeight * 0.1) + borderSize}px`,
                paddingLeft: `${radius * 1.2}px`,
                fontSize: `${fontSize}px`,
                height: `${linkSize}px`,
                lineHeight: `${linkSize}px`,
                color: '#fff',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                zIndex: 10,
                transform: `rotate(${deg}deg)`,
                transformOrigin: `0px ${linkSize * 0.5}px`,
                transition: 'all 0.2s ease-out, text-shadow 0.2s ease-out, filter 0.2s ease-out',
                textShadow: isHovered || isSelected ? `0 0 18px ${item.color}, 0 0 38px ${item.color}` : '0 0 12px rgba(255,255,255,0.2)',
                filter: isHovered || isSelected ? 'drop-shadow(0 0 12px rgba(255,255,255,0.18))' : 'none',
                transformStyle: 'preserve-3d',
                willChange: 'transform, text-shadow, filter',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform: isHovered || isSelected ? 'translateY(-1px) scale(1.04)' : 'translateY(0) scale(1)',
                  transition: 'transform 0.2s ease-out',
                  textShadow: isHovered || isSelected ? `0 0 18px ${item.color}` : 'none',
                }}
              >
                {item.label}
              </span>
            </a>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          right: '4vw',
          bottom: '4vh',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.82)',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          opacity: 0.9,
          fontFamily: "'Orbitron', 'Segoe UI', sans-serif",
          textShadow: '0 0 18px rgba(255,255,255,0.35)',
        }}
      >
        CHROME_HEAVEN
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Economica:wght@400;700&family=Orbitron:wght@400;500;700;800;900&display=swap');

        a {
          font-family: 'Orbitron', 'Segoe UI', sans-serif;
          font-weight: 700;
        }

        a span {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
          text-shadow: 0 1px 0 rgba(255,255,255,0.14), 0 4px 10px rgba(0,0,0,0.22);
        }

        a:hover span,
        a:focus span {
          animation: textLift 0.18s ease-out forwards;
        }

        @keyframes textLift {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-2px) scale(1.05); }
        }

        @keyframes fadeInBlack {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
