"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User } from "@/interface/user";

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
          const userData: User = JSON.parse(decodeURIComponent(userString));
          localStorage.setItem("user", JSON.stringify(userData));
          window.dispatchEvent(new Event("authStateChanged"));

          console.log("🔍 User data:", userData);

          // ✅ Count total roles
          const adminRoles = userData.userRoles?.length || 0;
          const userOrgs = userData.userOrganizations?.length || 0;
          const totalRoles = adminRoles + userOrgs;

          console.log(
            `🔍 Total roles: ${totalRoles} (${adminRoles} admin + ${userOrgs} orgs)`
          );

          if (totalRoles === 0) {
            // ✅ No roles - redirect to error or default page
            router.push("/Login?error=no_access");
            return;
          }

          if (totalRoles === 1) {
            // ✅ Only one role - auto-select and redirect
            if (
              adminRoles === 1 &&
              userData.userRoles &&
              userData.userRoles.length > 0
            ) {
              // Single admin role
              const adminRole = userData.userRoles[0];
              localStorage.setItem(
                "selectedRole",
                JSON.stringify({
                  type: "admin",
                  data: adminRole,
                })
              );

              switch (adminRole.role) {
                case "SUPER_ADMIN":
                  router.push("/SUPER_ADMIN");
                  break;
                case "ADMIN":
                  router.push("/ADMIN");
                  break;
                case "CAMPUS_ADMIN":
                  router.push("/CAMPUS_ADMIN");
                  break;
                default:
                  router.push("/USER");
              }
            } else if (
              userOrgs === 1 &&
              userData.userOrganizations &&
              userData.userOrganizations.length > 0
            ) {
              // Single organization role
              const userOrg = userData.userOrganizations[0];
              localStorage.setItem(
                "selectedRole",
                JSON.stringify({
                  type: "organization",
                  data: userOrg,
                })
              );
              localStorage.setItem("selectedOrganization", JSON.stringify(userOrg));
              router.push("/USER");
            }
          } else {
            // ✅ Multiple roles - go to selection page
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800">
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 w-full h-1/2"
            viewBox="0 0 1440 720"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,360L48,380.7C96,401,192,443,288,437.3C384,432,480,380,576,359.3C672,339,768,349,864,380.7C960,412,1056,464,1152,458.7C1248,453,1344,391,1392,359.3L1440,328L1440,720L1392,720C1344,720,1248,720,1152,720C1056,720,960,720,864,720C768,720,672,720,576,720C480,720,384,720,288,720C192,720,96,720,48,720L0,720Z"
              fill="rgba(16, 185, 129, 0.15)"
            />
          </svg>
          <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              กำลังเข้าสู่ระบบ...
            </h2>
            <p className="text-emerald-100">
              กำลังตรวจสอบสิทธิ์การเข้าถึงและบทบาทของคุณ
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
