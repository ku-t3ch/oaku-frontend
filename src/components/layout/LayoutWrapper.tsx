"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { getMenuItemsByRole } from "@/constants/MenuItemSidebar";
import { MenuItem } from "@/interface/menuItem";

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

  // ✅ ฟังก์ชันดึง role จาก localStorage
  const getUserRole = (): string => {
    if (typeof window === "undefined") return "PUBLIC";

    try {
      // ตรวจสอบ token ก่อน
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("🔍 LayoutWrapper - No token found, returning PUBLIC");
        return "PUBLIC";
      }

      const selectedOrgString = localStorage.getItem("selectedOrganization");
      if (selectedOrgString) {
        const selectedOrg: SelectedOrganization = JSON.parse(selectedOrgString);
        console.log(
          "🔍 LayoutWrapper - Found selected org role:",
          selectedOrg.role
        );
        return selectedOrg.role || "USER";
      }

      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        console.log("🔍 LayoutWrapper - Found user data, checking orgs");
        if (userData.userOrganizations && userData.userOrganizations.length > 0) {
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

  // ✅ อัพเดท role และ menu items
  const updateRoleAndMenu = () => {
    const role = getUserRole();
    const items = getMenuItemsByRole(role as any);

    console.log("🔄 LayoutWrapper - Role & Menu Update:", {
      role,
      itemsCount: items.length,
      pathname,
      hasToken: !!localStorage.getItem("accessToken"),
    });

    setCurrentRole(role);
    setMenuItems(items);
  };

  useEffect(() => {
    setMounted(true);
    updateRoleAndMenu();

    // ✅ Listen for auth state changes
    const handleAuthChange = () => {
      console.log("🔄 LayoutWrapper - Auth state changed");
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

  console.log("🔍 LayoutWrapper - Page check:", {
    pathname,
    isAuthPage,
    mounted,
    currentRole,
    menuItemsCount: menuItems.length,
  });

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

  // ✅ หน้า auth ไม่ต้องมี layout
  if (isAuthPage) {
    console.log("🚫 LayoutWrapper - Auth page detected, no layout");
    return <>{children}</>;
  }

  // ✅ ทุกหน้าอื่นๆ (รวม "/" สำหรับ PUBLIC) ต้องมี Sidebar + Navbar
  console.log("✅ LayoutWrapper - Rendering with layout");
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItems} currentRole={currentRole} />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 ml-60 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
