"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { User } from "@/interface/user";
import { SelectedOrganization } from "@/interface/selectOrganization";
import { getRoleLabel, getPositionLabel } from "@/utils/roleUtils";
import { getProxyImageUrl, getAvatarText } from "@/utils/imageUtils";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<SelectedOrganization | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedOrganization");

      setUser(null);
      setSelectedOrg(null);
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

    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsLoggedIn(true);

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
    }
  }, [handleLogout]);

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("focus", checkAuthStatus);
    window.addEventListener("authStateChanged", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("focus", checkAuthStatus);
      window.removeEventListener("authStateChanged", checkAuthStatus);
    };
  }, [checkAuthStatus]);

  const LoginHandler = () => {
    router.push("/Login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSwitchOrganization = () => {
    router.push("/auth/select");
  };

  if (!mounted) {
    return (
      <nav className="relative z-10 bg-[#006C67] ml-[15rem]">
        <div className="w-full">
          <div className="flex h-15 justify-between items-center px-4">
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

  return (
    <nav className="relative z-10 bg-[#006C67] ml-60">
      <div className="w-full">
        <div className="flex h-15 justify-between items-center px-4">
          <h3 className="text-white font-medium">
            {selectedOrg?.organization?.nameTh || "OAKU System"}
          </h3>

          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
              <>
                {/* Organization Info */}
                {selectedOrg && (
                  <div className="hidden md:block text-right text-white text-sm">
                    <p className="font-medium">
                      {selectedOrg.organization?.nameTh || "ไม่ระบุหน่วยงาน"}
                    </p>
                    <p className="text-xs opacity-75">
                      {getRoleLabel(selectedOrg.role)}
                      {selectedOrg.position &&
                        selectedOrg.position !== "NON_POSITION" &&
                        getPositionLabel(selectedOrg.position) &&
                        ` • ${getPositionLabel(selectedOrg.position)}`}
                    </p>
                  </div>
                )}

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

                      {selectedOrg && (
                        <button
                          onClick={handleSwitchOrganization}
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
                          เปลี่ยนหน่วยงาน
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
}
