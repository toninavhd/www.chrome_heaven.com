'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// Types & Definitions
// ---------------------------------------------------------------------------

type NavSection = 'portal' | 'music' | 'lab3d' | 'lore' | 'links';

interface NavItem {
  id: NavSection;
  label: string;
  cnLabel: string;
  code: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'portal', label: 'PORTAL', cnLabel: '主页', code: '01', path: '/portal' },
  { id: 'music', label: 'RELEASES', cnLabel: '作品', code: '02', path: '/music' },
  { id: 'lab3d', label: '3D LAB', cnLabel: '超现实', code: '03', path: '/3d-space' },
  { id: 'lore', label: 'ARCHIVE', cnLabel: '档案', code: '04', path: '/lore' },
  { id: 'links', label: 'LINKS', cnLabel: '链接', code: '05', path: '/links' },
];

interface AlbumData {
  id: string;
  title: string;
  cnTitle: string;
  year: string;
  format: string;
  bpm: string;
  genre: string;
  desc: string;
  coverBg: string;
  audioUrl: string;
  badge: string;
  discColor: string;
}

const DISCOGRAPHY: AlbumData[] = [
  {
    id: 'nevermind',
    title: 'nevermind 190bpm',
    cnTitle: '极速无所畏 / 190BPM',
    year: '2026',
    format: 'SINGLE / WAV 24-BIT',
    bpm: '190 BPM',
    genre: 'Breakcore / Dreamcore',
    desc: 'High velocity emotional breaks colliding with celestial ambient pads and reverberated vocal fragments.',
    coverBg: 'linear-gradient(135deg, #cc0055 0%, #330088 50%, #001133 100%)',
    audioUrl: '/audio/nevermind_190bpm_uloe.wav',
    badge: 'NEW RELEASE',
    discColor: '#ff0077',
  },
  {
    id: 'lonelystarr',
    title: 'lonelystarr',
    cnTitle: '孤独之星 / 虚拟空灵',
    year: '2026',
    format: 'SINGLE / WAV',
    bpm: '135 BPM',
    genre: 'Dreamcore / Ambient',
    desc: 'Nostalgic reverberated synthesizers depicting endless digital loneliness across late 90s cyber space.',
    coverBg: 'linear-gradient(135deg, #0088aa 0%, #002266 50%, #050215 100%)',
    audioUrl: '/audio/lonelystarr.wav',
    badge: 'FEATURED',
    discColor: '#00f0ff',
  },
  {
    id: 'malice',
    title: 'malice [EP]',
    cnTitle: '恶意全息 / 赛博天使集',
    year: '2025',
    format: 'EP / 4 TRACKS',
    bpm: '160 BPM',
    genre: 'Electronic / Glitch / Vapor',
    desc: 'The foundational introductory EP exploring fragmented memory artifacts and cyber angel theology.',
    coverBg: 'linear-gradient(135deg, #aa8800 0%, #660044 50%, #110022 100%)',
    audioUrl: '/audio/nevermind_190bpm_uloe.wav',
    badge: 'CORE EP',
    discColor: '#ffbb00',
  },
];

const DIRECTORY_LINKS = [
  {
    label: 'BANDCAMP',
    sublabel: '官方试听 / 购买无损 FLAC',
    href: 'https://bandcamp.com',
    bg: '#005544',
    accent: '#00ffcc',
    tag: 'FLAC / WAV',
  },
  {
    label: 'INSTAGRAM',
    sublabel: '视觉摄影 / 概念图集发布',
    href: 'https://www.instagram.com/chrome.heaven',
    bg: '#660066',
    accent: '#ff66ff',
    tag: 'VISUALS',
  },
  {
    label: 'TUMBLR ARCHIVE',
    sublabel: '数码美学 / 灵感日志档案',
    href: 'https://chromeheaven.tumblr.com',
    bg: '#000088',
    accent: '#66aaff',
    tag: 'AESTHETIC',
  },
  {
    label: 'YOUTUBE CHANNEL',
    sublabel: '音乐视频 / 视觉动画放送',
    href: 'https://www.youtube.com/@chrome_heaven',
    bg: '#770000',
    accent: '#ff5555',
    tag: 'MV / 4K',
  },
  {
    label: 'TIKTOK CLIPS',
    sublabel: '片段精选 / 实验循环试听',
    href: 'https://www.tiktok.com/@chrome_heaven',
    bg: '#181818',
    accent: '#00f0d0',
    tag: 'SHORTS',
  },
];

// ---------------------------------------------------------------------------
// 3D Geometry Math for Navigation Canvas (Unicorn Studio Style)
// ---------------------------------------------------------------------------

interface Point3D {
  x: number;
  y: number;
  z: number;
}

type ShapeType = 'icosahedron' | 'torus' | 'octahedron';

function getIcosahedron(): { vertices: Point3D[]; faces: number[][] } {
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVerts: [number, number, number][] = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];
  const vertices = rawVerts.map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return { x: (x / len) * 36, y: (y / len) * 36, z: (z / len) * 36 };
  });

  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  return { vertices, faces };
}

function getTorus(): { vertices: Point3D[]; faces: number[][] } {
  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  const segments = 14;
  const tubeSegments = 8;
  const R = 30;
  const r = 11;

  for (let i = 0; i < segments; i++) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = 0; j < tubeSegments; j++) {
      const v = (j / tubeSegments) * Math.PI * 2;
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);
      vertices.push({ x, y, z });
    }
  }

  for (let i = 0; i < segments; i++) {
    const nextI = (i + 1) % segments;
    for (let j = 0; j < tubeSegments; j++) {
      const nextJ = (j + 1) % tubeSegments;
      const a = i * tubeSegments + j;
      const b = nextI * tubeSegments + j;
      const c = nextI * tubeSegments + nextJ;
      const d = i * tubeSegments + nextJ;
      faces.push([a, b, c], [a, c, d]);
    }
  }

  return { vertices, faces };
}

