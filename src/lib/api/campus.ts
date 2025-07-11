const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllCampuses = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found");
  }
  const response = await fetch(`${API_BASE_URL}/campus`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campuses");
  }

  return response.json();
};