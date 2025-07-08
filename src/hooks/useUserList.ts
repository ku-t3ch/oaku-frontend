import { useState, useEffect, useMemo } from 'react';
import { User } from '@/interface/user';
import { getAllUsers } from '@/lib/api/user';

export interface UseUserListReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUsers: User[];
  refetch: () => Promise<void>;
}

export const useUserList = (): UseUserListReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowercaseSearch) ||
      user.email.toLowerCase().includes(lowercaseSearch) ||
      user.userId.toLowerCase().includes(lowercaseSearch) ||
      user.campus.name.toLowerCase().includes(lowercaseSearch)
    );
  }, [users, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    refetch: fetchUsers,
  };
};