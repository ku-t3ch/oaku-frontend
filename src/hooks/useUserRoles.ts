import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/interface/user";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";
import { getUserByUserId } from "@/lib/api/user"; // ต้องมีฟังก์ชันนี้
import { useEffect } from "react";

export interface RoleOption {
  type: "admin" | "organization";
  data: UserRole | UserOrganization;
  label: string;
  description: string;
  route: string;
}

const getPriority = (option: RoleOption) => {
  if (option.type === "admin") {
    const role = (option.data as UserRole).role;
    switch (role) {
      case "SUPER_ADMIN":
        return 1;
      case "CAMPUS_ADMIN":
        return 2;
      default:
        return 3;
    }
  }
  return 5;
};

export const useUserRoles = () => {
  const router = useRouter();

  // ดึง token และ id จาก localStorage
  let token: string | null = null;
  let id: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData: User = JSON.parse(userString);
        id = userData.id; // เปลี่ยนจาก userData.userId เป็น userData.id
      } catch {
        id = null;
      }
    }
  }

  // ใช้ React Query ดึง user จาก backend
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRoles", id],
    queryFn: async () => {
      if (!token || !id) throw new Error("No token or id");
      return await getUserByUserId(token, id); // ส่ง id ไปที่ backend
    },
    enabled: !!token && !!id, 
    staleTime: 5 * 60 * 1000,
  });

  // handle error redirect
  useEffect(() => {
    if (error) {
      router.push("/Login");
    }
  }, [error, router]);

  // แปลง user เป็น roleOptions
  let roleOptions: RoleOption[] = [];
  if (user) {
    const options: RoleOption[] = [];
    user.userRoles?.forEach((userRole) => {
      let label = "";
      let description = "";
      const route = "/dashboard";
      switch (userRole.role) {
        case "SUPER_ADMIN":
          label = "ผู้ดูแลระบบสูงสุด";
          description = "จัดการระบบทั้งหมด";
          break;
        case "CAMPUS_ADMIN":
          label = "ผู้ดูแลวิทยาเขต";
          description = `จัดการ${userRole.campus?.name || "วิทยาเขต"}`;
          break;
      }
      if (label) {
        options.push({ type: "admin", data: userRole, label, description, route });
      }
    });

    if (Array.isArray(user.userOrganizations)) {
      user.userOrganizations.forEach((userOrg) => {
        options.push({
          type: "organization",
          data: userOrg,
          label: userOrg.organization?.nameTh || userOrg.organization?.nameEn || "-",
          description: `${userOrg.position === "HEAD" ? "หัวหน้า" : "สมาชิก"} • ${userOrg.organization?.organizationType?.name || "-"}`,
          route: "/USER",
        });
      });
    }

    roleOptions = options.sort((a, b) => getPriority(a) - getPriority(b));
  }

  return {
    roleOptions,
    error: error ? (error as Error).message : null,
    isLoading,
    refetch,
  };
};