'use client';
import React from 'react';

export const MyComputerIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="18" height="13" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    <rect x="6" y="5" width="14" height="9" fill="#dfdfdf" />
    <rect x="8" y="7" width="10" height="5" fill="#000" />
    <rect x="9" y="8" width="8" height="3" fill="#008080" />
    <path d="M9 16 L17 16 L19 20 L7 20 Z" fill="#808080" stroke="#000" strokeWidth="1" />
    <rect x="6" y="20" width="14" height="1" fill="#c0c0c0" />
    <rect x="23" y="6" width="6" height="15" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    <rect x="23" y="6" width="1" height="15" fill="#ffffff" />
    <line x1="25" y1="9" x2="27" y2="9" stroke="#000" strokeWidth="1" />
    <line x1="25" y1="12" x2="27" y2="12" stroke="#808080" strokeWidth="1" />
    <circle cx="26" cy="18" r="0.7" fill="#00ff00" />
  </svg>
);

export const FolderIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6 L11 6 L13 9 L28 9 L28 26 L2 26 Z" fill="#b08030" stroke="#000" strokeWidth="1" />
    <rect x="5" y="7" width="16" height="5" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
    <path d="M2 10 L26 10 L28 26 L2 26 Z" fill="#f0c050" stroke="#000" strokeWidth="1" />
    <path d="M3 11 L25 11 L27 25 L3 25 Z" fill="#ffd870" />
  </svg>
);

export const TextDocIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2 L19 2 L25 8 L25 29 L5 29 Z" fill="#ffffff" stroke="#000" strokeWidth="1" />
    <path d="M19 2 L19 8 L25 8 Z" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    <line x1="8" y1="12" x2="22" y2="12" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="16" x2="22" y2="16" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="20" x2="22" y2="20" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <line x1="8" y1="24" x2="17" y2="24" stroke="#0000d0" strokeWidth="0.8" opacity="0.7" />
    <path d="M20 22 L27 29 L29 27 L22 20 Z" fill="#e0a000" stroke="#000" strokeWidth="0.8" />
    <path d="M27 29 L28 28 L29 27 Z" fill="#ff0000" />
  </svg>
);

export const MediaPlayerIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="1.2" />
    <rect x="5" y="5" width="22" height="22" fill="#d8d8d8" />
    <circle cx="16" cy="16" r="10" fill="#a0a0a0" stroke="#000" strokeWidth="1" />
    <circle cx="16" cy="16" r="8" fill="#404040" />
    <circle cx="16" cy="16" r="4" fill="#808080" />
    <circle cx="22" cy="22" r="7" fill="#ffffff" stroke="#000" strokeWidth="1" />
    <circle cx="22" cy="22" r="6" fill="#e0f0ff" />
    <circle cx="22" cy="22" r="2" fill="#000080" />
  </svg>
);

export const IEIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 640 640">
    <path fill="#fff" d="M483.03 369.453h155.293c1.181-10.772 1.689-21.768 1.689-33 0-52.75-14.15-102.273-38.918-144.923 25.56-67.95 24.674-125.647-9.555-160.124C558.987-1.016 471.62 4.24 372.843 47.988c-7.323-.543-14.693-.85-22.158-.85-135.58 0-249.298 93.308-280.716 219.003 42.52-54.45 87.237-93.946 147.037-122.659-5.433 5.103-37.146 36.638-42.496 41.942C16.914 342.973-32.776 548.794 20.693 602.264c40.63 40.63 114.32 33.78 198.97-7.666 39.32 20.032 83.883 31.335 131.058 31.335 127.076 0 234.747-81.769 273.736-195.71H467.959c-21.52 39.708-63.674 66.768-112.005 66.768-48.32 0-90.427-27.036-111.994-66.769a128.008 128.008 0 0 1-15.072-60.308v-.46H483.03zm-253.881-76.288c3.579-63.887 56.717-114.875 121.549-114.875 64.855 0 117.994 50.941 121.572 114.875H229.149zM590.122 63.52c22.052 22.276 21.508 63.284 2.658 114.486-32.34-49.277-79.289-88.135-134.754-110.27 59.28-25.429 107.505-28.807 132.096-4.216zM61.525 592.117c-28.122-28.17-19.677-87.25 16.583-158.447 22.56 63.32 66.568 116.505 123.238 150.793-62.788 28.5-114.202 33.354-139.844 7.665l.024-.012z" />
  </svg>

);

export const RecycleBinIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8 L25 8 L22 28 L10 28 Z" fill="#d0d0d0" stroke="#000" strokeWidth="1" />
    <ellipse cx="16" cy="8" rx="9" ry="2.5" fill="#808080" stroke="#000" strokeWidth="1" />
    <line x1="11" y1="9" x2="12" y2="28" stroke="#808080" strokeWidth="1.2" />
    <line x1="16" y1="9" x2="16" y2="28" stroke="#808080" strokeWidth="1.2" />
    <line x1="21" y1="9" x2="20" y2="28" stroke="#808080" strokeWidth="1.2" />
    <path d="M12 5 L16 3 L19 6 L15 7 Z" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
  </svg>
);

