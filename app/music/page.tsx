'use client';

import { useEffect, useState } from 'react';
import { ChromeHeavenSection } from '../../components/desktop/ChromeHeavenSection';
import { Track } from '../../types';

const FALLBACK_TRACKS: Track[] = [
  { id: 'track-1', title: 'nevermind 190bpm', artist: 'Chrome Heaven', genre: 'Dreamcore / Breakcore', audioUrl: '/audio/nevermind_190bpm_uloe.wav' },
  { id: 'track-2', title: 'lonelystarr', artist: 'Chrome Heaven', genre: 'Ambient / Neon', audioUrl: '/audio/lonelystarr.wav' },
];

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>(FALLBACK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track>(FALLBACK_TRACKS[0]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/content.json');
        const data = await res.json();
        const loadedTracks = data.tracks?.length ? data.tracks : FALLBACK_TRACKS;
        setTracks(loadedTracks);
        setCurrentTrack(loadedTracks[0]);
      } catch {
        setTracks(FALLBACK_TRACKS);
        setCurrentTrack(FALLBACK_TRACKS[0]);
      }
    };

    void load();
  }, []);

  return (
    <ChromeHeavenSection title="music" subtitle="visual player" accent="#ff5630">
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.25fr 0.75fr' }}>
        <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.22em', opacity: 0.75, textTransform: 'uppercase', marginBottom: 14 }}>
            now playing
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 2vw, 2.5rem)', fontWeight: 700, marginBottom: 8 }}>{currentTrack.title}</div>
          <div style={{ opacity: 0.8, marginBottom: 18 }}>{currentTrack.artist} · {currentTrack.genre}</div>
          {currentTrack.audioUrl ? (
            <audio controls src={currentTrack.audioUrl} style={{ width: '100%', marginBottom: 18 }} />
          ) : null}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrack(track)}
                style={{
                  border: currentTrack.id === track.id ? '1px solid #ff5630' : '1px solid rgba(255,255,255,0.18)',
                  background: currentTrack.id === track.id ? 'rgba(255,86,48,0.16)' : 'rgba(255,255,255,0.02)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {track.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'linear-gradient(180deg, rgba(255,86,48,0.12), rgba(255,255,255,0.02))' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.22em', opacity: 0.75, textTransform: 'uppercase', marginBottom: 18 }}>
            channel
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ opacity: 0.7, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Stream</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>Chrome Heaven</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ opacity: 0.7, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Mood</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>Night-drive synthwave</div>
            </div>
          </div>
        </div>
      </div>
    </ChromeHeavenSection>
  );
}
