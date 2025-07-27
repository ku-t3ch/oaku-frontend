const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadActivityHourFile(
  file: File,
  token: string,
  projectId: string,
  userId: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);
  formData.append("userId", userId);

  const res = await fetch(`${API_BASE_URL}/activity-hours/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    let errorMsg = "เกิดข้อผิดพลาด";
    try {
      const errJson = await res.json();
      errorMsg = errJson.message || errorMsg;
    } catch {
      errorMsg = await res.text();
    }
    throw new Error(errorMsg);
  }
  return await res.json();
}

export async function getActivityHourFile(filename: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/activity-hours/file/${filename}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMsg = "เกิดข้อผิดพลาด";
    try {
      const errJson = await res.json();
      errorMsg = errJson.message || errorMsg;
    } catch {
      errorMsg = await res.text();
    }
    throw new Error(errorMsg);
  }
  return await res.blob();
}