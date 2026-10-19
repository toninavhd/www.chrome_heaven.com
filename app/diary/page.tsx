'use client';

import { useEffect, useState } from 'react';
import { ChromeHeavenSection } from '../../components/desktop/ChromeHeavenSection';
import { BlogPost } from '../../types';

const FALLBACK_POSTS: BlogPost[] = [
  { id: 'post-demo', title: 'Workinnn on my debut EP or album', date: '2026-09-29', content: 'I just wanna stay home forever doing this.' },
];

export default function DiaryPage() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/content.json');
        const data = await res.json();
        setPosts(data.posts?.length ? data.posts : FALLBACK_POSTS);
      } catch {
        setPosts(FALLBACK_POSTS);
      }
    };

    void load();
  }, []);

  return (
    <ChromeHeavenSection title="diary" subtitle="journal entries" accent="#ff4fa0">
      <div style={{ display: 'grid', gap: 18 }}>
        {posts.map((post) => (
          <article key={post.id} style={{ padding: 22, borderRadius: 18, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.75 }}>{post.date}</div>
            <h2 style={{ margin: '12px 0 10px', fontSize: 'clamp(1.3rem, 2vw, 2rem)', color: '#fff' }}>{post.title}</h2>
            <p style={{ margin: 0, lineHeight: 1.8, opacity: 0.9 }}>{post.content}</p>
          </article>
        ))}
      </div>
    </ChromeHeavenSection>
  );
}
