'use client';
import React, { useEffect, useRef, useState } from 'react';
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
// Visualizer engine — a single canvas, redrawn every frame regardless of how
// often `visualizerBars` changes upstream. Three renderers, all built to read
// like classic WMP plugins: a segmented LED meter ("Battery"), a pulsing ring
// of orbiting particles ("Mathical Music"), and a slow-drifting plasma cloud
// with a glowing waveform ribbon ("Ethereal Spectrum").
// ---------------------------------------------------------------------------

const NORMALIZE_MAX = 90;

function average(values: number[]): number {
  if (!values.length) return 0;
  let sum = 0;
  for (let i = 0; i < values.length; i++) sum += values[i];
  return sum / values.length;
}

function safeBars(bars: number[]): number[] {
  if (!bars || bars.length === 0) return new Array(20).fill(0);
  return bars;
}

function drawBattery(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawBars: number[],
  peaks: number[]
) {
  const bars = safeBars(rawBars);
  ctx.fillStyle = '#040912';
  ctx.fillRect(0, 0, w, h);

  const cols = bars.length;
  const gap = Math.max(2, w / cols * 0.18);
  const colWidth = (w - gap * (cols + 1)) / cols;
  const segH = Math.max(3, h / 34);
  const segGap = Math.max(1, segH * 0.35);
  const maxSegs = Math.floor(h / (segH + segGap));

  while (peaks.length < cols) peaks.push(0);
  peaks.length = cols;

  for (let i = 0; i < cols; i++) {
    const amp = Math.max(0, Math.min(NORMALIZE_MAX, bars[i] || 0)) / NORMALIZE_MAX;
    const litSegs = Math.round(amp * maxSegs);
    peaks[i] = litSegs >= peaks[i] ? litSegs : Math.max(litSegs, peaks[i] - 0.2);

    const x = gap + i * (colWidth + gap);
    for (let s = 0; s < maxSegs; s++) {
      const y = h - (s + 1) * (segH + segGap);
      const segRatio = s / maxSegs;
      const isLit = s < litSegs;
      const onColor = segRatio > 0.8 ? '#ff5b5b' : segRatio > 0.55 ? '#ffd23f' : '#57e389';
      ctx.fillStyle = isLit ? onColor : 'rgba(120, 160, 200, 0.08)';
      ctx.fillRect(x, y, colWidth, segH);
    }

    const peakSeg = Math.round(peaks[i]);
    if (peakSeg > 0 && peakSeg <= maxSegs) {
      const py = h - peakSeg * (segH + segGap);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(x, py, colWidth, Math.max(1.5, segH * 0.4));
    }
  }
}

