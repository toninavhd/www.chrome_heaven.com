'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Win95Logo, TextDocIcon, BlogIcon, MediaPlayerIcon, FolderIcon, IEIcon, MyComputerIcon, NetworkIcon, VolumeIcon } from '../icons/Icons';
import { WindowState } from '../../types';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string;
  onStartMenuClick: (e: React.MouseEvent) => void;
  startMenuOpen: boolean;
  onWindowTabClick: (id: string) => void;
  openWindow: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows, activeWindowId, onStartMenuClick, startMenuOpen, onWindowTabClick, openWindow }) => {
  const [time, setTime] = useState('');

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

  return (
    <div className="win95-taskbar select-none z-50 relative">
      <div className="flex items-center gap-2 h-full">
        <button
          id="start-button"
          className={`start-btn ${startMenuOpen ? 'pressed' : ''}`}
          onClick={onStartMenuClick}
        >
          <Win95Logo />
          <span>Start</span>
        </button>

        <div className="w-0.5 h-[28px] bg-white border-l border-gray-500 mx-1"></div>

        <div className="flex gap-1 h-full items-center flex-1 overflow-hidden">
          {windows.map((win) => {
            if (!win.isOpen) return null;
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                className={`taskbar-tab ${isActive ? 'active' : ''}`}
                onClick={() => onWindowTabClick(win.id)}
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

      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-9 left-1 w-52 bg-[#d0d0c8] border-2 border-white border-r-[#404040] border-b-[#404040] z-50 p-0.5 flex"
          >
            <div className="w-8 bg-gradient-to-t from-blue-900 to-blue-500 flex items-end justify-center py-2 select-none">
              <span className="text-white font-bold font-display text-[12px] origin-center -rotate-90 tracking-widest uppercase">
                Win95
              </span>
            </div>

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

      <div className="win95-tray">
        <NetworkIcon />
        <VolumeIcon />
        <div className="w-px h-3.5 bg-gray-400 border-r border-white"></div>
        <span className="font-medium text-black text-[11px]">{time}</span>
      </div>
    </div>
  );
};
