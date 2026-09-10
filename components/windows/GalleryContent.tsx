'use client';
import React from 'react';
import { GalleryItem } from '../../types';
import { VideoFileIcon, GifFileIcon, ImageFileIcon } from '../icons/Icons';

interface GalleryContentProps {
  galleryItems: GalleryItem[];
  openImageViewer: (img: GalleryItem) => void;
}

export const GalleryContent: React.FC<GalleryContentProps> = ({ galleryItems, openImageViewer }) => {
  return (
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
  );
};
