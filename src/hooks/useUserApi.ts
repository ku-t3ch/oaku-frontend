import { useState, useCallback } from "react";
import {
  getUsers,
  getUsersByFilter,
  getUserByUserId,
  editUser,
  addOrRemoveCampusAdmin,
  addSuperAdmin,
  addUserToOrganization,
} from "@/lib/api/user";
import { User } from "@/interface/user";

// ดึง users ทั้งหมด
export function useUsers(token: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { users, loading, error, fetchUsers };
}

// ดึง users ตาม filter
export function useUsersByFilter(token: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersByFilter = useCallback(
    async (params: {
      role?: string;
      campusId?: string;
      organizationTypeId?: string;
      organizationId?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsersByFilter(token, params);
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { users, loading, error, fetchUsersByFilter };
}

// ดึง user รายคน
export function useUserByUserId(token: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserByUserId = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserByUserId(token, id);
        setUser(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { user, loading, error, fetchUserByUserId };
}

// แก้ไข user
export function useEditUser(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const edit = useCallback(
    async (
      id: string,
      data: Partial<Pick<User, "name" | "email" | "phoneNumber" | "image">>
    ) => {
      setLoading(true);
      setError(null);
      try {
        return await editUser(token, id, data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { edit, loading, error };
}

// เพิ่ม/ลบ campus admin
export function useAddOrRemoveCampusAdmin(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (id: string, data: { role: string; campusId: string }) => {
      setLoading(true);
      setError(null);
      try {
        return await addOrRemoveCampusAdmin(token, id, data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { mutate, loading, error };
}

// เพิ่ม super admin
export function useAddSuperAdmin(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        return await addSuperAdmin(token, id);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { mutate, loading, error };
}

// เพิ่ม user เข้า organization
export function useAddUserToOrganization(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      id: string,
      data: {
        organizationTypeId: string;
        organizationId: string;
        role?: string;
        position?: string;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        return await addUserToOrganization(token,id, data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { mutate, loading, error };
}
