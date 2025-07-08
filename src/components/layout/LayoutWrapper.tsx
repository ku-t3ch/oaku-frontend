"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname} from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { getMenuItemsByRole } from "@/constants/MenuItemSidebar";
import { MenuItem, UserPosition } from "@/interface/menuItem";
import { Role } from "@/utils/roleUtils";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

interface SelectedRole {
  type: "admin" | "organization";
  data: UserRole | UserOrganization;
  route?: string;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<string>("PUBLIC");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const getUserRole = useCallback((): string => {
    if (typeof window === "undefined") return "PUBLIC";

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return "PUBLIC";
      }

      const selectedRoleString = localStorage.getItem("selectedRole");
      if (selectedRoleString) {
        const selectedRole: SelectedRole = JSON.parse(selectedRoleString);

        if (selectedRole.type === "admin") {
          const adminRole = selectedRole.data as UserRole;
          return adminRole.role; // SUPER_ADMIN, CAMPUS_ADMIN
        } else if (selectedRole.type === "organization") {
          const userOrg = selectedRole.data as UserOrganization;
          return userOrg.role; // USER
        }
      }

      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);

        if (userData.userRoles && userData.userRoles.length > 0) {
          const sortedRoles = userData.userRoles.sort(
            (a: UserRole, b: UserRole) => {
              const priorityMap = {
                SUPER_ADMIN: 1,
                CAMPUS_ADMIN: 2,
              };
              return priorityMap[a.role] - priorityMap[b.role];
            }
          );

          return sortedRoles[0].role;
        }

        if (
          userData.userOrganizations &&
          userData.userOrganizations.length > 0
        ) {
          return userData.userOrganizations[0].role || "USER";
        }
      }

      return "PUBLIC";
    } catch (error) {
      console.error("Error getting user role:", error);
      return "PUBLIC";
    }
  }, []);

  const getUserPosition = useCallback((): string | undefined => {
    if (typeof window === "undefined") return undefined;

    try {
      const selectedRoleString = localStorage.getItem("selectedRole");
      if (selectedRoleString) {
        const selectedRole: SelectedRole = JSON.parse(selectedRoleString);

        if (selectedRole.type === "organization") {
          const userOrg = selectedRole.data as UserOrganization;
          return userOrg.position; // HEAD, MEMBER, NON_POSITION
        }
      }

      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);

        if (
          userData.userOrganizations &&
          userData.userOrganizations.length > 0
        ) {
          return userData.userOrganizations[0].position;
        }
      }

      return undefined;
    } catch (error) {
      console.error("Error getting user position:", error);
      return undefined;
    }
  }, []);

  const updateRoleAndMenu = useCallback(() => {
    const role = getUserRole();
    const position = getUserPosition();

    const items = getMenuItemsByRole(role as Role, position as UserPosition);

    console.log("🔄 Role updated:", {
      role,
      position,
      itemsCount: items.length,
    });

    setCurrentRole(role);
    setMenuItems(items);

    // ✅ Dispatch custom event เพื่อแจ้ง components อื่นๆ
    window.dispatchEvent(
      new CustomEvent("roleSelectionChanged", {
        detail: { role, position, items },
      })
    );
  }, [getUserRole, getUserPosition]);

  // ✅ Event handler สำหรับการเปลี่ยนบทบาท
  const handleRoleChange = useCallback(
    (event: Event) => {
      console.log("🔄 Role change detected:", event.type);

      // ใช้ setTimeout เพื่อให้ localStorage update เสร็จก่อน
      setTimeout(() => {
        updateRoleAndMenu();
      }, 100);
    },
    [updateRoleAndMenu]
  );

  useEffect(() => {
    setMounted(true);
    updateRoleAndMenu();

    const events = [
      "storage", // localStorage changes
      "focus", // window focus
      "authStateChanged", // custom auth event
      "roleSelected", // จาก role selection page
      "roleSelectionChanged", // custom role change event
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleRoleChange);
    });

    // ✅ Listen for popstate (browser back/forward)
    window.addEventListener("popstate", handleRoleChange);

    // ✅ Listen for visibility change
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        handleRoleChange(new Event("visibilitychange"));
      }
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleRoleChange);
      });
      window.removeEventListener("popstate", handleRoleChange);
      document.removeEventListener("visibilitychange", handleRoleChange);
    };
  }, [handleRoleChange, updateRoleAndMenu]);

  // ✅ Watch for pathname changes
  useEffect(() => {
    console.log("📍 Pathname changed:", pathname);
    // อาจต้องการ update menu based on current path
  }, [pathname]);

  const isAuthPage =
    pathname?.startsWith("/Login") || pathname?.startsWith("/auth/");

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
      <Sidebar
        menuItems={menuItems}
        currentRole={currentRole}
        key={`sidebar-${currentRole}-${menuItems.length}`} // ✅ Force re-render เมื่อ role เปลี่ยน
      />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="pt-16 pl-64 p-6 min-h-screen overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
