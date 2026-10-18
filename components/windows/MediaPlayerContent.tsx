'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Track, VisualizerPreset } from '../../types';
import { VISUALIZER_PRESETS } from '../../constants';

interface MediaPlayerContentProps {
  tracks: Track[];
  currentTrack: Track;
  setCurrentTrack: (track: Track) => void;
  visualizerPreset: VisualizerPreset;
  setVisualizerPreset: (preset: VisualizerPreset) => void;
  visualizerBars: number[];
  isPlaying: boolean;
  togglePlayback: () => void;
  stopPlayback: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  currentTime: number;
  duration: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handleMetadataLoaded: () => void;
  handleTimeUpdate: () => void;
  setIsPlaying: (playing: boolean) => void;
  stopVisualizer: () => void;
}

// ---------------------------------------------------------------------------
// Utility helpers & Audio Analysis
// ---------------------------------------------------------------------------

const NORMALIZE_MAX = 100;

function safeBars(bars: number[]): number[] {
  if (!bars || bars.length === 0) return new Array(32).fill(0);
  return bars;
}

interface AudioMetrics {
  bass: number;     // 0..100
  mid: number;      // 0..100
  treble: number;   // 0..100
  energy: number;   // 0..100
  isBeat: boolean;  // transient kick detected
  bassDelta: number;
}

function getAudioMetrics(rawBars: number[], prevBass: number): AudioMetrics {
  const bars = safeBars(rawBars);
  const len = bars.length;
  const bassEnd = Math.max(2, Math.floor(len * 0.22));
  const midEnd = Math.max(bassEnd + 2, Math.floor(len * 0.65));

  let sumBass = 0;
  for (let i = 0; i < bassEnd; i++) sumBass += bars[i];
  const bass = sumBass / bassEnd;

  let sumMid = 0;
  for (let i = bassEnd; i < midEnd; i++) sumMid += bars[i];
  const mid = sumMid / (midEnd - bassEnd);

  let sumTreble = 0;
  for (let i = midEnd; i < len; i++) sumTreble += bars[i];
  const treble = sumTreble / Math.max(1, len - midEnd);

  const energy = Math.min(100, (bass * 1.6 + mid * 1.0 + treble * 0.9) / 3.5);
  const bassDelta = Math.max(0, bass - prevBass);
  const isBeat = bass > 26 && bassDelta > 7.5;

  return { bass, mid, treble, energy, isBeat, bassDelta };
}

// ---------------------------------------------------------------------------
// Visualizer Engine State Types
// ---------------------------------------------------------------------------

interface Shockwave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  hue: number;
}

interface FogPuff {
  relX: number;
  relY: number;
  baseRadius: number;
  hueOffset: number;
  speed: number;
  phase: number;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  pz: number;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
}

interface VisualizerEngineState {
  t: number;
  prevBass: number;
  beatPulse: number;
  beatCount: number;
  masterHue: number;
  modeIndex: number;
  modeTimer: number;
  peaks: number[];
  shockwaves: Shockwave[];
  fogPuffs: FogPuff[];
  stars: Star3D[];
  embers: EmberParticle[];
}

function initEngineState(): VisualizerEngineState {
  const fogPuffs: FogPuff[] = [];
  const numPuffs = 14;
  for (let i = 0; i < numPuffs; i++) {
    fogPuffs.push({
      relX: 0.15 + ((i * 0.29) % 0.7),
      relY: 0.18 + ((i * 0.37) % 0.64),
      baseRadius: 0.26 + (i % 3) * 0.08,
      hueOffset: (i * 38) % 360,
      speed: 0.35 + (i % 4) * 0.16,
      phase: i * 0.9,
    });
  }

  return {
    t: 0,
    prevBass: 0,
    beatPulse: 0,
    beatCount: 0,
    masterHue: 280, // classic WMP psychedelic violet/magenta start
    modeIndex: 0,
    modeTimer: 0,
    peaks: [],
    shockwaves: [],
    fogPuffs,
    stars: [],
    embers: [],
  };
}

// ---------------------------------------------------------------------------
// Shared Psychedelic Fog & Atmosphere Engine (WMP Batería Style)
// ---------------------------------------------------------------------------

