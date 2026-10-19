'use client';

import { useEffect, useState } from 'react';
import { ChromeHeavenSection } from '../../components/desktop/ChromeHeavenSection';
import { GalleryItem } from '../../types';

const FALLBACK_IMAGES: GalleryItem[] = [
  { id: 'img-1', name: 'hands', src: '/images/49C063D1-581F-45F6-8222-D624965FC247.JPEG', tag: 'edit', type: 'image' },
  { id: 'img-2', name: 'angel_logo.png', src: '/images/Captura_de_pantalla_2026-09-10_143748.png', tag: 'angels', type: 'image' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_IMAGES);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/content.json');
        const data = await res.json();
        setItems(data.gallery?.length ? data.gallery : FALLBACK_IMAGES);
      } catch {
        setItems(FALLBACK_IMAGES);
      }
    };

    void load();
  }, []);

  return (
    <ChromeHeavenSection title="gallery" subtitle="visual archive" accent="#dfe5ef">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {items.map((item) => (
          <div key={item.id} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
            <img src={item.src} alt={item.name} style={{ display: 'block', width: '100%', height: 260, objectFit: 'cover' }} />
            <div style={{ padding: 16 }}>
              <div style={{ textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: 11, opacity: 0.75 }}>{item.tag}</div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </ChromeHeavenSection>
  );
}