function drawMathical(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawBars: number[],
  t: number
) {
  const bars = safeBars(rawBars);
  ctx.fillStyle = 'rgba(4, 6, 20, 0.28)';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  const cx = w / 2;
  const cy = h / 2;
  const rings = Math.min(6, bars.length);
  const maxRadius = Math.min(w, h) / 2 - 6;

  for (let r = 0; r < rings; r++) {
    const sampleIndex = Math.floor((r / rings) * bars.length);
    const amp = Math.max(0, Math.min(NORMALIZE_MAX, bars[sampleIndex] || 0));
    const baseRadius = 10 + r * (maxRadius / rings);
    const radius = baseRadius + amp * 0.3;
    const dotCount = 10 + r * 5;
    const hue = (t * 22 + r * 48) % 360;
    const spin = t * (0.25 + r * 0.06) * (r % 2 === 0 ? 1 : -1);

    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2 + spin;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.72;
      const size = 1.4 + amp * 0.035;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${hue}, 85%, 66%, ${0.3 + amp / 140})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const coreAmp = average(bars);
  const coreRadius = 4 + coreAmp * 0.25;
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 4);
  coreGrad.addColorStop(0, `hsla(${(t * 30) % 360}, 90%, 75%, 0.7)`);
  coreGrad.addColorStop(1, 'hsla(0,0%,0%,0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEthereal(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawBars: number[],
  t: number
) {
  const bars = safeBars(rawBars);
  ctx.fillStyle = 'rgba(4, 6, 22, 0.16)';
  ctx.fillRect(0, 0, w, h);

  const third = Math.max(1, Math.floor(bars.length / 3));
  const bass = average(bars.slice(0, third));
  const mid = average(bars.slice(third, third * 2));
  const treble = average(bars.slice(third * 2));

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  const blobCount = 5;
  for (let i = 0; i < blobCount; i++) {
    const angle = t * (0.12 + i * 0.04) + (i * Math.PI * 2) / blobCount;
    const orbitR = Math.min(w, h) * (0.16 + 0.05 * i);
    const cx = w / 2 + Math.cos(angle) * orbitR * (0.55 + mid / 120);
    const cy = h / 2 + Math.sin(angle * 1.3) * orbitR * 0.45 * (0.55 + bass / 140);
    const radius = 16 + i * 7 + bass * 0.55 + Math.sin(t * 2 + i) * 5;
    const hue = (t * 26 + i * 58) % 360;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, radius));
    grad.addColorStop(0, `hsla(${hue}, 90%, 72%, 0.5)`);
    grad.addColorStop(0.55, `hsla(${(hue + 45) % 360}, 85%, 55%, 0.22)`);
    grad.addColorStop(1, 'hsla(0,0%,0%,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = `hsla(${(t * 48) % 360}, 90%, 78%, 0.55)`;
  const midY = h * 0.56;
  for (let x = 0; x <= w; x += 4) {
    const idx = Math.floor((x / w) * bars.length) % bars.length;
    const amp = Math.max(0, Math.min(NORMALIZE_MAX, bars[idx] || 0));
    const y =
      midY +
      Math.sin(x * 0.04 + t * 3) * (7 + treble * 0.25) +
      Math.sin(x * 0.012 - t * 1.4) * amp * 0.25;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

function useWmpVisualizer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  visualizerPreset: VisualizerPreset,
  visualizerBars: number[]
) {
  const presetRef = useRef(visualizerPreset);
  const barsRef = useRef(visualizerBars);
  const peaksRef = useRef<number[]>([]);

  useEffect(() => {
    presetRef.current = visualizerPreset;
  }, [visualizerPreset]);

  useEffect(() => {
    barsRef.current = visualizerBars;
  }, [visualizerBars]);

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
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.016;
      const preset = presetRef.current;
      const bars = barsRef.current;
      if (preset === 'battery') {
        drawBattery(ctx, width, height, bars, peaksRef.current);
      } else if (preset === 'mathical') {
        drawMathical(ctx, width, height, bars, t);
      } else {
        drawEthereal(ctx, width, height, bars, t);
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
// Small inline icon set (kept dependency-free)
// ---------------------------------------------------------------------------

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

function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

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
  useWmpVisualizer(canvasRef, visualizerPreset, visualizerBars);

  const [prevVolume, setPrevVolume] = useState(volume > 0 ? volume : 0.6);
  const isMuted = volume <= 0;

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume > 0 ? prevVolume : 0.6);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  };

  const presetIndex = Math.max(
    0,
    VISUALIZER_PRESETS.findIndex((p) => p.id === visualizerPreset)
  );
  const currentPreset = VISUALIZER_PRESETS[presetIndex] ?? VISUALIZER_PRESETS[0];
  const cyclePreset = (dir: 1 | -1) => {
    const len = VISUALIZER_PRESETS.length;
    if (!len) return;
    const next = (presetIndex + dir + len) % len;
    setVisualizerPreset(VISUALIZER_PRESETS[next].id as VisualizerPreset);
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="flex flex-col md:flex-row gap-2 h-full p-1.5 rounded-sm select-none"
      style={{
        background: 'linear-gradient(180deg, #103a7a 0%, #1c5bb0 4%, #dfe9f7 4%, #dfe9f7 100%)',
        border: '1px solid #0a2e63',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.35)',
      }}
    >
      {/* Playlist */}
      <div className="w-full md:w-2/5 flex flex-col gap-0 pr-0">
        <div
          className="text-white font-bold text-[11px] px-2 py-1 flex items-center gap-1.5"
          style={{
            background: 'linear-gradient(180deg, #4c86e0 0%, #1c58c2 50%, #123f96 100%)',
            borderBottom: '1px solid #0a2e63',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#ffd23f">
            <path d="M9 17V5l12-2v12M9 17a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" fill="none" stroke="#ffd23f" strokeWidth="1.6" />
          </svg>
          Now Playing
        </div>
        <div
          className="flex-1 overflow-y-auto max-h-[300px] win2k-scroll"
          style={{ background: '#f3f7fd', border: '1px solid #7fa8de', borderTop: 'none' }}
        >
          {tracks.map((t, i) => {
            const active = currentTrack.id === t.id;
            return (
              <div
                key={t.id}
                className="px-2 py-1.5 cursor-pointer text-[11px]"
                style={{
                  background: active
                    ? 'linear-gradient(180deg, #6ea3ec, #2d64c4)'
                    : i % 2 === 0
                      ? '#f3f7fd'
                      : '#e6eefb',
                  color: active ? '#ffffff' : '#0a2350',
                  fontWeight: active ? 700 : 400,
                  borderBottom: '1px solid #d7e3f5',
                }}
                onClick={() => setCurrentTrack(t)}
              >
                <div className="truncate">{t.artist}</div>
                <div className="truncate opacity-90">{t.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col gap-2">
        <div
          className="p-2 flex items-center gap-3"
          style={{ background: '#e7eef9', border: '1px solid #b9cced' }}
        >
          {currentTrack.coverUrl ? (
            <div className="w-12 h-12 flex-shrink-0 border border-[#5b83c4] bg-black overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 flex-shrink-0 border border-[#5b83c4] bg-[#0f1021] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="1.5" fill="#0f1021" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.15em] text-[#3a5da3] font-bold">NOW PLAYING</div>
            <div className="text-[12px] font-bold text-[#0a2350] truncate">{currentTrack.title}</div>
            <div className="text-[11px] text-[#3a5da3] truncate">
              {currentTrack.artist} · {currentTrack.genre}
            </div>
          </div>
        </div>

        {/* Visualization screen */}
        <div
          className="relative"
          style={{
            background: '#050810',
            border: '2px solid #0a1f45',
            boxShadow:
              'inset 0 0 0 1px #3a6ea5, inset 0 0 12px rgba(0,0,0,0.8), 0 0 0 1px #9fc0eb',
          }}
        >
          <div className="relative h-[210px] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* corner rivets, WMP-style screen frame accents */}
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 24px rgba(0,0,0,0.55)' }} />
          </div>
          {/* preset switcher overlay */}
          <div
            className="flex items-center justify-between px-2 py-1 text-[10px] text-[#cfe1ff]"
            style={{
              background: 'linear-gradient(180deg, rgba(10,20,40,0.9), rgba(3,7,16,0.95))',
              borderTop: '1px solid #1c3a63',
            }}
          >
            <button
              className="px-1.5 hover:text-white text-[#8cb6ff]"
              onClick={() => cyclePreset(-1)}
              aria-label="Previous visualization"
            >
              ‹
            </button>
            <span className="uppercase tracking-[0.15em]">
              {currentPreset ? currentPreset.label : 'Visualizer'}
            </span>
            <button
              className="px-1.5 hover:text-white text-[#8cb6ff]"
              onClick={() => cyclePreset(1)}
              aria-label="Next visualization"
            >
              ›
            </button>
          </div>
        </div>

        {/* Transport bar */}
        <div
          className="flex flex-col gap-1.5 px-2 py-2"
          style={{
            background: 'linear-gradient(180deg, #eef4fc 0%, #cfdff5 100%)',
            border: '1px solid #9fc0eb',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] w-9 text-right text-[#0a2350] font-mono">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              disabled={!currentTrack.audioUrl || !duration}
              onChange={(event) => {
                const val = Number(event.target.value);
                if (audioRef.current) audioRef.current.currentTime = val;
              }}
              className="h-1.5 flex-1 accent-[#1c58c2]"
              style={{
                background: `linear-gradient(to right, #2d64c4 ${progressPct}%, #b9cced ${progressPct}%)`,
                borderRadius: '2px',
              }}
              aria-label="Seek"
            />
            <span className="text-[10px] w-9 text-[#0a2350] font-mono">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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

              <button
                onClick={togglePlayback}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background:
                    'radial-gradient(circle at 35% 28%, #f3fff5, #8fe7a0 42%, #23a24a 74%, #0c4d1d)',
                  boxShadow: '0 0 6px rgba(70,255,120,0.55), inset 0 1px 1px rgba(255,255,255,0.7)',
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button
                onClick={toggleMute}
                className="w-6 h-6 rounded-sm flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #5f7ba8, #2c3f66)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.4)',
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <SpeakerIcon muted={isMuted} />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <SpeakerIcon muted={isMuted} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="h-1.5 w-20 accent-[#1c58c2]"
                style={{
                  background: `linear-gradient(to right, #2d64c4 ${volume * 100}%, #b9cced ${volume * 100}%)`,
                  borderRadius: '2px',
                }}
                aria-label="Volume"
              />
            </div>
          </div>
        </div>

        {/* Hidden native audio element + source status */}
        <div
          className="flex items-center justify-between text-[10px] px-2 py-1"
          style={{ background: '#e7eef9', border: '1px solid #b9cced', color: '#3a5da3' }}
        >
          <span>Audio source · HTML5</span>
          {currentTrack.audioUrl ? (
            <a
              href={currentTrack.audioUrl}
              className="font-bold text-[#123f96] underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open local file
            </a>
          ) : (
            <span className="font-bold text-orange-600">No local file configured</span>
          )}
        </div>

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
        ) : (
          <div className="text-center text-[10px] text-gray-500 italic px-2 py-1">
            The native player is ready — add a direct MP3/M4A stream URL to enable playback.
          </div>
        )}
      </div>
    </div>
  );
};