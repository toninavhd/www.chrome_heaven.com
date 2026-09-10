'use client';
import React from 'react';
import { BlogPost } from '../../types';

interface BlogContentProps {
  posts: BlogPost[];
  selectedPostId: string;
  setSelectedPostId: (id: string) => void;
  onOpenImageAttachment: (src: string) => void;
  onPlayAudioAttachment: (src: string, title: string) => void;
}

export const BlogContent: React.FC<BlogContentProps> = ({ 
  posts, 
  selectedPostId, 
  setSelectedPostId, 
  onOpenImageAttachment, 
  onPlayAudioAttachment 
}) => {
  return (
    <div className="flex gap-2 h-full min-h-[360px]">
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
              <div className="border-b pb-2">
                <h2 className="text-lg font-bold text-blue-900 tracking-wide">{currentPost.title}</h2>
                <div className="text-xs text-gray-500 font-mono italic mt-1">Published on: {currentPost.date}</div>
              </div>

              <div className="text-xs text-gray-800 whitespace-pre-wrap font-sans">
                {currentPost.content}
              </div>

              {(currentPost.imageSrc || currentPost.audioSrc) && (
                <div className="mt-4 p-2 bg-gray-50 border border-gray-300 rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-wider">Attachments:</div>
                  <div className="flex flex-col gap-3">
                    {currentPost.imageSrc && (
                      <div className="flex flex-col gap-1 items-start">
                        <div className="relative border border-gray-400 bg-black cursor-pointer hover:opacity-90 max-w-[200px]" onClick={() => onOpenImageAttachment(currentPost.imageSrc!)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentPost.imageSrc}
                            alt="Attached media"
                            className="max-h-[120px] object-contain"
                          />
                        </div>
                        <span className="text-[9px] text-gray-500 italic">(Double-click/click image to open in Viewer)</span>
                      </div>
                    )}

                    {currentPost.audioSrc && (
                      <div className="flex items-center gap-2">
                        <button
                          className="win2k-btn bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1 flex items-center gap-1.5"
                          onClick={() => onPlayAudioAttachment(currentPost.audioSrc!, currentPost.title)}
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
  );
};
