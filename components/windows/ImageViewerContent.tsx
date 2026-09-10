'use client';
import React from 'react';
import Image from 'next/image';
import { GalleryItem } from '../../types';

interface ImageViewerContentProps {
  selectedImage: GalleryItem;
}

export const ImageViewerContent: React.FC<ImageViewerContentProps> = ({ selectedImage }) => {
  return (
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
  );
};
