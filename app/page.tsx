'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AudioVisualizer from './components/AudioVisualizer';

// Windows 95/98 Pixel-Art SVGs
const MyComputerIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* CRT Monitor Outer casing */}
    <rect x="4" y="3" width="18" height="13" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    {/* Bezel */}
    <rect x="6" y="5" width="14" height="9" fill="#dfdfdf" />
    {/* Screen */}
    <rect x="8" y="7" width="10" height="5" fill="#000" />
    <rect x="9" y="8" width="8" height="3" fill="#008080" />
    {/* Base Stand */}
    <path d="M9 16 L17 16 L19 20 L7 20 Z" fill="#808080" stroke="#000" strokeWidth="1" />
    <rect x="6" y="20" width="14" height="1" fill="#c0c0c0" />
    {/* Tower Case */}
    <rect x="23" y="6" width="6" height="15" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    <rect x="23" y="6" width="1" height="15" fill="#ffffff" />
    {/* Floppy drive */}
    <line x1="25" y1="9" x2="27" y2="9" stroke="#000" strokeWidth="1" />
    {/* CD ROM */}
    <line x1="25" y1="12" x2="27" y2="12" stroke="#808080" strokeWidth="1" />
    {/* Power buttons */}
    <circle cx="26" cy="18" r="0.7" fill="#00ff00" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Folder back tab */}
    <path d="M2 6 L11 6 L13 9 L28 9 L28 26 L2 26 Z" fill="#b08030" stroke="#000" strokeWidth="1" />
    {/* Paper insert showing */}
    <rect x="5" y="7" width="16" height="5" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
    {/* Folder front cover (slanted and brighter yellow) */}
    <path d="M2 10 L26 10 L28 26 L2 26 Z" fill="#f0c050" stroke="#000" strokeWidth="1" />
    <path d="M3 11 L25 11 L27 25 L3 25 Z" fill="#ffd870" />
  </svg>
);

const TextDocIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* White Paper Sheet */}
    <path d="M5 2 L19 2 L25 8 L25 29 L5 29 Z" fill="#ffffff" stroke="#000" strokeWidth="1" />
    {/* Folded Corner */}
    <path d="M19 2 L19 8 L25 8 Z" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    {/* Blue lined notepad lines */}
    <line x1="8" y1="12" x2="22" y2="12" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="16" x2="22" y2="16" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="20" x2="22" y2="20" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="24" x2="17" y2="24" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    {/* Pencil overlay */}
    <path d="M20 22 L27 29 L29 27 L22 20 Z" fill="#e0a000" stroke="#000" strokeWidth="0.8" />
    <path d="M27 29 L28 28 L29 27 Z" fill="#ff0000" />
  </svg>
);

const MediaPlayerIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Speaker box shape */}
    <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="1.2" />
    <rect x="5" y="5" width="22" height="22" fill="#d8d8d8" />
    {/* Speaker cone circle */}
    <circle cx="16" cy="16" r="10" fill="#a0a0a0" stroke="#000" strokeWidth="1" />
    <circle cx="16" cy="16" r="8" fill="#404040" />
    <circle cx="16" cy="16" r="4" fill="#808080" />
    {/* CD overlay */}
    <circle cx="22" cy="22" r="7" fill="#ffffff" stroke="#000" strokeWidth="1" />
    <circle cx="22" cy="22" r="6" fill="#e0f0ff" />
    <circle cx="22" cy="22" r="2" fill="#000080" />
  </svg>
);

const IEIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Classic Windows 95 Blue e */}
    <path d="M26 15 C26 7 20 5 15 5 C8 5 4 10 4 17 C4 24 9 27 16 27 C23 27 26 23 26 17 L9 17 C9 19 11 22 16 22 C20 22 22 20 22 17" stroke="#1080f0" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M11 13 L26 13" stroke="#1080f0" strokeWidth="3.5" strokeLinecap="round" />
    {/* Gold ring swoosh orbit */}
    <path d="M2 20 C10 12 22 8 30 12 C32 13 30 16 26 17 C18 19 8 20 2 20 Z" fill="#ffb000" stroke="#a07000" strokeWidth="0.8" opacity="0.9" />
  </svg>
);

const RecycleBinIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Gray can body */}
    <path d="M7 8 L25 8 L22 28 L10 28 Z" fill="#d0d0d0" stroke="#000" strokeWidth="1" />
    {/* Rim ring */}
    <ellipse cx="16" cy="8" rx="9" ry="2.5" fill="#808080" stroke="#000" strokeWidth="1" />
    {/* Ribs / stripes of the bin */}
    <line x1="11" y1="9" x2="12" y2="28" stroke="#808080" strokeWidth="1.2" />
    <line x1="16" y1="9" x2="16" y2="28" stroke="#808080" strokeWidth="1.2" />
    <line x1="21" y1="9" x2="20" y2="28" stroke="#808080" strokeWidth="1.2" />
    {/* Crumpled paper pieces */}
    <path d="M12 5 L16 3 L19 6 L15 7 Z" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
  </svg>
);

const ImageFileIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="22" height="24" fill="#ffffff" stroke="#000" strokeWidth="1" />
    {/* Sun */}
    <circle cx="12" cy="11" r="3" fill="#ffd700" stroke="#b8860b" strokeWidth="0.8" />
    {/* Mountains/landscape inside */}
    <path d="M7 24 L15 15 L21 21 L25 17 L25 24 Z" fill="#008000" stroke="#004000" strokeWidth="0.8" />
  </svg>
);

const VideoFileIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="26" height="22" rx="1" fill="#1a1a2e" stroke="#000" strokeWidth="1" />
    <rect x="5" y="7" width="22" height="14" fill="#0d0d1a" />
    {/* Play button */}
    <path d="M13 11 L21 14 L13 17 Z" fill="#4080ff" />
    {/* Film strip holes */}
    <rect x="5" y="22" width="3" height="3" fill="#303050" />
    <rect x="10" y="22" width="3" height="3" fill="#303050" />
    <rect x="15" y="22" width="3" height="3" fill="#303050" />
    <rect x="20" y="22" width="3" height="3" fill="#303050" />
    <rect x="25" y="22" width="2" height="3" fill="#303050" />
  </svg>
);

const GifFileIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="22" height="24" fill="#ffffff" stroke="#000" strokeWidth="1" />
    <path d="M5 4 L27 4 L27 10 L5 10 Z" fill="#9900cc" />
    <text x="7" y="9.5" fontSize="6" fontWeight="bold" fill="#ffffff" fontFamily="monospace">GIF</text>
    <circle cx="16" cy="20" r="5" fill="none" stroke="#9900cc" strokeWidth="1.5" />
    <path d="M14 20 L19 20 M16 18 L16 22" stroke="#9900cc" strokeWidth="1.5" />
  </svg>
);

// Start Menu Flag Logo (Windows 95 style)
const Win95Logo = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="6" height="5" fill="#ff4040" stroke="#000" strokeWidth="0.5" />
    <rect x="8" y="2" width="7" height="5" fill="#40ff40" stroke="#000" strokeWidth="0.5" />
    <rect x="1" y="8" width="6" height="5" fill="#4040ff" stroke="#000" strokeWidth="0.5" />
    <rect x="8" y="8" width="7" height="5" fill="#ffff40" stroke="#000" strokeWidth="0.5" />
  </svg>
);

// Small status bar / system tray icons
const VolumeIcon = () => (
  <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5v6h3l4 4V1L5 5H2zm9 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"/>
  </svg>
);

const NetworkIcon = () => (
  <svg className="w-4 h-4 text-black" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="6" height="5" fill="#c0c0c0" stroke="#000" strokeWidth="0.8" />
    <rect x="2" y="3" width="4" height="3" fill="#00ffff" />
    <rect x="9" y="8" width="6" height="5" fill="#c0c0c0" stroke="#000" strokeWidth="0.8" />
    <rect x="10" y="9" width="4" height="3" fill="#00ff00" />
    <path d="M4 11 L12 5" stroke="#000" strokeWidth="1" />
  </svg>
);

const BlogIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Book Cover */}
    <rect x="5" y="3" width="22" height="26" fill="#a02020" stroke="#000" strokeWidth="1.2" />
    {/* Page block border */}
    <rect x="23" y="4" width="3" height="24" fill="#ffffff" />
    <line x1="26" y1="4" x2="26" y2="28" stroke="#000" strokeWidth="1.2" />
    {/* Spine line */}
    <line x1="7" y1="3" x2="7" y2="29" stroke="#501010" strokeWidth="1" />
    {/* Book label gold */}
    <rect x="10" y="10" width="10" height="12" fill="#ffd700" stroke="#000" strokeWidth="0.8" />
    {/* Lines inside label */}
    <line x1="12" y1="13" x2="18" y2="13" stroke="#805000" strokeWidth="1" />
    <line x1="12" y1="16" x2="18" y2="16" stroke="#805000" strokeWidth="1" />
    <line x1="12" y1="19" x2="16" y2="19" stroke="#805000" strokeWidth="1" />
  </svg>
);

const AdminIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Classic Floppy Disk casing */}
    <rect x="4" y="4" width="24" height="24" fill="#303030" stroke="#000" strokeWidth="1.2" />
    {/* Label paper */}
    <rect x="8" y="14" width="16" height="13" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
    <rect x="10" y="16" width="12" height="2" fill="#0000d0" />
    <rect x="10" y="20" width="12" height="1" fill="#808080" />
    <rect x="10" y="23" width="8" height="1" fill="#808080" />
    {/* Metal sliding cover */}
    <rect x="10" y="4" width="8" height="7" fill="#c0c0c0" stroke="#808080" strokeWidth="0.8" />
    <rect x="12" y="6" width="2" height="3" fill="#000" />
    {/* Power/Activity LED */}
    <rect x="25" y="25" width="2" height="2" fill="#00ff00" />
  </svg>
);

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  audioUrl?: string;
  coverUrl?: string;
  spotifyUrl?: string;
  bandcampUrl?: string;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: 'nevermind_190bpm_uloe',
    title: 'nevermind 190bpm',
    artist: 'Chrome Heaven',
    genre: 'Local WAV / 190 BPM',
    audioUrl: '/audio/nevermind_190bpm_uloe.wav',
  },
  {
    id: 'lonelystarr',
    title: 'lonelystarr',
    artist: 'Chrome Heaven',
    genre: 'Local WAV / Dreamcore',
    audioUrl: '/audio/lonelystarr.wav',
  },
  {
    id: 'malice',
    title: 'ｍａｌｉｃｅ [EP]',
    artist: 'Chrome Heaven',
    genre: 'Electronic / Dreamcore',
    audioUrl: '/audio/nevermind_190bpm_uloe.wav',
  },
  {
    id: 'bleedmeariver',
    title: 'BleedMeARiver',
    artist: 'Chrome Heaven',
    genre: 'Electronic',
    audioUrl: '/audio/lonelystarr.wav',
  },
];

