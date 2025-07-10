import { User } from "@/interface/user";
import { UserRole } from "@/interface/userRole";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UpdateRoleAdminRequest {
  campusId?: string;
  action: "add" | "remove";
}
export interface AddRoleResponse {
  message?: string;
  userRole: UserRole;
  user: User;
}

export interface GetUsersByRoleRequest {
  role: "SUPER_ADMIN" | "CAMPUS_ADMIN" | "USER";
}

export interface GetUsersByRoleAndCampusRequest {
  role: "SUPER_ADMIN" | "CAMPUS_ADMIN" | "USER";
  campusId: string;
}

export interface EditInfoUserRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  image?: string;
}

// GET /user/get-users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${API_BASE_URL}/user/get-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserByRoleOrCampus = async (
  request: GetUsersByRoleRequest | GetUsersByRoleAndCampusRequest
): Promise<User[]> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    // สร้าง query string จาก request
    const params = new URLSearchParams();
    if ("role" in request && request.role) {
      params.append("role", request.role);
    }
    if ("campusId" in request && request.campusId) {
      params.append("campusId", request.campusId);
    }

    const response = await fetch(
      `${API_BASE_URL}/user/get-users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users by role/campus:", error);
    throw error;
  }
};

export const updateRoleAdmin = async (
  userId: string,
  role: "CAMPUS_ADMIN" | "SUPER_ADMIN",
  data: UpdateRoleAdminRequest
): Promise<AddRoleResponse> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const response = await fetch(
      `${API_BASE_URL}/user/add-role-admin/${userId}/${role}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating admin role:", error);
    throw error;
  }
};

export const editInfoUser = async (
  userId: string,
  data: EditInfoUserRequest
): Promise<User> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const response = await fetch(
      `${API_BASE_URL}/user/edit-info-user/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return (await response.json()) as User;
  } catch (error) {
    console.error("Error editing user info:", error);
    throw error;
  }
};