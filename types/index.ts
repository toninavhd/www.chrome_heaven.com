import React from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  audioUrl?: string;
  coverUrl?: string;
}

export type VisualizerPreset = 'battery' | 'mathical' | 'spectrum';

export interface GalleryItem {
  id: string;
  name: string;
  src: string;
  tag: string;
  type?: 'image' | 'video' | 'gif';
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageSrc?: string;
  audioSrc?: string;
}

export interface WindowState {
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

export interface Wallpaper {
  id: string;
  name: string;
  value: string;
  type: string;
}

