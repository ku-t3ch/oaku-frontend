import { User } from '@/interface/user';
import { UserRole } from '@/interface/userRole';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AddRoleRequest {
  campusId?: string; // required for CAMPUS_ADMIN, null for SUPER_ADMIN
}

export interface AddRoleResponse {
  message?: string;
  userRole: UserRole; 
  user: User;
}

// GET /user/get-users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/user/get-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// POST /user/add-role-admin/:userId/:role
export const addRoleAdminToUser = async (
  userId: string, 
  role: 'CAMPUS_ADMIN' | 'SUPER_ADMIN', 
  data: AddRoleRequest
): Promise<AddRoleResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/user/add-role-admin/${userId}/${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding admin role:', error);
    throw error;
  }
};