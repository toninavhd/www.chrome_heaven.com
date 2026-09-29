'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Track, VisualizerPreset, GalleryItem, BlogPost, WindowState } from '../types';
import { VISUALIZER_PRESETS, BATTERY_CELLS, DEFAULT_TRACKS, DEFAULT_GALLERY_ITEMS, DEFAULT_POSTS, WALLPAPERS } from '../constants';

import {
  MyComputerIcon,
  FolderIcon,
  TextDocIcon,
  MediaPlayerIcon,
  IEIcon,
  RecycleBinIcon,
  ImageFileIcon,
  BlogIcon,
} from '../components/icons/Icons';

import { DesktopShortcut } from '../components/desktop/DesktopShortcut';
import { Taskbar } from '../components/desktop/Taskbar';

import { WelcomeContent } from '../components/windows/WelcomeContent';
import { MediaPlayerContent } from '../components/windows/MediaPlayerContent';
import { GalleryContent } from '../components/windows/GalleryContent';
import { IEContent } from '../components/windows/IEContent';
import { BlogContent } from '../components/windows/BlogContent';
import { SettingsContent } from '../components/windows/SettingsContent';
import { ImageViewerContent } from '../components/windows/ImageViewerContent';

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'welcome', title: 'Welcome.txt - Notepad', isOpen: true, isMinimized: false, isMaximized: false, x: 30, y: 30, width: 480, height: 380, icon: <TextDocIcon /> },
    { id: 'blog', title: 'My Diary - Journal', isOpen: false, isMinimized: false, isMaximized: false, x: 60, y: 50, width: 640, height: 460, icon: <BlogIcon /> },
    { id: 'music', title: 'Windows Media Player', isOpen: false, isMinimized: false, isMaximized: false, x: 100, y: 70, width: 620, height: 480, icon: <MediaPlayerIcon /> },
    { id: 'gallery', title: 'C:\\Visuals_and_Edits', isOpen: false, isMinimized: false, isMaximized: false, x: 150, y: 110, width: 520, height: 360, icon: <FolderIcon /> },
    { id: 'links', title: 'Internet Explorer', isOpen: false, isMinimized: false, isMaximized: false, x: 70, y: 90, width: 580, height: 460, icon: <IEIcon /> },
    { id: 'settings', title: 'Display Properties', isOpen: false, isMinimized: false, isMaximized: false, x: 180, y: 130, width: 380, height: 320, icon: <MyComputerIcon /> },
    { id: 'viewer', title: 'Windows Image Viewer', isOpen: false, isMinimized: false, isMaximized: false, x: 220, y: 50, width: 500, height: 450, icon: <ImageFileIcon /> },
  ]);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [activeWindowId, setActiveWindowId] = useState<string>('welcome');
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(DEFAULT_TRACKS[0]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0]);
  
  // Media Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array.from({ length: BATTERY_CELLS }, () => 8));
  const [visualizerPreset, setVisualizerPreset] = useState<VisualizerPreset>('battery');

  const desktopRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const sourceElementRef = useRef<HTMLAudioElement | null>(null); // track which <audio> the source node belongs to
  const animationFrameRef = useRef<number | null>(null);
  const vizRunningRef = useRef(false); // flag to control draw loop lifecycle

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/content.json');
        if (res.ok) {
          const data = await res.json();
          if (data.tracks && data.tracks.length > 0) {
            setTracks(data.tracks);
            setCurrentTrack(data.tracks[0]);
          } else {
            setTracks(DEFAULT_TRACKS);
            setCurrentTrack(DEFAULT_TRACKS[0]);
          }
          if (data.gallery && data.gallery.length > 0) {
            setGalleryItems(data.gallery);
          } else {
            setGalleryItems(DEFAULT_GALLERY_ITEMS);
          }
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
            setSelectedPostId(data.posts[0].id);
          } else {
            setPosts(DEFAULT_POSTS);
            setSelectedPostId(DEFAULT_POSTS[0].id);
          }
        } else {
          throw new Error('Non-ok response');
        }
      } catch (err) {
        console.warn('Could not load content.json, falling back to static defaults', err);
        setTracks(DEFAULT_TRACKS);
        setCurrentTrack(DEFAULT_TRACKS[0]);
        setGalleryItems(DEFAULT_GALLERY_ITEMS);
        setPosts(DEFAULT_POSTS);
        if (DEFAULT_POSTS.length > 0) {
          setSelectedPostId(DEFAULT_POSTS[0].id);
        }
      }
    };
    loadContent();
  }, []);

  useEffect(() => {
    return () => {
      stopVisualizer();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    stopVisualizer();
    // Disconnect old source node — it belongs to the previous <audio> element.
    // A new one will be created the next time startVisualizer() is called.
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch (_) { /* ignore */ }
      sourceRef.current = null;
    }
    sourceElementRef.current = null;
  }, [currentTrack.id]);

  const stopVisualizer = () => {
    vizRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startVisualizer = async () => {
    const audio = audioRef.current;
    if (!audio || typeof window === 'undefined') return;

    // Create AudioContext once
    if (!audioContextRef.current) {
      const AudioContextImpl =
        window.AudioContext ||
        (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextImpl) return;
      audioContextRef.current = new AudioContextImpl();
    }

    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // Create analyser once per AudioContext
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.65;
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    // Create source node only if the audio element has changed (new track = new <audio> element)
    if (sourceElementRef.current !== audio) {
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch (_) { /* ignore */ }
      }
      sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      sourceElementRef.current = audio;
    }

    stopVisualizer(); // cancel any existing loop before starting new one
    vizRunningRef.current = true;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!vizRunningRef.current) return; // loop was stopped externally

      analyserRef.current?.getByteFrequencyData(dataArray);
      const nextBars = Array.from({ length: BATTERY_CELLS }, (_, index) => {
        // Perceptual/logarithmic frequency mapping across bins
        const p0 = Math.pow(index / BATTERY_CELLS, 1.5);
        const p1 = Math.pow((index + 1) / BATTERY_CELLS, 1.5);
        const start = Math.floor(p0 * (bufferLength - 1));
        const end = Math.max(start + 1, Math.ceil(p1 * (bufferLength - 1)));
        let sum = 0;
        let count = 0;
        for (let b = start; b < end && b < bufferLength; b++) {
          sum += dataArray[b];
          count++;
        }
        const avg = count > 0 ? sum / count : 0;
        // Treble/mid equal-loudness boost so higher bands react as vigorously as bass
        const boost = 1.0 + Math.pow(index / BATTERY_CELLS, 1.1) * 1.6;
        const normalized = Math.min(100, Math.round((avg / 255) * 100 * boost));
        return Math.max(0, normalized);
      });

      setVisualizerBars(nextBars);
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => {
        setIsPlaying(true);
        void startVisualizer();
      }).catch(err => {
        console.warn('Playback failed:', err);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
      stopVisualizer();
    }
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    stopVisualizer();
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleMetadataLoaded = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const openWindow = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) return { ...win, isOpen: true, isMinimized: false };
      return win;
    }));
    setActiveWindowId(id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) return { ...win, isOpen: false };
      return win;
    }));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) return { ...win, isMinimized: true };
      return win;
    }));
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) return { ...win, isMaximized: !win.isMaximized };
      return win;
    }));
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    openWindow('music');
  };

  const openImageViewer = (img: GalleryItem) => {
    setSelectedImage(img);
    openWindow('viewer');
  };

  const handlePlayAudioAttachment = (src: string, title: string) => {
    const matchedTrack = tracks.find(t => t.audioUrl === src);
    if (matchedTrack) {
      playTrack(matchedTrack);
    } else {
      const tempTrack: Track = {
        id: 'temp_' + Date.now(),
        title: `Attachment - ${title}`,
        artist: 'Chrome Heaven',
        genre: 'Blog Attachment',
        audioUrl: src
      };
      setTracks(prev => [...prev, tempTrack]);
      playTrack(tempTrack);
    }
    setTimeout(() => {
      if (audioRef.current) {
        void audioRef.current.play();
        setIsPlaying(true);
        startVisualizer();
      }
    }, 150);
  };

  const handleOpenImageAttachment = (src: string) => {
    const matchedImg = galleryItems.find(item => item.src === src);
    if (matchedImg) {
      openImageViewer(matchedImg);
    } else {
      openImageViewer({
        id: 'attached',
        name: src.split('/').pop() || 'attachment.bmp',
        src: src,
        tag: 'Attached'
      });
    }
  };

  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{
        backgroundColor: currentWallpaper.type === 'color' ? currentWallpaper.value : undefined,
        backgroundImage: currentWallpaper.type !== 'color' ? currentWallpaper.value : undefined,
        backgroundSize: currentWallpaper.type === 'cover' ? 'cover' : 'auto',
        backgroundPosition: currentWallpaper.type === 'cover' ? 'center center' : '0 0',
        backgroundRepeat: currentWallpaper.type === 'tile' ? 'repeat' : 'no-repeat',
      }}
      onClick={() => {
        setSelectedDesktopIcon(null);
        setStartMenuOpen(false);
      }}
    >
      <div className="flex-1 relative p-4 flex flex-col flex-wrap content-start items-start gap-3 select-none">
        
        <DesktopShortcut id="welcome" title="Welcome.txt" icon={<TextDocIcon />} isSelected={selectedDesktopIcon === 'welcome'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('welcome'); }} onDoubleClick={() => openWindow('welcome')} />
        <DesktopShortcut id="blog" title="My Diary" icon={<BlogIcon />} isSelected={selectedDesktopIcon === 'blog'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('blog'); }} onDoubleClick={() => openWindow('blog')} />
        <DesktopShortcut id="music" title="Media Player" icon={<MediaPlayerIcon />} isSelected={selectedDesktopIcon === 'music'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('music'); }} onDoubleClick={() => openWindow('music')} />
        <DesktopShortcut id="gallery" title="Visuals Folder" icon={<FolderIcon />} isSelected={selectedDesktopIcon === 'gallery'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('gallery'); }} onDoubleClick={() => openWindow('gallery')} />
        <DesktopShortcut id="links" title="Internet Explorer" icon={<IEIcon />} isSelected={selectedDesktopIcon === 'links'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('links'); }} onDoubleClick={() => openWindow('links')} />
        <DesktopShortcut id="settings" title="Display Properties" icon={<MyComputerIcon />} isSelected={selectedDesktopIcon === 'settings'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('settings'); }} onDoubleClick={() => openWindow('settings')} />
        <DesktopShortcut id="recycle" title="Recycle Bin" icon={<RecycleBinIcon />} isSelected={selectedDesktopIcon === 'recycle'} onSelect={(e) => { e.stopPropagation(); setSelectedDesktopIcon('recycle'); }} onDoubleClick={() => alert("The Recycle Bin is empty.")} />

        {windows.map((win) => {
          if (!win.isOpen) return null;
          const isActive = activeWindowId === win.id;
          const isMin = win.isMinimized;

          return (
            <motion.div
              key={win.id}
              drag
              dragMomentum={false}
              dragConstraints={desktopRef}
              initial={win.isMaximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
              animate={
                win.isMaximized
                  ? { x: 0, y: 0, width: '100%', height: 'calc(100vh - 38px)' }
                  : { x: win.x, y: win.y, width: win.width, height: win.height }
              }
              style={{
                zIndex: isActive ? 30 : 10,
                display: isMin ? 'none' : 'flex',
                flexDirection: 'column',
              }}
              className="absolute win2k-window"
              onClick={() => setActiveWindowId(win.id)}
            >
              <div className={`win2k-title-bar ${isActive ? '' : 'inactive'}`}>
                <div className="flex items-center gap-1.5 font-bold text-[11px] truncate flex-1 win2k-title-bar-drag h-full py-1 cursor-default">
                  <div className="w-4 h-4 scale-75 flex-shrink-0 flex items-center justify-center">
                    {win.icon}
                  </div>
                  <span className="truncate">{win.title}</span>
                </div>
                <div className="flex gap-1 pl-2">
                  <button className="win2k-title-btn" onClick={() => minimizeWindow(win.id)} aria-label="Minimize">_</button>
                  <button className="win2k-title-btn" onClick={() => toggleMaximize(win.id)} aria-label="Maximize">
                    {win.isMaximized ? '❐' : '⬜'}
                  </button>
                  <button className="win2k-title-btn font-bold text-red-700 font-sans" onClick={() => closeWindow(win.id)} aria-label="Close">X</button>
                </div>
              </div>

              {win.id !== 'links' && (
                <div className="win2k-menu bg-[#d0d0c8] select-none">
                  <span className="win2k-menu-item">File</span>
                  <span className="win2k-menu-item">Edit</span>
                  <span className="win2k-menu-item">View</span>
                  <span className="win2k-menu-item">Help</span>
                </div>
              )}

              <div className={`flex-1 overflow-hidden flex flex-col ${win.id === 'links' ? 'p-0 bg-[#070509]' : 'p-1.5 bg-white'}`}>
                <div className={`flex-1 ${win.id === 'links' ? 'overflow-hidden flex flex-col' : 'win2k-border-inset overflow-y-auto win2k-scroll text-black p-3 bg-white font-sans text-[12px] select-text'}`}>
                  
                  {win.id === 'welcome' && <WelcomeContent openWindow={openWindow} />}
                  
                  {win.id === 'music' && (
                    <MediaPlayerContent
                      tracks={tracks}
                      currentTrack={currentTrack}
                      setCurrentTrack={setCurrentTrack}
                      visualizerPreset={visualizerPreset}
                      setVisualizerPreset={setVisualizerPreset}
                      visualizerBars={visualizerBars}
                      isPlaying={isPlaying}
                      togglePlayback={togglePlayback}
                      stopPlayback={stopPlayback}
                      volume={volume}
                      setVolume={setVolume}
                      currentTime={currentTime}
                      duration={duration}
                      audioRef={audioRef}
                      handleMetadataLoaded={handleMetadataLoaded}
                      handleTimeUpdate={handleTimeUpdate}
                      setIsPlaying={setIsPlaying}
                      stopVisualizer={stopVisualizer}
                    />
                  )}

                  {win.id === 'gallery' && <GalleryContent galleryItems={galleryItems} openImageViewer={openImageViewer} />}
                  
                  {win.id === 'links' && <IEContent />}
                  
                  {win.id === 'blog' && (
                    <BlogContent 
                      posts={posts}
                      selectedPostId={selectedPostId}
                      setSelectedPostId={setSelectedPostId}
                      onOpenImageAttachment={handleOpenImageAttachment}
                      onPlayAudioAttachment={handlePlayAudioAttachment}
                    />
                  )}

                  {win.id === 'settings' && (
                    <SettingsContent 
                      wallpapers={WALLPAPERS} 
                      currentWallpaper={currentWallpaper} 
                      setCurrentWallpaper={setCurrentWallpaper} 
                      closeWindow={closeWindow} 
                    />
                  )}

                  {win.id === 'viewer' && selectedImage && <ImageViewerContent selectedImage={selectedImage} />}

                </div>
                <div className="win2k-status-bar select-none">
                  <div className="win2k-status-field">Status: Active</div>
                  <div className="win2k-status-field">Canary Islands</div>
                  <div className="win2k-status-field font-mono text-right">CH95</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId} 
        onStartMenuClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen); }} 
        startMenuOpen={startMenuOpen} 
        onWindowTabClick={(id) => {
          const win = windows.find(w => w.id === id);
          if (win?.isMinimized) {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
            setActiveWindowId(id);
          } else if (activeWindowId === id) {
            minimizeWindow(id);
          } else {
            setActiveWindowId(id);
          }
        }} 
        openWindow={openWindow} 
      />
    </div>
  );
}
