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
        message: 'Writing content is only supported during local development (npm run dev). in production, data changes are simulated in the browser session.' 
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

      dbContent.posts.unshift(newPost); // Add new posts to the beginning
      await fs.writeFile(dbPath, JSON.stringify(dbContent, null, 2), 'utf-8');

      return NextResponse.json({ success: true, post: newPost, db: dbContent });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in content API:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
