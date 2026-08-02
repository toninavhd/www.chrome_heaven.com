'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface VisualizerPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
}

export const VISUALIZER_PRESETS: VisualizerPreset[] = [
  {
    id: 'wmp_battery',
    name: 'WMP Battery 3D',
    subtitle: 'Volumetric Ethereal Plasma & 3D Core',
    description: 'Authentic Windows Media Player 3D battery with glowing plasma orb, rotating 3D geodesic core, depth blur, and orbiting cosmic dust.',
  },
  {
    id: 'trilogy_mathical',
    name: 'Trilogy II: Mathical 3D',
    subtitle: '3D Hyper-Math Knot & Fractal Geometry',
    description: '3D rotating Torus knot math geometry, Lissajous 3D curves, and pulsing perspective vector mandalas reacting to audio harmonics.',
  },
  {
    id: 'ethereal_silk',
    name: 'Ethereal Silk 3D',
    subtitle: 'Multi-Depth Liquid Aurora & Silk Ribbons',
    description: 'Layered 3D sinusoidal silk ribbons with depth-of-field blur floating through translucent midnight space.',
  },
  {
    id: 'neon_spectrum',
    name: 'Neon Spectrum 3D',
    subtitle: '3D Cyber Grid Pillars & Starfield',
    description: '3D perspective matrix grid with 3D spectrum pillars, falling peak caps, and volumetric neon glow.',
  },
];

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  activePresetId?: string;
  onPresetChange?: (presetId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  hue: number;
  alpha: number;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  size: number;
}

const createIcosahedron = (): { vertices: Point3D[]; edges: [number, number][] } => {
  const t = (1.0 + Math.sqrt(5.0)) / 2.0;
  const rawVertices: Point3D[] = [
    { x: -1, y: t, z: 0 },
    { x: 1, y: t, z: 0 },
    { x: -1, y: -t, z: 0 },
    { x: 1, y: -t, z: 0 },
    { x: 0, y: -1, z: t },
    { x: 0, y: 1, z: t },
    { x: 0, y: -1, z: -t },
    { x: 0, y: 1, z: -t },
    { x: t, y: 0, z: -1 },
    { x: t, y: 0, z: 1 },
    { x: -t, y: 0, z: -1 },
    { x: -t, y: 0, z: 1 },
  ];

  const vertices = rawVertices.map((v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  });

  const edges: [number, number][] = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[i].x - vertices[j].x;
      const dy = vertices[i].y - vertices[j].y;
      const dz = vertices[i].z - vertices[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 1.15) {
        edges.push([i, j]);
      }
    }
  }

  return { vertices, edges };
};

const ICOSAHEDRON = createIcosahedron();

