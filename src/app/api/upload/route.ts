import { NextResponse, type NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getAdmin } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Files ko project folder ke BAHAR rakhna hai, warna har deploy par
// git reset / npm run build unhe uda dega.
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/var/www/sathimate-uploads';
const PUBLIC_PREFIX = '/uploads';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: NextRequest) {
  try {
    // ---- 1. Auth: sirf logged-in user hi upload kar sakta hai ----
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await getAdmin();
    let uid: string;
    try {
      const decoded = await admin.auth().verifyIdToken(authorization.split('Bearer ')[1]);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // ---- 2. File nikalo aur validate karo ----
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const blob = file as File;

    if (blob.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 413 });
    }

    const ext = ALLOWED[blob.type];
    if (!ext) {
      return NextResponse.json(
        { error: 'Only JPG, PNG and WebP images are allowed.' },
        { status: 415 }
      );
    }

    // ---- 3. Disk par likho ----
    // Filename hum khud generate karte hain — user ka file.name kabhi use mat karna,
    // warna "../../etc/passwd" jaisa path traversal ho sakta hai.
    const folder = formData.get('folder') === 'covers' ? 'covers' : 'profiles';
    const filename = `${crypto.randomUUID()}.${ext}`;
    const destDir = path.join(UPLOAD_DIR, folder, uid);

    await mkdir(destDir, { recursive: true });
    const buffer = Buffer.from(await blob.arrayBuffer());
    await writeFile(path.join(destDir, filename), buffer);

    const url = `${PUBLIC_PREFIX}/${folder}/${uid}/${filename}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('[upload] failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
