'use client';
import React from 'react';
import { Wallpaper } from '../../types';

interface SettingsContentProps {
  wallpapers: Wallpaper[];
  currentWallpaper: Wallpaper;
  setCurrentWallpaper: (wp: Wallpaper) => void;
  closeWindow: (id: string) => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ wallpapers, currentWallpaper, setCurrentWallpaper, closeWindow }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold text-blue-900 border-b pb-1">Wallpaper Configuration</div>
      <p className="text-[11px] text-gray-600">Select a classic wallpaper to customize your desktop background:</p>
      
      <div className="flex flex-col gap-2">
        {wallpapers.map((wp) => (
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
  );
};
