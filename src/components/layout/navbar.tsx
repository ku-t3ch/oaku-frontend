"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { User } from "@/interface/user";
import { SelectedOrganization } from "@/interface/selectOrganization";
import { getRoleLabel, getPositionLabel } from "@/utils/roleUtils";
import { getProxyImageUrl, getAvatarText } from "@/utils/imageUtils";

interface SelectedRole {
  type: "admin" | "organization";
  data: any;
  route?: string;
}

const Navbar = React.memo(function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<SelectedOrganization | null>(null);
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedOrganization");
      localStorage.removeItem("selectedRole");

      setUser(null);
      setSelectedOrg(null);
      setSelectedRole(null);
      setIsLoggedIn(false);

      router.push("/Login");
    } catch (error) {
      console.error("Error during logout:", error);
      window.location.href = "/Login";
    }
  }, [router]);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");
    const selectedOrgString = localStorage.getItem("selectedOrganization");
    const selectedRoleString = localStorage.getItem("selectedRole");

    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsLoggedIn(true);

        // Handle selected role
        if (selectedRoleString) {
          const roleData = JSON.parse(selectedRoleString);
          setSelectedRole(roleData);
        }

        // Handle selected organization (backward compatibility)
        if (selectedOrgString) {
          const orgData = JSON.parse(selectedOrgString);
          setSelectedOrg(orgData);
        } else {
          setSelectedOrg(null);
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setSelectedOrg(null);
      setSelectedRole(null);
    }
  }, [handleLogout]);

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("focus", checkAuthStatus);
    window.addEventListener("authStateChanged", checkAuthStatus);
    window.addEventListener("roleSelected", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("focus", checkAuthStatus);
      window.removeEventListener("authStateChanged", checkAuthStatus);
      window.removeEventListener("roleSelected", checkAuthStatus);
    };
  }, [checkAuthStatus]);

  const LoginHandler = () => {
    router.push("/Login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSwitchRole = () => {
    router.push("/auth/select");
  };

  // Get display information based on current role
  const getDisplayInfo = () => {
    if (!selectedRole || !user) {
      return {
        title: "ไม่ได้เลือกบทบาท",
        subtitle: ""
      };
    }

    if (selectedRole.type === "admin") {
      const adminRole = selectedRole.data;
      return {
        title: getRoleLabel(adminRole.role),
        subtitle: adminRole.campus?.name || ""
      };
    } else if (selectedRole.type === "organization") {
      const userOrg = selectedRole.data;
      return {
        title: userOrg.organization?.nameTh || "ไม่ระบุองค์กร",
        subtitle: `${getRoleLabel(userOrg.role)}${
          userOrg.position && 
          userOrg.position !== "NON_POSITION" && 
          getPositionLabel(userOrg.position) 
            ? ` • ${getPositionLabel(userOrg.position)}` 
            : ""
        }`
      };
    }

    return {
      title: "ไม่ระบุบทบาท",
      subtitle: ""
    };
  };

  // Check if user has multiple roles available
  const hasMultipleRoles = () => {
    if (!user) return false;
    
    const adminRoles = user.userRoles?.length || 0;
    const userOrgs = user.userOrganizations?.length || 0;
    
    return (adminRoles + userOrgs) > 1;
  };

  // Check if user has organization roles
  const hasOrganizationRoles = () => {
    return user?.userOrganizations && user.userOrganizations.length > 0;
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-64 right-0 z-10 bg-[#006C67] h-16">
        <div className="w-full h-full">
          <div className="flex h-full justify-between items-center px-6">
            <h3 className="text-white">กำลังโหลด...</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-300 animate-pulse px-4 py-2 rounded-md">
                <div className="h-4 w-20 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const displayInfo = getDisplayInfo();

  return (
    <nav className="fixed top-0 left-64 right-0 z-10 bg-gradient-to-r from-[#06574D] to-[#006C67] h-16 shadow-lg">
      <div className="w-full h-full">
        <div className="flex h-full justify-between items-center px-6">
          <h3 className="text-white font-medium">
            {displayInfo.title}
            {displayInfo.subtitle && (
              <p className="text-xs opacity-75">
                {displayInfo.subtitle}
              </p>
            )}
          </h3>

          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
              <>
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:bg-[#005A56] px-3 py-2 rounded-md transition-colors duration-200">
                    {user.image ? (
                      <img
                        src={getProxyImageUrl(user.image)}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                        onError={(e) => {
                          console.warn(
                            "Failed to load profile image:",
                            user.image
                          );
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                    ) : null}

                    {/* Fallback Avatar */}
                    <div
                      className={`w-8 h-8 bg-[#B2BB1C] rounded-full flex items-center justify-center ${
                        user.image ? "hidden" : ""
                      }`}
                    >
                      <span className="text-white font-semibold text-sm">
                        {getAvatarText(user.name, user.email)}
                      </span>
                    </div>

                    <span className="hidden md:block font-medium">
                      {user.name || user.email}
                    </span>

                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                    <div className="py-1">
                      {/* User Info Header */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || "ไม่ระบุชื่อ"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email || "ไม่ระบุอีเมล"}
                        </p>
                      </div>

                      <button
                        onClick={handleProfile}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        โปรไฟล์
                      </button>

                      {/* Show role switching if user has multiple roles */}
                      {hasMultipleRoles() && (
                        <button
                          onClick={handleSwitchRole}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                          เปลี่ยนบทบาท
                        </button>
                      )}

                      <hr className="my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={LoginHandler}
                className="bg-[#B2BB1C] px-4 py-2 rounded-md text-white font-semibold text-sm hover:bg-[#9FAF1A] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;