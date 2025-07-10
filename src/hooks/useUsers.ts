import { useState, useEffect, useCallback } from "react";
import { User } from "@/interface/user";
import { getAllUsers, getUserByRoleOrCampus } from "@/lib/api/user";
import { GetUsersByRoleRequest, GetUsersByRoleAndCampusRequest } from "@/lib/api/user";

type RoleType = "SUPER_ADMIN" | "CAMPUS_ADMIN" | "USER" | "all";

interface UseUsersOptions {
  role?: RoleType;
  campusId?: string;
}

export function useUsers({ role = "all", campusId }: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: User[];

      if ((role && role !== "all") || (campusId && campusId !== "all")) {
        if (role && role !== "all" && campusId && campusId !== "all") {
          // ทั้ง role และ campusId
          const req: GetUsersByRoleAndCampusRequest = { role: role as Exclude<RoleType, "all">, campusId };
          data = await getUserByRoleOrCampus(req);
        } else if (role && role !== "all") {
          // เฉพาะ role
          const req: GetUsersByRoleRequest = { role: role as Exclude<RoleType, "all"> };
          data = await getUserByRoleOrCampus(req);
        } else if (campusId && campusId !== "all") {
          // เฉพาะ campusId (role ไม่ระบุ)
          const req: GetUsersByRoleAndCampusRequest = { role: "USER", campusId };
          data = await getUserByRoleOrCampus(req);
        } else {
          data = await getAllUsers();
        }
      } else {
        data = await getAllUsers();
      }
      setUsers(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
      }
    } finally {
      setLoading(false);
    }
  }, [role, campusId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}