'use client';
import React from 'react';
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
  stopVisualizer
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="w-full md:w-2/5 flex flex-col gap-2 border-r pr-3 select-none">
        <div className="font-bold text-blue-900 border-b pb-1 mb-1">Now Playing</div>
        <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 win2k-scroll">
          {tracks.map((t) => (
            <div
              key={t.id}
              className={`p-2 border-b cursor-pointer text-[11px] ${
                currentTrack.id === t.id ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentTrack(t)}
            >
              <div className="truncate">{t.artist}</div>
              <div className="truncate opacity-90">{t.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="win2k-border-inset p-2 bg-[#f1f1f1] overflow-hidden h-[320px]">
          <div className="flex h-full flex-col">
            <div className="mb-2 border-b border-gray-300 pb-2 flex items-center gap-3">
              {currentTrack.coverUrl ? (
                <div className="w-12 h-12 flex-shrink-0 border border-gray-400 bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 border border-gray-400 bg-[#0f1021] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="1.5" fill="#0f1021" />
                  </svg>
                </div>
              )}
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-600">Now playing</div>
                <div className="text-[12px] font-bold text-blue-900">{currentTrack.title}</div>
                <div className="text-[11px] text-gray-700">{currentTrack.artist} · {currentTrack.genre}</div>
              </div>
            </div>

            <div className="mb-2 rounded-sm border border-gray-400 bg-[#0f1021] p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#8cb6ff]">Reactive visualizer</div>
                  <div className="text-[10px] text-[#cfe1ff]">Preset: {visualizerPreset === 'battery' ? 'Battery' : visualizerPreset === 'mathical' ? 'Mathical Music' : 'Ethereal Spectrum'}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {VISUALIZER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className={`text-[10px] px-2 py-1 rounded ${visualizerPreset === preset.id ? 'bg-blue-900 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                      onClick={() => setVisualizerPreset(preset.id as VisualizerPreset)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-sm overflow-hidden border border-gray-700 bg-[#09121f] p-3">
                {visualizerPreset === 'battery' ? (
                  <div className="wmp-battery-shell mt-3 p-3">
                    <div className="wmp-battery-tip" />
                    <div className="wmp-battery-grid">
                      {visualizerBars.map((height, index) => {
                        const level = Math.round((height / 54) * 100);
                        const fillColor = level > 66 ? '#6df16d' : level > 33 ? '#f4e651' : '#ff6262';
                        return (
                          <div key={index} className="wmp-battery-cell">
                            <div
                              className="wmp-battery-cell-fill"
                              style={{ height: `${height}px`, background: `linear-gradient(to top, ${fillColor}, #0f3969)` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : visualizerPreset === 'mathical' ? (
                  <div className="grid grid-cols-4 gap-2 py-4">
                    {visualizerBars.map((height, index) => {
                      const radius = Math.max(12, Math.min(42, Math.round(height * 0.85)));
                      const opacity = Math.min(1, 0.4 + height / 120);
                      return (
                        <div key={index} className="h-24 relative flex items-center justify-center">
                          <div
                            className="rounded-full blur-sm"
                            style={{
                              width: `${radius}px`,
                              height: `${radius}px`,
                              background: `radial-gradient(circle, rgba(138, 204, 255, ${opacity}) 0%, rgba(30, 62, 122, 0.1) 80%)`,
                            }}
                          />
                          <div
                            className="rounded-full border border-white/10 absolute"
                            style={{ width: `${radius * 0.55}px`, height: `${radius * 0.55}px`, boxShadow: `0 0 ${radius / 4}px rgba(138, 204, 255, 0.45)` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-10 gap-1 py-3">
                    {visualizerBars.map((height, index) => {
                      const gradient = `linear-gradient(to top, rgba(134, 183, 255, 0.2), rgba(106, 104, 255, 0.95))`;
                      return (
                        <div key={index} className="h-24 w-full rounded-sm bg-[#07111f] flex items-end overflow-hidden">
                          <div
                            className="w-full rounded-sm"
                            style={{ height: `${height}px`, background: gradient }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <button className="win2k-btn px-2 py-0.5 text-[10px]" onClick={togglePlayback}>
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button className="win2k-btn px-2 py-0.5 text-[10px]" onClick={stopPlayback}>
                    Stop
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-gray-600">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="h-2 w-24 accent-blue-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden rounded-sm border border-gray-400 bg-black p-3 text-[11px] text-gray-200">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#8cb6ff]">
                <span>Native audio player</span>
                <span>{currentTime > 0 ? `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}` : '00:00'}/{duration > 0 ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` : '00:00'}</span>
              </div>
              {currentTrack.audioUrl ? (
                <>
                  <div className="mb-2 text-[11px] text-gray-300">
                    Direct stream ready for this track.
                  </div>
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
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-gray-400">
                  <div>
                    <div className="font-bold text-white">Direct audio source needed</div>
                    <div className="mt-1">The native player is ready; add a direct MP3/M4A stream URL to enable playback.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-600">
              <span>Audio source • HTML5</span>
              {currentTrack.audioUrl ? (
                <a
                  href={currentTrack.audioUrl}
                  className="font-bold text-blue-900 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open local file
                </a>
              ) : (
                <span className="font-bold text-orange-600">No local file configured</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <span className="text-[10px] text-gray-500 italic">Upload missing files in the admin panel.</span>
        </div>
      </div>
    </div>
  );
};
