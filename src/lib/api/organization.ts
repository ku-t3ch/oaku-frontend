import { Organization } from "@/interface/organization";
import { OrganizationDetail } from "@/interface/organization";

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

// API: PUT /organizations/:id (รองรับทั้งข้อมูลและไฟล์)
export async function updateOrganization(
  token: string,
  id: string,
  data: Partial<Organization> & { image?: File }
): Promise<Organization> {
  let body: BodyInit;
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  if (data.image) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(data.image.type)) {
      throw new Error("ไฟล์รูปภาพต้องเป็น png, jpg, jpeg หรือ webp เท่านั้น");
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    body = formData;
    // อย่า set Content-Type
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE_URL}/organizations/${id}`, {
    method: "PUT",
    headers,
    body,
  });
  if (!res.ok) throw new Error("อัปเดตองค์กรไม่สำเร็จ");
  return res.json();
}

// API: GET /organizations/:id
export async function getOrganizationById(
  token: string,
  id: string
): Promise<OrganizationDetail> {
  const res = await fetch(`${API_BASE_URL}/organizations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลองค์กรได้");
  return res.json();
}
