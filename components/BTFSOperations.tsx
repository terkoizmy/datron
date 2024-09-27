"use client";
// components/BTFSOperations.tsx
import React, { useState } from 'react';
import axios from 'axios';

export default function BTFSOperations() {
  const [file, setFile] = useState<File | null>(null);
  const [bucketName, setBucketName] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<{location: string, key: string, cid: string} | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file and enter a bucket name');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketName', bucketName);

    try {
      const response = await axios.post('/api/btfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setUploadResult(response.data);
      setError('');
    } catch (err: any) {
      setError('Upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">BTFS Upload</h1>
      
      <div>
        <input 
          type="text" 
          placeholder="Bucket Name" 
          value={bucketName} 
          onChange={(e) => setBucketName(e.target.value)}
          className="border p-2 mr-2"
        />
      </div>

      <div>
        <input type="file" onChange={handleFileChange} className="mr-2" />
        <button onClick={uploadFile} className="bg-blue-500 text-white p-2 rounded">Upload File</button>
      </div>

      {uploadResult && (
        <div>
          <p>File uploaded successfully</p>
          <p>Location: {uploadResult.location}</p>
          <p>Key: {uploadResult.key}</p>
          <p>CID: {uploadResult.cid}</p>
        </div>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}