interface GalleryItem {
  id: string;
  name: string;
  src: string;
  tag: string;
  type?: 'image' | 'video' | 'gif';
  description?: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', name: 'paris_2023.bmp', src: '/images/gallery_1.png', tag: 'Paris2023' },
  { id: 'g2', name: 'lost_in_fantasy.bmp', src: '/images/gallery_2.png', tag: 'lost-in-a-fantasy' },
  { id: 'g3', name: 'how_to_start_cult.bmp', src: '/images/gallery_3.png', tag: 'how-2-start-a-cult' },
  { id: 'g4', name: 'nothin_2_say.bmp', src: '/images/gallery_4.png', tag: 'nothin-2-say' },
  { id: 'g5', name: 'malice_cover.bmp', src: '/images/malice_ep_cover.png', tag: 'malice' },
  { id: 'g6', name: 'avatar_uloe.bmp', src: '/images/avatar.png', tag: 'uloee' },
];

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageSrc?: string;
  audioSrc?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post1',
    title: 'Chrome Heaven Portal Upgrade',
    date: '2026-07-15',
    content: 'Welcome to the new Chrome Heaven blog and official portal!\n\nI have redesigned the layout to act as a direct blog and official page. I am transitioning away from external platforms like SoundCloud to host my own music and content.\n\nNow, all music tracks and photography edits will be served directly from this page. You can listen to my new tracks in the Windows Media Player window and view high-quality renders in the Visuals folder. More updates coming soon.',
    imageSrc: '/images/malice_ep_cover.png',
    audioSrc: '/audio/nevermind_190bpm_uloe.wav'
  },
  {
    id: 'post2',
    title: 'lonelystarr.wav Preview',
    date: '2026-07-10',
    content: 'Here is a preview of my upcoming track \'lonelystarr\'. It is a mix of electronic breakcore and dreamcore synth layers.\n\nYou can listen to the full WAV file by opening the Media Player window and selecting \'lonelystarr\' from the playlist, or play it directly from this journal entry. Let me know what you think on my socials!',
    imageSrc: '/images/gallery_2.png',
    audioSrc: '/audio/lonelystarr.wav'
  }
];

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  icon: React.ReactNode;
}

