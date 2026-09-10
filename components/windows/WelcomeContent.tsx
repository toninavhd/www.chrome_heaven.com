'use client';
import React from 'react';

interface WelcomeContentProps {
  openWindow: (id: string) => void;
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ openWindow }) => {
  return (
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
        <li>Open <span className="underline cursor-pointer text-blue-800" onClick={() => openWindow('music')}>Media Player</span> to listen to directly hosted tracks from this site.</li>
        <li>Open the <span className="underline cursor-pointer text-blue-800" onClick={() => openWindow('gallery')}>Visuals Folder</span> to check my photography edits.</li>
        <li>Open <span className="underline cursor-pointer text-blue-800" onClick={() => openWindow('links')}>Internet Explorer</span> to find external socials and profile links.</li>
      </ul>
      
      <p className="text-right mt-8 text-gray-400 font-mono text-[10px]">
        @chrome_heaven
      </p>
    </div>
  );
};
