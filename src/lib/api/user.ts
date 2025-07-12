import { User } from "@/interface/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function getUsersByFilter(
  token: string,
  params: {
    role?: string;
    campusId?: string;
    organizationTypeId?: string;
    organizationId?: string;
  }
): Promise<User[]> {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  const res = await fetch(`${API_BASE_URL}/users/filter?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users by filter");
  return res.json();
}
export async function getUserByUserId(
  token: string,
  userId: string
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function editUser(
  token: string,
  id: string,
  data: Partial<Pick<User, "name" | "email" | "phoneNumber" | "image">>
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function addOrRemoveCampusAdmin(
  token: string,
  userId: string,
  data: { role: string; campusId: string }
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  let result;
  try {
    result = await res.json();
  } catch {
    result = {};
  }
  if (!res.ok) throw new Error(result.error || "Failed to update campus admin");
  return result;
}

export async function addSuperAdmin(token: string, id: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}/superadmin`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to add super admin");
  return res.json();
}

export async function addUserToOrganization(
  token: string,
  id: string,
  data: {
    organizationTypeId: string;
    organizationId: string;
    role?: string;
    position?: string;
  }
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}/organization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add user to organization");
  return res.json();
}

export async function suspendUser(
  token: string,
  id: string,
  isSuspended: boolean = true
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}/suspend`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isSuspended }),
  });
  if (!res.ok) throw new Error("Failed to suspend user");
  return res.json();
}