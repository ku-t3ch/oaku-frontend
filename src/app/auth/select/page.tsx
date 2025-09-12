"use client";
import { getMenuItemsByRole } from "@/constants/MenuItemSidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCampuses } from "@/hooks/useCampuses";
import { useUserRoles, RoleOption } from "@/hooks/useUserRoles";
import { ArrowRight } from "lucide-react";
import BackgroundDecor from "@/components/ui/BackgroundDecor";
import { RoleCard } from "@/components/ui/RoleCard";
import { useUserByUserId } from "@/hooks/useUserApi";
import Image from "next/image";
import { UserOrganization } from "@/interface/userOrganization";
export default function RoleSelectPage() {
  const router = useRouter();
  const {
    loading: campusesLoading,
    error: campusesError,
    fetchCampuses,
  } = useCampuses();
  const {
    roleOptions,
    error: userRolesError,
    isLoading: userRolesLoading,
  } = useUserRoles();
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [error] = useState<string | null>(null);

  // --- Fetch user info ---
  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.id
      : undefined;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const {
    user,
    loading: userLoading,
    error: userError,
    fetchUserByUserId,
  } = useUserByUserId(token);

  useEffect(() => {
    fetchCampuses();
    if (userId) fetchUserByUserId(userId);
  }, [fetchCampuses, fetchUserByUserId, userId]);

  const isUserSuspended = user?.isSuspended === true;

  const isOrganizationSuspended = (option: RoleOption) => {
    if (option.type === "organization") {
      const orgId = (option.data as { id: string }).id;
      const userOrg = user?.userOrganizations?.find(
        (uo: UserOrganization) => uo.id === orgId
      );
      return userOrg?.isSuspended === true;
    }
    return false;
  };

  const isLoading = userRolesLoading || campusesLoading || userLoading;
  const pageError = userRolesError || campusesError || userError || error;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#006C67] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 mb-4">{pageError}</p>
          <button
            onClick={() => router.push("/Login")}
            className="px-6 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
          >
            กลับสู่หน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // ฟังก์ชันเปรียบเทียบ id ของ RoleOption
  const isRoleOptionSelected = (a: RoleOption | null, b: RoleOption) => {
    if (!a) return false;
    if (a.type !== b.type) return false;
    if (a.type === "admin" && b.type === "admin") {
      return (a.data as { id: string }).id === (b.data as { id: string }).id;
    }
    if (a.type === "organization" && b.type === "organization") {
      return (a.data as { id: string }).id === (b.data as { id: string }).id;
    }
    return false;
  };

  const handleRoleSelect = (option: RoleOption) => {
    setSelectedRole(option);
    // Save selectedRole to localStorage for global access (e.g., navbar)
    localStorage.setItem(
      "selectedRole",
      JSON.stringify({
        type: option.type,
        data: option.data,
        route: option.route,
      })
    );
    // If organization, you may want to save selectedOrganization as well
    if (option.type === "organization") {
      localStorage.setItem("selectedOrganization", JSON.stringify(option.data));
    }
    // Notify other tabs/components
    window.dispatchEvent(new Event("roleSelected"));
    router.push(option.route);
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      alert("กรุณาเลือกบทบาท");
      return;
    }
    handleRoleSelect(selectedRole);
    const role = selectedRole.data.role; // หรือค่าที่ได้จากระบบคุณ

    const menuItems = getMenuItemsByRole(role);
    if (menuItems.length > 0) {
      router.replace(menuItems[0].href);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800">
      <BackgroundDecor />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl rounded-xl shadow-lg border border-white/20 ring-1 ring-black/5">
            <div className="px-4 py-4 sm:p-6">
              <div className="text-center mb-6">
                <Image
                  width={64}
                  height={64}
                  className="h-24 w-48 object-contain mx-auto mb-2"
                  src="/OAKU-Logo-nobg.png"
                  alt="OAKU Logo"
                />
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  เลือกบทบาทเพื่อเข้าใช้งาน
                </h1>
                <p className="mt-1 text-sm text-gray-600 max-w-xl mx-auto">
                  คุณมี {roleOptions.length} บทบาทที่สามารถเข้าถึงได้
                  กรุณาเลือกบทบาทที่ต้องการเพื่อดำเนินการต่อ
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-3">
                {roleOptions.map((option) => {
                  const orgSuspended = isOrganizationSuspended(option);
                  return (
                    <RoleCard
                      key={`${option.type}-${
                        (option.data as { id: string }).id
                      }`}
                      option={option}
                      isSelected={isRoleOptionSelected(selectedRole, option)}
                      onClick={() =>
                        !option.isSuspended &&
                        !isUserSuspended &&
                        !orgSuspended &&
                        setSelectedRole(option)
                      }
                      disabled={
                        option.isSuspended || isUserSuspended || orgSuspended
                      }
                    />
                  );
                })}
              </div>
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isUserSuspended ||
                    !selectedRole ||
                    selectedRole?.isSuspended ||
                    isOrganizationSuspended(selectedRole)
                  }
                  className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                    selectedRole &&
                    !selectedRole.isSuspended &&
                    !isUserSuspended &&
                    !isOrganizationSuspended(selectedRole)
                      ? "bg-[#006C67] text-white hover:bg-[#005A56] shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>
                    {isUserSuspended
                      ? "บัญชีผู้ใช้ถูกระงับ"
                      : selectedRole
                      ? selectedRole.isSuspended ||
                        isOrganizationSuspended(selectedRole)
                        ? "บัญชีนี้ถูกระงับ"
                        : "เข้าสู่ระบบ"
                      : "กรุณาเลือกบทบาท"}
                  </span>
                  {selectedRole &&
                    !selectedRole.isSuspended &&
                    !isUserSuspended &&
                    !isOrganizationSuspended(selectedRole) && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("selectedRole");
                    localStorage.removeItem("selectedOrganization");
                    router.push("/Login");
                  }}
                  className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition"
                >
                  ออกจากระบบ / กลับหน้า Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-10 w-full p-4">
        <div className="text-center text-white/70 text-sm">
          <div className="flex justify-center gap-x-4 mb-1">
            <a
              href="https://sa.ku.ac.th/website-policy/"
              target="_blank"
              rel="noopener"
              className="hover:text-white"
            >
              นโยบายคุ้มครองข้อมูล
            </a>
            <span>●</span>
            <a
              href="https://sa.ku.ac.th/"
              target="_blank"
              rel="noopener"
              className="hover:text-white"
            >
              เว็บไซต์
            </a>
            <span>●</span>
            <a href="mailto:saku@ku.th" className="hover:text-white">
              ติดต่อเรา
            </a>
          </div>
          <p>
            สงวนลิขสิทธิ์ © {new Date().getFullYear()} กองพัฒนานิสิต
            มหาวิทยาลัยเกษตรศาสตร์
          </p>
          <p className="text-xs opacity-80">
            {process.env.NEXT_PUBLIC_BUILD_MESSAGE ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}
