import { useState, useEffect } from 'react';
import { User } from '@/interface/user';
import { getAllUsers, addRoleAdminToUser, AddRoleRequest } from '@/lib/api/user';

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addAdminRole: (userId: string, role: 'CAMPUS_ADMIN' | 'SUPER_ADMIN', data: AddRoleRequest) => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const addAdminRole = async (
    userId: string, 
    role: 'CAMPUS_ADMIN' | 'SUPER_ADMIN', 
    data: AddRoleRequest
  ) => {
    try {
      await addRoleAdminToUser(userId, role, data);
      // Refetch users after successful role addition
      await fetchUsers();
    } catch (err) {
      throw err; // Re-throw to let component handle the error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    addAdminRole,
  };
};