export default function AudioVisualizer({
  analyserNode,
  isPlaying,
  activePresetId = 'wmp_battery',
  onPresetChange,
  isExpanded = false,
  onToggleExpand,
  className = '',
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(activePresetId);
  const [enableScanlines, setEnableScanlines] = useState<boolean>(true);

  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const particles3DRef = useRef<Particle3D[]>([]);
  const stars3DRef = useRef<Star3D[]>([]);
  const peakPillarsRef = useRef<number[]>([]);

  useEffect(() => {
    setSelectedPresetId(activePresetId);
  }, [activePresetId]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    if (onPresetChange) {
      onPresetChange(id);
    }
  };

  const handleNextPreset = () => {
    const currentIndex = VISUALIZER_PRESETS.findIndex((p) => p.id === selectedPresetId);
    const nextIndex = (currentIndex + 1) % VISUALIZER_PRESETS.length;
    handleSelectPreset(VISUALIZER_PRESETS[nextIndex].id);
  };

  const handlePrevPreset = () => {
    const currentIndex = VISUALIZER_PRESETS.findIndex((p) => p.id === selectedPresetId);
    const prevIndex = (currentIndex - 1 + VISUALIZER_PRESETS.length) % VISUALIZER_PRESETS.length;
    handleSelectPreset(VISUALIZER_PRESETS[prevIndex].id);
  };

  useEffect(() => {
    const particles: Particle3D[] = [];
    for (let i = 0; i < 90; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 60 + Math.random() * 140;
      particles.push({
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.sin(phi) * Math.sin(theta),
        z: rad * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.2,
        hue: 175 + Math.random() * 85,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }
    particles3DRef.current = particles;

    const stars: Star3D[] = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 2 + 0.8,
      });
    }
    stars3DRef.current = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bufferLength = 128;
    let dataArray = new Uint8Array(bufferLength);

    if (analyserNode) {
      analyserNode.fftSize = 256;
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    if (peakPillarsRef.current.length !== 32) {
      peakPillarsRef.current = new Array(32).fill(0);
    }

    const render = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      } else {
        for (let i = 0; i < bufferLength; i++) {
          const synthVal = Math.sin(t * 2 + i * 0.1) * 35 + Math.cos(t * 1.5 - i * 0.05) * 25 + 40;
          dataArray[i] = Math.max(10, Math.min(255, synthVal));
        }
      }

      // Precise & Smooth Linear Frequency Response for Rich Color Clarity
      const bass = dataArray.slice(0, 10).reduce((sum, v) => sum + v, 0) / 10 / 255;
      const mid = dataArray.slice(10, 40).reduce((sum, v) => sum + v, 0) / 30 / 255;
      const treble = dataArray.slice(40, 90).reduce((sum, v) => sum + v, 0) / 50 / 255;
      const overall = dataArray.reduce((sum, v) => sum + v, 0) / bufferLength / 255;

      const cx = width / 2;
      const cy = height / 2;
      const fov = 380;

      const trailAlpha = selectedPresetId === 'neon_spectrum' ? 0.28 : 0.18;
      ctx.fillStyle = `rgba(3, 4, 12, ${trailAlpha})`;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      switch (selectedPresetId) {
        case 'wmp_battery':
          renderWMPBattery3D(ctx, width, height, cx, cy, fov, t, bass, mid, treble, overall, dataArray);
          break;
        case 'trilogy_mathical':
          renderTrilogyMathical3D(ctx, width, height, cx, cy, fov, t, bass, mid, treble, overall, dataArray);
          break;
        case 'ethereal_silk':
          renderEtherealSilk3D(ctx, width, height, cx, cy, fov, t, bass, mid, treble, overall, dataArray);
          break;
        case 'neon_spectrum':
          renderNeonSpectrum3D(ctx, width, height, cx, cy, fov, t, bass, mid, treble, overall, dataArray);
          break;
        default:
          renderWMPBattery3D(ctx, width, height, cx, cy, fov, t, bass, mid, treble, overall, dataArray);
          break;
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyserNode, isPlaying, selectedPresetId]);

  const rotateX = (p: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
  };

  const rotateY = (p: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
  };

  const rotateZ = (p: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos, z: p.z };
  };

  const project3D = (p: Point3D, cx: number, cy: number, fov: number, cameraZ: number = 400) => {
    const scale = fov / (p.z + cameraZ);
    return { x: cx + p.x * scale, y: cy + p.y * scale, scale };
  };

  // PRESET 1: WMP Battery 3D (Smooth, Elegant, High-Precision Color Rendering)
  const renderWMPBattery3D = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cx: number,
    cy: number,
    fov: number,
    t: number,
    bass: number,
    mid: number,
    treble: number,
    overall: number,
    freqData: Uint8Array
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const hueBase = (t * 15 + bass * 40) % 360;

    // Smooth Volumetric Central Aura Bloom
    const auraRadius = 60 + bass * 60;
    const auraGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, auraRadius * 2);
    auraGrad.addColorStop(0, `hsla(${hueBase}, 100%, 75%, ${0.8 + bass * 0.2})`);
    auraGrad.addColorStop(0.3, `hsla(${(hueBase + 40) % 360}, 90%, 55%, 0.4)`);
    auraGrad.addColorStop(0.7, `hsla(${(hueBase + 180) % 360}, 85%, 35%, 0.15)`);
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, auraRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // 3D Rotating Geodesic Core (Icosahedron Geometry)
    const icoScale = 45 + bass * 35;
    const rx = t * 0.8;
    const ry = t * 1.2;
    const rz = t * 0.5;

    const transformedVerts = ICOSAHEDRON.vertices.map((v) => {
      let p: Point3D = { x: v.x * icoScale, y: v.y * icoScale, z: v.z * icoScale };
      p = rotateX(p, rx);
      p = rotateY(p, ry);
      p = rotateZ(p, rz);
      return { point3d: p, proj: project3D(p, cx, cy, fov, 380) };
    });

    const edgeHue = (hueBase + 120) % 360;
    ctx.strokeStyle = `hsla(${edgeHue}, 100%, 70%, ${0.7 + bass * 0.3})`;
    ctx.lineWidth = 2 + bass * 2.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsla(${edgeHue}, 100%, 50%, 0.9)`;

    ICOSAHEDRON.edges.forEach(([i, j]) => {
      const v1 = transformedVerts[i].proj;
      const v2 = transformedVerts[j].proj;
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.stroke();
    });

    transformedVerts.forEach((v) => {
      const nodeRadius = Math.max(2, 4 * v.proj.scale);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${hueBase}, 100%, 70%, 1)`;
      ctx.beginPath();
      ctx.arc(v.proj.x, v.proj.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Orbiting 3D Ethereal Battery Dust Particles
    const particles = particles3DRef.current;
    particles.sort((a, b) => b.z - a.z);

    particles.forEach((p) => {
      p.x += Math.sin(t + p.y * 0.01) * 0.8;
      p.y += Math.cos(t + p.x * 0.01) * 0.8;

      let pos: Point3D = { x: p.x, y: p.y, z: p.z };
      pos = rotateY(pos, t * 0.4);
      pos = rotateX(pos, t * 0.2);

      const proj = project3D(pos, cx, cy, fov, 420);
      const alpha = Math.min(1, Math.max(0.1, (pos.z + 200) / 400));
      const size = Math.max(1, p.radius * proj.scale * (1 + treble * 1.5));

      const pHue = (p.hue + t * 15) % 360;
      ctx.fillStyle = `hsla(${pHue}, 95%, 75%, ${p.alpha * alpha * (0.6 + overall * 0.6)})`;
      ctx.shadowBlur = 12 * proj.scale;
      ctx.shadowColor = `hsla(${pHue}, 100%, 50%, 0.8)`;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Concentric 3D Energy Shockwave Rings
    const ringCount = 3;
    for (let r = 0; r < ringCount; r++) {
      const baseR = 50 + r * 45 + bass * 55;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.08) {
        const index = Math.floor((a / (Math.PI * 2)) * (freqData.length / 2));
        const freqVal = (freqData[index] || 0) / 255;
        const waveR = baseR + Math.sin(a * 4 + t * 3 + r) * (12 + freqVal * 30);

        let ringP: Point3D = {
          x: Math.cos(a) * waveR,
          y: Math.sin(a) * waveR * 0.5,
          z: Math.sin(a * 2 + t) * 20,
        };
        ringP = rotateX(ringP, 0.4 + Math.sin(t * 0.5) * 0.2);
        ringP = rotateZ(ringP, t * 0.2 + r * 0.4);

        const proj = project3D(ringP, cx, cy, fov, 380);
        if (a === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.closePath();
      const ringHue = (hueBase + r * 50) % 360;
      ctx.strokeStyle = `hsla(${ringHue}, 90%, 65%, ${0.35 + bass * 0.45})`;
      ctx.lineWidth = 1.8 + bass * 2;
      ctx.shadowBlur = 18;
      ctx.shadowColor = `hsla(${ringHue}, 100%, 50%, 0.8)`;
      ctx.stroke();
    }

    ctx.restore();
  };

  // PRESET 2: Trilogy II Mathical 3D
  const renderTrilogyMathical3D = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cx: number,
    cy: number,
    fov: number,
    t: number,
    bass: number,
    mid: number,
    treble: number,
    overall: number,
    freqData: Uint8Array
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const baseHue = (t * 22) % 360;

    // 3D Perspective Math Floor Grid
    const gridRows = 16;
    const gridCols = 16;
    const gridSpacing = 50;

    ctx.strokeStyle = `hsla(${(baseHue + 200) % 360}, 80%, 45%, ${0.15 + bass * 0.2})`;
    ctx.lineWidth = 1.2;

    for (let r = -gridRows / 2; r <= gridRows / 2; r++) {
      ctx.beginPath();
      for (let c = -gridCols / 2; c <= gridCols / 2; c++) {
        const x = c * gridSpacing;
        const z = r * gridSpacing + 300;
        const waveY = Math.sin(x * 0.02 + z * 0.02 + t * 2) * (15 + bass * 25);
        let p: Point3D = { x, y: 140 + waveY, z };
        p = rotateX(p, 0.35);
        const proj = project3D(p, cx, cy, fov, 350);
        if (c === -gridCols / 2) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.stroke();
    }

    // 3D Torus Knot
    const pKnot = 3;
    const qKnot = 4;
    const RKnot = 90 + bass * 40;
    const rKnot = 35 + mid * 25;

    const pointsKnot = 220;
    ctx.beginPath();
    let first = true;

    for (let i = 0; i <= pointsKnot; i++) {
      const phi = (i / pointsKnot) * Math.PI * 2 * pKnot;
      const index = Math.floor((i / pointsKnot) * freqData.length);
      const freqVal = (freqData[index] || 0) / 255;

      const modR = rKnot + Math.sin(phi * 6 + t * 4) * (8 + freqVal * 20);

      let p: Point3D = {
        x: (RKnot + modR * Math.cos(qKnot * phi)) * Math.cos(pKnot * phi),
        y: (RKnot + modR * Math.cos(qKnot * phi)) * Math.sin(pKnot * phi),
        z: modR * Math.sin(qKnot * phi),
      };

      p = rotateX(p, t * 0.6);
      p = rotateY(p, t * 0.9);
      p = rotateZ(p, t * 0.4);

      const proj = project3D(p, cx, cy, fov, 380);

      if (first) {
        ctx.moveTo(proj.x, proj.y);
        first = false;
      } else {
        ctx.lineTo(proj.x, proj.y);
      }
    }

    ctx.strokeStyle = `hsla(${baseHue}, 100%, 70%, ${0.75 + overall * 0.25})`;
    ctx.lineWidth = 2.5 + bass * 2;
    ctx.shadowBlur = 22;
    ctx.shadowColor = `hsla(${baseHue}, 100%, 55%, 0.9)`;
    ctx.stroke();

    ctx.restore();
  };

  // PRESET 3: Ethereal Silk 3D
  const renderEtherealSilk3D = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cx: number,
    cy: number,
    fov: number,
    t: number,
    bass: number,
    mid: number,
    treble: number,
    overall: number,
    freqData: Uint8Array
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const ribbonCount = 6;
    const baseHue = (t * 16) % 360;

    for (let r = 0; r < ribbonCount; r++) {
      const depthZ = (r - (ribbonCount - 1) / 2) * 120;
      const scaleFactor = fov / (depthZ + 400);

      const yOffset = cy + (r - (ribbonCount - 1) / 2) * 18 * scaleFactor;
      const amplitude = (30 + bass * 45 + r * 10) * scaleFactor;
      const frequency = 0.008 + r * 0.002;

      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 8) {
        const binIdx = Math.floor((x / w) * (freqData.length / 2));
        const freqVal = (freqData[binIdx] || 0) / 255;

        const sineVal =
          Math.sin(x * frequency + t * 1.8 + r * 0.8) * amplitude +
          Math.cos(x * 0.015 - t * 1.2) * (freqVal * 30 * scaleFactor);

        const y = yOffset + sineVal;
        if (x === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      const ribbonHue = (baseHue + r * 45) % 360;
      const opacity = Math.min(0.7, (0.25 + overall * 0.3) * scaleFactor);

      const grad = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude);
      grad.addColorStop(0, `hsla(${ribbonHue}, 90%, 65%, ${opacity})`);
      grad.addColorStop(0.5, `hsla(${(ribbonHue + 30) % 360}, 85%, 50%, ${opacity * 0.5})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.shadowBlur = 20 * scaleFactor;
      ctx.shadowColor = `hsla(${ribbonHue}, 100%, 55%, 0.7)`;
      ctx.fill();

      ctx.strokeStyle = `hsla(${ribbonHue}, 95%, 75%, ${0.6 + bass * 0.4})`;
      ctx.lineWidth = Math.max(1, (1.5 + bass * 1.5) * scaleFactor);
      ctx.stroke();
    }

    ctx.restore();
  };

  // PRESET 4: Neon Spectrum 3D
  const renderNeonSpectrum3D = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cx: number,
    cy: number,
    fov: number,
    t: number,
    bass: number,
    mid: number,
    treble: number,
    overall: number,
    freqData: Uint8Array
  ) => {
    ctx.save();

    const stars = stars3DRef.current;
    const speed = 2 + overall * 12;

    ctx.fillStyle = '#ffffff';
    stars.forEach((s) => {
      s.z -= speed;
      if (s.z <= 0) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * 1200;
        s.y = (Math.random() - 0.5) * 1200;
      }
      const scale = fov / (s.z + 300);
      const px = cx + s.x * scale;
      const py = cy + s.y * scale;

      if (px >= 0 && px <= w && py >= 0 && py <= h) {
        const starAlpha = Math.min(1, (1000 - s.z) / 400);
        ctx.fillStyle = `rgba(220, 235, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, s.size * scale), 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalCompositeOperation = 'lighter';

    const barCount = 32;
    const pillarWidth = 14;
    const peakPillars = peakPillarsRef.current;

    const baseHue = (t * 30) % 360;

    for (let i = 0; i < barCount; i++) {
      const dataIdx = Math.floor((i / barCount) * (freqData.length * 0.7));
      const val = (freqData[dataIdx] || 0) / 255;
      const targetHeight = val * 160 + 6;

      if (targetHeight > peakPillars[i]) {
        peakPillars[i] = targetHeight;
      } else {
        peakPillars[i] = Math.max(6, peakPillars[i] - 1.8);
      }

      const xPos = (i - (barCount - 1) / 2) * (pillarWidth + 6);
      const zPos = 300 + Math.sin(i * 0.2 + t) * 30;

      let pBottom: Point3D = { x: xPos, y: 80, z: zPos };
      pBottom = rotateX(pBottom, 0.25);
      const projBottom = project3D(pBottom, cx, cy, fov, 350);

      let pTop: Point3D = { x: xPos, y: 80 - targetHeight, z: zPos };
      pTop = rotateX(pTop, 0.25);
      const projTop = project3D(pTop, cx, cy, fov, 350);

      const renderWidth = Math.max(3, pillarWidth * projBottom.scale);
      const renderHeight = Math.abs(projBottom.y - projTop.y);

      const hue = (baseHue + i * 7) % 360;

      const grad = ctx.createLinearGradient(projBottom.x, projBottom.y, projTop.x, projTop.y);
      grad.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.85)`);
      grad.addColorStop(0.8, `hsla(${(hue + 40) % 360}, 100%, 65%, 0.95)`);
      grad.addColorStop(1, '#ffffff');

      ctx.fillStyle = grad;
      ctx.shadowBlur = 12 * projBottom.scale;
      ctx.shadowColor = `hsla(${hue}, 100%, 55%, 0.8)`;
      ctx.fillRect(projTop.x - renderWidth / 2, projTop.y, renderWidth, renderHeight);

      let pPeak: Point3D = { x: xPos, y: 80 - peakPillars[i] - 5, z: zPos };
      pPeak = rotateX(pPeak, 0.25);
      const projPeak = project3D(pPeak, cx, cy, fov, 350);

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = `hsla(${hue}, 100%, 75%, 1)`;
      ctx.fillRect(projPeak.x - renderWidth / 2, projPeak.y, renderWidth, Math.max(2, 3 * projPeak.scale));
    }

    ctx.restore();
  };

  const currentPresetInfo =
    VISUALIZER_PRESETS.find((p) => p.id === selectedPresetId) || VISUALIZER_PRESETS[0];

  return (
    <div className={`relative flex flex-col w-full h-full bg-black rounded overflow-hidden border border-gray-800 ${className}`}>
      
      {/* Top Overlay Controls Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between px-3 py-1.5 bg-black/75 backdrop-blur-md border-b border-white/10 text-[11px] text-white select-none gap-2">
        
        {/* Preset Name */}
        <div className="flex items-center gap-1.5 font-mono text-[#8cb6ff] truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wider uppercase text-[10px]">
            {currentPresetInfo.name}
          </span>
        </div>

        {/* Preset & Effects Controls */}
        <div className="flex items-center gap-2">
          {/* CRT Scanline Toggle */}
          <button
            onClick={() => setEnableScanlines(!enableScanlines)}
            className={`px-1.5 py-0.5 border text-[9px] font-mono rounded transition-colors cursor-pointer ${
              enableScanlines
                ? 'bg-cyan-950 text-cyan-200 border-cyan-500 font-bold'
                : 'bg-gray-900 text-gray-400 border-gray-700'
            }`}
            title="Toggle CRT Screen Scanlines"
          >
            CRT {enableScanlines ? 'ON' : 'OFF'}
          </button>

          {/* Full Window Expand Toggle Button */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="px-2 py-0.5 border text-[9px] font-mono rounded transition-colors bg-blue-900/80 hover:bg-blue-800 text-cyan-200 border-cyan-500 font-bold cursor-pointer"
              title={isExpanded ? 'Restore Normal View' : 'Full Window Mode'}
            >
              {isExpanded ? '🗗 RESTORE' : '⛶ FULL WINDOW'}
            </button>
          )}

          {/* Preset Selector dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPreset}
              className="px-2 py-0.5 bg-gray-800/90 hover:bg-gray-700 active:bg-gray-900 border border-gray-600 rounded text-[10px] font-bold cursor-pointer"
              title="Previous Visualizer Preset"
            >
              &lt;
            </button>

            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-gray-900/90 text-white border border-gray-700 text-[10px] px-1.5 py-0.5 rounded focus:outline-none focus:border-cyan-400 font-sans cursor-pointer"
            >
              {VISUALIZER_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextPreset}
              className="px-2 py-0.5 bg-gray-800/90 hover:bg-gray-700 active:bg-gray-900 border border-gray-600 rounded text-[10px] font-bold cursor-pointer"
              title="Next Visualizer Preset"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Display with Crisp High-Definition Bloom */}
      <div className="relative flex-1 w-full h-full min-h-[200px] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            filter: 'brightness(1.1) contrast(1.08) drop-shadow(0 0 10px rgba(0, 200, 255, 0.35))',
          }}
        />

        {/* CRT Scanline Overlay Effect */}
        {enableScanlines && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
              backgroundSize: '100% 3px, 6px 100%',
            }}
          />
        )}
      </div>

      {/* Subtitle / Description Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 py-1 bg-black/80 backdrop-blur-sm border-t border-white/10 flex items-center justify-between text-[10px] text-gray-300 font-sans select-none">
        <span className="truncate italic text-cyan-200/90">{currentPresetInfo.subtitle}</span>
      </div>
    </div>
  );
}