function getOctahedron(): { vertices: Point3D[]; faces: number[][] } {
  const s = 38;
  const vertices: Point3D[] = [
    { x: 0, y: -s, z: 0 },
    { x: 0, y: s, z: 0 },
    { x: -s, y: 0, z: 0 },
    { x: s, y: 0, z: 0 },
    { x: 0, y: 0, z: -s },
    { x: 0, y: 0, z: s },
  ];
  const faces = [
    [0, 2, 5], [0, 5, 3], [0, 3, 4], [0, 4, 2],
    [1, 5, 2], [1, 3, 5], [1, 4, 3], [1, 2, 4],
  ];
  return { vertices, faces };
}

// ---------------------------------------------------------------------------
// Interactive 3D Canvas (Unicorn Studio Style)
// ---------------------------------------------------------------------------

interface Canvas3DProps {
  shape?: ShapeType;
  interactive?: boolean;
  wireframeOnly?: boolean;
  accentHue?: number;
  width?: number;
  height?: number;
  glitchActive?: boolean;
  spinSpeed?: number;
  showRings?: boolean;
  onCycleShape?: () => void;
}

const Interactive3DCanvas: React.FC<Canvas3DProps> = ({
  shape = 'icosahedron',
  interactive = true,
  wireframeOnly = false,
  accentHue = 310,
  width = 110,
  height = 80,
  glitchActive = false,
  spinSpeed = 1,
  showRings = true,
  onCycleShape,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotRef = useRef({ x: 0.3, y: 0.4, vx: 0.012 * spinSpeed, vy: 0.016 * spinSpeed });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });

  const geom = useMemo(() => {
    if (shape === 'torus') return getTorus();
    if (shape === 'octahedron') return getOctahedron();
    return getIcosahedron();
  }, [shape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 0.02;
      const rot = rotRef.current;

      if (!mouseRef.current.isDown) {
        rot.x += rot.vx * spinSpeed;
        rot.y += rot.vy * spinSpeed;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 100;
      const camZ = 115;

      // Subtle atmospheric glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.55);
      bgGrad.addColorStop(0, `hsla(${accentHue}, 100%, 65%, 0.16)`);
      bgGrad.addColorStop(0.65, `hsla(${(accentHue + 60) % 360}, 90%, 45%, 0.04)`);
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Orbital rings
      if (showRings) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, 44 + Math.sin(t * 2) * 3, 14, t * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${accentHue}, 100%, 75%, 0.3)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 16, -t * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(accentHue + 80) % 360}, 100%, 75%, 0.2)`;
        ctx.stroke();
        ctx.restore();
      }

      // Rotate vertices
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);

      const transformed = geom.vertices.map((v) => {
        const gx = glitchActive ? (Math.random() - 0.5) * 5 : 0;
        const gy = glitchActive ? (Math.random() - 0.5) * 5 : 0;

        const x1 = v.x * cosY + v.z * sinY + gx;
        const y1 = v.y + gy;
        const z1 = -v.x * sinY + v.z * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const scale = fov / (camZ + z2);
        const px = cx + x2 * scale;
        const py = cy + y2 * scale;

        return { px, py, z: z2 };
      });

      // Depth sort faces
      interface SortedFace {
        indices: number[];
        avgZ: number;
        normalZ: number;
      }

      const sortedFaces: SortedFace[] = [];
      for (const f of geom.faces) {
        const p0 = transformed[f[0]];
        const p1 = transformed[f[1]];
        const p2 = transformed[f[2]];
        if (!p0 || !p1 || !p2) continue;

        const ax = p1.px - p0.px;
        const ay = p1.py - p0.py;
        const bx = p2.px - p0.px;
        const by = p2.py - p0.py;
        const normalZ = ax * by - ay * bx;

        const avgZ = (p0.z + p1.z + p2.z) / 3;
        sortedFaces.push({ indices: f, avgZ, normalZ });
      }

      sortedFaces.sort((a, b) => b.avgZ - a.avgZ);

      // Render 3D polygons
      for (const face of sortedFaces) {
        const { indices, normalZ, avgZ } = face;
        const isBackface = normalZ < 0;

        ctx.beginPath();
        for (let i = 0; i < indices.length; i++) {
          const pt = transformed[indices[i]];
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.closePath();

        if (!wireframeOnly) {
          const lightFactor = Math.max(0.15, Math.min(1, (-normalZ / 350) * 0.8 + 0.3));
          const depthLight = Math.max(0.2, (avgZ + 36) / 72);
          const hue = (accentHue + depthLight * 60 + (isBackface ? 140 : 0)) % 360;
          const lightness = 38 + lightFactor * 45;
          const alpha = isBackface ? 0.35 : 0.85;

          ctx.fillStyle = `hsla(${hue}, 95%, ${lightness}%, ${alpha})`;
          ctx.fill();
        }

        ctx.strokeStyle = `hsla(${(accentHue + 40) % 360}, 100%, 85%, ${isBackface ? 0.2 : 0.8})`;
        ctx.lineWidth = isBackface ? 0.6 : 1.1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(raf);
  }, [geom, accentHue, width, height, glitchActive, spinSpeed, wireframeOnly, showRings]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !mouseRef.current.isDown) return;
    const dx = e.clientX - mouseRef.current.lastX;
    const dy = e.clientY - mouseRef.current.lastY;
    rotRef.current.y += dx * 0.02;
    rotRef.current.x += dy * 0.02;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  return (
    <div
      className="relative cursor-grab active:cursor-grabbing select-none"
      style={{ width, height }}
      onClick={onCycleShape}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      title="Click to cycle 3D geometry / Drag to rotate"
    >
      <canvas ref={canvasRef} width={width} height={height} className="block w-full h-full" />
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3D Rotating Album Jewel Case with Ejecting CD Component
// ---------------------------------------------------------------------------

interface Album3DCardProps {
  album: AlbumData;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const Album3DCard: React.FC<Album3DCardProps> = ({ album, isPlaying, onTogglePlay }) => {
  const [rotY, setRotY] = useState(-12);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slow rotation when idle
  useEffect(() => {
    if (isHovered || isPlaying) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setRotY(-14 + Math.sin(frame * 0.06) * 16);
    }, 40);
    return () => clearInterval(interval);
  }, [isHovered, isPlaying]);

  return (
    <div
      className="border p-3 transition-all relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #130320 0%, #070110 100%)',
        borderColor: isPlaying ? '#00ffff' : '#ff00ff',
        boxShadow: isPlaying
          ? '0 0 16px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1)'
          : '0 0 12px rgba(255, 0, 255, 0.2)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* 3D Perspective Stage: ancho fijo para que el CD salga DENTRO de su hueco */}
        <div
          className="relative flex-shrink-0 cursor-pointer select-none"
          style={{ perspective: 900, width: 210, height: 144 }}
          onMouseEnter={() => {
            setIsHovered(true);
            setRotY(isPlaying ? 0 : 12);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setRotY(isPlaying ? 0 : -12);
          }}
          onClick={onTogglePlay}
          title={isPlaying ? 'Click to pause' : 'Click to eject CD and play'}
        >
          {/* Capa externa: solo desliza y aparece/desaparece */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 6,
              left: 8,
              width: 128,
              height: 128,
              zIndex: 5,
              opacity: isPlaying ? 1 : 0,
              transform: isPlaying ? 'translateX(70px)' : 'translateX(0px)',
              transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease-out',
              filter: isPlaying ? 'drop-shadow(0 0 12px rgba(0,240,255,0.7))' : 'none',
            }}
          >
            {/* Capa interna: solo gira */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden flex items-center justify-center"
              style={{
                background:
                  'conic-gradient(from 45deg, #00f0ff 0deg, #ff0077 60deg, #ffff00 120deg, #00ff66 180deg, #00f0ff 240deg, #ff00ff 300deg, #00f0ff 360deg)',
                border: '1px solid rgba(255,255,255,0.7)',
                animation: isPlaying ? 'cd-spin 2.6s linear infinite' : 'none',
              }}
            >
              {/* Reflejo especular */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7) 0%, transparent 50%),' +
                    'radial-gradient(circle at 65% 65%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                }}
              />
              {/* Textos del disco (giran con él) */}
              <div className="absolute top-3 left-0 right-0 text-center font-mono text-[7px] font-extrabold tracking-widest text-black uppercase">
                CHROME HEAVEN
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[6px] font-bold text-black">
                COMPACT DISC
              </div>
              {/* Agujero central */}
              <div
                className="w-10 h-10 rounded-full bg-[#0a0515] border-2 border-[#fff] relative flex items-center justify-center"
                style={{ boxShadow: 'inset 0 0 6px rgba(0,0,0,0.9)' }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-transparent border border-[#555]" />
              </div>
            </div>
          </div>

          {/* 3D Jewel Case */}
          <div
            className="absolute transition-transform duration-300 ease-out"
            style={{
              top: 6,
              left: 8,
              width: 128,
              height: 128,
              transformStyle: 'preserve-3d',
              transform: `rotateY(${isPlaying ? 0 : rotY}deg) rotateX(4deg)`,
              zIndex: 10,
            }}
          >
            {/* Portada */}
            <div
              className="absolute inset-0 border-2 border-white flex flex-col justify-between p-2.5 overflow-hidden"
              style={{
                background: album.coverBg,
                boxShadow: '0 8px 24px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.4)',
              }}
            >
              <div
                className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 rotate-45"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)',
                }}
              />

              <div className="flex items-center justify-between z-10">
                <span className="text-[7px] font-mono font-bold bg-black text-white px-1 py-0.5 border border-white">
                  {album.badge}
                </span>
                <span className="text-[7px] font-mono text-white tracking-widest">{album.bpm}</span>
              </div>

              <div className="z-10">
                <div className="text-[11px] font-mono font-extrabold text-white leading-tight uppercase drop-shadow-md">
                  {album.title}
                </div>
                <div className="text-[7px] font-mono text-[#ffcc00] mt-0.5">{album.cnTitle}</div>
              </div>
            </div>

            {/* Lomo 3D */}
            <div
              className="absolute top-0 bottom-0 left-0 w-3 origin-left bg-[#111] border border-white flex items-center justify-center"
              style={{ transform: 'rotateY(-90deg)' }}
            >
              <span className="text-[5px] font-mono text-white -rotate-90 whitespace-nowrap">
                CHROME HEAVEN
              </span>
            </div>
          </div>
        </div>

        {/* Detalles + control de reproducción */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-mono font-bold text-white truncate">{album.title}</h3>
            <span className="text-[8px] font-mono font-bold text-[#00ffff] bg-black px-1.5 py-0.5 border border-[#00ffff] flex-shrink-0">
              {album.format}
            </span>
          </div>

          <div className="text-[9px] font-mono text-[#ffcc00] mt-0.5">
            {album.cnTitle} · {album.year}
          </div>

          <div className="text-[8px] font-mono text-[#88ddff] mt-1">
            GENRE: {album.genre} | TEMPO: {album.bpm}
          </div>

          <p className="text-[8px] font-mono text-[#ccaacc] mt-1.5 leading-relaxed">{album.desc}</p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="px-3 py-1 font-mono font-bold text-[9px] border cursor-pointer transition-all flex items-center gap-1.5"
              style={{
                background: isPlaying
                  ? 'linear-gradient(90deg, #00f0ff, #0088cc)'
                  : 'linear-gradient(90deg, #ff0080, #aa00ff)',
                color: '#000',
                borderColor: '#fff',
                boxShadow: isPlaying
                  ? '0 0 10px rgba(0,255,255,0.7)'
                  : '0 0 8px rgba(255,0,128,0.5)',
              }}
            >
              <span>{isPlaying ? '[PAUSE CD]' : '[PLAY CD // 播放]'}</span>
            </button>

            {isPlaying && (
              <span className="text-[8px] font-mono text-[#00ffff] animate-pulse">
                [CD EJECTED & SPINNING]
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cd-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


// ---------------------------------------------------------------------------
// Marquee Component (ASCII & Retro Cyber Typography)
// ---------------------------------------------------------------------------

function MarqueeTicker({ text }: { text: string }) {
  const content = text.repeat(4);
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', height: 16 }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: 9,
          color: '#ffcc00',
          fontFamily: 'monospace',
          letterSpacing: 2,
          animation: 'marquee-scroll 24s linear infinite',
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

// ---------------------------------------------------------------------------
// Main IEContent Component
// ---------------------------------------------------------------------------

export const IEContent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>('portal');
  const [history, setHistory] = useState<NavSection[]>(['portal']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [inputUrl, setInputUrl] = useState('http://www.chromeheaven.com/portal');
  const [glitch, setGlitch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(100);
  const [heroShape, setHeroShape] = useState<ShapeType>('icosahedron');
  const [wireframeMode, setWireframeMode] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [decrypted, setDecrypted] = useState(false);

  // Audio preview playback for 3D CD player
  const [playingAlbumId, setPlayingAlbumId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Periodic subtle glitch effect
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 140);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  // Handle CD Audio Playback
  const togglePlayAlbum = (album: AlbumData) => {
    if (playingAlbumId === album.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAlbumId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = album.audioUrl;
        audioPlayerRef.current.currentTime = 0;
        void audioPlayerRef.current.play().catch(() => {
          /* ignore autoplay restrictions */
        });
      }
      setPlayingAlbumId(album.id);
    }
  };

  const navigateTo = (section: NavSection) => {
    if (section === currentSection) return;
    setIsLoading(true);
    setProgress(25);

    const item = NAV_ITEMS.find((n) => n.id === section);
    setInputUrl(`http://www.chromeheaven.com${item?.path || '/portal'}`);

    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(section);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setCurrentSection(section);

    setTimeout(() => setProgress(70), 100);
    setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 240);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setCurrentSection(prev);
      const item = NAV_ITEMS.find((n) => n.id === prev);
      setInputUrl(`http://www.chromeheaven.com${item?.path || '/portal'}`);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setCurrentSection(next);
      const item = NAV_ITEMS.find((n) => n.id === next);
      setInputUrl(`http://www.chromeheaven.com${item?.path || '/portal'}`);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setProgress(30);
    setTimeout(() => setProgress(75), 120);
    setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 260);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = inputUrl.toLowerCase();
    if (url.includes('music') || url.includes('release')) navigateTo('music');
    else if (url.includes('3d') || url.includes('space') || url.includes('lab')) navigateTo('lab3d');
    else if (url.includes('lore') || url.includes('archive')) navigateTo('lore');
    else if (url.includes('link') || url.includes('dir')) navigateTo('links');
    else navigateTo('portal');
  };

  return (
    <div
      className="flex flex-col h-full w-full select-none overflow-hidden"
      style={{
        background: '#070509',
        fontFamily: "'MS Gothic', Tahoma, monospace",
        color: '#ffffff',
      }}
    >
      {/* Hidden audio element for CD playback */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingAlbumId(null)}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. Classic Windows IE 6.0 Menu Bar (Zero Emojis)               */}
      {/* ------------------------------------------------------------- */}
      <div
        className="flex items-center text-[10px] px-2 py-0.5 gap-2 border-b flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #eae8e3 0%, #d8d4cd 100%)',
          color: '#000',
          borderColor: '#a09d96',
        }}
      >
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1">File(<u>F</u>)</span>
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1">Edit(<u>E</u>)</span>
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1">View(<u>V</u>)</span>
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1">Favorites(<u>A</u>)</span>
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1">Tools(<u>T</u>)</span>
        <span className="cursor-pointer hover:bg-[#316ac5] hover:text-white px-1">Help(<u>H</u>)</span>
        <div className="ml-auto text-[9px] text-[#444] font-mono tracking-wider flex items-center gap-2">
          <span>INTERNET EXPLORER 6.0</span>
          <span className="w-1.5 h-1.5 bg-emerald-600 inline-block" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. IE Navigation Toolbar & Address Bar                        */}
      {/* ------------------------------------------------------------- */}
      <div
        className="flex flex-col border-b flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #f0eee9 0%, #dfdbd3 100%)',
          borderColor: '#8d8981',
          padding: '3px 8px',
          gap: 3,
        }}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleBack}
            disabled={historyIdx === 0}
            className="px-2 py-0.5 text-[10px] font-bold rounded-sm border cursor-pointer disabled:opacity-40 disabled:cursor-default"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #dfdbd3 100%)',
              borderColor: '#807c74',
              color: '#000',
            }}
          >
            [BACK]
          </button>
          <button
            onClick={handleForward}
            disabled={historyIdx >= history.length - 1}
            className="px-2 py-0.5 text-[10px] font-bold rounded-sm border cursor-pointer disabled:opacity-40 disabled:cursor-default"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #dfdbd3 100%)',
              borderColor: '#807c74',
              color: '#000',
            }}
          >
            [FWD]
          </button>
          <button
            onClick={handleRefresh}
            className="px-2 py-0.5 text-[10px] font-bold rounded-sm border cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #dfdbd3 100%)',
              borderColor: '#807c74',
              color: '#000',
            }}
          >
            [REFRESH]
          </button>
          <button
            onClick={() => navigateTo('portal')}
            className="px-2 py-0.5 text-[10px] font-bold rounded-sm border cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #dfdbd3 100%)',
              borderColor: '#807c74',
              color: '#000',
            }}
          >
            [HOME]
          </button>

          <div className="h-4 w-px bg-[#a09c94] mx-1" />

          {/* Quick text links */}
          <div className="flex items-center gap-2 text-[9px] text-[#222]">
            <span
              onClick={() => navigateTo('portal')}
              className="cursor-pointer hover:underline text-[#0044aa]"
            >
              // PORTAL
            </span>
            <span
              onClick={() => navigateTo('music')}
              className="cursor-pointer hover:underline text-[#0044aa]"
            >
              // RELEASES
            </span>
            <span
              onClick={() => navigateTo('lab3d')}
              className="cursor-pointer hover:underline text-[#7700aa]"
            >
              // 3D LAB
            </span>
            <span
              onClick={() => navigateTo('links')}
              className="cursor-pointer hover:underline text-[#0044aa]"
            >
              // DIRECTORY
            </span>
          </div>

          {/* Retro Animated IE Node Logo */}
          <div className="ml-auto flex items-center pr-1">
            <div
              className="w-5 h-5 border border-black flex items-center justify-center font-bold text-[10px] text-white"
              style={{
                background: 'linear-gradient(135deg, #0088cc 0%, #002266 100%)',
                boxShadow: '0 0 4px rgba(0, 140, 255, 0.6)',
                animation: isLoading ? 'ie-pulse 0.7s infinite alternate' : 'none',
              }}
            >
              IE
            </div>
            <style>{`
              @keyframes ie-pulse {
                from { transform: scale(0.9); filter: hue-rotate(0deg); }
                to   { transform: scale(1.1); filter: hue-rotate(90deg); }
              }
            `}</style>
          </div>
        </div>

        {/* Address Input Bar */}
        <form onSubmit={handleUrlSubmit} className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#444] font-bold">Address:</span>
          <div className="flex-1 flex items-center bg-white border border-[#7f9db9] px-2 py-0.5 rounded-sm shadow-inner">
            <span className="text-[9px] font-mono text-[#0066cc] mr-2 font-bold">HTTP://</span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 text-[11px] font-mono text-[#000] outline-none bg-transparent"
            />
            {isLoading && (
              <span className="text-[9px] text-[#777] font-mono animate-pulse">CONNECTING...</span>
            )}
          </div>
          <button
            type="submit"
            className="px-2.5 py-0.5 text-[10px] font-bold bg-[#e0ded8] border border-[#706c64] rounded-sm cursor-pointer hover:bg-[#d0cdc4]"
          >
            GO [►]
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Main Web Page Content (Fluid & Fully Responsive)            */}
      {/* ------------------------------------------------------------- */}
      <div
        className="flex-1 overflow-y-auto win2k-scroll relative flex flex-col"
        style={{
          background:
            'radial-gradient(circle at 50% 10%, rgba(55, 0, 90, 0.25) 0%, transparent 60%),' +
            'repeating-linear-gradient(0deg, rgba(0,255,100,0.02) 0px, transparent 1px, transparent 24px),' +
            'repeating-linear-gradient(90deg, rgba(0,255,200,0.02) 0px, transparent 1px, transparent 24px), #070509',
        }}
      >
        {/* CRT Scanline Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-40"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
          }}
        />

        {/* Top Scrolling Cyber Banner (Zero Emojis) */}
        <div
          className="border-b border-[#330044] px-3 py-1 flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #110022 0%, #001122 50%, #220011 100%)' }}
        >
          <MarqueeTicker text="// CHROME HEAVEN // 赛博千禧超空间 // 虚拟美学 // 影之领域 // 3D LAB // LOSSLESS AUDIO ARCHIVES // " />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3D Interactive Navigation Hub (Unicorn Studio Style)          */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 pt-3 flex-shrink-0">
          <div
            className="w-full flex flex-col md:flex-row items-center justify-between border-2 p-2 gap-3"
            style={{
              background: 'linear-gradient(180deg, #180528 0%, #0d0216 100%)',
              borderColor: '#ff00ff',
              boxShadow: '0 0 16px rgba(255, 0, 255, 0.35), inset 0 0 12px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Mascot 3D Object */}
            <div className="flex items-center gap-3">
              <Interactive3DCanvas
                shape={heroShape}
                width={56}
                height={46}
                accentHue={310}
                glitchActive={glitch}
                spinSpeed={1.2}
                showRings={false}
                onCycleShape={() => {
                  setHeroShape((s) =>
                    s === 'icosahedron' ? 'torus' : s === 'torus' ? 'octahedron' : 'icosahedron'
                  );
                }}
              />
              <div>
                <div className="text-[13px] font-bold tracking-[0.2em] font-mono text-white flex items-center gap-1.5">
                  <span className="text-[#ff00ff]">CHROME</span>
                  <span className="text-[#00ffff]">HEAVEN</span>
                </div>
                <div className="text-[8px] font-mono text-[#ffcc00] tracking-widest">
                  CYBER Y2K // 3D PORTAL
                </div>
              </div>
            </div>

            {/* 3D Navigation Isometric Buttons (No Emojis) */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center" style={{ perspective: 600 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className="relative flex flex-col items-center justify-center px-3.5 py-1.5 border cursor-pointer transition-all duration-150"
                    style={{
                      background: isActive
                        ? 'linear-gradient(180deg, #ff00ff 0%, #7700aa 100%)'
                        : 'linear-gradient(180deg, #1f0833 0%, #10041d 100%)',
                      borderColor: isActive ? '#00ffff' : '#551177',
                      boxShadow: isActive
                        ? '0 0 12px #ff00ff99, inset 0 1px 0 rgba(255,255,255,0.6)'
                        : '0 2px 4px rgba(0,0,0,0.5)',
                      transform: isActive
                        ? 'translateZ(10px) translateY(-2px)'
                        : 'translateZ(0px)',
                    }}
                  >
                    <div className="text-[10px] font-bold font-mono tracking-wider">
                      <span className={isActive ? 'text-white' : 'text-[#d8b4f8]'}>
                        [{item.label}]
                      </span>
                    </div>
                    <div
                      className="text-[8px] font-mono tracking-widest mt-0.5"
                      style={{ color: isActive ? '#ffcc00' : '#8855aa' }}
                    >
                      {item.cnLabel} // {item.code}
                    </div>

                    {isActive && (
                      <div
                        className="absolute -bottom-1 w-2 h-2 rotate-45"
                        style={{ background: '#00ffff', boxShadow: '0 0 6px #00ffff' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Main Body Grid: Responsive Sidebar + Content Column           */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 py-3 flex flex-col lg:flex-row gap-4 flex-1">
          {/* SIDEBAR: ID Card, Weather & Classic Retro Badges (No Visitor Counter) */}
          <div className="w-full lg:w-64 xl:w-72 flex flex-col gap-3 flex-shrink-0">
            {/* Identity Card */}
            <div
              className="border p-2.5"
              style={{
                background: 'linear-gradient(180deg, #130320 0%, #0a0112 100%)',
                borderColor: '#7700aa',
                boxShadow: '0 0 10px rgba(119,0,170,0.3)',
              }}
            >
              <div className="flex items-center justify-between border-b border-[#330044] pb-1 mb-2">
                <span className="text-[9px] font-mono font-bold text-[#ff77ff] tracking-widest">
                  // IDENTITY CARD // 身份卡
                </span>
                <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className="w-14 h-14 border-2 border-[#ff00ff] overflow-hidden relative flex-shrink-0"
                  style={{ boxShadow: '0 0 10px #ff00ff88' }}
                >
                  <Image
                    src="/images/Captura_de_pantalla_2026-09-10_143748.png"
                    alt="Uloe avatar"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    style={{
                      filter: glitch
                        ? 'hue-rotate(180deg) saturate(2)'
                        : 'saturate(1.2) contrast(1.1)',
                    }}
                  />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white font-mono truncate">
                    CHROME HEAVEN
                  </div>
                  <div className="text-[8px] text-[#ffcc00] font-mono">// WEBMASTER: ChromeHeavenLord</div>
                  <div className="text-[8px] text-[#8877aa] font-mono mt-0.5">
                    影が届くまで
                  </div>
                  <div className="text-[8px] text-emerald-400 font-mono mt-1">STATUS: ONLINE [在线]</div>
                </div>
              </div>

              <div className="mt-2 text-[8px] font-mono text-[#9988bb] border-t border-[#220033] pt-1 leading-relaxed">
                <div>NODE: 218.104.92.14 [BEIJING]</div>
                <div>ENCRYPTION: 128-BIT SSL</div>
              </div>
            </div>

            {/* Cyber Weather & System Status (No Emojis) */}
            <div
              className="border p-2.5 text-[8px] font-mono leading-relaxed"
              style={{
                background: 'linear-gradient(180deg, #050d18 0%, #02070d 100%)',
                borderColor: '#0088cc',
              }}
            >
              <div className="text-[9px] font-bold text-[#00e0ff] border-b border-[#003355] pb-1 mb-1">
                // SYSTEM & METEO STATUS //
              </div>
              <div className="text-[#aaddff]">
                <span>CYBERSPACE: RAIN</span>
                <span className="float-right text-[#00ffcc]">23 DEG C</span>
              </div>
              <div className="text-[#88aacc] mt-0.5">HUMIDITY: 88% | LATENCY: 14MS</div>
              <div className="text-[#ffcc00] mt-1 border-t border-[#002233] pt-1">
                HOROSCOPE: LUCKY [宜聆听Dreamcore]
              </div>
            </div>

            {/* Retro 88x31 Badges */}
            <div className="border p-2 flex flex-wrap gap-1.5 justify-center border-[#330044] bg-[#05000a]">
              {['NETSCAPE', 'HTML 4.0', 'FLASH 5', 'Y2K READY', '1024x768', 'NOTEPAD'].map(
                (badge, i) => (
                  <div
                    key={badge}
                    className="text-[7px] font-mono px-1.5 py-0.5 border font-bold"
                    style={{
                      background:
                        i % 2 === 0
                          ? 'linear-gradient(90deg, #ff0055, #ffaa00)'
                          : 'linear-gradient(90deg, #0088ff, #00ffaa)',
                      color: '#000',
                      borderColor: '#fff',
                    }}
                  >
                    {badge}
                  </div>
                )
              )}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* --------------------------------------------------------- */}
            {/* TAB 1: PORTAL HOME (主页)                                */}
            {/* --------------------------------------------------------- */}
            {currentSection === 'portal' && (
              <div className="flex flex-col gap-4">
                {/* Hero Banner with Unicorn Studio 3D Canvas */}
                <div
                  className="border-2 p-4 relative overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(35, 5, 55, 0.95) 0%, rgba(10, 2, 20, 0.98) 100%)',
                    borderColor: '#ff00ff',
                    boxShadow: '0 0 20px rgba(255, 0, 255, 0.25)',
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="inline-block px-2 py-0.5 bg-[#ff00ff] text-black font-mono font-bold text-[8px] mb-1.5">
                        // OFFICIAL PORTAL 2000-2026 //
                      </div>
                      <h1 className="text-[20px] sm:text-[26px] font-mono font-extrabold text-white tracking-wider flex items-center gap-2">
                        <span className="text-[#00ffff]">CHROME</span>
                        <span className="text-[#ff00ff]">HEAVEN</span>
                      </h1>
                      <div className="text-[10px] text-[#ffcc00] font-mono tracking-widest mt-0.5">
                        影が届くまで // 虚拟梦核与未来记忆
                      </div>
                      <p className="text-[9px] text-[#ccaacc] font-mono mt-2.5 max-w-xl leading-relaxed">
                        Welcome to the official online sanctuary. Bridging Chinese 2000s web aesthetics with modern 3D WebGL interactive design.
                      </p>
                      <div className="flex items-center gap-2 mt-3.5">
                        <button
                          onClick={() => navigateTo('music')}
                          className="px-3 py-1.5 text-[9px] font-bold font-mono bg-gradient-to-r from-[#ff0080] to-[#ff00ff] text-white border border-white cursor-pointer hover:brightness-110 shadow-md"
                        >
                          [DISCOGRAPHY // 作品列表]
                        </button>
                        <button
                          onClick={() => navigateTo('lab3d')}
                          className="px-3 py-1.5 text-[9px] font-bold font-mono bg-[#110022] text-[#00ffff] border border-[#00ffff] cursor-pointer hover:bg-[#220044]"
                        >
                          [ENTER 3D LAB // 进入空间]
                        </button>
                      </div>
                    </div>

                    {/* Interactive 3D Model in Hero */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <Interactive3DCanvas
                        shape={heroShape}
                        width={130}
                        height={110}
                        accentHue={320}
                        glitchActive={glitch}
                        spinSpeed={1.1}
                        showRings={true}
                        onCycleShape={() => {
                          setHeroShape((s) =>
                            s === 'icosahedron' ? 'torus' : s === 'torus' ? 'octahedron' : 'icosahedron'
                          );
                        }}
                      />
                      <span className="text-[8px] font-mono text-[#7755aa] mt-1">
                        [CLICK TO MORPH 3D SHAPE]
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3D Rotating Album Showcase (Featured Release) */}
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] font-mono font-bold text-[#00ffff] tracking-widest flex items-center justify-between border-b border-[#220044] pb-1">
                    <span>// SPOTLIGHT RELEASE: 3D CD PLAYER //</span>
                    <span className="text-[8px] text-[#ffcc00]">[CLICK COVER TO EJECT CD]</span>
                  </div>

                  <Album3DCard
                    album={DISCOGRAPHY[0]}
                    isPlaying={playingAlbumId === DISCOGRAPHY[0].id}
                    onTogglePlay={() => togglePlayAlbum(DISCOGRAPHY[0])}
                  />
                </div>

                {/* Bulletin News Board (站长公告栏) */}
                <div
                  className="border p-3"
                  style={{
                    background: '#07020d',
                    borderColor: '#ff00aa',
                  }}
                >
                  <div className="text-[9px] font-mono font-bold text-[#ffcc00] border-b border-[#330033] pb-1 mb-2 flex justify-between">
                    <span>// BBS BULLETINS & ANNOUNCEMENTS // 站长公告</span>
                    <span>ARCHIVE 2026.09</span>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-[9px]">
                    <div className="border-l-2 border-[#ff00ff] pl-2.5">
                      <div className="text-[#ff77ff] font-bold">
                        [2026-09-29] 3D Jewel Cases & Responsive Maximized Mode Implemented
                      </div>
                      <div className="text-[#aab]">
                        Albums now feature interactive 3D jewel cases with smooth rotation and animated ejecting holographic CDs on click.
                      </div>
                    </div>
                    <div className="border-l-2 border-[#00ffff] pl-2.5">
                      <div className="text-[#00ffff] font-bold">
                        [2026-07-15] Lossless Master Recordings Available
                      </div>
                      <div className="text-[#aab]">
                        Full lossless WAV 24-bit audio files and uncompressed photography edits are now available exclusively through this web directory.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* TAB 2: DISCOGRAPHY & RELEASES (3D Album Covers with CDs) */}
            {/* --------------------------------------------------------- */}
            {currentSection === 'music' && (
              <div className="flex flex-col gap-4">
                <div
                  className="border-b border-[#ff00ff] pb-1.5 flex items-center justify-between"
                  style={{ background: 'linear-gradient(90deg, #1c002e 0%, transparent 100%)' }}
                >
                  <div>
                    <h2 className="text-[13px] font-mono font-bold text-white tracking-wider">
                      // OFFICIAL DISCOGRAPHY // 音乐作品全集
                    </h2>
                    <div className="text-[8px] font-mono text-[#ffcc00]">
                      CLICK ANY 3D ALBUM TO EJECT ITS HOLOGRAPHIC CD AND PREVIEW
                    </div>
                  </div>
                  <span className="text-[9px] text-[#00ffff] font-mono font-bold">[3 ALBUMS AVAILABLE]</span>
                </div>

                {/* Responsive 3D Album Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {DISCOGRAPHY.map((album) => (
                    <Album3DCard
                      key={album.id}
                      album={album}
                      isPlaying={playingAlbumId === album.id}
                      onTogglePlay={() => togglePlayAlbum(album)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* TAB 3: 3D CYBER LAB (Unicorn Studio Interactive Viewport) */}
            {/* --------------------------------------------------------- */}
            {currentSection === 'lab3d' && (
              <div
                className="border p-4 flex flex-col gap-3.5"
                style={{
                  background: 'linear-gradient(180deg, #120320 0%, #06010d 100%)',
                  borderColor: '#00ffff',
                  boxShadow: '0 0 16px rgba(0, 255, 255, 0.3)',
                }}
              >
                <div className="border-b border-[#220044] pb-1.5 flex items-center justify-between">
                  <div>
                    <h2 className="text-[13px] font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                      <span>// 3D CYBERSPACE LAB //</span>
                      <span className="text-[9px] text-[#ff00ff]">[UNICORN STUDIO ENGINE]</span>
                    </h2>
                    <div className="text-[8px] font-mono text-[#ffcc00]">
                      实时全息多面体 · 交互式三维渲染
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400">60 FPS WEBGL MATH</span>
                </div>

                {/* Big Interactive 3D Canvas Viewport */}
                <div
                  className="w-full flex items-center justify-center border-2 border-[#5500aa] py-6 relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle, #1a0033 0%, #06000e 100%)',
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
                  }}
                >
                  <Interactive3DCanvas
                    shape={heroShape}
                    width={260}
                    height={180}
                    accentHue={300}
                    wireframeOnly={wireframeMode}
                    glitchActive={glitch}
                    spinSpeed={speedMultiplier}
                    showRings={true}
                  />
                  <div className="absolute bottom-1.5 right-2.5 text-[8px] font-mono text-[#8855aa]">
                    [DRAG MOUSE TO ROTATE IN 3D]
                  </div>
                </div>

                {/* 3D Lab Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[9px]">
                  <button
                    onClick={() =>
                      setHeroShape((s) =>
                        s === 'icosahedron' ? 'torus' : s === 'torus' ? 'octahedron' : 'icosahedron'
                      )
                    }
                    className="p-2 border border-[#ff00ff] bg-[#1a0028] text-white hover:bg-[#330055] cursor-pointer"
                  >
                    SHAPE: <span className="text-[#00ffff] font-bold">{heroShape.toUpperCase()}</span>
                  </button>

                  <button
                    onClick={() => setWireframeMode((w) => !w)}
                    className="p-2 border border-[#ff00ff] bg-[#1a0028] text-white hover:bg-[#330055] cursor-pointer"
                  >
                    WIREFRAME: <span className="text-[#ffcc00] font-bold">{wireframeMode ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setSpeedMultiplier((s) => (s >= 2 ? 0.5 : s + 0.5))}
                    className="p-2 border border-[#ff00ff] bg-[#1a0028] text-white hover:bg-[#330055] cursor-pointer"
                  >
                    SPEED: <span className="text-emerald-400 font-bold">{speedMultiplier}X</span>
                  </button>

                  <button
                    onClick={() => {
                      setGlitch(true);
                      setTimeout(() => setGlitch(false), 500);
                    }}
                    className="p-2 border border-[#00ffff] bg-[#002233] text-[#00ffff] hover:bg-[#004466] cursor-pointer font-bold"
                  >
                    [TRIGGER GLITCH]
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* TAB 4: MANIFESTO & LORE (天堂档案)                        */}
            {/* --------------------------------------------------------- */}
            {currentSection === 'lore' && (
              <div
                className="border p-4 flex flex-col gap-3 font-mono"
                style={{
                  background: '#07020e',
                  borderColor: '#ffcc00',
                  boxShadow: '0 0 14px rgba(255, 204, 0, 0.2)',
                }}
              >
                <div className="border-b border-[#332200] pb-1.5 flex justify-between items-center">
                  <h2 className="text-[12px] font-bold text-[#ffcc00] tracking-widest">
                    // MANIFESTO & THEOLOGY // 天堂档案
                  </h2>
                  <span className="text-[8px] text-[#888]">DECLASSIFIED 2026</span>
                </div>

                <div className="text-[9px] text-[#ddaadd] leading-relaxed space-y-2.5">
                  <p>
                    <strong className="text-white">CHROME HEAVEN</strong> is an audiovisual pilgrimage into digital eternity. Born from the intersection of early 2000s Asian cyber nostalgia, broken Dreamcore soundscapes, and transcendent hyper-chromatic dimensions.
                  </p>
                  <p className="text-[#aab]">
                    在数字阴影消逝的时刻，赛博天使将银色记忆重新铸造成声音。我们不依附于现代算法的平庸，而是重建千禧年个人网站的自由殿堂。
                  </p>
                </div>

                {/* Secret Encrypted Terminal */}
                <div
                  className="border p-2.5 bg-black border-[#5500aa] text-[8px] font-mono mt-2"
                  style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)' }}
                >
                  <div className="flex justify-between text-[#8877bb] border-b border-[#220044] pb-1 mb-1.5">
                    <span>ENCRYPTED TERMINAL [AES-256]</span>
                    <button
                      onClick={() => setDecrypted((d) => !d)}
                      className="text-[#00ffff] cursor-pointer hover:underline"
                    >
                      [{decrypted ? 'RE-LOCK' : 'DECRYPT'}]
                    </button>
                  </div>
                  <div className={decrypted ? 'text-emerald-400 font-bold' : 'text-[#555] break-all'}>
                    {decrypted
                      ? '>>> "Memory is the only paradise from which we cannot be driven." — Chrome Heaven is permanent.'
                      : '7f9a2b88c901e457f920da473e1c668b99ef001cda789b94098231...'}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* TAB 5: WEB DIRECTORY (网站链接)                           */}
            {/* --------------------------------------------------------- */}
            {currentSection === 'links' && (
              <div className="flex flex-col gap-3">
                <div
                  className="border-b border-[#ff00ff] pb-1.5 flex items-center justify-between"
                  style={{ background: 'linear-gradient(90deg, #1c002e 0%, transparent 100%)' }}
                >
                  <div>
                    <h2 className="text-[13px] font-mono font-bold text-white tracking-wider">
                      // OFFICIAL DIRECTORY // 官方传送门
                    </h2>
                    <div className="text-[8px] font-mono text-[#ffcc00]">
                      CLICK ANY DESTINATION TO ACCESS STREAMING & SOCIALS
                    </div>
                  </div>
                  <span className="text-[9px] text-[#00ffff] font-mono font-bold">[5 DESTINATIONS]</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {DIRECTORY_LINKS.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border block transition-all group"
                      style={{
                        background: 'linear-gradient(90deg, #140022 0%, #0d0016 100%)',
                        borderColor: '#330044',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = link.accent;
                        e.currentTarget.style.background = link.bg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#330044';
                        e.currentTarget.style.background =
                          'linear-gradient(90deg, #140022 0%, #0d0016 100%)';
                      }}
                    >
                      <div
                        className="w-9 h-9 border flex items-center justify-center text-[11px] font-mono flex-shrink-0 bg-black font-bold"
                        style={{ borderColor: link.accent, color: link.accent }}
                      >
                        [{i + 1}]
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-mono font-bold text-white flex items-center gap-2">
                          <span>{link.label}</span>
                          <span
                            className="text-[7px] font-mono px-1 py-0.2 bg-black border text-[#ffcc00]"
                            style={{ borderColor: link.accent }}
                          >
                            {link.tag}
                          </span>
                        </div>
                        <div className="text-[8px] font-mono text-[#aa88cc]">
                          {link.sublabel}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-[#664488] group-hover:text-white transition-transform group-hover:translate-x-1">
                        [►]
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Footer (No Emojis)                                            */}
        {/* ------------------------------------------------------------- */}
        <div className="p-3 text-center border-t border-[#220033] mt-auto font-mono text-[8px] text-[#775599] flex-shrink-0">
          <div>(C)2000-2026 CHROME HEAVEN // 网络天堂 // ALL RIGHTS RESERVED</div>
          <div className="text-[#553366] mt-0.5">
            OPTIMIZED FOR INTERNET EXPLORER 6.0 // BEST VIEWED IN 1024X768 // UNICORN STUDIO 3D ENGINE
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Windows IE Status Bar (No Emojis)                          */}
      {/* ------------------------------------------------------------- */}
      <div
        className="flex items-center text-[9px] px-2 py-0.5 border-t gap-2 flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #eae8e3 0%, #d8d4cd 100%)',
          color: '#333',
          borderColor: '#a09d96',
        }}
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="text-[8px] font-mono font-bold text-[#0044aa]">[IE]</span>
          <span className="truncate">
            {isLoading ? 'Opening page http://www.chromeheaven.com...' : 'Done (网页已就绪)'}
          </span>
        </div>

        {/* Loading Progress Bar */}
        {isLoading && (
          <div className="w-20 h-2 bg-white border border-[#888] overflow-hidden flex">
            <div
              className="h-full bg-blue-600 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="h-3 w-px bg-[#a09c94]" />
        <span>[SSL 128-BIT]</span>
        <div className="h-3 w-px bg-[#a09c94]" />
        <span>Internet | Protected Mode: Off</span>
        <div className="h-3 w-px bg-[#a09c94]" />
        <span>100%</span>
      </div>
    </div>
  );
};
