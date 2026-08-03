'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ─── Icons ──────────────────────────────────────────────────────────────────

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

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface ConfirmDialog {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WALLPAPERS = [
  { id: 'classic_teal', name: 'Classic Teal', value: '#386ca0', type: 'color' },
  { id: 'deep_violet', name: 'Deep Violet', value: '#120c1f', type: 'color' },
  { id: 'midnight', name: 'Midnight Black', value: '#0a0a0f', type: 'color' },
  { id: 'forest', name: 'Dark Forest', value: '#0d1f0d', type: 'color' },
  { id: 'wine', name: 'Wine Red', value: '#1f0a0a', type: 'color' },
  { id: 'fence', name: 'Fence Tile', value: 'url("https://sadhost.neocities.org/images/tiles/fence.gif")', type: 'tile' },
  { id: 'clouds', name: 'Heavenly Clouds', value: 'url("https://win98icons.alexmeub.com/images/wallpapers/clouds.png")', type: 'cover' },
];

// SHA-256 hash of the admin password (obfuscated, split to avoid trivial grepping)
const _A = '818efe46a6c2ddb9';
const _B = '5df1bdecd7869fbd';
const _C = '6ac790f24182f681';
const _D = 'cc6b7edf43ec7b69';
const ADMIN_HASH = _A + _B + _C + _D;

// ─── Password Verification ───────────────────────────────────────────────────

async function verifyPassword(input: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ADMIN_HASH;
  } catch {
    return false;
  }
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

function Win95ConfirmDialog({ dialog, onClose }: { dialog: ConfirmDialog; onClose: () => void }) {
  if (!dialog.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-[#d0d0c8] win2k-window w-[320px] flex flex-col shadow-2xl">
        {/* Title bar */}
        <div className="win2k-title-bar">
          <div className="flex items-center gap-1.5 font-bold text-[11px] h-full py-0.5 cursor-default">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="#ffdd00"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-3H7V4h2v5z"/></svg>
            {dialog.title}
          </div>
        </div>
        {/* Body */}
        <div className="flex gap-4 p-4 text-[11px] text-black items-start">
          <svg viewBox="0 0 16 16" className="w-8 h-8 flex-shrink-0 text-yellow-600" fill="currentColor">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <p className="leading-relaxed">{dialog.message}</p>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <button
            className="win2k-btn font-bold px-4 py-1 bg-red-50 border-red-300 text-red-900 hover:bg-red-100"
            onClick={() => { dialog.onConfirm(); onClose(); }}
          >
            Yes
          </button>
          <button className="win2k-btn px-4 py-1" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Message ──────────────────────────────────────────────────────────

function StatusMsg({ status }: { status: { type: string; text: string } }) {
  if (!status.text) return null;
  return (
    <div className={`p-2 border font-mono text-[10px] ${
      status.type === 'success' ? 'bg-green-100 border-green-500 text-green-900' : 'bg-orange-100 border-orange-500 text-orange-950'
    }`}>
      {status.text}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedOn, setIsLoggedOn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'music' | 'visuals' | 'blog' | 'settings'>('music');

  // Wallpaper state
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);

  // Database state
  const [tracks, setTracks] = useState<Track[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    open: false, title: '', message: '', onConfirm: () => {}
  });

  // Edit states
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editTrackData, setEditTrackData] = useState<Partial<Track>>({});
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editImageData, setEditImageData] = useState<Partial<GalleryItem>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostData, setEditPostData] = useState<Partial<BlogPost>>({});

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

  // CRUD operation status
  const [crudStatus, setCrudStatus] = useState({ type: '', text: '' });

  // Load wallpaper preference
  useEffect(() => {
    const savedWallpaperId = localStorage.getItem('admin_wallpaper');
    if (savedWallpaperId) {
      const found = WALLPAPERS.find(w => w.id === savedWallpaperId);
      if (found) setWallpaper(found);
    }
  }, []);

  // Load content.json
  const loadContent = useCallback(async () => {
    try {
      const res = await fetch('/content.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.tracks) setTracks(data.tracks);
        if (data.gallery) setGalleryItems(data.gallery);
        if (data.posts) setPosts(data.posts);
      }
    } catch (err) {
      console.warn('Could not load database in admin page.', err);
    }
  }, []);

  useEffect(() => { loadContent(); }, [loadContent]);

  useEffect(() => {
    setNewPostDate(new Date().toISOString().split('T')[0]);
  }, [isLoggedOn]);

  const handleLogon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    const ok = await verifyPassword(password);
    if (ok) {
      setIsLoggedOn(true);
    } else {
      setLoginError('The password you entered is incorrect. Access denied.');
      setPassword('');
    }
  };

  const applyWallpaper = (wp: typeof WALLPAPERS[0]) => {
    setWallpaper(wp);
    localStorage.setItem('admin_wallpaper', wp.id);
  };

  const bgStyle: React.CSSProperties = wallpaper.type === 'color'
    ? { backgroundColor: wallpaper.value }
    : wallpaper.type === 'tile'
    ? { backgroundImage: wallpaper.value, backgroundRepeat: 'repeat' }
    : { backgroundImage: wallpaper.value, backgroundSize: 'cover', backgroundPosition: 'center' };

  const mediaAccept = uploadMediaType === 'video' ? 'video/*' : uploadMediaType === 'gif' ? 'image/gif' : 'image/*';

  const TABS: { id: 'music' | 'visuals' | 'blog' | 'settings'; label: string }[] = [
    { id: 'music', label: '♪ Music' },
    { id: 'visuals', label: '◈ Visuals' },
    { id: 'blog', label: '✎ Diary' },
    { id: 'settings', label: '⚙ Settings' },
  ];

  // ── Generic API call helper ──────────────────────────────────────────────

  const callApi = async (formData: FormData): Promise<any> => {
    const res = await fetch('/api/content', { method: 'POST', body: formData });
    return res.json();
  };

  // ── Delete handlers ──────────────────────────────────────────────────────

  const confirmDelete = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const handleDeleteTrack = (track: Track) => {
    confirmDelete(
      'Confirm Delete',
      `Delete track "${track.title}"? This will remove it from the database and delete the audio file if not used elsewhere.`,
      async () => {
        try {
          const fd = new FormData();
          fd.append('action', 'delete_track');
          fd.append('id', track.id);
          const data = await callApi(fd);
          if (data.success) {
            setTracks(data.db.tracks);
            setCrudStatus({ type: 'success', text: `✓ Track "${track.title}" deleted.` });
          } else {
            // Fallback: remove from local state only
            setTracks(prev => prev.filter(t => t.id !== track.id));
            setCrudStatus({ type: 'success', text: `Removed "${track.title}" from session. Commit content.json manually.` });
          }
        } catch {
          setTracks(prev => prev.filter(t => t.id !== track.id));
          setCrudStatus({ type: 'success', text: `Removed "${track.title}" from session. Commit content.json manually.` });
        }
      }
    );
  };

  const handleDeleteImage = (item: GalleryItem) => {
    confirmDelete(
      'Confirm Delete',
      `Delete "${item.name}" from the gallery? The file will be removed from disk if not used elsewhere.`,
      async () => {
        try {
          const fd = new FormData();
          fd.append('action', 'delete_image');
          fd.append('id', item.id);
          const data = await callApi(fd);
          if (data.success) {
            setGalleryItems(data.db.gallery);
            setCrudStatus({ type: 'success', text: `✓ "${item.name}" deleted from gallery.` });
          } else {
            setGalleryItems(prev => prev.filter(g => g.id !== item.id));
            setCrudStatus({ type: 'success', text: `Removed "${item.name}" from session. Commit content.json manually.` });
          }
        } catch {
          setGalleryItems(prev => prev.filter(g => g.id !== item.id));
          setCrudStatus({ type: 'success', text: `Removed "${item.name}" from session. Commit content.json manually.` });
        }
      }
    );
  };

  const handleDeletePost = (post: BlogPost) => {
    confirmDelete(
      'Confirm Delete',
      `Delete diary post "${post.title}"? This action cannot be undone.`,
      async () => {
        try {
          const fd = new FormData();
          fd.append('action', 'delete_post');
          fd.append('id', post.id);
          const data = await callApi(fd);
          if (data.success) {
            setPosts(data.db.posts);
            setCrudStatus({ type: 'success', text: `✓ Post "${post.title}" deleted.` });
          } else {
            setPosts(prev => prev.filter(p => p.id !== post.id));
            setCrudStatus({ type: 'success', text: `Removed "${post.title}" from session. Commit content.json manually.` });
          }
        } catch {
          setPosts(prev => prev.filter(p => p.id !== post.id));
          setCrudStatus({ type: 'success', text: `Removed "${post.title}" from session. Commit content.json manually.` });
        }
      }
    );
  };

  // ── Update handlers ──────────────────────────────────────────────────────

  const handleUpdateTrack = async (id: string) => {
    try {
      const fd = new FormData();
      fd.append('action', 'update_track');
      fd.append('id', id);
      if (editTrackData.title) fd.append('title', editTrackData.title);
      if (editTrackData.artist) fd.append('artist', editTrackData.artist);
      if (editTrackData.genre) fd.append('genre', editTrackData.genre);
      const data = await callApi(fd);
      if (data.success) {
        setTracks(data.db.tracks);
      } else {
        setTracks(prev => prev.map(t => t.id === id ? { ...t, ...editTrackData } : t));
      }
    } catch {
      setTracks(prev => prev.map(t => t.id === id ? { ...t, ...editTrackData } : t));
    }
    setEditingTrackId(null);
    setCrudStatus({ type: 'success', text: `✓ Track updated.` });
  };

  const handleUpdateImage = async (id: string) => {
    try {
      const fd = new FormData();
      fd.append('action', 'update_image');
      fd.append('id', id);
      if (editImageData.name) fd.append('name', editImageData.name);
      if (editImageData.tag) fd.append('tag', editImageData.tag);
      fd.append('description', editImageData.description ?? '');
      const data = await callApi(fd);
      if (data.success) {
        setGalleryItems(data.db.gallery);
      } else {
        setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, ...editImageData } : g));
      }
    } catch {
      setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, ...editImageData } : g));
    }
    setEditingImageId(null);
    setCrudStatus({ type: 'success', text: `✓ Gallery item updated.` });
  };

  const handleUpdatePost = async (id: string) => {
    try {
      const fd = new FormData();
      fd.append('action', 'update_post');
      fd.append('id', id);
      if (editPostData.title) fd.append('title', editPostData.title);
      if (editPostData.date) fd.append('date', editPostData.date);
      if (editPostData.content) fd.append('content', editPostData.content);
      fd.append('imageSrc', editPostData.imageSrc ?? '');
      fd.append('audioSrc', editPostData.audioSrc ?? '');
      const data = await callApi(fd);
      if (data.success) {
        setPosts(data.db.posts);
      } else {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, ...editPostData } : p));
      }
    } catch {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, ...editPostData } : p));
    }
    setEditingPostId(null);
    setCrudStatus({ type: 'success', text: `✓ Post updated.` });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col font-sans select-none" style={bgStyle}>
      
      {/* ── Confirm Dialog ── */}
      <Win95ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog(d => ({ ...d, open: false }))}
      />

      {!isLoggedOn ? (
        /* ─────────────── LOGIN SCREEN ─────────────── */
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
                      autoFocus
                      className="flex-1 px-2 py-0.5 bg-white border border-gray-400 text-black text-xs win2k-border-inset outline-none"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                    />
                  </div>
                  {loginError && (
                    <div className="text-[10px] text-red-700 font-mono border border-red-300 bg-red-50 px-2 py-1">
                      {loginError}
                    </div>
                  )}
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
        /* ─────────────── ADMIN PANEL ─────────────── */
        <div className="flex-1 relative p-4 flex items-center justify-center overflow-auto">
          
          <div className="w-full max-w-[720px] bg-[#d0d0c8] win2k-window flex flex-col">
            
            {/* Title Bar */}
            <div className="win2k-title-bar">
              <div className="flex items-center gap-1.5 font-bold text-[11px] truncate flex-1 h-full py-0.5 cursor-default">
                <div className="w-4 h-4 scale-75 flex-shrink-0 flex items-center justify-center">
                  <AdminIcon />
                </div>
                <span>Content Manager — System Administration</span>
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
                    onClick={() => { setActiveTab(tab.id); setCrudStatus({ type: '', text: '' }); }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Frame */}
              <div className="flex-1 bg-[#d0d0c8] win2k-border-inset p-3 flex flex-col gap-3 min-h-[420px] max-h-[520px] overflow-y-auto win2k-scroll">
                
                {/* Global CRUD status */}
                {crudStatus.text && <StatusMsg status={crudStatus} />}

                {/* ══════════════════════════════════════════ */}
                {/* Tab 1: Music                               */}
                {/* ══════════════════════════════════════════ */}
                {activeTab === 'music' && (
                  <div className="flex flex-col gap-3 text-[11px]">
                    
                    {/* ── Existing Tracks List ── */}
                    <div>
                      <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider mb-2">
                        Library — {tracks.length} track{tracks.length !== 1 ? 's' : ''}
                      </div>
                      {tracks.length === 0 ? (
                        <div className="text-gray-500 italic text-[10px] py-2">No tracks in database.</div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {tracks.map(track => (
                            <div key={track.id} className="border border-gray-300 bg-white">
                              {editingTrackId === track.id ? (
                                /* ── Edit row ── */
                                <div className="p-2 flex flex-col gap-1.5">
                                  <div className="flex gap-2">
                                    <input
                                      className="flex-1 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editTrackData.title ?? track.title}
                                      onChange={e => setEditTrackData(d => ({ ...d, title: e.target.value }))}
                                      placeholder="Title"
                                    />
                                    <input
                                      className="w-28 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editTrackData.artist ?? track.artist}
                                      onChange={e => setEditTrackData(d => ({ ...d, artist: e.target.value }))}
                                      placeholder="Artist"
                                    />
                                    <input
                                      className="w-28 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editTrackData.genre ?? track.genre}
                                      onChange={e => setEditTrackData(d => ({ ...d, genre: e.target.value }))}
                                      placeholder="Genre"
                                    />
                                  </div>
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      className="win2k-btn flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-green-900 bg-green-50 border-green-400"
                                      onClick={() => handleUpdateTrack(track.id)}
                                    >
                                      <SaveIcon /> Save
                                    </button>
                                    <button
                                      className="win2k-btn px-2 py-0.5 text-[10px]"
                                      onClick={() => { setEditingTrackId(null); setEditTrackData({}); }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* ── Display row ── */
                                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 group">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  {track.coverUrl && <img src={track.coverUrl} alt="" className="w-6 h-6 object-cover border border-gray-300 flex-shrink-0" />}
                                  {!track.coverUrl && (
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 flex-shrink-0" fill="currentColor">
                                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                      <circle cx="12" cy="12" r="4" />
                                      <circle cx="12" cy="12" r="1.5" fill="#fff" />
                                    </svg>
                                  )}
                                  <span className="flex-1 font-semibold truncate">{track.title}</span>
                                  <span className="text-gray-500 w-24 truncate">{track.artist}</span>
                                  <span className="text-gray-400 w-24 truncate">{track.genre}</span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-blue-900"
                                      onClick={() => { setEditingTrackId(track.id); setEditTrackData({ title: track.title, artist: track.artist, genre: track.genre }); }}
                                      title="Edit"
                                    >
                                      <EditIcon /> Edit
                                    </button>
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-red-800 bg-red-50 border-red-300"
                                      onClick={() => handleDeleteTrack(track)}
                                      title="Delete"
                                    >
                                      <TrashIcon /> Del
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── Upload New Track ── */}
                    <div className="border-t border-gray-400 pt-3">
                      <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider mb-2">Upload New Track</div>
                      
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

                      <div className="flex flex-col gap-1 mt-2">
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

                      <StatusMsg status={uploadTrackStatus} />

                      <div className="mt-2 flex justify-between items-center pt-1">
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
                                setUploadTrackStatus({ type: 'success', text: `✓ Track "${uploadTrackTitle}" saved to disk and registered.` });
                                setUploadTrackTitle('');
                                setUploadTrackFile(null);
                                setUploadTrackCoverFile(null);
                                setUploadTrackCoverPreview(null);
                              } else {
                                throw new Error(data.message || 'API error');
                              }
                            } catch {
                              // Fallback simulation
                              const fileUrl = uploadTrackFile ? URL.createObjectURL(uploadTrackFile) : '';
                              const coverUrl = uploadTrackCoverFile ? URL.createObjectURL(uploadTrackCoverFile) : undefined;
                              setTracks(prev => [...prev, {
                                id: 'sim_' + Date.now(),
                                title: uploadTrackTitle,
                                artist: uploadTrackArtist,
                                genre: uploadTrackGenre,
                                audioUrl: fileUrl,
                                ...(coverUrl ? { coverUrl } : {})
                              }]);
                              setUploadTrackStatus({ type: 'success', text: `Session only: "${uploadTrackTitle}" registered. Commit content.json to persist.` });
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
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════════════ */}
                {/* Tab 2: Visuals                             */}
                {/* ══════════════════════════════════════════ */}
                {activeTab === 'visuals' && (
                  <div className="flex flex-col gap-3 text-[11px]">

                    {/* ── Gallery List ── */}
                    <div>
                      <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider mb-2">
                        Gallery — {galleryItems.length} item{galleryItems.length !== 1 ? 's' : ''}
                      </div>
                      {galleryItems.length === 0 ? (
                        <div className="text-gray-500 italic text-[10px] py-2">No gallery items in database.</div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {galleryItems.map(item => (
                            <div key={item.id} className="border border-gray-300 bg-white">
                              {editingImageId === item.id ? (
                                /* ── Edit row ── */
                                <div className="p-2 flex flex-col gap-1.5">
                                  <div className="flex gap-2">
                                    <input
                                      className="flex-1 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editImageData.name ?? item.name}
                                      onChange={e => setEditImageData(d => ({ ...d, name: e.target.value }))}
                                      placeholder="Display name"
                                    />
                                    <input
                                      className="w-28 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editImageData.tag ?? item.tag}
                                      onChange={e => setEditImageData(d => ({ ...d, tag: e.target.value }))}
                                      placeholder="Tag"
                                    />
                                  </div>
                                  <input
                                    className="w-full px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                    value={editImageData.description ?? item.description ?? ''}
                                    onChange={e => setEditImageData(d => ({ ...d, description: e.target.value }))}
                                    placeholder="Description (optional)"
                                  />
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-green-900 bg-green-50 border-green-400"
                                      onClick={() => handleUpdateImage(item.id)}
                                    >
                                      <SaveIcon /> Save
                                    </button>
                                    <button
                                      className="win2k-btn px-2 py-0.5 text-[10px]"
                                      onClick={() => { setEditingImageId(null); setEditImageData({}); }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* ── Display row ── */
                                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 group">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={item.src} alt={item.name} className="w-8 h-8 object-cover border border-gray-300 flex-shrink-0 bg-black" />
                                  <span className="flex-1 font-semibold truncate">{item.name}</span>
                                  <span className="text-gray-500 w-20 truncate">{item.tag}</span>
                                  <span className="text-gray-400 text-[10px] w-12">{item.type ?? 'image'}</span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-blue-900"
                                      onClick={() => { setEditingImageId(item.id); setEditImageData({ name: item.name, tag: item.tag, description: item.description }); }}
                                      title="Edit"
                                    >
                                      <EditIcon /> Edit
                                    </button>
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-red-800 bg-red-50 border-red-300"
                                      onClick={() => handleDeleteImage(item)}
                                      title="Delete"
                                    >
                                      <TrashIcon /> Del
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── Upload New Visual ── */}
                    <div className="border-t border-gray-400 pt-3">
                      <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider mb-2">Upload Visual, GIF or Video</div>
                      
                      {/* Type selector */}
                      <div className="flex flex-col gap-1 mb-2">
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

                      <div className="flex gap-2 mb-2">
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

                      <div className="flex flex-col gap-1 mb-2">
                        <label className="font-bold text-gray-700">Description (optional):</label>
                        <textarea
                          placeholder="Brief description of this visual..."
                          className="p-2 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans resize-none h-[44px]"
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

                      <StatusMsg status={uploadMediaStatus} />

                      <div className="mt-2 flex justify-between items-center pt-1">
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
                                setUploadMediaStatus({ type: 'success', text: `✓ "${uploadMediaName}" saved to disk and registered.` });
                                setUploadMediaName('');
                                setUploadMediaTag('');
                                setUploadMediaDescription('');
                                setUploadMediaFile(null);
                              } else {
                                throw new Error(data.message || 'API error');
                              }
                            } catch {
                              const fileUrl = uploadMediaFile ? URL.createObjectURL(uploadMediaFile) : '';
                              setGalleryItems(prev => [...prev, {
                                id: 'sim_' + Date.now(),
                                name: uploadMediaName,
                                src: fileUrl,
                                tag: uploadMediaTag || 'visual',
                                type: uploadMediaType,
                                ...(uploadMediaDescription ? { description: uploadMediaDescription } : {})
                              }]);
                              setUploadMediaStatus({ type: 'success', text: `Session only: "${uploadMediaName}" registered. Commit content.json to persist.` });
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
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════════════ */}
                {/* Tab 3: Diary / Blog                        */}
                {/* ══════════════════════════════════════════ */}
                {activeTab === 'blog' && (
                  <div className="flex flex-col gap-3 text-[11px]">

                    {/* ── Posts List ── */}
                    <div>
                      <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider mb-2">
                        Posts — {posts.length} entr{posts.length !== 1 ? 'ies' : 'y'}
                      </div>
                      {posts.length === 0 ? (
                        <div className="text-gray-500 italic text-[10px] py-2">No diary posts yet.</div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {posts.map(post => (
                            <div key={post.id} className="border border-gray-300 bg-white">
                              {editingPostId === post.id ? (
                                /* ── Edit form ── */
                                <div className="p-2 flex flex-col gap-1.5">
                                  <div className="flex gap-2">
                                    <input
                                      className="flex-1 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white font-bold"
                                      value={editPostData.title ?? post.title}
                                      onChange={e => setEditPostData(d => ({ ...d, title: e.target.value }))}
                                      placeholder="Title"
                                    />
                                    <input
                                      className="w-24 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white font-mono"
                                      value={editPostData.date ?? post.date}
                                      onChange={e => setEditPostData(d => ({ ...d, date: e.target.value }))}
                                      placeholder="Date"
                                    />
                                  </div>
                                  <textarea
                                    className="w-full p-1.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white resize-none h-[80px] win2k-scroll"
                                    value={editPostData.content ?? post.content}
                                    onChange={e => setEditPostData(d => ({ ...d, content: e.target.value }))}
                                    placeholder="Content"
                                  />
                                  <div className="flex gap-2">
                                    <select
                                      className="flex-1 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editPostData.imageSrc ?? post.imageSrc ?? ''}
                                      onChange={e => setEditPostData(d => ({ ...d, imageSrc: e.target.value }))}
                                    >
                                      <option value="">(No image)</option>
                                      {galleryItems.map(item => (
                                        <option key={item.id} value={item.src}>{item.name}</option>
                                      ))}
                                    </select>
                                    <select
                                      className="flex-1 px-1.5 py-0.5 border border-gray-400 win2k-border-inset outline-none text-[11px] bg-white"
                                      value={editPostData.audioSrc ?? post.audioSrc ?? ''}
                                      onChange={e => setEditPostData(d => ({ ...d, audioSrc: e.target.value }))}
                                    >
                                      <option value="">(No audio)</option>
                                      {tracks.map(track => (
                                        <option key={track.id} value={track.audioUrl}>{track.title}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-green-900 bg-green-50 border-green-400"
                                      onClick={() => handleUpdatePost(post.id)}
                                    >
                                      <SaveIcon /> Save
                                    </button>
                                    <button
                                      className="win2k-btn px-2 py-0.5 text-[10px]"
                                      onClick={() => { setEditingPostId(null); setEditPostData({}); }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* ── Display row ── */
                                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 group">
                                  <span className="text-gray-400 font-mono text-[10px] w-20 flex-shrink-0">{post.date}</span>
                                  <span className="flex-1 font-semibold truncate">{post.title}</span>
                                  <span className="text-gray-400 text-[10px] truncate w-32 hidden sm:block">
                                    {post.content.slice(0, 40)}{post.content.length > 40 ? '…' : ''}
                                  </span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-blue-900"
                                      onClick={() => { setEditingPostId(post.id); setEditPostData({ title: post.title, date: post.date, content: post.content, imageSrc: post.imageSrc, audioSrc: post.audioSrc }); }}
                                      title="Edit"
                                    >
                                      <EditIcon /> Edit
                                    </button>
                                    <button
                                      className="win2k-btn flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-red-800 bg-red-50 border-red-300"
                                      onClick={() => handleDeletePost(post)}
                                      title="Delete"
                                    >
                                      <TrashIcon /> Del
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── New Post Form ── */}
                    <div className="border-t border-gray-400 pt-3">
                      <div className="font-bold text-blue-900 border-b pb-1 uppercase tracking-wider mb-2">Publish New Diary Post</div>
                      
                      <div className="flex gap-2 mb-2">
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

                      <div className="flex-1 flex flex-col gap-1 min-h-[80px] mb-2">
                        <label className="font-bold text-gray-700">Entry Content:</label>
                        <textarea
                          placeholder="Write your entry text here..."
                          className="flex-1 p-2 bg-white border border-gray-400 win2k-border-inset outline-none text-black text-xs font-sans resize-none win2k-scroll min-h-[80px]"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 mb-2">
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

                      <StatusMsg status={newPostStatus} />

                      <div className="flex justify-between items-center pt-1">
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
                            } catch {
                              const simulatedId = 'sim_p_' + Date.now();
                              setPosts(prev => [{ id: simulatedId, title: newPostTitle, date: newPostDate || new Date().toISOString().split('T')[0], content: newPostContent, imageSrc: newPostAttachedImage, audioSrc: newPostAttachedAudio }, ...prev]);
                              setNewPostStatus({ type: 'success', text: `Session only: Post added. Commit content.json to persist.` });
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
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════════════ */}
                {/* Tab 4: Settings (Wallpaper)                */}
                {/* ══════════════════════════════════════════ */}
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

            {/* Status Bar */}
            <div className="win2k-status-bar select-none">
              <div className="win2k-status-field">Admin Session: Active</div>
              <div className="win2k-status-field">{tracks.length} tracks · {galleryItems.length} visuals · {posts.length} posts</div>
              <div className="win2k-status-field">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
