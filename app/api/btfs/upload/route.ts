// app/api/btfs/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import s3Client from '@/utils/s3Config';
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.NEXT_PUBLIC_BTFS_BUCKET

async function getCID(bucket: string, key: string): Promise<string | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key
    });
    const headData = await s3Client.send(command);
    // console.log("masukk",headData);
    // Attempt to get the CID (this might need adjustment based on how BTFS stores it)
    let cid = headData.Metadata?.cid || 'CID not available';
    
    return cid;
  } catch (error) {
    console.error('Error fetching CID:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !bucketName) {
      return NextResponse.json({ error: 'No file uploaded or bucket name not provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const params = {
      Bucket: bucketName,
      Key: `${Date.now()} - ${file.name}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Fetch the CID
    const cid = await getCID(bucketName, params.Key);

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      location: `https://${bucketName}.storage3.btfs.io/s3/${file.name}`,
      key: file.name,
      cid: cid || 'CID not available'
    });
  } catch (error: any) {
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    if (error.name === 'InvalidAccessKeyId') {
      return NextResponse.json({
        error: 'Invalid Access Key ID',
        details: 'The provided Access Key ID does not exist in BTFS records. Please check your credentials.'
      }, { status: 403 });
    }
    
    return NextResponse.json({ 
      error: 'Error uploading file',
      details: error.message,
      code: error.name
    }, { status: 500 });
  }
}

