// utils/btfs.ts
export async function uploadToBTFS(file: File): Promise<{location: string, key: string, cid: string}> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/btfs', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    if (!result.location || !result.key || !result.cid) {
      throw new Error('Invalid response from server');
    }

    return result;
  } catch (error) {
    console.error('BTFS upload error:', error);
    throw error;
  }
}