export const ImageFileIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="22" height="24" fill="#ffffff" stroke="#000" strokeWidth="1" />
    <circle cx="12" cy="11" r="3" fill="#ffd700" stroke="#b8860b" strokeWidth="0.8" />
    <path d="M7 24 L15 15 L21 21 L25 17 L25 24 Z" fill="#008000" stroke="#004000" strokeWidth="0.8" />
  </svg>
);

export const VideoFileIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="26" height="22" rx="1" fill="#1a1a2e" stroke="#000" strokeWidth="1" />
    <rect x="5" y="7" width="22" height="14" fill="#0d0d1a" />
    <path d="M13 11 L21 14 L13 17 Z" fill="#4080ff" />
    <rect x="5" y="22" width="3" height="3" fill="#303050" />
    <rect x="10" y="22" width="3" height="3" fill="#303050" />
    <rect x="15" y="22" width="3" height="3" fill="#303050" />
    <rect x="20" y="22" width="3" height="3" fill="#303050" />
    <rect x="25" y="22" width="2" height="3" fill="#303050" />
  </svg>
);

export const GifFileIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="22" height="24" fill="#ffffff" stroke="#000" strokeWidth="1" />
    <path d="M5 4 L27 4 L27 10 L5 10 Z" fill="#9900cc" />
    <text x="7" y="9.5" fontSize="6" fontWeight="bold" fill="#ffffff" fontFamily="monospace">GIF</text>
    <circle cx="16" cy="20" r="5" fill="none" stroke="#9900cc" strokeWidth="1.5" />
    <path d="M14 20 L19 20 M16 18 L16 22" stroke="#9900cc" strokeWidth="1.5" />
  </svg>
);

export const Win95Logo = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="6" height="5" fill="#ff4040" stroke="#000" strokeWidth="0.5" />
    <rect x="8" y="2" width="7" height="5" fill="#40ff40" stroke="#000" strokeWidth="0.5" />
    <rect x="1" y="8" width="6" height="5" fill="#4040ff" stroke="#000" strokeWidth="0.5" />
    <rect x="8" y="8" width="7" height="5" fill="#ffff40" stroke="#000" strokeWidth="0.5" />
  </svg>
);

export const VolumeIcon = () => (
  <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5v6h3l4 4V1L5 5H2zm9 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" />
  </svg>
);

export const NetworkIcon = () => (
  <svg className="w-4 h-4 text-black" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="6" height="5" fill="#c0c0c0" stroke="#000" strokeWidth="0.8" />
    <rect x="2" y="3" width="4" height="3" fill="#00ffff" />
    <rect x="9" y="8" width="6" height="5" fill="#c0c0c0" stroke="#000" strokeWidth="0.8" />
    <rect x="10" y="9" width="4" height="3" fill="#00ff00" />
    <path d="M4 11 L12 5" stroke="#000" strokeWidth="1" />
  </svg>
);

export const BlogIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="22" height="26" fill="#a02020" stroke="#000" strokeWidth="1.2" />
    <rect x="23" y="4" width="3" height="24" fill="#ffffff" />
    <line x1="26" y1="4" x2="26" y2="28" stroke="#000" strokeWidth="1.2" />
    <line x1="7" y1="3" x2="7" y2="29" stroke="#501010" strokeWidth="1" />
    <rect x="10" y="10" width="10" height="12" fill="#ffd700" stroke="#000" strokeWidth="0.8" />
    <line x1="12" y1="13" x2="18" y2="13" stroke="#805000" strokeWidth="1" />
    <line x1="12" y1="16" x2="18" y2="16" stroke="#805000" strokeWidth="1" />
    <line x1="12" y1="19" x2="16" y2="19" stroke="#805000" strokeWidth="1" />
  </svg>
);

export const AdminIcon = () => (
  <svg className="w-8 h-8 desktop-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#303030" stroke="#000" strokeWidth="1.2" />
    <rect x="8" y="14" width="16" height="13" fill="#ffffff" stroke="#808080" strokeWidth="0.8" />
    <rect x="10" y="16" width="12" height="2" fill="#0000d0" />
    <rect x="10" y="20" width="12" height="1" fill="#808080" />
    <rect x="10" y="23" width="8" height="1" fill="#808080" />
    <rect x="10" y="4" width="8" height="7" fill="#c0c0c0" stroke="#808080" strokeWidth="0.8" />
    <rect x="12" y="6" width="2" height="3" fill="#000" />
    <rect x="25" y="25" width="2" height="2" fill="#00ff00" />
  </svg>
);
