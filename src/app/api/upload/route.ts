import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const path = join(uploadDir, filename);
    
    // Create uploads directory if it doesn't exist
    try {
      await writeFile(path, buffer);
    } catch (error) {
      // Try to create directory and retry
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path, buffer);
    }

    const imageUrl = `/uploads/${filename}`;
    
    return Response.json({ 
      success: true, 
      imageUrl,
      message: 'File uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}