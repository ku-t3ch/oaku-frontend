import { Organization } from "@/interface/organization";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API: GET /organizations?campusId=&organizationTypeId=
export async function getOrganizations(
  token: string,
  params: { campusId?: string; organizationTypeId?: string }
): Promise<Organization[]> {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const res = await fetch(`${API_BASE_URL}/organizations?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลองค์กรได้");
  return res.json();
}

// API: POST /organizations
export async function createOrganization(
  token: string,
  data: Partial<Organization>
): Promise<Organization> {
  const res = await fetch(`${API_BASE_URL}/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("สร้างองค์กรไม่สำเร็จ");
  return res.json();
}
