const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrganizationTypes(token: string, campusId?: string) {
  let url = `${API_BASE_URL}/organization-types`;
  if (campusId) {
    url += `?campusId=${campusId}`;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("ไม่สามารถดึงข้อมูลประเภทองค์กรได้");
  }

  return res.json();
}