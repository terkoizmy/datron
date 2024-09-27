import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToBTFS } from '@/utils/btfs';

export function BTFSTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{location: string, key: string, cid: string} | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(`File selected: ${selectedFile.name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setStatus('Uploading...');
    try {
      const result = await uploadToBTFS(file);
      setUploadResult(result);
      setStatus(`File uploaded successfully.`);
    } catch (error) {
      setStatus(`Failed to upload file to BTFS: ${(error as Error).message}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <Input type="file" onChange={handleFileChange} disabled={isUploading} />
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload to BTFS'}
        </Button>
      </div>
      {uploadResult && (
        <div>
          <p>File uploaded successfully:</p>
          <p>Location: <a href={uploadResult.location} target="_blank" rel="noopener noreferrer">{uploadResult.location}</a></p>
          <p>Key: {uploadResult.key}</p>
          <p>CID: {uploadResult.cid}</p>
        </div>
      )}
      <div>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}