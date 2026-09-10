'use client';
import React from 'react';
import Image from 'next/image';

export const IEContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#f1f1f1]">
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

      <div className="flex-1 bg-[#2b4c7e] p-6 overflow-y-auto text-white font-sans text-center">
        <div className="max-w-md mx-auto bg-[#d0d0c8] border-2 border-white border-r-[#404040] border-bottom-[#404040] p-4 text-black text-left shadow-lg">
          <div className="bg-gradient-to-r from-blue-900 to-blue-400 text-white font-bold p-1 text-[11px] mb-3">
            Internet Explorer Web Portal
          </div>

          <div className="flex items-center gap-4 mb-4 border-b pb-3">
            <Image
              src="/images/Captura_de_pantalla_2026-09-10_143748.png"
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
              href="/"
              className="block p-2 bg-orange-100 hover:bg-orange-200 border-2 border-white border-r-orange-600 border-b-orange-600 text-orange-950 font-bold text-center text-xs"
            >
              Back to Homepage
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
  );
};
