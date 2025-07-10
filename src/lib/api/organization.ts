const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrganizationsByCampusId(campusId: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${API_BASE_URL}/organization/get-organization-by-campus/${campusId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("ไม่สามารถดึงข้อมูลองค์กรได้");
  }
  return res.json();
}
