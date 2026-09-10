'use client';

import React, { useState, useEffect } from 'react';
import { verifyAdminPassword } from './actions';

const AdminIcon = () => (
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

const Win95Logo = () => (
  <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="6" height="5" fill="#ff4040" stroke="#000" strokeWidth="0.5" />
    <rect x="8" y="2" width="7" height="5" fill="#40ff40" stroke="#000" strokeWidth="0.5" />
    <rect x="1" y="8" width="6" height="5" fill="#4040ff" stroke="#000" strokeWidth="0.5" />
    <rect x="8" y="8" width="7" height="5" fill="#ffff40" stroke="#000" strokeWidth="0.5" />
  </svg>
);

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  audioUrl?: string;
  coverUrl?: string;
}

interface GalleryItem {
  id: string;
  name: string;
  src: string;
  tag: string;
  type?: 'image' | 'video' | 'gif';
  description?: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageSrc?: string;
  audioSrc?: string;
}

const WALLPAPERS = [
  { id: 'classic_teal', name: 'Classic Teal', value: '#386ca0', type: 'color' },
  { id: 'deep_violet', name: 'Deep Violet', value: '#120c1f', type: 'color' },
  { id: 'midnight', name: 'Midnight Black', value: '#0a0a0f', type: 'color' },
  { id: 'forest', name: 'Dark Forest', value: '#0d1f0d', type: 'color' },
  { id: 'wine', name: 'Wine Red', value: '#1f0a0a', type: 'color' },
  { id: 'fence', name: 'Fence Tile', value: 'url("https://sadhost.neocities.org/images/tiles/fence.gif")', type: 'tile' },
  { id: 'clouds', name: 'Heavenly Clouds', value: 'url("https://win98icons.alexmeub.com/images/wallpapers/clouds.png")', type: 'cover' },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedOn, setIsLoggedOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'music' | 'visuals' | 'blog' | 'settings'>('music');

  // Wallpaper state (persists via localStorage)
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);

  // Database loaded states
  const [tracks, setTracks] = useState<Track[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Music upload state
  const [uploadTrackTitle, setUploadTrackTitle] = useState('');
  const [uploadTrackArtist, setUploadTrackArtist] = useState('Chrome Heaven');
  const [uploadTrackGenre, setUploadTrackGenre] = useState('Electronic');
  const [uploadTrackFile, setUploadTrackFile] = useState<File | null>(null);
  const [uploadTrackCoverFile, setUploadTrackCoverFile] = useState<File | null>(null);
  const [uploadTrackCoverPreview, setUploadTrackCoverPreview] = useState<string | null>(null);
  const [uploadTrackStatus, setUploadTrackStatus] = useState({ type: '', text: '' });

  // Visuals upload state
  const [uploadMediaName, setUploadMediaName] = useState('');
  const [uploadMediaTag, setUploadMediaTag] = useState('');
  const [uploadMediaDescription, setUploadMediaDescription] = useState('');
  const [uploadMediaType, setUploadMediaType] = useState<'image' | 'video' | 'gif'>('image');
  const [uploadMediaFile, setUploadMediaFile] = useState<File | null>(null);
  const [uploadMediaStatus, setUploadMediaStatus] = useState({ type: '', text: '' });

  // Blog upload state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDate, setNewPostDate] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostAttachedImage, setNewPostAttachedImage] = useState('');
  const [newPostAttachedAudio, setNewPostAttachedAudio] = useState('');
  const [newPostStatus, setNewPostStatus] = useState({ type: '', text: '' });

  // Load wallpaper preference from localStorage
  useEffect(() => {
    const savedWallpaperId = localStorage.getItem('admin_wallpaper');
    if (savedWallpaperId) {
      const found = WALLPAPERS.find(w => w.id === savedWallpaperId);
      if (found) setWallpaper(found);
    }
  }, []);

  // Load database metadata to populate selectors
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/content.json');
        if (res.ok) {
          const data = await res.json();
          if (data.tracks) setTracks(data.tracks);
          if (data.gallery) setGalleryItems(data.gallery);
          if (data.posts) setPosts(data.posts);
        }
      } catch (err) {
        console.warn('Could not load database in admin page.', err);
      }
    };
    loadContent();
  }, []);

  // Update date pre-fill
  useEffect(() => {
    setNewPostDate(new Date().toISOString().split('T')[0]);
  }, [isLoggedOn]);

  const handleLogon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setIsLoggedOn(true);
    } else {
      alert('The password you entered is incorrect. Access denied.');
      setPassword('');
    }
  };

  const handleDeleteItem = async (type: 'tracks' | 'gallery' | 'posts', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const formData = new FormData();
    formData.append('action', 'delete_item');
    formData.append('type', type);
    formData.append('id', id);

    try {
      const res = await fetch('/api/content', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        if (type === 'tracks') setTracks(data.db.tracks);
        if (type === 'gallery') setGalleryItems(data.db.gallery);
        if (type === 'posts') setPosts(data.db.posts);
      } else {
        alert(data.message || 'Error deleting item');
      }
    } catch (err) {
      alert('Network error while deleting.');
    }
  };

  const applyWallpaper = (wp: typeof WALLPAPERS[0]) => {
    setWallpaper(wp);
    localStorage.setItem('admin_wallpaper', wp.id);
  };

  // Compute background style
  const bgStyle: React.CSSProperties = wallpaper.type === 'color'
    ? { backgroundColor: wallpaper.value }
    : wallpaper.type === 'tile'
    ? { backgroundImage: wallpaper.value, backgroundRepeat: 'repeat' }
    : { backgroundImage: wallpaper.value, backgroundSize: 'cover', backgroundPosition: 'center' };

  // Media accept types helper
  const mediaAccept = uploadMediaType === 'video' ? 'video/*' : uploadMediaType === 'gif' ? 'image/gif' : 'image/*';

  const TABS: { id: 'music' | 'visuals' | 'blog' | 'settings'; label: string }[] = [
    { id: 'music', label: 'Music Track' },
    { id: 'visuals', label: 'Visual / Video' },
    { id: 'blog', label: 'Diary Post' },
    { id: 'settings', label: '⚙ Settings' },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col font-sans select-none" style={bgStyle}>
      
      {!isLoggedOn ? (
        /* Full Screen Windows 95 Logon Dialog */
        <div className="flex-1 flex items-center justify-center p-4">
          <form 
            onSubmit={handleLogon}
            className="w-full max-w-[420px] bg-[#d0d0c8] win2k-window flex flex-col p-1 gap-2 shadow-2xl"
          >
            {/* Title Bar */}
            <div className="win2k-title-bar select-none">
              <div className="flex items-center gap-1.5 font-bold text-[11px] h-full py-0.5 cursor-default">
                <Win95Logo />
                <span>Enter Network Password</span>
              </div>
            </div>

            {/* Content body */}
            <div className="flex gap-4 p-4 text-black text-[11px] leading-relaxed items-start">
              {/* Graphic Icon */}
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-[#d0d0c8] win2k-border shadow-inner p-1">
                <svg className="w-10 h-10 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.63 2A6.5 6.5 0 0 0 7 8.12V10h1.5v1.5H10v1.5h1.5v1.5H13l3.18-3.18a6.5 6.5 0 0 0 2.82-5.32 6.5 6.5 0 0 0-6.37-6.13zm5.37 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                </svg>
              </div>

              {/* Login input fields */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="text-xs font-bold font-sans text-gray-950">
                  Enter your administrator credentials to manage chromeheaven.com.
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-semibold text-right">User name:</span>
                    <input
                      type="text"
                      disabled
                      value="Administrator"
                      className="flex-1 px-2 py-0.5 bg-gray-100 border border-gray-400 text-gray-500 text-xs win2k-border-inset outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-semibold text-right">Password:</span>
                    <input
                      type="password"
                      placeholder="Password..."
                      autoFocus
                      className="flex-1 px-2 py-0.5 bg-white border border-gray-400 text-black text-xs win2k-border-inset outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons on the right */}
              <div className="flex flex-col gap-2 w-20">
                <button type="submit" className="win2k-btn font-bold py-1 w-full text-center">OK</button>
                <button type="button" className="win2k-btn py-1 w-full text-center" onClick={() => window.location.href = '/'}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* Logged In Desktop and Uploader Window */
        <div className="flex-1 relative p-4 flex items-center justify-center overflow-auto">
          
          {/* Centered Upload Manager Window */}
          <div className="w-full max-w-[520px] bg-[#d0d0c8] win2k-window flex flex-col">
            
            {/* Title Bar */}
            <div className="win2k-title-bar">
              <div className="flex items-center gap-1.5 font-bold text-[11px] truncate flex-1 h-full py-0.5 cursor-default">
                <div className="w-4 h-4 scale-75 flex-shrink-0 flex items-center justify-center">
                  <AdminIcon />
                </div>
                <span>Upload Manager - System Administration</span>
              </div>
              <div className="flex gap-1 pl-2">
                <button 
                  className="win2k-title-btn font-bold text-red-700 font-sans" 
                  onClick={() => { setIsLoggedOn(false); setPassword(''); }}
                  title="Log Off"
                >
                  X
                </button>
              </div>
            </div>

            {/* Window Content Area */}
            <div className="flex-1 bg-white overflow-hidden flex flex-col p-1.5 text-black">
              
              {/* Tab Header bar */}
              <div className="flex border-b border-gray-400 gap-1 bg-[#d0d0c8] p-1 pb-0 select-none flex-wrap">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`px-3 py-1 text-[11px] rounded-t-sm border border-b-0 ${
                      activeTab === tab.id
                        ? 'bg-[#d0d0c8] border-white border-r-[#404040] font-bold z-10 relative -mb-px'
                        : 'bg-gray-200 border-gray-300 border-b-gray-400 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Frame */}
              <div className="flex-1 bg-[#d0d0c8] win2k-border-inset p-4 flex flex-col gap-3 min-h-[360px] overflow-y-auto win2k-scroll">
                
                {/* ══════════════════════════════════ */}
                {/* Tab 1: Music Track                 */}
                {/* ══════════════════════════════════ */}
                {activeTab === 'music' && (
                  <div className="flex flex-col gap-3 text-[11px]">
                    <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider">Upload New Music Track</div>
                    
                    <div className="flex gap-3">
                      {/* Cover Art Preview */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 border border-gray-400 bg-black overflow-hidden flex items-center justify-center flex-shrink-0">
                          {uploadTrackCoverPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={uploadTrackCoverPreview} alt="cover preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-600" fill="currentColor">
                              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="12" cy="12" r="4" />
                              <circle cx="12" cy="12" r="1.5" fill="#000" />
                            </svg>
                          )}
                        </div>
                        <label className="font-bold text-gray-600 text-[9px] cursor-pointer hover:text-blue-900 text-center leading-tight">
                          Cover Art<br />(optional)
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const f = e.target.files[0];
                                setUploadTrackCoverFile(f);
                                setUploadTrackCoverPreview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Track fields */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-700">Track Title:</label>
                          <input
                            type="text"
                            placeholder="e.g. malice_demo"
                            className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans"
                            value={uploadTrackTitle}
                            onChange={(e) => setUploadTrackTitle(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1 flex flex-col gap-1">
                            <label className="font-bold text-gray-700">Artist:</label>
                            <input
                              type="text"
                              placeholder="Chrome Heaven"
                              className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans"
                              value={uploadTrackArtist}
                              onChange={(e) => setUploadTrackArtist(e.target.value)}
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <label className="font-bold text-gray-700">Genre:</label>
                            <input
                              type="text"
                              placeholder="Dreamcore"
                              className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans"
                              value={uploadTrackGenre}
                              onChange={(e) => setUploadTrackGenre(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-700">Audio File (WAV, MP3):</label>
                      <input
                        type="file"
                        accept="audio/*"
                        className="w-full text-xs"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setUploadTrackFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>

                    {uploadTrackStatus.text && (
                      <div className={`p-2 border font-mono text-[10px] ${
                        uploadTrackStatus.type === 'success' ? 'bg-green-100 border-green-500 text-green-900' : 'bg-orange-100 border-orange-500 text-orange-950'
                      }`}>
                        {uploadTrackStatus.text}
                      </div>
                    )}

                    <div className="mt-auto flex justify-between items-center pt-2">
                      <span className="text-[10px] text-gray-500 italic">Self-host files locally</span>
                      <button
                        className="win2k-btn font-bold px-4 py-1.5"
                        onClick={async () => {
                          if (!uploadTrackTitle || !uploadTrackFile) {
                            alert('Please provide a title and select an audio file.');
                            return;
                          }
                          setUploadTrackStatus({ type: 'loading', text: 'Processing track...' });
                          
                          const formData = new FormData();
                          formData.append('action', 'upload_track');
                          formData.append('title', uploadTrackTitle);
                          formData.append('artist', uploadTrackArtist);
                          formData.append('genre', uploadTrackGenre);
                          formData.append('file', uploadTrackFile);
                          if (uploadTrackCoverFile) {
                            formData.append('cover', uploadTrackCoverFile);
                          }

                          try {
                            const res = await fetch('/api/content', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              setTracks(data.db.tracks);
                              setUploadTrackStatus({ type: 'success', text: `✓ Track "${uploadTrackTitle}" saved to disk and registered in WMP.` });
                              setUploadTrackTitle('');
                              setUploadTrackFile(null);
                              setUploadTrackCoverFile(null);
                              setUploadTrackCoverPreview(null);
                            } else {
                              throw new Error(data.message || 'API error');
                            }
                          } catch (err: any) {
                            // Fallback simulation
                            const fileUrl = URL.createObjectURL(uploadTrackFile);
                            const coverUrl = uploadTrackCoverFile ? URL.createObjectURL(uploadTrackCoverFile) : undefined;
                            setTracks(prev => [...prev, {
                              id: 'sim_' + Date.now(),
                              title: uploadTrackTitle,
                              artist: uploadTrackArtist,
                              genre: uploadTrackGenre,
                              audioUrl: fileUrl,
                              ...(coverUrl ? { coverUrl } : {})
                            }]);
                            setUploadTrackStatus({ type: 'success', text: `Session Simulation: "${uploadTrackTitle}" registered. (Preview only — run dev server to save to disk)` });
                            setUploadTrackTitle('');
                            setUploadTrackFile(null);
                            setUploadTrackCoverFile(null);
                            setUploadTrackCoverPreview(null);
                          }
                        }}
                      >
                        Upload Track
                      </button>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-300">
                      <div className="font-bold text-gray-700 mb-2">Existing Tracks ({tracks.length})</div>
                      <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto win2k-border-inset p-1 bg-white">
                        {tracks.map(t => (
                          <div key={t.id} className="flex justify-between items-center bg-gray-50 border-b border-gray-200 p-1">
                            <span className="truncate">{t.title} - {t.artist}</span>
                            <button className="win2k-btn bg-red-100 text-red-900 px-2 py-0.5" onClick={() => handleDeleteItem('tracks', t.id)}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════ */}
                {/* Tab 2: Visual / Video              */}
                {/* ══════════════════════════════════ */}
                {activeTab === 'visuals' && (
                  <div className="flex flex-col gap-3 text-[11px]">
                    <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider">Upload Visual, GIF or Video</div>
                    
                    {/* Type selector */}
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-700">File Type:</label>
                      <div className="flex gap-2">
                        {(['image', 'gif', 'video'] as const).map(t => (
                          <label key={t} className="flex items-center gap-1 cursor-pointer capitalize">
                            <input
                              type="radio"
                              name="mediaType"
                              value={t}
                              checked={uploadMediaType === t}
                              onChange={() => { setUploadMediaType(t); setUploadMediaFile(null); }}
                            />
                            {t === 'image' ? 'Image (.png, .jpg)' : t === 'gif' ? 'Animation (.gif)' : 'Video (.mp4, .webm)'}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-700">Display Name:</label>
                        <input
                          type="text"
                          placeholder="e.g. blue_dreams.gif"
                          className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans"
                          value={uploadMediaName}
                          onChange={(e) => setUploadMediaName(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-700">Tag / Theme:</label>
                        <input
                          type="text"
                          placeholder="e.g. Tenerife2026"
                          className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans"
                          value={uploadMediaTag}
                          onChange={(e) => setUploadMediaTag(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-700">Description (optional):</label>
                      <textarea
                        placeholder="Brief description of this visual..."
                        className="p-2 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans resize-none h-[52px]"
                        value={uploadMediaDescription}
                        onChange={(e) => setUploadMediaDescription(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-700">
                        {uploadMediaType === 'video' ? 'Video File (.mp4, .webm):' : uploadMediaType === 'gif' ? 'GIF File (.gif):' : 'Image File (.png, .jpg, .bmp):'}
                      </label>
                      <input
                        key={uploadMediaType}
                        type="file"
                        accept={mediaAccept}
                        className="w-full text-xs"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setUploadMediaFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>

                    {uploadMediaStatus.text && (
                      <div className={`p-2 border font-mono text-[10px] ${
                        uploadMediaStatus.type === 'success' ? 'bg-green-100 border-green-500 text-green-900' : 'bg-orange-100 border-orange-500 text-orange-950'
                      }`}>
                        {uploadMediaStatus.text}
                      </div>
                    )}

                    <div className="mt-auto flex justify-between items-center pt-2">
                      <span className="text-[10px] text-gray-500 italic">Self-host media locally</span>
                      <button
                        className="win2k-btn font-bold px-4 py-1.5"
                        onClick={async () => {
                          if (!uploadMediaName || !uploadMediaFile) {
                            alert('Please provide a name and select a file.');
                            return;
                          }
                          setUploadMediaStatus({ type: 'loading', text: 'Processing...' });

                          const formData = new FormData();
                          formData.append('action', 'upload_image');
                          formData.append('name', uploadMediaName);
                          formData.append('tag', uploadMediaTag);
                          formData.append('description', uploadMediaDescription);
                          formData.append('type', uploadMediaType);
                          formData.append('file', uploadMediaFile);

                          try {
                            const res = await fetch('/api/content', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              setGalleryItems(data.db.gallery);
                              setUploadMediaStatus({ type: 'success', text: `✓ "${uploadMediaName}" saved to disk and registered in Visuals folder.` });
                              setUploadMediaName('');
                              setUploadMediaTag('');
                              setUploadMediaDescription('');
                              setUploadMediaFile(null);
                            } else {
                              throw new Error(data.message || 'API error');
                            }
                          } catch (err: any) {
                            // Fallback simulation
                            const fileUrl = URL.createObjectURL(uploadMediaFile);
                            setGalleryItems(prev => [...prev, {
                              id: 'sim_' + Date.now(),
                              name: uploadMediaName,
                              src: fileUrl,
                              tag: uploadMediaTag || 'visual',
                              type: uploadMediaType,
                              ...(uploadMediaDescription ? { description: uploadMediaDescription } : {})
                            }]);
                            setUploadMediaStatus({ type: 'success', text: `Session Simulation: "${uploadMediaName}" registered. (Preview only — run dev server to save to disk)` });
                            setUploadMediaName('');
                            setUploadMediaTag('');
                            setUploadMediaDescription('');
                            setUploadMediaFile(null);
                          }
                        }}
                      >
                        Upload
                      </button>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-300">
                      <div className="font-bold text-gray-700 mb-2">Existing Visuals ({galleryItems.length})</div>
                      <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto win2k-border-inset p-1 bg-white">
                        {galleryItems.map(g => (
                          <div key={g.id} className="flex justify-between items-center bg-gray-50 border-b border-gray-200 p-1">
                            <span className="truncate">{g.name} [{g.type}]</span>
                            <button className="win2k-btn bg-red-100 text-red-900 px-2 py-0.5" onClick={() => handleDeleteItem('gallery', g.id)}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════ */}
                {/* Tab 3: Diary Post                  */}
                {/* ══════════════════════════════════ */}
                {activeTab === 'blog' && (
                  <div className="flex flex-col gap-3 text-[11px] flex-1">
                    <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider">Publish New Diary Post</div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-700">Entry Title:</label>
                        <input
                          type="text"
                          placeholder="Title of your post..."
                          className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                      </div>
                      <div className="w-[100px] flex flex-col gap-1">
                        <label className="font-bold text-gray-700">Date:</label>
                        <input
                          type="text"
                          className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-mono text-center"
                          value={newPostDate}
                          onChange={(e) => setNewPostDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 min-h-[120px]">
                      <label className="font-bold text-gray-700">Entry Content:</label>
                      <textarea
                        placeholder="Write your entry text here..."
                        className="flex-1 p-2 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans resize-none win2k-scroll min-h-[100px]"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-700">Attach Image:</label>
                        <select
                          className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs"
                          value={newPostAttachedImage}
                          onChange={(e) => setNewPostAttachedImage(e.target.value)}
                        >
                          <option value="">(None)</option>
                          {galleryItems.map(item => (
                            <option key={item.id} value={item.src}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-700">Attach Music Track:</label>
                        <select
                          className="px-2 py-1 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs"
                          value={newPostAttachedAudio}
                          onChange={(e) => setNewPostAttachedAudio(e.target.value)}
                        >
                          <option value="">(None)</option>
                          {tracks.map(track => (
                            <option key={track.id} value={track.audioUrl}>{track.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {newPostStatus.text && (
                      <div className={`p-2 border font-mono text-[10px] ${
                        newPostStatus.type === 'success' ? 'bg-green-100 border-green-500 text-green-900' : 'bg-orange-100 border-orange-500 text-orange-950'
                      }`}>
                        {newPostStatus.text}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 mt-auto">
                      <button
                        className="win2k-btn bg-red-100 border-red-400 text-red-950 font-bold px-3 py-1"
                        onClick={() => { setIsLoggedOn(false); setPassword(''); }}
                      >
                        Log Off
                      </button>
                      <button
                        className="win2k-btn font-bold px-4 py-1.5"
                        onClick={async () => {
                          if (!newPostTitle || !newPostContent) {
                            alert('Please provide a title and content.');
                            return;
                          }
                          setNewPostStatus({ type: 'loading', text: 'Saving post...' });

                          const formData = new FormData();
                          formData.append('action', 'create_post');
                          formData.append('title', newPostTitle);
                          formData.append('date', newPostDate);
                          formData.append('content', newPostContent);
                          formData.append('imageSrc', newPostAttachedImage);
                          formData.append('audioSrc', newPostAttachedAudio);

                          try {
                            const res = await fetch('/api/content', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              setPosts(data.db.posts);
                              setNewPostStatus({ type: 'success', text: `✓ Post "${newPostTitle}" published to disk!` });
                              setNewPostTitle('');
                              setNewPostContent('');
                              setNewPostAttachedImage('');
                              setNewPostAttachedAudio('');
                            } else {
                              throw new Error(data.message || 'API error');
                            }
                          } catch (err: any) {
                            const simulatedId = 'sim_p_' + Date.now();
                            setPosts(prev => [{ id: simulatedId, title: newPostTitle, date: newPostDate || new Date().toISOString().split('T')[0], content: newPostContent, imageSrc: newPostAttachedImage, audioSrc: newPostAttachedAudio }, ...prev]);
                            setNewPostStatus({ type: 'success', text: `Session Simulation: Post added. (Preview only — run dev server to save to disk)` });
                            setNewPostTitle('');
                            setNewPostContent('');
                            setNewPostAttachedImage('');
                            setNewPostAttachedAudio('');
                          }
                        }}
                      >
                        Publish Post
                      </button>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-300">
                      <div className="font-bold text-gray-700 mb-2">Existing Posts ({posts.length})</div>
                      <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto win2k-border-inset p-1 bg-white">
                        {posts.map(p => (
                          <div key={p.id} className="flex justify-between items-center bg-gray-50 border-b border-gray-200 p-1">
                            <span className="truncate">{p.title} - {p.date}</span>
                            <button className="win2k-btn bg-red-100 text-red-900 px-2 py-0.5" onClick={() => handleDeleteItem('posts', p.id)}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════ */}
                {/* Tab 4: Settings (Wallpaper)        */}
                {/* ══════════════════════════════════ */}
                {activeTab === 'settings' && (
                  <div className="flex flex-col gap-3 text-[11px]">
                    <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider">Display Settings — Admin Desktop</div>
                    
                    <p className="text-[10px] text-gray-600 italic">Select a background for the admin desktop. Your choice will be saved automatically in this browser.</p>

                    <div className="grid grid-cols-2 gap-2">
                      {WALLPAPERS.map(wp => {
                        const isSelected = wallpaper.id === wp.id;
                        return (
                          <button
                            key={wp.id}
                            className={`flex items-center gap-2 p-2 border-2 text-left text-[11px] ${
                              isSelected
                                ? 'border-blue-900 bg-blue-50 font-bold'
                                : 'border-gray-300 bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => applyWallpaper(wp)}
                          >
                            {/* Swatch */}
                            <div
                              className="w-8 h-8 flex-shrink-0 border border-gray-400"
                              style={
                                wp.type === 'color'
                                  ? { backgroundColor: wp.value }
                                  : wp.type === 'tile'
                                  ? { backgroundImage: wp.value, backgroundRepeat: 'repeat', backgroundSize: '16px' }
                                  : { backgroundImage: wp.value, backgroundSize: 'cover', backgroundPosition: 'center' }
                              }
                            />
                            <span>{wp.name}</span>
                            {isSelected && <span className="ml-auto text-blue-900">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 text-[10px] text-gray-500 border-t pt-2">
                      <div className="font-bold mb-1">Current wallpaper:</div>
                      <div
                        className="h-12 border border-gray-400"
                        style={bgStyle}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Taskbar indicator inside window frame */}
            <div className="win2k-status-bar select-none">
              <div className="win2k-status-field">Admin Session: Active</div>
              <div className="win2k-status-field">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
