// app/api/btfs/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const BTFS_BUCKET = process.env.BTFS_BUCKET || "datron";

const s3Client = new S3Client({
  region: "us-east-1", // This is required but not used for BTFS
  endpoint: "https://storage3.btfs.io/s3",
  credentials: {
    accessKeyId: process.env.BTFS_ACCESS_KEY || '',
    secretAccessKey: process.env.BTFS_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

async function getCID(bucket: string, key: string): Promise<string | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const headData = await s3Client.send(command);
    return headData.Metadata?.cid || 'CID not available';
  } catch (error) {
    console.error('Error fetching CID:', error);
    return null;
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const key = `${Date.now()}-${file.name}`;
    const command = new PutObjectCommand({
      Bucket: BTFS_BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type || 'application/octet-stream',
    });

    await s3Client.send(command);
    const cid = await getCID(BTFS_BUCKET, key);
    const location = `https://${BTFS_BUCKET}.storage3.btfs.io/s3/${key}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      location,
      key,
      cid: cid || 'CID not available'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file to BTFS' }, { status: 500 });
  }
}