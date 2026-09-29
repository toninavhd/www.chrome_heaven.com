import { Track, VisualizerPreset, GalleryItem, BlogPost } from '../types';

export const VISUALIZER_PRESETS: { id: VisualizerPreset; label: string; description: string }[] = [
  { id: 'battery', label: 'Batería: Fog Spectrum', description: 'Niebla psicodélica y barras reactivas WMP' },
  { id: 'mathical', label: 'Batería: Acid Ambience', description: 'Vórtice de humo ácido y lissajous mutantes' },
  { id: 'spectrum', label: 'Batería: Cosmic Nebula', description: 'Túnel warp, estrellas y nebulosa psicodélica' },
];

export const TRACK_SLUG_MAP: { [key: string]: string } = {
  malice: 'malice',
  'bleedmeariver': 'bleedmeariver',
};

export const DEFAULT_TRACKS: Track[] = [
  {
    id: 'nevermind_190bpm_uloe',
    title: 'nevermind 190bpm',
    artist: 'Chrome Heaven',
    album: 'Singles',
    genre: 'Local WAV / 190 BPM',
    audioUrl: '/audio/nevermind_190bpm_uloe.wav',
  },
  {
    id: 'lonelystarr',
    title: 'lonelystarr',
    artist: 'Chrome Heaven',
    album: 'Singles',
    genre: 'Local WAV / Dreamcore',
    audioUrl: '/audio/lonelystarr.wav',
  },
  {
    id: 'malice',
    title: 'ｍａｌｉｃｅ [EP]',
    artist: 'Chrome Heaven',
    album: 'ｍａｌｉｃｅ EP',
    genre: 'Electronic / Dreamcore',
    audioUrl: '',
  },
  {
    id: 'bleedmeariver',
    title: 'BleedMeARiver',
    artist: 'Chrome Heaven',
    album: 'ｍａｌｉｃｅ EP',
    genre: 'Electronic',
    audioUrl: '',
  },
];

export const BATTERY_CELLS = 32;

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', name: 'paris_2023.bmp', src: '/images/gallery_1.png', tag: 'Paris2023' },
  { id: 'g2', name: 'lost_in_fantasy.bmp', src: '/images/gallery_2.png', tag: 'lost-in-a-fantasy' },
  { id: 'g3', name: 'how_to_start_cult.bmp', src: '/images/gallery_3.png', tag: 'how-2-start-a-cult' },
  { id: 'g4', name: 'nothin_2_say.bmp', src: '/images/gallery_4.png', tag: 'nothin-2-say' },
  { id: 'g5', name: 'malice_cover.bmp', src: '/images/malice_ep_cover.png', tag: 'malice' },
  { id: 'g6', name: 'avatar_uloe.bmp', src: '/images/avatar.png', tag: 'uloee' },
];

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post1',
    title: 'Chrome Heaven Portal Upgrade',
    date: '2026-07-15',
    content: 'Welcome to the new Chrome Heaven blog and official portal!\n\nI have redesigned the layout to act as a direct blog and official page. I am transitioning away from external platforms like SoundCloud to host my own music and content.\n\nNow, all music tracks and photography edits will be served directly from this page. You can listen to my new tracks in the Windows Media Player window and view high-quality renders in the Visuals folder. More updates coming soon.',
    imageSrc: '/images/malice_ep_cover.png',
    audioSrc: '/audio/nevermind_190bpm_uloe.wav'
  },
  {
    id: 'post2',
    title: 'lonelystarr.wav Preview',
    date: '2026-07-10',
    content: 'Here is a preview of my upcoming track \'lonelystarr\'. It is a mix of electronic breakcore and dreamcore synth layers.\n\nYou can listen to the full WAV file by opening the Media Player window and selecting \'lonelystarr\' from the playlist, or play it directly from this journal entry. Let me know what you think on my socials!',
    imageSrc: '/images/gallery_2.png',
    audioSrc: '/audio/lonelystarr.wav'
  }
];

export const WALLPAPERS = [
  { id: 'fence', name: 'Fence Tile', value: 'url("https://sadhost.neocities.org/images/tiles/fence.gif")', type: 'tile' },
  { id: 'classic', name: 'Classic Teal', value: '#386ca0', type: 'color' },
  { id: 'clouds', name: 'Heavenly Clouds', value: 'url("https://win98icons.alexmeub.com/images/wallpapers/clouds.png")', type: 'cover' },
  { id: 'violet', name: 'Deep Violet', value: '#120c1f', type: 'color' },
];
