import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  // Check if we are running in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Writing content is only supported during local development (npm run dev). In production, data changes must be committed to the repository.' 
      },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;

    const dbPath = path.join(process.cwd(), 'public', 'content.json');
    
    // Read current content.json
    let dbContent: { tracks: any[]; gallery: any[]; posts: any[] } = {
      tracks: [],
      gallery: [],
      posts: []
    };

    try {
      const dbRaw = await fs.readFile(dbPath, 'utf-8');
      dbContent = JSON.parse(dbRaw);
    } catch (e) {
      // If content.json doesn't exist, we'll start with empty and write it
    }

    // ─────────────────────────────────────────────────────────
    // CREATE: Upload Track
    // ─────────────────────────────────────────────────────────
    if (action === 'upload_track') {
      const title = formData.get('title') as string;
      const artist = formData.get('artist') as string;
      const genre = formData.get('genre') as string;
      const file = formData.get('file') as File;
      const coverFile = formData.get('cover') as File | null;

      if (!file || !title) {
        return NextResponse.json({ success: false, message: 'Missing file or title' }, { status: 400 });
      }

      // Generate a clean filename
      const cleanFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uploadDir = path.join(process.cwd(), 'public', 'audio');
      
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, cleanFilename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const audioUrl = `/audio/${cleanFilename}`;
      const id = cleanFilename.split('.')[0].toLowerCase() + '_' + Date.now();

      // Handle optional cover art
      let coverUrl: string | undefined;
      if (coverFile && coverFile.size > 0) {
        const coverDir = path.join(process.cwd(), 'public', 'images', 'covers');
        await fs.mkdir(coverDir, { recursive: true });
        const cleanCoverFilename = coverFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const coverPath = path.join(coverDir, cleanCoverFilename);
        const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
        await fs.writeFile(coverPath, coverBuffer);
        coverUrl = `/images/covers/${cleanCoverFilename}`;
      }

      const newTrack = {
        id,
        title,
        artist: artist || 'Chrome Heaven',
        genre: genre || 'Electronic',
        audioUrl,
        ...(coverUrl ? { coverUrl } : {})
      };

      dbContent.tracks.push(newTrack);
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      return NextResponse.json({ success: true, track: newTrack, db: dbContent });
    } 
    
    // ─────────────────────────────────────────────────────────
    // UPDATE: Edit Track metadata
    // ─────────────────────────────────────────────────────────
    else if (action === 'update_track') {
      const id = formData.get('id') as string;
      const title = formData.get('title') as string;
      const artist = formData.get('artist') as string;
      const genre = formData.get('genre') as string;

      if (!id) {
        return NextResponse.json({ success: false, message: 'Missing track id' }, { status: 400 });
      }

      const idx = dbContent.tracks.findIndex((t: any) => t.id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Track not found' }, { status: 404 });
      }

      dbContent.tracks[idx] = {
        ...dbContent.tracks[idx],
        ...(title ? { title } : {}),
        ...(artist ? { artist } : {}),
        ...(genre ? { genre } : {})
      };

      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');
      return NextResponse.json({ success: true, db: dbContent });
    }

    // ─────────────────────────────────────────────────────────
    // DELETE: Remove Track
    // ─────────────────────────────────────────────────────────
    else if (action === 'delete_track') {
      const id = formData.get('id') as string;
      if (!id) {
        return NextResponse.json({ success: false, message: 'Missing track id' }, { status: 400 });
      }

      const track = dbContent.tracks.find((t: any) => t.id === id);
      if (!track) {
        return NextResponse.json({ success: false, message: 'Track not found' }, { status: 404 });
      }

      // Remove from db
      dbContent.tracks = dbContent.tracks.filter((t: any) => t.id !== id);
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      // Optionally delete the audio file (only if it's inside /public/audio and not used by other tracks)
      if (track.audioUrl && track.audioUrl.startsWith('/audio/')) {
        const audioFilename = track.audioUrl.replace('/audio/', '');
        const stillUsed = dbContent.tracks.some((t: any) => t.audioUrl === track.audioUrl);
        if (!stillUsed) {
          try {
            await fs.unlink(path.join(process.cwd(), 'public', 'audio', audioFilename));
          } catch (_) { /* File may not exist, ignore */ }
        }
      }

      return NextResponse.json({ success: true, db: dbContent });
    }
    
    // ─────────────────────────────────────────────────────────
    // CREATE: Upload Image/Visual
    // ─────────────────────────────────────────────────────────
    else if (action === 'upload_image') {
      const name = formData.get('name') as string;
      const tag = formData.get('tag') as string;
      const description = formData.get('description') as string;
      const type = (formData.get('type') as string) || 'image';
      const file = formData.get('file') as File;

      if (!file || !name) {
        return NextResponse.json({ success: false, message: 'Missing file or name' }, { status: 400 });
      }

      // Determine upload directory by type
      const cleanFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uploadDir = type === 'video'
        ? path.join(process.cwd(), 'public', 'videos')
        : path.join(process.cwd(), 'public', 'images');
      
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, cleanFilename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const src = type === 'video' ? `/videos/${cleanFilename}` : `/images/${cleanFilename}`;
      const id = 'g_' + cleanFilename.split('.')[0].toLowerCase() + '_' + Date.now();

      const newImage = {
        id,
        name,
        src,
        tag: tag || 'visual',
        type: type as 'image' | 'video' | 'gif',
        ...(description ? { description } : {})
      };

      dbContent.gallery.push(newImage);
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      return NextResponse.json({ success: true, image: newImage, db: dbContent });
    }

    // ─────────────────────────────────────────────────────────
    // UPDATE: Edit Gallery Item metadata
    // ─────────────────────────────────────────────────────────
    else if (action === 'update_image') {
      const id = formData.get('id') as string;
      const name = formData.get('name') as string;
      const tag = formData.get('tag') as string;
      const description = formData.get('description') as string;

      if (!id) {
        return NextResponse.json({ success: false, message: 'Missing image id' }, { status: 400 });
      }

      const idx = dbContent.gallery.findIndex((g: any) => g.id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Gallery item not found' }, { status: 404 });
      }

      dbContent.gallery[idx] = {
        ...dbContent.gallery[idx],
        ...(name ? { name } : {}),
        ...(tag ? { tag } : {}),
        description: description || ''
      };

      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');
      return NextResponse.json({ success: true, db: dbContent });
    }

    // ─────────────────────────────────────────────────────────
    // DELETE: Remove Gallery Item
    // ─────────────────────────────────────────────────────────
    else if (action === 'delete_image') {
      const id = formData.get('id') as string;
      if (!id) {
        return NextResponse.json({ success: false, message: 'Missing image id' }, { status: 400 });
      }

      const item = dbContent.gallery.find((g: any) => g.id === id);
      if (!item) {
        return NextResponse.json({ success: false, message: 'Gallery item not found' }, { status: 404 });
      }

      dbContent.gallery = dbContent.gallery.filter((g: any) => g.id !== id);
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      // Optionally delete the file
      if (item.src) {
        const relativePath = item.src.startsWith('/') ? item.src.slice(1) : item.src;
        const stillUsed = dbContent.gallery.some((g: any) => g.src === item.src);
        if (!stillUsed) {
          try {
            await fs.unlink(path.join(process.cwd(), 'public', relativePath));
          } catch (_) { /* ignore */ }
        }
      }

      return NextResponse.json({ success: true, db: dbContent });
    }
    
    // ─────────────────────────────────────────────────────────
    // CREATE: New Blog Post
    // ─────────────────────────────────────────────────────────
    else if (action === 'create_post') {
      const title = formData.get('title') as string;
      const date = formData.get('date') as string;
      const content = formData.get('content') as string;
      const imageSrc = formData.get('imageSrc') as string;
      const audioSrc = formData.get('audioSrc') as string;

      if (!title || !content) {
        return NextResponse.json({ success: false, message: 'Missing title or content' }, { status: 400 });
      }

      const id = 'post_' + Date.now();
      const newPost = {
        id,
        title,
        date: date || new Date().toISOString().split('T')[0],
        content,
        imageSrc: imageSrc || '',
        audioSrc: audioSrc || ''
      };

      dbContent.posts.unshift(newPost);
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      return NextResponse.json({ success: true, post: newPost, db: dbContent });
    }

    // ─────────────────────────────────────────────────────────
    // UPDATE: Edit Blog Post
    // ─────────────────────────────────────────────────────────
    else if (action === 'update_post') {
      const id = formData.get('id') as string;
      const title = formData.get('title') as string;
      const date = formData.get('date') as string;
      const content = formData.get('content') as string;
      const imageSrc = formData.get('imageSrc') as string;
      const audioSrc = formData.get('audioSrc') as string;

      if (!id) {
        return NextResponse.json({ success: false, message: 'Missing post id' }, { status: 400 });
      }

      const idx = dbContent.posts.findIndex((p: any) => p.id === id);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
      }

      dbContent.posts[idx] = {
        ...dbContent.posts[idx],
        ...(title ? { title } : {}),
        ...(date ? { date } : {}),
        ...(content ? { content } : {}),
        imageSrc: imageSrc ?? dbContent.posts[idx].imageSrc,
        audioSrc: audioSrc ?? dbContent.posts[idx].audioSrc,
      };

      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');
      return NextResponse.json({ success: true, db: dbContent });
    }

    // ─────────────────────────────────────────────────────────
    // DELETE: Remove Blog Post
    // ─────────────────────────────────────────────────────────
    else if (action === 'delete_post') {
      const id = formData.get('id') as string;
      if (!id) {
        return NextResponse.json({ success: false, message: 'Missing post id' }, { status: 400 });
      }

      const exists = dbContent.posts.some((p: any) => p.id === id);
      if (!exists) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
      }

      dbContent.posts = dbContent.posts.filter((p: any) => p.id !== id);
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      return NextResponse.json({ success: true, db: dbContent });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in content API:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
