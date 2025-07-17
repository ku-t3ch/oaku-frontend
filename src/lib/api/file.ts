const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Upload activity hours file to the backend.
 * @param file File object to upload
 * @param token JWT access token
 */
export async function uploadActivityHoursFile(file: File, token: string): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/file/activity-hours/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }
  return res.json();
}

/**
 * Download file from S3 by key.
 * @param key S3 file key
 * @param token JWT access token
 */
export async function downloadFile(key: string, token: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/file/download/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Download failed");
  }
  return res.blob();
}