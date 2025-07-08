"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { getMenuItemsByRole } from "@/constants/MenuItemSidebar";
import { MenuItem } from "@/interface/menuItem";
import { Role } from "@/utils/roleUtils";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

interface SelectedOrganization {
  role: string;
  organization?: {
    nameTh?: string;
  };
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<string>("PUBLIC");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const getUserRole = (): string => {
    if (typeof window === "undefined") return "PUBLIC";

    try {
      // ตรวจสอบ token ก่อน
      const token = localStorage.getItem("accessToken");

      if (!token) {

        return "PUBLIC";
      }

      const selectedOrgString = localStorage.getItem("selectedOrganization");
      if (selectedOrgString) {
        const selectedOrg: SelectedOrganization = JSON.parse(selectedOrgString);
     
        return selectedOrg.role || "USER";
      }

      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
      
        if (
          userData.userOrganizations &&
          userData.userOrganizations.length > 0
        ) {
          return userData.userOrganizations[0].role || "USER";
        }
        return "USER";
      }

      return "PUBLIC";
    } catch (error) {
      console.error("Error getting user role:", error);
      return "PUBLIC";
    }
  };

 
  const updateRoleAndMenu = () => {
    const role = getUserRole();
    const items = getMenuItemsByRole(role as Role);



    setCurrentRole(role);
    setMenuItems(items);
  };

  useEffect(() => {
    setMounted(true);
    updateRoleAndMenu();

    // ✅ Listen for auth state changes
    const handleAuthChange = () => {
      
      updateRoleAndMenu();
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
    };
  }, []);

  // ✅ หน้าที่ไม่ต้องการ Sidebar/Navbar (เฉพาะหน้า Login และ auth/* เท่านั้น)
  const isAuthPage =
    pathname?.startsWith("/Login") || pathname?.startsWith("/auth/");



  // ✅ Loading state สำหรับ hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItems} currentRole={currentRole} />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="pt-16 pl-64 p-6 min-h-screen overflow-auto">{children}</main>
      </div>
    </div>
  );
}
