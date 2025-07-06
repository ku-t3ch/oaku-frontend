"use client";
import { useState, useEffect, useCallback } from "react";
import { User } from "@/interface/user";
import { SelectedOrganization } from "@/interface/selectOrganization";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<SelectedOrganization | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(() => {
    if (typeof window === "undefined") return;

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
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        logout();
      }
    } else {
      setUser(null);
      setSelectedOrg(null);
      setIsLoggedIn(false);
    }

    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedOrganization");

    setUser(null);
    setSelectedOrg(null);
    setIsLoggedIn(false);

    window.dispatchEvent(new Event("authStateChanged"));
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [checkAuthStatus]);

  return {
    user,
    selectedOrg,
    isLoggedIn,
    loading,
    logout,
    checkAuthStatus,
  };
};