const WALLPAPERS = [
  { id: 'fence', name: 'Fence Tile', value: 'url("https://sadhost.neocities.org/images/tiles/fence.gif")', type: 'tile' },
  { id: 'classic', name: 'Classic Teal', value: '#386ca0', type: 'color' },
  { id: 'clouds', name: 'Heavenly Clouds', value: 'url("https://win98icons.alexmeub.com/images/wallpapers/clouds.png")', type: 'cover' },
  { id: 'violet', name: 'Deep Violet', value: '#120c1f', type: 'color' },
];

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'welcome',
      title: 'Welcome.txt - Notepad',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 30,
      y: 30,
      width: 480,
      height: 380,
      icon: <TextDocIcon />,
    },
    {
      id: 'blog',
      title: 'My Diary - Journal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 60,
      y: 50,
      width: 640,
      height: 460,
      icon: <BlogIcon />,
    },
    {
      id: 'music',
      title: 'Windows Media Player',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 100,
      y: 70,
      width: 620,
      height: 480,
      icon: <MediaPlayerIcon />,
    },
    {
      id: 'gallery',
      title: 'C:\\Visuals_and_Edits',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 150,
      y: 110,
      width: 520,
      height: 360,
      icon: <FolderIcon />,
    },
    {
      id: 'links',
      title: 'Internet Explorer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 70,
      y: 90,
      width: 580,
      height: 460,
      icon: <IEIcon />,
    },
    {
      id: 'settings',
      title: 'Display Properties',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 130,
      width: 380,
      height: 320,
      icon: <MyComputerIcon />,
    },
    {
      id: 'viewer',
      title: 'Windows Image Viewer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 220,
      y: 50,
      width: 500,
      height: 450,
      icon: <ImageFileIcon />,
    },
  ]);

  // Database loaded states
  const [tracks, setTracks] = useState<Track[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const [activeWindowId, setActiveWindowId] = useState<string>('welcome');
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track>(DEFAULT_TRACKS[0]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [visualizerPreset, setVisualizerPreset] = useState<string>('wmp_battery');
  const [isVisualizerExpanded, setIsVisualizerExpanded] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load content database on mount
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
  }, [currentTrack.id]);

  // Update System Tray Clock
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startVisualizer = () => {
    const audio = audioRef.current;
    if (!audio || typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      const AudioContextImpl = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextImpl) return;
      audioContextRef.current = new AudioContextImpl();
    }

    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
      startVisualizer();
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

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const playNextTrack = () => {
    const trackList = tracks.length > 0 ? tracks : DEFAULT_TRACKS;
    const currentIndex = trackList.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % trackList.length;
    setCurrentTrack(trackList[nextIndex]);
  };

  const playPrevTrack = () => {
    const trackList = tracks.length > 0 ? tracks : DEFAULT_TRACKS;
    const currentIndex = trackList.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    setCurrentTrack(trackList[prevIndex]);
  };

  const openWindow = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) {
        return { ...win, isOpen: true, isMinimized: false };
      }
      return win;
    }));
    setActiveWindowId(id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) {
        return { ...win, isOpen: false };
      }
      return win;
    }));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) {
        return { ...win, isMinimized: true };
      }
      return win;
    }));
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) {
        return { ...win, isMaximized: !win.isMaximized };
      }
      return win;
    }));
  };

  const handleWindowClick = (id: string) => {
    setActiveWindowId(id);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    openWindow('music');
  };

  const openImageViewer = (img: GalleryItem) => {
    setSelectedImage(img);
    openWindow('viewer');
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
      {/* Desktop Area */}
      <div className="flex-1 relative p-4 flex flex-col flex-wrap content-start items-start gap-3 select-none">
        
        {/* Desktop Shortcut Icons with Windows 95 Selection States */}
        <div
          className={`desktop-icon ${selectedDesktopIcon === 'welcome' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('welcome'); }}
          onDoubleClick={() => openWindow('welcome')}
        >
          <TextDocIcon />
          <div className="desktop-icon-text">Welcome.txt</div>
        </div>

        <div
          className={`desktop-icon ${selectedDesktopIcon === 'blog' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('blog'); }}
          onDoubleClick={() => openWindow('blog')}
        >
          <BlogIcon />
          <div className="desktop-icon-text">My Diary</div>
        </div>

        <div
          className={`desktop-icon ${selectedDesktopIcon === 'music' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('music'); }}
          onDoubleClick={() => openWindow('music')}
        >
          <MediaPlayerIcon />
          <div className="desktop-icon-text">Media Player</div>
        </div>

        <div
          className={`desktop-icon ${selectedDesktopIcon === 'gallery' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('gallery'); }}
          onDoubleClick={() => openWindow('gallery')}
        >
          <FolderIcon />
          <div className="desktop-icon-text">Visuals Folder</div>
        </div>

        <div
          className={`desktop-icon ${selectedDesktopIcon === 'links' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('links'); }}
          onDoubleClick={() => openWindow('links')}
        >
          <IEIcon />
          <div className="desktop-icon-text">Internet Explorer</div>
        </div>

        <div
          className={`desktop-icon ${selectedDesktopIcon === 'settings' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('settings'); }}
          onDoubleClick={() => openWindow('settings')}
        >
          <MyComputerIcon />
          <div className="desktop-icon-text">Display Properties</div>
        </div>



        <div
          className={`desktop-icon ${selectedDesktopIcon === 'recycle' ? 'selected' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSelectedDesktopIcon('recycle'); }}
          onDoubleClick={() => alert("The Recycle Bin is empty.")}
        >
          <RecycleBinIcon />
          <div className="desktop-icon-text">Recycle Bin</div>
        </div>

        {/* Windows rendering */}
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
              onClick={() => handleWindowClick(win.id)}
            >
              {/* Title Bar */}
              <div className={`win2k-title-bar ${isActive ? '' : 'inactive'}`}>
                <div className="flex items-center gap-1.5 font-bold text-[11px] truncate flex-1 win2k-title-bar-drag h-full py-1 cursor-default">
                  <div className="w-4 h-4 scale-75 flex-shrink-0 flex items-center justify-center">
                    {win.icon}
                  </div>
                  <span className="truncate">{win.title}</span>
                </div>
                
                {/* Title buttons */}
                <div className="flex gap-1 pl-2">
                  <button className="win2k-title-btn" onClick={() => minimizeWindow(win.id)} aria-label="Minimize">_</button>
                  <button className="win2k-title-btn" onClick={() => toggleMaximize(win.id)} aria-label="Maximize">
                    {win.isMaximized ? '❐' : '⬜'}
                  </button>
                  <button className="win2k-title-btn font-bold text-red-700 font-sans" onClick={() => closeWindow(win.id)} aria-label="Close">X</button>
                </div>
              </div>

              {/* Menu Bar */}
              <div className="win2k-menu bg-[#d0d0c8] select-none">
                <span className="win2k-menu-item">File</span>
                <span className="win2k-menu-item">Edit</span>
                <span className="win2k-menu-item">View</span>
                <span className="win2k-menu-item">Help</span>
              </div>

              {/* Window Content Area */}
              <div className="flex-1 bg-white overflow-hidden flex flex-col p-1.5">
                <div className="flex-1 win2k-border-inset overflow-y-auto win2k-scroll text-black p-3 bg-white font-sans text-[12px] select-text">
                  
                  {/* welcome notepad */}
                  {win.id === 'welcome' && (
                    <div className="leading-relaxed whitespace-pre-wrap select-text">
                      <p className="font-bold text-lg border-b pb-1 mb-2 font-display uppercase tracking-wider text-blue-900">Chrome Heaven — 影が届くまで</p>
                      <p className="italic text-gray-500 mb-4">File Created: January 5, 2023</p>
                      
                      <p className="mb-4">
                        Welcome to my official portfolio space. I am a musical project and visual creator based in Tenerife (Canary Islands).
                      </p>
                      
                      <p className="mb-4">
                        Here you can explore my projects under different aliases like Uloe, Till I Die, and Chrome Heaven.
                      </p>
                      
                      <h3 className="font-bold text-blue-900 mt-4 mb-2">Instructions:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Open <span className="underline cursor-pointer text-blue-800" onClick={() => openWindow('music')}>Media Player</span> to listen to my SoundCloud uploads.</li>
                        <li>Open the <span className="underline cursor-pointer text-blue-800" onClick={() => openWindow('gallery')}>Visuals Folder</span> to check my photography edits.</li>
                        <li>Open <span className="underline cursor-pointer text-blue-800" onClick={() => openWindow('links')}>Internet Explorer</span> to find all my social link profiles.</li>
                      </ul>
                      
                      <p className="text-right mt-8 text-gray-400 font-mono text-[10px]">
                        @chrome_heaven
                      </p>
                    </div>
                  )}

                  {/* Windows Media Player */}
                  {win.id === 'music' && (
                    <div className="flex flex-col md:flex-row gap-4 h-full">
                      
                      {/* Left: Tracks Playlist (Hidden when visualizer is expanded to full window) */}
                      {!isVisualizerExpanded && (
                        <div className="w-full md:w-2/5 flex flex-col gap-2 border-r pr-3 select-none">
                          <div className="font-bold text-blue-900 border-b pb-1 mb-1 flex items-center justify-between text-[11px]">
                            <span>Now Playing</span>
                            <span className="text-[10px] text-gray-500 font-mono font-normal">{tracks.length} Track(s)</span>
                          </div>
                          <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 win2k-scroll">
                            {tracks.map((t) => (
                              <div
                                key={t.id}
                                className={`p-2 border-b cursor-pointer text-[11px] rounded-sm transition-colors ${
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
                      )}

                      {/* Right: Custom visual player with Canvas Visualizer */}
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div className="win2k-border-inset p-2 bg-[#f1f1f1] overflow-hidden flex flex-col gap-2 h-full">
                          
                          {/* Track Header Details (hidden in full window for maximum visualizer space) */}
                          {!isVisualizerExpanded && (
                            <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {currentTrack.coverUrl ? (
                                  <div className="w-10 h-10 flex-shrink-0 border border-gray-400 bg-black overflow-hidden rounded-sm">
                                    <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 flex-shrink-0 border border-gray-400 bg-[#0f1021] flex items-center justify-center rounded-sm">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 animate-pulse" fill="currentColor">
                                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                      <circle cx="12" cy="12" r="4" />
                                      <circle cx="12" cy="12" r="1.5" fill="#0f1021" />
                                    </svg>
                                  </div>
                                )}
                                <div>
                                  <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-mono">Now Playing</div>
                                  <div className="text-[12px] font-bold text-blue-950 truncate max-w-[240px]">{currentTrack.title}</div>
                                  <div className="text-[10px] text-gray-600 truncate">{currentTrack.artist} · <span className="font-mono text-blue-800">{currentTrack.genre}</span></div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Multi-Preset Canvas Visualizer (Full height when expanded) */}
                          <div className={`w-full ${isVisualizerExpanded ? 'h-[295px]' : 'h-[210px]'}`}>
                            <AudioVisualizer
                              analyserNode={analyserRef.current}
                              isPlaying={isPlaying}
                              activePresetId={visualizerPreset}
                              onPresetChange={setVisualizerPreset}
                              isExpanded={isVisualizerExpanded}
                              onToggleExpand={() => setIsVisualizerExpanded(!isVisualizerExpanded)}
                            />
                          </div>

                          {/* Time scrub timeline & controls */}
                          <div className="flex flex-col gap-1.5 bg-[#e4e4dc] p-2 border border-gray-400 rounded-sm">
                            {/* Seek bar */}
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-800">
                              <span>
                                {currentTime > 0 ? `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}` : '00:00'}
                              </span>
                              <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                step="0.1"
                                value={currentTime}
                                onChange={(e) => handleSeek(Number(e.target.value))}
                                className="flex-1 h-1.5 accent-blue-900 cursor-pointer"
                              />
                              <span>
                                {duration > 0 ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` : '00:00'}
                              </span>
                            </div>

                            {/* Playback Buttons & Volume */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-300">
                              <div className="flex items-center gap-1">
                                <button
                                  className="win2k-btn px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                                  onClick={playPrevTrack}
                                  title="Previous Track"
                                >
                                  |&lt;&lt;
                                </button>
                                <button
                                  className="win2k-btn px-3 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-950 cursor-pointer"
                                  onClick={togglePlayback}
                                >
                                  {isPlaying ? 'Pause ⏸' : 'Play ▶'}
                                </button>
                                <button
                                  className="win2k-btn px-2.5 py-0.5 text-[10px] font-bold cursor-pointer"
                                  onClick={stopPlayback}
                                >
                                  Stop ■
                                </button>
                                <button
                                  className="win2k-btn px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                                  onClick={playNextTrack}
                                  title="Next Track"
                                >
                                  &gt;&gt;|
                                </button>
                              </div>

                              {/* Volume control */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono uppercase text-gray-700">Vol:</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.01"
                                  value={volume}
                                  onChange={(event) => setVolume(Number(event.target.value))}
                                  className="h-1.5 w-16 accent-blue-900 cursor-pointer"
                                />
                                <span className="text-[9px] font-mono text-gray-600 w-6 text-right">
                                  {Math.round(volume * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Hidden HTML5 Audio Element */}
                          {currentTrack.audioUrl && (
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
                                playNextTrack();
                              }}
                            />
                          )}

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visuals File Explorer */}
                  {win.id === 'gallery' && (
                    <div>
                      <div className="bg-gray-100 p-2 mb-3 border flex items-center justify-between text-[11px]">
                        <div>Address: <span className="bg-white px-2 py-0.5 border font-mono">C:\Visuals_and_Edits</span></div>
                        <div className="text-gray-500">{galleryItems.length} Object(s)</div>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
                        {galleryItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col items-center justify-center p-2 text-center hover:bg-blue-900/10 cursor-pointer border border-transparent hover:border-blue-950/20 rounded"
                            onDoubleClick={() => openImageViewer(item)}
                          >
                            {item.type === 'video' ? <VideoFileIcon /> : item.type === 'gif' ? <GifFileIcon /> : <ImageFileIcon />}
                            <div className="text-[11px] truncate w-full mt-1.5">{item.name}</div>
                            {item.type && item.type !== 'image' && (
                              <div className="text-[9px] text-purple-700 font-bold uppercase">{item.type}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internet Explorer */}
                  {win.id === 'links' && (
                    <div className="flex flex-col h-full bg-[#f1f1f1]">
                      {/* IE top panel */}
                      <div className="bg-[#d0d0c8] p-2 border-b flex flex-col gap-1.5">
                        <div className="flex gap-2">
                          <button className="win2k-btn px-1.5 py-0.5 text-[10px]" onClick={() => alert("Back navigation simulation")}>&lt; Back</button>
                          <button className="win2k-btn px-1.5 py-0.5 text-[10px]" onClick={() => alert("Forward navigation simulation")}>Forward &gt;</button>
                          <div className="flex-1 flex items-center gap-1">
                            <span className="text-[11px] font-sans">Address:</span>
                            <div className="flex-1 bg-white border border-gray-400 font-mono text-[11px] px-2 py-0.5">
                              http://www.chromeheaven.com/links
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Simulated web content */}
                      <div className="flex-1 bg-[#2b4c7e] p-6 overflow-y-auto text-white font-sans text-center">
                        <div className="max-w-md mx-auto bg-[#d0d0c8] border-2 border-white border-r-[#404040] border-bottom-[#404040] p-4 text-black text-left shadow-lg">
                          <div className="bg-gradient-to-r from-blue-900 to-blue-400 text-white font-bold p-1 text-[11px] mb-3">
                            Internet Explorer Web Portal
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4 border-b pb-3">
                            <Image
                              src="/images/avatar.png"
                              alt="Uloe avatar"
                              width={48}
                              height={48}
                              className="rounded-full border"
                            />
                            <div>
                              <h2 className="font-display font-bold text-base leading-tight">Chrome Heaven Portal</h2>
                              <p className="text-xs text-gray-500 font-jp">影が届くまで</p>
                            </div>
                          </div>

                          <p className="text-[11px] mb-4 text-gray-700">
                            Click any destination below to access official profiles and streaming:
                          </p>

                          <div className="flex flex-col gap-2">
                            <a
                              href="https://soundcloud.com/uloee"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-orange-100 hover:bg-orange-200 border-2 border-white border-r-orange-600 border-b-orange-600 text-orange-950 font-bold text-center text-xs"
                            >
                              SoundCloud Profile (uloee)
                            </a>
                            <a
                              href="https://bandcamp.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-teal-100 hover:bg-teal-200 border-2 border-white border-r-teal-600 border-b-teal-600 text-teal-950 font-bold text-center text-xs"
                            >
                              Bandcamp
                            </a>
                            <a
                              href="https://instagram.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-pink-100 hover:bg-pink-200 border-2 border-white border-r-pink-600 border-b-pink-600 text-pink-950 font-bold text-center text-xs"
                            >
                              Instagram
                            </a>
                            <a
                              href="https://chromeheaven.tumblr.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-blue-100 hover:bg-blue-200 border-2 border-white border-r-blue-600 border-b-blue-600 text-blue-950 font-bold text-center text-xs"
                            >
                              Tumblr Blog
                            </a>
                            <a
                              href="https://youtube.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-red-100 hover:bg-red-200 border-2 border-white border-r-red-600 border-b-red-600 text-red-950 font-bold text-center text-xs"
                            >
                              YouTube
                            </a>
                            <a
                              href="https://tiktok.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-violet-100 hover:bg-violet-200 border-2 border-white border-r-violet-600 border-b-violet-600 text-violet-950 font-bold text-center text-xs"
                            >
                              TikTok
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blog Reader */}
                  {win.id === 'blog' && (
                    <div className="flex gap-2 h-full min-h-[360px]">
                      {/* Left Sidebar: List of posts */}
                      <div className="w-1/3 border-r pr-2 flex flex-col gap-1.5 select-none">
                        <div className="font-bold text-blue-900 border-b pb-1 text-[11px] uppercase tracking-wider">Entries</div>
                        <div className="flex-1 overflow-y-auto max-h-[340px] win2k-scroll pr-1">
                          {posts.length === 0 ? (
                            <div className="text-gray-400 text-center italic py-4">No entries yet.</div>
                          ) : (
                            posts.map((post) => (
                              <div
                                key={post.id}
                                className={`p-2 border-b cursor-pointer transition-colors duration-100 ${
                                  selectedPostId === post.id
                                    ? 'bg-[#000080] text-white font-bold'
                                    : 'hover:bg-gray-100 text-gray-800'
                                }`}
                                onClick={() => setSelectedPostId(post.id)}
                              >
                                <div className="truncate text-[11px]">{post.title}</div>
                                <div className="text-[9px] opacity-75 font-mono mt-0.5">{post.date}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right Panel: Content of selected post */}
                      <div className="flex-1 flex flex-col pl-2 overflow-y-auto win2k-scroll">
                        {(() => {
                          const currentPost = posts.find((p) => p.id === selectedPostId);
                          if (!currentPost) {
                            return (
                              <div className="flex h-full items-center justify-center text-gray-400 italic">
                                Select an entry from the list to read.
                              </div>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-3 select-text leading-relaxed">
                              {/* Header */}
                              <div className="border-b pb-2">
                                <h2 className="text-lg font-bold text-blue-900 tracking-wide">{currentPost.title}</h2>
                                <div className="text-xs text-gray-500 font-mono italic mt-1">Published on: {currentPost.date}</div>
                              </div>

                              {/* Body text */}
                              <div className="text-xs text-gray-800 whitespace-pre-wrap font-sans">
                                {currentPost.content}
                              </div>

                              {/* Attached Media Container */}
                              {(currentPost.imageSrc || currentPost.audioSrc) && (
                                <div className="mt-4 p-2 bg-gray-50 border border-gray-300 rounded-sm">
                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-wider">Attachments:</div>
                                  <div className="flex flex-col gap-3">
                                    {/* Image Attachment */}
                                    {currentPost.imageSrc && (
                                      <div className="flex flex-col gap-1 items-start">
                                        <div className="relative border border-gray-400 bg-black cursor-pointer hover:opacity-90 max-w-[200px]" onClick={() => {
                                          if (currentPost.imageSrc) {
                                            const matchedImg = galleryItems.find(item => item.src === currentPost.imageSrc);
                                            if (matchedImg) {
                                              openImageViewer(matchedImg);
                                            } else {
                                              openImageViewer({
                                                id: 'attached',
                                                name: currentPost.imageSrc.split('/').pop() || 'attachment.bmp',
                                                src: currentPost.imageSrc,
                                                tag: 'Attached'
                                              });
                                            }
                                          }
                                        }}>
                                          <img
                                            src={currentPost.imageSrc}
                                            alt="Attached media"
                                            className="max-h-[120px] object-contain"
                                          />
                                        </div>
                                        <span className="text-[9px] text-gray-500 italic">(Double-click/click image to open in Viewer)</span>
                                      </div>
                                    )}

                                    {/* Audio Attachment */}
                                    {currentPost.audioSrc && (
                                      <div className="flex items-center gap-2">
                                        <button
                                          className="win2k-btn bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1 flex items-center gap-1.5"
                                          onClick={() => {
                                            if (currentPost.audioSrc) {
                                              const matchedTrack = tracks.find(t => t.audioUrl === currentPost.audioSrc);
                                              if (matchedTrack) {
                                                playTrack(matchedTrack);
                                                setTimeout(() => {
                                                  if (audioRef.current) {
                                                    void audioRef.current.play();
                                                    setIsPlaying(true);
                                                    startVisualizer();
                                                  }
                                                }, 150);
                                              } else {
                                                // Create a temp track if not in list
                                                const tempTrack = {
                                                  id: 'temp_' + Date.now(),
                                                  title: `Attachment - ${currentPost.title}`,
                                                  artist: 'Chrome Heaven',
                                                  genre: 'Blog Attachment',
                                                  audioUrl: currentPost.audioSrc
                                                };
                                                setTracks(prev => [...prev, tempTrack]);
                                                playTrack(tempTrack);
                                                setTimeout(() => {
                                                  if (audioRef.current) {
                                                    void audioRef.current.play();
                                                    setIsPlaying(true);
                                                    startVisualizer();
                                                  }
                                                }, 150);
                                              }
                                            }
                                          }}
                                        >
                                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z"/>
                                          </svg>
                                          Play Attachment in Media Player
                                        </button>
                                        <span className="text-[10px] text-gray-500 font-mono">({currentPost.audioSrc.split('/').pop()})</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}



                  {/* Display properties / Wallpaper setup */}
                  {win.id === 'settings' && (
                    <div className="flex flex-col gap-4">
                      <div className="font-bold text-blue-900 border-b pb-1">Wallpaper Configuration</div>
                      <p className="text-[11px] text-gray-600">Select a classic wallpaper to customize your desktop background:</p>
                      
                      <div className="flex flex-col gap-2">
                        {WALLPAPERS.map((wp) => (
                          <div
                            key={wp.id}
                            className={`p-2 border cursor-pointer flex justify-between items-center text-[12px] ${
                              currentWallpaper.id === wp.id ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setCurrentWallpaper(wp)}
                          >
                            <span>{wp.name}</span>
                            <span className="text-[10px] opacity-75 uppercase">{wp.type}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-right mt-4">
                        <button className="win2k-btn" onClick={() => closeWindow('settings')}>
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Viewer */}
                  {win.id === 'viewer' && selectedImage && (
                    <div className="flex flex-col items-center justify-between h-full bg-[#f1f1f1] p-2">
                      <div className="relative w-full flex-1 min-h-[260px] border border-gray-400 bg-black flex items-center justify-center overflow-hidden">
                        {selectedImage.type === 'video' ? (
                          <video
                            key={selectedImage.src}
                            src={selectedImage.src}
                            controls
                            autoPlay
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : selectedImage.type === 'gif' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedImage.src}
                            alt={selectedImage.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Image
                            src={selectedImage.src}
                            alt={selectedImage.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="w-full mt-2 font-mono text-[11px] text-gray-700 text-center">
                        {selectedImage.name} — #{selectedImage.tag}
                        {selectedImage.type && selectedImage.type !== 'image' && (
                          <span className="ml-2 text-purple-700 font-bold uppercase">[{selectedImage.type}]</span>
                        )}
                      </div>
                      {selectedImage.description && (
                        <div className="w-full mt-1 px-2 py-1 bg-gray-100 border border-gray-300 text-[10px] italic text-gray-600 font-sans">
                          {selectedImage.description}
                        </div>
                      )}
                    </div>
                  )}

                </div>
                
                {/* Classic status bar */}
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

      {/* Taskbar Area (Windows 95 high fidelity styling) */}
      <div className="win95-taskbar select-none">
        
        {/* Start Button & Active Task tabs */}
        <div className="flex items-center gap-2 h-full">
          <button
            id="start-button"
            className={`start-btn ${startMenuOpen ? 'pressed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setStartMenuOpen(!startMenuOpen);
            }}
          >
            <Win95Logo />
            <span>Start</span>
          </button>

          {/* Separator line */}
          <div className="w-0.5 h-[28px] bg-white border-l border-gray-500 mx-1"></div>

          {/* Active task windows list */}
          <div className="flex gap-1 h-full items-center">
            {windows.map((win) => {
              if (!win.isOpen) return null;
              const isActive = activeWindowId === win.id && !win.isMinimized;
              return (
                <button
                  key={win.id}
                  className={`taskbar-tab ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (win.isMinimized) {
                      setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMinimized: false } : w));
                      setActiveWindowId(win.id);
                    } else if (activeWindowId === win.id) {
                      minimizeWindow(win.id);
                    } else {
                      setActiveWindowId(win.id);
                    }
                  }}
                >
                  <div className="w-4 h-4 scale-75 flex-shrink-0 flex items-center justify-center">
                    {win.icon}
                  </div>
                  <span className="truncate pr-1 text-[11px]">{win.title.split(' - ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Menu Popup */}
        <AnimatePresence>
          {startMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-9 left-1 w-52 bg-[#d0d0c8] border-2 border-white border-r-[#404040] border-b-[#404040] z-50 p-0.5 flex"
            >
              {/* Start menu side bar */}
              <div className="w-8 bg-gradient-to-t from-blue-900 to-blue-500 flex items-end justify-center py-2 select-none">
                <span className="text-white font-bold font-display text-[12px] origin-center -rotate-90 tracking-widest uppercase">
                  Win95
                </span>
              </div>

              {/* Start menu list */}
              <div className="flex-1 flex flex-col py-1 text-[11px] select-none text-black">
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => openWindow('welcome')}>
                  <TextDocIcon />
                  <span>Welcome.txt</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => openWindow('blog')}>
                  <BlogIcon />
                  <span>My Diary (Blog)</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => openWindow('music')}>
                  <MediaPlayerIcon />
                  <span>Windows Media Player</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => openWindow('gallery')}>
                  <FolderIcon />
                  <span>C:\Visuals_and_Edits</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => openWindow('links')}>
                  <IEIcon />
                  <span>Internet Explorer</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => openWindow('settings')}>
                  <MyComputerIcon />
                  <span>Display Settings</span>
                </div>

                <div className="border-t border-gray-400 my-1"></div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default flex items-center gap-2" onClick={() => alert("Shut Down simulation: Goodbye!")}>
                  <svg className="w-4 h-4 scale-75" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="#000" strokeWidth="1.5" />
                    <line x1="8" y1="2" x2="8" y2="8" stroke="#000" strokeWidth="1.5" />
                  </svg>
                  <span>Shut Down...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Tray (Clock & status indicators) */}
        <div className="win95-tray">
          <NetworkIcon />
          <VolumeIcon />
          <div className="w-px h-3.5 bg-gray-400 border-r border-white"></div>
          <span className="font-medium text-black text-[11px]">{time}</span>
        </div>

      </div>
    </div>
  );
}
