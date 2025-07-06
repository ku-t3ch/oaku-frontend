"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refresh");
      const userString = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        console.error("Auth error:", error);
        router.push("/Login?error=" + error);
        return;
      }

      if (token && refreshToken && userString) {
        try {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", refreshToken);
          const userData = JSON.parse(decodeURIComponent(userString));
          localStorage.setItem("user", JSON.stringify(userData));
          window.dispatchEvent(new Event("authStateChanged"));

          const userOrgs =
            userData.userOrganizations || userData.organizations || [];

          if (userOrgs.length === 0) {
            router.push("/USER");
          } else if (userOrgs.length === 1) {
            const singleOrg = userOrgs[0];
            localStorage.setItem(
              "selectedOrganization",
              JSON.stringify(singleOrg)
            );

            window.dispatchEvent(new Event("authStateChanged"));

            const role = singleOrg.role;

            switch (role) {
              case "SUPER_ADMIN":
                router.push("/SUPER_ADMIN");
                break;
              case "ADMIN":
                router.push("/ADMIN");
                break;
              case "CAMPUS_ADMIN":
                router.push("/CAMPUS_ADMIN");
                break;
              case "USER":
                router.push("/USER");
                break;
              default:
                router.push("/USER");
            }
          } else {
            router.push("/auth/select");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          router.push("/Login?error=parse_error");
        }
      } else {
        console.error("Missing required parameters");
        router.push("/Login?error=missing_params");
      }

      setLoading(false);
    };

    handleCallback();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังเข้าสู่ระบบ...</p>
          <p className="text-sm text-gray-500 mt-2">กำลังตรวจสอบหน่วยงาน...</p>
        </div>
      </div>
    );
  }

  return null;
}