function drawPsychedelicFog(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  metrics: AudioMetrics,
  state: VisualizerEngineState
) {
  const { energy, bass } = metrics;
  const { t, masterHue, fogPuffs, beatPulse } = state;

  // Rich optical persistence: dark velvet wash creates smooth motion trails and misty smoke
  const trailAlpha = Math.max(0.12, 0.22 - (energy / 100) * 0.08);
  ctx.fillStyle = `rgba(3, 1, 9, ${trailAlpha})`;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(w, h);

  // Volumetric billowing smoke clouds (multi-octave drifting gradients)
  for (let i = 0; i < fogPuffs.length; i++) {
    const p = fogPuffs[i];
    const driftX = Math.sin(t * p.speed + p.phase) * (w * 0.22);
    const driftY = Math.cos(t * p.speed * 0.78 + p.phase) * (h * 0.18);
    const px = cx + driftX + (p.relX - 0.5) * (w * 0.65);
    const py = cy + driftY + (p.relY - 0.5) * (h * 0.55);

    const rad = p.baseRadius * minDim * (0.85 + (energy / 100) * 0.75 + beatPulse * 0.5);
    if (!isFinite(px) || !isFinite(py) || !isFinite(rad) || rad <= 1) continue;

    const hue = (masterHue + p.hueOffset + t * 24) % 360;
    const coreAlpha = 0.22 + (energy / 100) * 0.38 + beatPulse * 0.28;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, Math.max(1, rad));
    grad.addColorStop(0, `hsla(${hue}, 100%, 65%, ${coreAlpha})`);
    grad.addColorStop(0.38, `hsla(${(hue + 45) % 360}, 95%, 48%, ${coreAlpha * 0.55})`);
    grad.addColorStop(0.72, `hsla(${(hue + 90) % 360}, 90%, 30%, ${coreAlpha * 0.18})`);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Undulating psychedelic mist ribbon across the scene
  const ribbonSteps = 24;
  ctx.beginPath();
  for (let s = 0; s <= ribbonSteps; s++) {
    const rx = (s / ribbonSteps) * w;
    const wave =
      Math.sin(s * 0.45 + t * 2.4) * (h * 0.08 * (1 + bass / 60)) +
      Math.cos(s * 0.25 - t * 1.8) * (h * 0.05);
    const ry = cy + wave;
    if (s === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  }
  ctx.strokeStyle = `hsla(${(masterHue + 160) % 360}, 100%, 75%, ${0.12 + (energy / 100) * 0.25})`;
  ctx.lineWidth = 12 + (energy / 100) * 22;
  ctx.stroke();

  ctx.restore();
}

function updateAndDrawShockwaves(
  ctx: CanvasRenderingContext2D,
  shockwaves: Shockwave[]
) {
  if (shockwaves.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.r += 9 + (sw.maxR - sw.r) * 0.07;
    sw.alpha *= 0.92;

    if (sw.alpha < 0.015 || sw.r >= sw.maxR) {
      shockwaves.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${sw.hue}, 100%, 75%, ${sw.alpha})`;
    ctx.lineWidth = Math.max(1, (1 - sw.r / sw.maxR) * 6);
    ctx.shadowColor = `hsla(${sw.hue}, 100%, 80%, 0.8)`;
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  ctx.restore();
}

function updateAndDrawEmbers(
  ctx: CanvasRenderingContext2D,
  embers: EmberParticle[],
  w: number,
  h: number,
  energy: number,
  masterHue: number
) {
  if (energy > 20 && embers.length < 45 && Math.random() < 0.45) {
    embers.push({
      x: w * (0.15 + Math.random() * 0.7),
      y: h * 0.82 + Math.random() * (h * 0.18),
      vx: (Math.random() - 0.5) * 1.8,
      vy: -1.2 - Math.random() * 2.8 - (energy / 100) * 2.5,
      life: 0,
      maxLife: 50 + Math.random() * 60,
      hue: (masterHue + Math.random() * 90) % 360,
      size: 1.2 + Math.random() * 2.4,
    });
  }

  if (embers.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = embers.length - 1; i >= 0; i--) {
    const emb = embers[i];
    emb.life++;
    emb.x += emb.vx + Math.sin(emb.life * 0.09) * 0.9;
    emb.y += emb.vy;
    const progress = emb.life / emb.maxLife;
    if (progress >= 1 || emb.y < -15) {
      embers.splice(i, 1);
      continue;
    }
    const alpha = Math.sin(progress * Math.PI) * 0.85;
    ctx.fillStyle = `hsla(${emb.hue}, 100%, 78%, ${alpha})`;
    ctx.shadowColor = `hsla(${emb.hue}, 100%, 85%, 0.8)`;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(emb.x, emb.y, emb.size * (1 - progress * 0.5), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// 1. PRESET: "BATERÍA: FOG SPECTRUM"
// Psychedelic Fog with Mutating Equalizer (Horizon / Butterfly / Radial Ring)
// ---------------------------------------------------------------------------

function drawSpectrumAnalyzer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawBars: number[],
  state: VisualizerEngineState,
  metrics: AudioMetrics
) {
  const bars = safeBars(rawBars);
  const { energy, bass } = metrics;
  const { t, masterHue, peaks, modeIndex, beatPulse } = state;

  // 1. Billowing psychedelic volumetric fog backdrop
  drawPsychedelicFog(ctx, w, h, metrics, state);
  updateAndDrawShockwaves(ctx, state.shockwaves);
  updateAndDrawEmbers(ctx, state.embers, w, h, energy, masterHue);

  const cols = bars.length;
  while (peaks.length < cols) peaks.push(0);
  peaks.length = cols;

  const cx = w / 2;
  const cy = h / 2;

  // -------------------------------------------------------------
  // Variation 0: Classic WMP Batería Horizon Spectrum with Reflection
  // -------------------------------------------------------------
  if (modeIndex === 0) {
    const gap = Math.max(1.5, Math.floor((w / cols) * 0.12));
    const colW = Math.max(2, (w - gap * (cols + 1)) / cols);
    const segH = Math.max(2, h / 42);
    const segGap = Math.max(0.6, segH * 0.22);
    const maxSegs = Math.floor((h * 0.78) / (segH + segGap));

    ctx.save();
    for (let i = 0; i < cols; i++) {
      // Harmonic wave modulation gives lively undulating bounce across bars
      const waveMod = 1 + 0.18 * Math.sin(t * 4 + i * 0.35);
      const amp = Math.max(0, Math.min(100, bars[i] * waveMod)) / 100;
      const litSegs = Math.round(amp * maxSegs);
      peaks[i] = litSegs >= peaks[i] ? litSegs : Math.max(litSegs, peaks[i] - 0.22);

      const x = gap + i * (colW + gap);
      const colHue = (masterHue + (i / cols) * 160 + t * 45) % 360;

      // Glow on high peaks
      if (amp > 0.35) {
        ctx.shadowColor = `hsl(${colHue}, 100%, 70%)`;
        ctx.shadowBlur = 8 + amp * 18 + beatPulse * 12;
      } else {
        ctx.shadowBlur = 0;
      }

      for (let s = 0; s < maxSegs; s++) {
        const y = h * 0.88 - (s + 1) * (segH + segGap);
        const ratio = s / maxSegs;
        if (s < litSegs) {
          const segHue = (colHue + ratio * 90) % 360;
          const sat = 100;
          const lig = 50 + ratio * 35;
          ctx.fillStyle = `hsl(${segHue}, ${sat}%, ${lig}%)`;
          ctx.fillRect(x, y, colW, segH);
        }
      }

      // Peak floating dot with diamond glow
      const peakSeg = Math.round(peaks[i]);
      if (peakSeg > 0 && peakSeg <= maxSegs) {
        const py = h * 0.88 - peakSeg * (segH + segGap);
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, py, colW, Math.max(2, segH * 0.6));
      }
    }

    // Mirror reflection on misty water floor with horizontal ripple
    ctx.globalAlpha = 0.24 + (energy / 100) * 0.2;
    ctx.globalCompositeOperation = 'lighter';
    const floorY = h * 0.88;
    for (let i = 0; i < cols; i++) {
      const amp = (bars[i] / 100) * (h * 0.28);
      const x = gap + i * (colW + gap);
      const colHue = (masterHue + (i / cols) * 160 + t * 45) % 360;
      const ripple = Math.sin(t * 3 + i * 0.4) * 3;
      ctx.fillStyle = `hsla(${colHue}, 100%, 65%, 0.6)`;
      ctx.fillRect(x + ripple, floorY + 2, colW, amp);
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // Variation 1: Symmetrical Butterfly Wings (Bilateral Energy Flare)
  // -------------------------------------------------------------
  else if (modeIndex === 1) {
    const halfCols = Math.floor(cols / 2);
    const colW = Math.max(3, (w * 0.44) / halfCols);
    const maxBarH = h * 0.42;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < halfCols; i++) {
        const barIdx = side === -1 ? halfCols - 1 - i : i;
        const amp = (bars[barIdx] / 100);
        const barH = amp * maxBarH * (1 + 0.15 * Math.sin(t * 5 + i * 0.4));
        const x = cx + side * (i * colW + 12);
        const colHue = (masterHue + (i / halfCols) * 180 + t * 50) % 360;

        ctx.shadowColor = `hsl(${colHue}, 100%, 75%)`;
        ctx.shadowBlur = 6 + amp * 16;

        // Gradient column
        const grad = ctx.createLinearGradient(x, cy - barH, x, cy + barH);
        grad.addColorStop(0, `hsla(${colHue}, 100%, 85%, 0.9)`);
        grad.addColorStop(0.5, `hsla(${(colHue + 40) % 360}, 100%, 60%, 0.7)`);
        grad.addColorStop(1, `hsla(${colHue}, 100%, 85%, 0.9)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x - (side === -1 ? colW : 0), cy - barH, colW - 2, barH * 2);
      }
    }

    // Central pulsing iris
    const irisR = 14 + (bass / 100) * 32 + beatPulse * 20;
    const irisGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, irisR);
    irisGrad.addColorStop(0, '#ffffff');
    irisGrad.addColorStop(0.4, `hsla(${masterHue}, 100%, 70%, 0.8)`);
    irisGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // -------------------------------------------------------------
  // Variation 2: Radial Mandala Spectrum Ring in Dense Fog
  // -------------------------------------------------------------
  else {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const baseR = Math.min(cx, cy) * 0.42 + (bass / 100) * 22;
    const maxR = Math.min(cx, cy) * 0.9;
    const rotSpeed = t * 0.35;

    for (let i = 0; i < cols; i++) {
      const angle = (i / cols) * Math.PI * 2 + rotSpeed;
      const amp = (bars[i] / 100);
      const rayLen = amp * (maxR - baseR);
      const colHue = (masterHue + (i / cols) * 260 + t * 40) % 360;

      const x1 = cx + Math.cos(angle) * baseR;
      const y1 = cy + Math.sin(angle) * baseR;
      const x2 = cx + Math.cos(angle) * (baseR + rayLen);
      const y2 = cy + Math.sin(angle) * (baseR + rayLen);

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${colHue}, 100%, 75%, ${0.4 + amp * 0.6})`;
      ctx.lineWidth = Math.max(2, (w / cols) * 0.4);
      ctx.shadowColor = `hsla(${colHue}, 100%, 80%, 0.8)`;
      ctx.shadowBlur = 8 + amp * 14;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Outer sparkle dot
      if (amp > 0.3) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x2, y2, 2.5 + amp * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Inner glowing mandala circle
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * 0.9, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${(masterHue + 60) % 360}, 100%, 75%, 0.5)`;
    ctx.lineWidth = 3 + beatPulse * 4;
    ctx.stroke();

    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// 2. PRESET: "BATERÍA: ACID AMBIENCE"
// Swirling Fog Cyclone, Mutating 3D Lissajous & Kaleidoscopic Shockwaves
// ---------------------------------------------------------------------------

function drawOscilloscope(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawBars: number[],
  state: VisualizerEngineState,
  metrics: AudioMetrics
) {
  const bars = safeBars(rawBars);
  const { energy, bass, mid } = metrics;
  const { t, masterHue, modeIndex, beatPulse } = state;

  // 1. Atmosphere & Fog
  drawPsychedelicFog(ctx, w, h, metrics, state);
  updateAndDrawShockwaves(ctx, state.shockwaves);
  updateAndDrawEmbers(ctx, state.embers, w, h, energy, masterHue);

  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(cx, cy);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // -------------------------------------------------------------
  // Variation 0: Hypnotic Fog Cyclone & Multi-Layer Lissajous
  // -------------------------------------------------------------
  if (modeIndex === 0) {
    // Swirling spiral arms of acid mist
    const arms = 5;
    for (let a = 0; a < arms; a++) {
      const armAngle = (a / arms) * Math.PI * 2 + t * 0.7;
      ctx.beginPath();
      for (let r = 10; r < minDim * 0.95; r += 8) {
        const spiralAngle = armAngle + (r / minDim) * 3.2;
        const wave = Math.sin(r * 0.1 - t * 4) * (bass * 0.25);
        const px = cx + Math.cos(spiralAngle) * (r + wave);
        const py = cy + Math.sin(spiralAngle) * (r + wave);
        if (r === 10) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const hue = (masterHue + a * 65 + t * 50) % 360;
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.3 + (energy / 100) * 0.5})`;
      ctx.lineWidth = 2 + (energy / 100) * 3;
      ctx.shadowColor = `hsla(${hue}, 100%, 80%, 0.8)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    // 4 Intertwined 3D-rotating Lissajous loops
    const numLoops = 4;
    for (let l = 0; l < numLoops; l++) {
      const hue = (masterHue + l * 75 + t * 60) % 360;
      const freqA = 2 + l * 0.7 + (bass > 50 ? 1 : 0);
      const freqB = 3 + l * 0.5 + (mid > 40 ? 1 : 0);
      const phase = l * 0.6 + t * 0.8;
      const scaleX = minDim * (0.65 + (energy / 100) * 0.35);
      const scaleY = minDim * (0.55 + (energy / 100) * 0.35);

      ctx.beginPath();
      for (let theta = 0; theta <= 360; theta += 2) {
        const rad = (theta / 360) * Math.PI * 2;
        const lx = cx + Math.sin(freqA * rad + phase) * scaleX;
        const ly = cy + Math.sin(freqB * rad) * scaleY;
        if (theta === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.strokeStyle = `hsla(${hue}, 100%, 75%, 0.65)`;
      ctx.lineWidth = 1.5 + (energy / 100) * 2.5;
      ctx.shadowColor = `hsla(${hue}, 100%, 85%, 0.9)`;
      ctx.shadowBlur = 8;
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------
  // Variation 1: Quantum Ribbons / Undulating Laser Helix
  // -------------------------------------------------------------
  else if (modeIndex === 1) {
    const helixRibbons = 6;
    for (let r = 0; r < helixRibbons; r++) {
      const hue = (masterHue + r * 50 + t * 70) % 360;
      const phase = (r / helixRibbons) * Math.PI * 2 + t * 1.5;

      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const normX = x / w;
        const freq = 3 + r * 0.5;
        const amp = (h * 0.28) * (0.5 + (energy / 100) * 1.2);
        const y = cy + Math.sin(normX * freq * Math.PI * 2 + phase) * amp * Math.cos(normX * 2 + t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${0.4 + (energy / 100) * 0.5})`;
      ctx.lineWidth = 2 + (energy / 100) * 3;
      ctx.shadowColor = `hsla(${hue}, 100%, 80%, 0.8)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    // Reactive frequency spikes across center line
    const spikeN = Math.min(bars.length, 32);
    for (let i = 0; i < spikeN; i++) {
      const sx = (i / spikeN) * w;
      const sH = (bars[i] / 100) * (h * 0.35);
      const hue = (masterHue + i * 12 + t * 40) % 360;
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.7)`;
      ctx.lineWidth = 2;
      ctx.moveTo(sx, cy - sH);
      ctx.lineTo(sx, cy + sH);
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------
  // Variation 2: Kaleidoscopic Acid Mandala (6-Fold Symmetry)
  // -------------------------------------------------------------
  else {
    const sectors = 6;
    const pointsPerSector = 60;
    const baseRadius = minDim * 0.75 * (0.5 + (energy / 100) * 0.7);

    for (let s = 0; s < sectors; s++) {
      const sectorAngle = (s / sectors) * Math.PI * 2 + t * 0.25;
      const hue = (masterHue + s * 60 + t * 50) % 360;

      ctx.beginPath();
      for (let p = 0; p <= pointsPerSector; p++) {
        const u = p / pointsPerSector;
        const barSample = bars[Math.floor(u * (bars.length - 1))] || 0;
        const wave = Math.sin(u * Math.PI * 4 + t * 3) * (barSample / 100) * (minDim * 0.35);
        const r = u * baseRadius + wave;
        const theta = sectorAngle + Math.sin(u * Math.PI * 2) * (Math.PI / sectors) * 0.9;

        const px = cx + Math.cos(theta) * r;
        const py = cy + Math.sin(theta) * r;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `hsla(${hue}, 100%, 75%, 0.8)`;
      ctx.lineWidth = 2 + beatPulse * 2.5;
      ctx.shadowColor = `hsla(${hue}, 100%, 85%, 0.9)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// 3. PRESET: "BATERÍA: COSMIC NEBULA"
// Milkdrop Warp Tunnel, 3D Chromatic Starfield & Solar Coronal Flares
// ---------------------------------------------------------------------------

function drawMilkdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawBars: number[],
  state: VisualizerEngineState,
  metrics: AudioMetrics
) {
  const bars = safeBars(rawBars);
  const { energy, bass } = metrics;
  const { t, masterHue, stars, modeIndex, beatPulse } = state;

  // 1. Atmosphere & Fog
  drawPsychedelicFog(ctx, w, h, metrics, state);
  updateAndDrawShockwaves(ctx, state.shockwaves);
  updateAndDrawEmbers(ctx, state.embers, w, h, energy, masterHue);

  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(cx, cy);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // -------------------------------------------------------------
  // Variation 0: Hyper Warp Tunnel with Perspective Depth
  // -------------------------------------------------------------
  if (modeIndex === 0) {
    const tunnelRings = 16;
    for (let r = 0; r < tunnelRings; r++) {
      const zPhase = ((r / tunnelRings) + (t * 0.35)) % 1;
      const warpR = Math.pow(zPhase, 1.5) * minDim * 1.8;
      const bassWarp = 1 + (bass / 100) * 0.6;
      const hue = (masterHue + r * 22 + t * 45) % 360;
      const alpha = (1 - zPhase) * 0.4 + (energy / 100) * 0.3;

      ctx.beginPath();
      // Rippled perimeter reactive to audio
      const numPts = 32;
      for (let p = 0; p <= numPts; p++) {
        const angle = (p / numPts) * Math.PI * 2;
        const bv = bars[p % bars.length] || 0;
        const ripple = 1 + (bv / 100) * 0.25 * Math.sin(angle * 4 + t * 3);
        const rx = cx + Math.cos(angle) * warpR * bassWarp * ripple;
        const ry = cy + Math.sin(angle) * (warpR * 0.7) * ripple;
        if (p === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
      ctx.lineWidth = 1.2 + (1 - zPhase) * 3;
      ctx.shadowColor = `hsla(${hue}, 100%, 75%, 0.8)`;
      ctx.shadowBlur = 8;
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------
  // Variation 1: Geometric Prism Portal (Hexagonal Warp)
  // -------------------------------------------------------------
  else if (modeIndex === 1) {
    const prismRings = 14;
    const sides = 6;
    for (let r = 0; r < prismRings; r++) {
      const zPhase = ((r / prismRings) + (t * 0.3)) % 1;
      const radius = Math.pow(zPhase, 1.4) * minDim * 1.7;
      const rotation = t * 0.4 + zPhase * Math.PI * 0.8;
      const hue = (masterHue + r * 28 + t * 50) % 360;
      const alpha = (1 - zPhase) * 0.5 + (energy / 100) * 0.35;

      ctx.beginPath();
      for (let s = 0; s <= sides; s++) {
        const angle = (s / sides) * Math.PI * 2 + rotation;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${alpha})`;
      ctx.lineWidth = 1.5 + (1 - zPhase) * 3.5;
      ctx.shadowColor = `hsla(${hue}, 100%, 80%, 0.9)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------
  // Variation 2: Supernova Coronal Flare (360° Frequency Spikes)
  // -------------------------------------------------------------
  else {
    const spikeN = bars.length;
    const baseRing = minDim * 0.45 + (bass / 100) * 20;

    for (let i = 0; i < spikeN; i++) {
      const angle = (i / spikeN) * Math.PI * 2 + t * 0.2;
      const bv = bars[i] || 0;
      const spLen = (bv / 100) * minDim * 0.7;
      const hue = (masterHue + i * (360 / spikeN) + t * 45) % 360;

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 100%, 75%, ${0.35 + (bv / 100) * 0.65})`;
      ctx.lineWidth = 2 + (bv / 100) * 3;
      ctx.shadowColor = `hsla(${hue}, 100%, 80%, 0.9)`;
      ctx.shadowBlur = 10;
      ctx.moveTo(cx + Math.cos(angle) * baseRing, cy + Math.sin(angle) * baseRing);
      ctx.lineTo(
        cx + Math.cos(angle) * (baseRing + spLen),
        cy + Math.sin(angle) * (baseRing + spLen)
      );
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------
  // 3D Chromatic Starfield with RGB Separation
  // -------------------------------------------------------------
  if (stars.length === 0) {
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2.2,
        y: (Math.random() - 0.5) * h * 2.2,
        z: Math.random() * w,
        pz: w,
      });
    }
  }

  const starSpeed = 3 + (bass / 100) * 12 + beatPulse * 8;
  const chromaticOffset = 1.5 + (energy / 100) * 2.5;

  for (const star of stars) {
    star.pz = star.z;
    star.z -= starSpeed;
    if (star.z <= 0) {
      star.x = (Math.random() - 0.5) * w * 2.2;
      star.y = (Math.random() - 0.5) * h * 2.2;
      star.z = w;
      star.pz = w;
    }

    const sx = (star.x / star.z) * w + cx;
    const sy = (star.y / star.z) * h + cy;
    const px = (star.x / star.pz) * w + cx;
    const py = (star.y / star.pz) * h + cy;
    const bright = Math.floor((1 - star.z / w) * 255);
    const sz = Math.max(0.6, (1 - star.z / w) * 2.2);

    ctx.lineWidth = sz;

    // Red Channel
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, ${bright >> 1}, ${bright >> 1}, 0.8)`;
    ctx.moveTo(px - chromaticOffset, py);
    ctx.lineTo(sx - chromaticOffset, sy);
    ctx.stroke();

    // Green Channel
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${bright >> 1}, 255, ${bright >> 1}, 0.5)`;
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Blue Channel
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${bright >> 1}, ${bright >> 1}, 255, 0.65)`;
    ctx.moveTo(px + chromaticOffset, py);
    ctx.lineTo(sx + chromaticOffset, sy);
    ctx.stroke();
  }

  // Central Hyper-Orb Core
  const coreR = 10 + (energy / 100) * 30 + beatPulse * 16;
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.3, `hsla(${masterHue}, 100%, 75%, 0.8)`);
  coreGrad.addColorStop(0.6, `hsla(${(masterHue + 60) % 360}, 90%, 50%, 0.3)`);
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Single persistent RAF loop — visualizer hook with Dynamic Mutation Engine
// ---------------------------------------------------------------------------

function useWmpVisualizer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  visualizerPreset: VisualizerPreset,
  visualizerBars: number[],
  isPlaying: boolean
) {
  const presetRef = useRef(visualizerPreset);
  const barsRef = useRef(visualizerBars);
  const isPlayingRef = useRef(isPlaying);
  const engineRef = useRef<VisualizerEngineState | null>(null);

  if (engineRef.current == null) {
    engineRef.current = initEngineState();
  }

  useEffect(() => { presetRef.current = visualizerPreset; }, [visualizerPreset]);
  useEffect(() => { barsRef.current = visualizerBars; }, [visualizerBars]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;

    const decayedBars = () => {
      const raw = barsRef.current;
      if (isPlayingRef.current) return raw;
      return raw.map(v => v * 0.94);
    };

    const loop = () => {
      const state = engineRef.current!;
      state.t += 0.016;

      // Master psychedelic color cycle
      state.masterHue = (state.masterHue + 0.45) % 360;

      const rawBars = decayedBars();
      const metrics = getAudioMetrics(rawBars, state.prevBass);
      state.prevBass = metrics.bass;

      // Transient Beat Detection & Shockwave Spawning
      if (metrics.isBeat && state.beatPulse < 0.3) {
        state.beatPulse = 1.0;
        state.beatCount++;
        if (state.shockwaves.length < 5) {
          state.shockwaves.push({
            x: width / 2,
            y: height / 2,
            r: 10,
            maxR: Math.max(width, height) * 0.85,
            alpha: 0.85,
            hue: (state.masterHue + Math.random() * 60) % 360,
          });
        }
      } else {
        state.beatPulse = Math.max(0, state.beatPulse * 0.9);
      }

      // Dynamic Variety & Morphing ("Muchos Cambios"):
      // Automatically cycle pattern variations every 11 seconds OR every 20 strong beats!
      state.modeTimer += 0.016;
      if (state.modeTimer > 11 || state.beatCount >= 20) {
        state.modeIndex = (state.modeIndex + 1) % 3;
        state.modeTimer = 0;
        state.beatCount = 0;
      }

      const preset = presetRef.current;
      if (preset === 'battery') {
        drawSpectrumAnalyzer(ctx, width, height, rawBars, state, metrics);
      } else if (preset === 'mathical') {
        drawOscilloscope(ctx, width, height, rawBars, state, metrics);
      } else {
        drawMilkdrop(ctx, width, height, rawBars, state, metrics);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef]);
}

// ---------------------------------------------------------------------------
// Icon set
// ---------------------------------------------------------------------------

const SkipPrevIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);
const SkipNextIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm8.5-6v6H17V6h-2.5z" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0c3d17">
    <path d="M7 5.5v13l11-6.5-11-6.5z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0c3d17">
    <rect x="6" y="5" width="4" height="14" />
    <rect x="14" y="5" width="4" height="14" />
  </svg>
);
const StopIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#e9eefc">
    <rect x="5" y="5" width="14" height="14" rx="1.5" />
  </svg>
);
const SpeakerIcon = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#e9eefc">
    <path d="M4 9v6h4l5 5V4L8 9H4z" />
    {muted ? (
      <path d="M16 9l5 6M21 9l-5 6" stroke="#ff8080" strokeWidth="1.8" strokeLinecap="round" />
    ) : (
      <path
        d="M16.5 8.5a5 5 0 010 7"
        stroke="#e9eefc"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    )}
  </svg>
);
const AlbumIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
  </svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Scrolling title ticker (WMP style)
// ---------------------------------------------------------------------------
function ScrollingTitle({ text }: { text: string }) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let pos = 0;
    const id = setInterval(() => {
      const containerW = containerRef.current?.offsetWidth ?? 0;
      const textW = textRef.current?.scrollWidth ?? 0;
      if (textW <= containerW) return;
      pos += 1;
      if (pos > textW + 20) pos = -containerW;
      setOffset(pos);
    }, 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap relative"
      style={{ height: '1.2em' }}
    >
      <span
        ref={textRef}
        style={{ transform: `translateX(${-offset}px)`, display: 'inline-block' }}
      >
        {text}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
type PlaylistView = 'all' | 'albums';

export const MediaPlayerContent: React.FC<MediaPlayerContentProps> = ({
  tracks,
  currentTrack,
  setCurrentTrack,
  visualizerPreset,
  setVisualizerPreset,
  visualizerBars,
  isPlaying,
  togglePlayback,
  stopPlayback,
  volume,
  setVolume,
  currentTime,
  duration,
  audioRef,
  handleMetadataLoaded,
  handleTimeUpdate,
  setIsPlaying,
  stopVisualizer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useWmpVisualizer(canvasRef, visualizerPreset, visualizerBars, isPlaying);

  const [prevVolume, setPrevVolume] = useState(volume > 0 ? volume : 0.6);
  const isMuted = volume <= 0;

  const [playlistView, setPlaylistView] = useState<PlaylistView>('all');
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const [vizDropdownOpen, setVizDropdownOpen] = useState(false);
  const vizDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!vizDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (vizDropdownRef.current && !vizDropdownRef.current.contains(e.target as Node)) {
        setVizDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [vizDropdownOpen]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(prevVolume > 0 ? prevVolume : 0.6);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  }, [isMuted, prevVolume, volume, setVolume]);

  const presetIndex = Math.max(0, VISUALIZER_PRESETS.findIndex(p => p.id === visualizerPreset));
  const currentPreset = VISUALIZER_PRESETS[presetIndex] ?? VISUALIZER_PRESETS[0];

  // Skip prev/next
  const skipTrack = useCallback((dir: 1 | -1) => {
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    const next = (idx + dir + tracks.length) % tracks.length;
    setCurrentTrack(tracks[next]);
  }, [tracks, currentTrack, setCurrentTrack]);

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  // Album grouping
  const albums = Array.from(new Set(tracks.map(t => t.album ?? 'Loose tracks')));
  const tracksByAlbum: Record<string, Track[]> = {};
  for (const t of tracks) {
    const a = t.album ?? 'Loose tracks';
    if (!tracksByAlbum[a]) tracksByAlbum[a] = [];
    tracksByAlbum[a].push(t);
  }

  const toggleAlbum = (album: string) => {
    setExpandedAlbums(prev => {
      const next = new Set(prev);
      if (next.has(album)) next.delete(album);
      else next.add(album);
      return next;
    });
  };

  // WMP-era toolbar buttons style
  const toolBtn = (onClick: () => void, label: string, children: React.ReactNode, active?: boolean) => (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: active
          ? 'linear-gradient(180deg, #b8cce8 0%, #7aaad8 100%)'
          : 'linear-gradient(180deg, #e8eef8 0%, #c4d4ec 100%)',
        border: '1px solid #6a8fc0',
        boxShadow: active
          ? 'inset 1px 1px 2px rgba(0,0,0,0.25)'
          : 'inset 0 1px 1px rgba(255,255,255,0.8), 0 1px 1px rgba(0,0,0,0.2)',
        color: '#0a2350',
        fontSize: '10px',
        padding: '2px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        cursor: 'pointer',
        borderRadius: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="flex flex-col h-full w-full select-none overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #103a7a 0%, #1c5bb0 3%, #dfe9f7 3%, #dfe9f7 100%)',
        border: '1px solid #0a2e63',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
      }}
    >
      {/* WMP top toolbar */}
      <div
        className="flex items-center gap-1 px-2 py-1 flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #dfe9f7 0%, #c8d8f0 100%)',
          borderBottom: '1px solid #8aabd4',
        }}
      >
        {toolBtn(() => setPlaylistView('all'), 'All tracks', <><ListIcon /><span>Now Playing</span></>, playlistView === 'all')}
        {toolBtn(() => setPlaylistView('albums'), 'Albums', <><AlbumIcon /><span>Library</span></>, playlistView === 'albums')}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: '9px', color: '#3a5da3', fontStyle: 'italic' }}>Windows Media Player</div>
      </div>

      {/* Main body — flex row */}
      <div className="flex flex-1 overflow-hidden gap-0">

        {/* LEFT: Playlist */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{
            width: '38%',
            minWidth: '140px',
            maxWidth: '260px',
            borderRight: '2px solid #7fa8de',
            background: '#f3f7fd',
          }}
        >
          {/* Playlist header */}
          <div
            className="text-white font-bold text-[10px] px-2 py-1 flex items-center gap-1.5 flex-shrink-0"
            style={{
              background: 'linear-gradient(180deg, #4c86e0 0%, #1c58c2 50%, #123f96 100%)',
              borderBottom: '1px solid #0a2e63',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#ffd23f">
              <path d="M9 17V5l12-2v12M9 17a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" fill="none" stroke="#ffd23f" strokeWidth="1.6" />
            </svg>
            {playlistView === 'all' ? 'Now Playing' : 'Library'}
          </div>

          {/* Track list */}
          <div className="flex-1 overflow-y-auto win2k-scroll">
            {playlistView === 'all' ? (
              tracks.map((t, i) => {
                const active = currentTrack.id === t.id;
                return (
                  <div
                    key={t.id}
                    className="px-2 py-1.5 cursor-pointer text-[11px] flex items-center gap-1.5"
                    style={{
                      background: active
                        ? 'linear-gradient(180deg, #6ea3ec, #2d64c4)'
                        : i % 2 === 0 ? '#f3f7fd' : '#e6eefb',
                      color: active ? '#ffffff' : '#0a2350',
                      fontWeight: active ? 700 : 400,
                      borderBottom: '1px solid #d7e3f5',
                    }}
                    onClick={() => setCurrentTrack(t)}
                  >
                    {active && isPlaying ? (
                      <span style={{ fontSize: '8px', color: '#ffd23f' }}>▶</span>
                    ) : (
                      <span style={{ fontSize: '8px', opacity: 0.3 }}>♪</span>
                    )}
                    <div className="min-w-0">
                      <div className="truncate">{t.title}</div>
                      <div className="truncate opacity-75" style={{ fontSize: '9px' }}>{t.artist}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              albums.map(album => {
                const albumTracks = tracksByAlbum[album] ?? [];
                const expanded = expandedAlbums.has(album);
                const hasActive = albumTracks.some(t => t.id === currentTrack.id);
                return (
                  <div key={album}>
                    {/* Album row */}
                    <div
                      className="px-2 py-1.5 cursor-pointer text-[10px] flex items-center gap-1.5 font-bold select-none"
                      style={{
                        background: hasActive
                          ? 'linear-gradient(180deg, #b8d4f8, #8ab4e8)'
                          : 'linear-gradient(180deg, #d4e4f8, #bccfe8)',
                        color: '#082060',
                        borderBottom: '1px solid #a0bce0',
                      }}
                      onClick={() => toggleAlbum(album)}
                    >
                      <span style={{ fontSize: '9px' }}>{expanded ? '▼' : '▶'}</span>
                      <AlbumIcon />
                      <span className="truncate flex-1">{album}</span>
                      <span style={{ fontSize: '9px', opacity: 0.6 }}>{albumTracks.length}</span>
                    </div>
                    {/* Album tracks */}
                    {expanded && albumTracks.map((t, i) => {
                      const active = currentTrack.id === t.id;
                      return (
                        <div
                          key={t.id}
                          className="pl-6 pr-2 py-1.5 cursor-pointer text-[11px] flex items-center gap-1.5"
                          style={{
                            background: active
                              ? 'linear-gradient(180deg, #6ea3ec, #2d64c4)'
                              : i % 2 === 0 ? '#eef4fd' : '#e2edfb',
                            color: active ? '#fff' : '#0a2350',
                            fontWeight: active ? 700 : 400,
                            borderBottom: '1px solid #d7e3f5',
                          }}
                          onClick={() => setCurrentTrack(t)}
                        >
                          {active && isPlaying ? (
                            <span style={{ fontSize: '8px', color: '#ffd23f' }}>▶</span>
                          ) : (
                            <span style={{ fontSize: '8px', opacity: 0.3 }}>♪</span>
                          )}
                          <div className="min-w-0">
                            <div className="truncate">{t.title}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Main player panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Now Playing info */}
          <div
            className="flex items-center gap-2 px-2 py-1.5 flex-shrink-0"
            style={{ background: '#e7eef9', borderBottom: '1px solid #b9cced' }}
          >
            {currentTrack.coverUrl ? (
              <div className="w-10 h-10 flex-shrink-0 border border-[#5b83c4] bg-black overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 flex-shrink-0 border border-[#5b83c4] bg-[#0f1021] flex items-center justify-center rounded-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="12" cy="12" r="1.5" fill="#0f1021" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[9px] tracking-[0.15em] text-[#3a5da3] font-bold uppercase">Now Playing</div>
              <ScrollingTitle key={currentTrack.title} text={currentTrack.title} />
              <div className="text-[10px] text-[#3a5da3] truncate">{currentTrack.artist}{currentTrack.album ? ` · ${currentTrack.album}` : ''}</div>
            </div>
            {/* eq indicator */}
            <div className="flex items-end gap-px h-6 flex-shrink-0">
              {[0.4, 0.7, 1, 0.8, 0.5].map((scale, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: `${(isPlaying ? (visualizerBars[i * 2] ?? 0) / NORMALIZE_MAX : 0.1) * 100 * scale}%`,
                    minHeight: 2,
                    maxHeight: '100%',
                    background: `hsl(${200 + i * 15}, 80%, 55%)`,
                    transition: 'height 0.08s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Visualization screen — flex-1 so it grows in maximized mode */}
          <div
            className="relative flex-1 min-h-0"
            style={{
              background: '#000',
              border: '2px solid #0a1f45',
              borderLeft: 'none',
              borderRight: 'none',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
            }}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* CRT scanline overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />
            {/* Vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}
            />

            {/* Visualizer dropdown — anchored bottom-right of screen */}
            <div
              ref={vizDropdownRef}
              className="absolute bottom-1.5 right-2"
              style={{ zIndex: 20 }}
            >
              {/* Popup list — renders above the button */}
              {vizDropdownOpen && (
                <div
                  className="absolute bottom-full right-0 mb-1 flex flex-col overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #1a2a4a 0%, #0d1a30 100%)',
                    border: '1px solid #3a6ea5',
                    boxShadow: '0 -4px 16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
                    minWidth: '140px',
                    borderRadius: '3px 3px 0 0',
                  }}
                >
                  <div
                    className="px-2 py-1 text-[9px] tracking-[0.15em] uppercase font-bold"
                    style={{ color: '#5a8ec8', borderBottom: '1px solid #1c3a63' }}
                  >
                    Visualizations
                  </div>
                  {VISUALIZER_PRESETS.map((preset) => {
                    const isActive = preset.id === visualizerPreset;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setVisualizerPreset(preset.id as VisualizerPreset);
                          setVizDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-left w-full"
                        style={{
                          background: isActive
                            ? 'linear-gradient(90deg, #1c4a8a, #1a3a6a)'
                            : 'transparent',
                          color: isActive ? '#7ec8ff' : '#c8deff',
                          fontSize: '11px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <span style={{
                          width: 7, height: 7,
                          borderRadius: '50%',
                          background: isActive ? '#4a9eff' : 'rgba(255,255,255,0.15)',
                          flexShrink: 0,
                          display: 'inline-block',
                          boxShadow: isActive ? '0 0 6px #4a9eff' : 'none',
                        }} />
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Toggle button */}
              <button
                onClick={() => setVizDropdownOpen(v => !v)}
                className="flex items-center gap-1.5"
                style={{
                  background: vizDropdownOpen
                    ? 'linear-gradient(180deg, #0d1a30, #1a2a4a)'
                    : 'linear-gradient(180deg, #1a2a4a, #0d1a30)',
                  border: '1px solid #3a6ea5',
                  borderRadius: vizDropdownOpen ? '0 0 3px 3px' : '3px',
                  padding: '3px 8px 3px 6px',
                  color: '#a8d0ff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  boxShadow: vizDropdownOpen
                    ? 'inset 0 1px 3px rgba(0,0,0,0.5)'
                    : '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  minWidth: '100px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Change visualization"
              >
                <span style={{ fontSize: '8px', opacity: 0.7 }}>·</span>
                <span style={{ flex: 1, textAlign: 'left', paddingLeft: 4 }}>
                  {currentPreset ? currentPreset.label : 'Visualizer'}
                </span>
                <span style={{ fontSize: '8px', opacity: 0.7, marginLeft: 4 }}>
                  {vizDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
            </div>
          </div>

          {/* Transport bar */}
          <div
            className="flex flex-col gap-1 px-2 py-1.5 flex-shrink-0"
            style={{
              background: 'linear-gradient(180deg, #eef4fc 0%, #cfdff5 100%)',
              borderTop: '1px solid #9fc0eb',
            }}
          >
            {/* Progress */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] w-8 text-right text-[#0a2350] font-mono tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative h-3 flex items-center">
                <div
                  className="absolute inset-0 rounded-sm"
                  style={{
                    background: 'linear-gradient(180deg, #a8c0e0, #8aacd8)',
                    border: '1px solid #6a8fc0',
                    boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                />
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-sm"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(180deg, #78b4f8, #2d64c4)',
                    transition: 'width 0.1s linear',
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  disabled={!currentTrack.audioUrl || !duration}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  aria-label="Seek"
                />
              </div>
              <span className="text-[10px] w-8 text-[#0a2350] font-mono tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                {/* Skip prev */}
                <button
                  onClick={() => skipTrack(-1)}
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-[#e9eefc]"
                  style={{
                    background: 'linear-gradient(180deg, #5f7ba8, #2c3f66)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.4)',
                  }}
                  aria-label="Previous track"
                >
                  <SkipPrevIcon />
                </button>

                {/* Stop */}
                <button
                  onClick={stopPlayback}
                  className="w-6 h-6 rounded-sm flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(180deg, #5f7ba8, #2c3f66)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.4)',
                  }}
                  aria-label="Stop"
                >
                  <StopIcon />
                </button>

                {/* Play/Pause — big green button */}
                <button
                  onClick={togglePlayback}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'radial-gradient(circle at 35% 28%, #f3fff5, #8fe7a0 42%, #23a24a 74%, #0c4d1d)',
                    boxShadow: '0 0 8px rgba(70,255,120,0.6), inset 0 1px 1px rgba(255,255,255,0.7)',
                  }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                {/* Skip next */}
                <button
                  onClick={() => skipTrack(1)}
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-[#e9eefc]"
                  style={{
                    background: 'linear-gradient(180deg, #5f7ba8, #2c3f66)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.4)',
                  }}
                  aria-label="Next track"
                >
                  <SkipNextIcon />
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="w-6 h-6 rounded-sm flex items-center justify-center ml-1"
                  style={{
                    background: 'linear-gradient(180deg, #5f7ba8, #2c3f66)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.4)',
                  }}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <SpeakerIcon muted={isMuted} />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span style={{ fontSize: '9px', color: '#3a5da3' }}>VOL</span>
                <div className="relative h-3 w-20 flex items-center">
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      background: 'linear-gradient(180deg, #a8c0e0, #8aacd8)',
                      border: '1px solid #6a8fc0',
                      boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-sm"
                    style={{
                      width: `${volume * 100}%`,
                      background: 'linear-gradient(180deg, #78b4f8, #2d64c4)',
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    aria-label="Volume"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center justify-between text-[9px] px-2 py-0.5 flex-shrink-0"
            style={{ background: '#e7eef9', borderTop: '1px solid #b9cced', color: '#3a5da3' }}
          >
            <span>{isPlaying ? '▶ Playing' : '■ Stopped'} · {currentTrack.genre}</span>
            {currentTrack.audioUrl ? (
              <a
                href={currentTrack.audioUrl}
                className="font-bold text-[#123f96] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                HTML5 · WAV
              </a>
            ) : (
              <span className="font-bold text-orange-600">No file</span>
            )}
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      {currentTrack.audioUrl ? (
        <audio
          ref={audioRef}
          key={currentTrack.id}
          src={currentTrack.audioUrl}
          preload="metadata"
          onLoadedMetadata={handleMetadataLoaded}
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onEnded={() => {
            setIsPlaying(false);
            stopVisualizer();
          }}
          className="hidden"
        />
      ) : null}
    </div>
  );
};