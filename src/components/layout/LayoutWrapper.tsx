"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { getMenuItemsByRole } from "@/constants/MenuItemSidebar";
import { MenuItem, UserPosition } from "@/interface/menuItem";
import { Role } from "@/utils/roleUtils";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";
import { MobileWarning } from "./MobileWarning";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

interface SelectedRole {
  type: "admin" | "organization";
  data: UserRole | UserOrganization;
  route?: string;
}

// Route Protection Configuration
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/SUPER_ADMIN': ['SUPER_ADMIN'],
  '/CAMPUS_ADMIN': ['SUPER_ADMIN', 'CAMPUS_ADMIN'],
  '/USER': ['SUPER_ADMIN', 'CAMPUS_ADMIN', 'USER'],
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<string>("PUBLIC");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getCurrentUserRole = useCallback((): string => {
    if (typeof window === "undefined") return "PUBLIC";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return "PUBLIC";

      const selectedRoleString = localStorage.getItem("selectedRole");
      if (selectedRoleString) {
        const selectedRole: SelectedRole = JSON.parse(selectedRoleString);
        if (selectedRole.type === "admin") {
          const adminRole = selectedRole.data as UserRole;
          return adminRole.role;
        } else if (selectedRole.type === "organization") {
          const userOrg = selectedRole.data as UserOrganization;
          return userOrg.role || "USER";
        }
      }

      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        if (userData.userRoles && userData.userRoles.length > 0) {
          const sortedRoles = userData.userRoles.sort((a: UserRole, b: UserRole) => {
            const priorityMap: Record<string, number> = {
              SUPER_ADMIN: 1,
              CAMPUS_ADMIN: 2,
            };
            return (priorityMap[a.role] || 999) - (priorityMap[b.role] || 999);
          });
          return sortedRoles[0].role;
        }
        if (userData.userOrganizations && userData.userOrganizations.length > 0) {
          return userData.userOrganizations[0].role || "USER";
        }
      }
      return "PUBLIC";
    } catch (error) {
      console.error("Error getting user role:", error);
      return "PUBLIC";
    }
  }, []);

  const checkRouteAccess = useCallback((path: string, userRole: string): boolean => {
    const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route => 
      path.startsWith(route)
    );
    
    if (!protectedRoute) {
      return true;
    }
    
    return PROTECTED_ROUTES[protectedRoute].includes(userRole);
  }, []);

  const redirectToAuthorizedPage = useCallback((userRole: string) => {
    switch (userRole) {
      case 'SUPER_ADMIN':
        router.replace('/SUPER_ADMIN/dashboard');
        break;
      case 'CAMPUS_ADMIN':
        router.replace('/CAMPUS_ADMIN/dashboard');
        break;
      case 'USER':
        router.replace('/USER/dashboard');
        break;
      default:
        router.replace('/Login');
        break;
    }
  }, [router]);

  const getUserPosition = useCallback((): string | undefined => {
    if (typeof window === "undefined") return undefined;
    try {
      const selectedRoleString = localStorage.getItem("selectedRole");
      if (selectedRoleString) {
        const selectedRole: SelectedRole = JSON.parse(selectedRoleString);
        if (selectedRole.type === "organization") {
          const userOrg = selectedRole.data as UserOrganization;
          return userOrg.position;
        }
      }
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        if (userData.userOrganizations && userData.userOrganizations.length > 0) {
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
    const role = getCurrentUserRole();
    const position = getUserPosition();
    setCurrentRole(role);
    setMenuItems(getMenuItemsByRole(role as Role, position as UserPosition));
    window.dispatchEvent(
      new CustomEvent("roleSelectionChanged", {
        detail: { role, position, items: getMenuItemsByRole(role as Role, position as UserPosition) },
      })
    );
  }, [getCurrentUserRole, getUserPosition]);

  const handleRoleChange = useCallback(() => {
    setTimeout(() => {
      updateRoleAndMenu();
    }, 100);
  }, [updateRoleAndMenu]);

  // Auth และ Route Protection Check
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuthAndRoute = () => {
      setIsCheckingAuth(true);
      
      // ข้าม auth pages
      if (pathname?.startsWith('/Login') || pathname?.startsWith('/auth/')) {
        setIsCheckingAuth(false);
        return;
      }

      const userRole = getCurrentUserRole();
      const hasAccess = checkRouteAccess(pathname, userRole);

      if (!hasAccess) {
        console.warn(`Access denied: ${userRole} trying to access ${pathname}`);
        redirectToAuthorizedPage(userRole);
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuthAndRoute();
  }, [pathname, getCurrentUserRole, checkRouteAccess, redirectToAuthorizedPage]);

  useEffect(() => {
    setMounted(true);
    updateRoleAndMenu();

    const events = [
      "storage",
      "focus", 
      "authStateChanged",
      "roleSelected",
      "roleSelectionChanged",
    ];
    events.forEach((eventName) => {
      window.addEventListener(eventName, handleRoleChange);
    });
    window.addEventListener("popstate", handleRoleChange);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        handleRoleChange();
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

  const isAuthPage =
    pathname?.startsWith("/Login") || 
    pathname?.startsWith("/auth/");

  if (!mounted || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileWarning />;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        currentRole={currentRole}
        key={`sidebar-${currentRole}-${menuItems.length}`}
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