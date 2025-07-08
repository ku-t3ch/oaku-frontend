"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/interface/user";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";
import {
  CheckCircle,
  Shield,
  Users,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface RoleOption {
  type: "admin" | "organization";
  data: UserRole | UserOrganization;
  label: string;
  description: string;
  route: string;
}

export default function RoleSelectPage() {
  const router = useRouter();
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      router.push("/Login");
      return;
    }

    try {
      const userData: User = JSON.parse(userString);
      setUser(userData);

      const options: RoleOption[] = [];

      if (userData.userRoles && userData.userRoles.length > 0) {
        userData.userRoles.forEach((userRole) => {
          let label = "";
          let description = "";
          let route = "";

          switch (userRole.role) {
            case "SUPER_ADMIN":
              label = "ผู้ดูแลระบบสูงสุด";
              description = "จัดการระบบทั้งหมด";
              route = "/SUPER_ADMIN";
              break;
            case "ADMIN":
              label = "ผู้ดูแลระบบ";
              description = "จัดการข้อมูลและผู้ใช้";
              route = "/ADMIN";
              break;
            case "CAMPUS_ADMIN":
              label = "ผู้ดูแลวิทยาเขต";
              description = `จัดการ${userRole.campus?.name || "วิทยาเขต"}`;
              route = "/CAMPUS_ADMIN";
              break;
          }

          options.push({
            type: "admin",
            data: userRole,
            label,
            description,
            route,
          });
        });
      }

      // Add organization roles
      if (userData.userOrganizations && userData.userOrganizations.length > 0) {
        userData.userOrganizations.forEach((userOrg) => {
          options.push({
            type: "organization",
            data: userOrg,
            label: userOrg.organization.nameTh,
            description: `${
              userOrg.position === "HEAD" ? "หัวหน้า" : "สมาชิก"
            } • ${userOrg.organization.organizationType.name}`,
            route: "/USER",
          });
        });
      }

      if (options.length === 0) {
        setError("คุณไม่มีสิทธิ์เข้าใช้งานระบบ");
      } else if (options.length === 1) {
        // Auto-select if only one option
        handleRoleSelect(options[0]);
        return;
      }

      // Sort options by priority: SUPER_ADMIN -> ADMIN -> CAMPUS_ADMIN -> USER
      const sortedOptions = options.sort((a, b) => {
        const getPriority = (option: RoleOption) => {
          if (option.type === "admin") {
            const role = (option.data as UserRole).role;
            switch (role) {
              case "SUPER_ADMIN":
                return 1;
              case "ADMIN":
                return 2;
              case "CAMPUS_ADMIN":
                return 3;
              default:
                return 4;
            }
          }
          return 5; // organization (USER)
        };

        return getPriority(a) - getPriority(b);
      });

      setRoleOptions(sortedOptions);
      setLoading(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      router.push("/Login");
    }
  }, [router]);

  const handleRoleSelect = (option: RoleOption) => {
    try {
      // Store selected role information
      localStorage.setItem(
        "selectedRole",
        JSON.stringify({
          type: option.type,
          data: option.data,
          route: option.route,
        })
      );

      // For backward compatibility with organization selection
      if (option.type === "organization") {
        localStorage.setItem(
          "selectedOrganization",
          JSON.stringify(option.data)
        );
      }

      window.dispatchEvent(new Event("roleSelected"));
      router.push(option.route);
    } catch (error) {
      console.error("Error selecting role:", error);
      setError("เกิดข้อผิดพลาดในการเลือกบทบาท");
    }
  };

  const handleCardClick = (option: RoleOption) => {
    const roleId = `${option.type}-${JSON.stringify(option.data)}`;
    setSelectedRole(roleId);
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      alert("กรุณาเลือกบทบาท");
      return;
    }

    const selectedOption = roleOptions.find((option) => {
      const roleId = `${option.type}-${JSON.stringify(option.data)}`;
      return roleId === selectedRole;
    });

    if (selectedOption) {
      handleRoleSelect(selectedOption);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#006C67] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <p className="text-gray-600 mb-4">{error}</p>
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800">
      {/* Background Decorations */}
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
          <path
            d="M0,500L48,520.7C96,541,192,583,288,577.3C384,572,480,520,576,499.3C672,479,768,489,864,520.7C960,552,1056,604,1152,598.7C1248,593,1344,531,1392,499.3L1440,468L1440,720L1392,720C1344,720,1248,720,1152,720C1056,720,960,720,864,720C768,720,672,720,576,720C480,720,384,720,288,720C192,720,96,720,48,720L0,720Z"
            fill="rgba(16, 185, 129, 0.1)"
          />
        </svg>

        <svg
          className="absolute top-0 left-0 w-full h-1/2"
          viewBox="0 0 1440 720"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0L48,21.3C96,43,192,85,288,74.7C384,64,480,0,576,21.3C672,43,768,149,864,192C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="rgba(34, 197, 94, 0.15)"
          />
          <path
            d="M0,150L48,171.3C96,193,192,235,288,224.7C384,214,480,150,576,171.3C672,193,768,299,864,342C960,385,1056,363,1152,342C1248,321,1344,299,1392,288.7L1440,278L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="rgba(34, 197, 94, 0.1)"
          />
        </svg>

        <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-green-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>

        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1000 1000"
        >
          <circle cx="200" cy="200" r="3" fill="#22c55e" />
          <circle cx="800" cy="300" r="2" fill="#facc15" />
          <circle cx="600" cy="700" r="3" fill="#22c55e" />
          <line
            x1="200"
            y1="200"
            x2="800"
            y2="300"
            stroke="#22c55e"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="800"
            y1="300"
            x2="600"
            y2="700"
            stroke="#facc15"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Content Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 ring-1 ring-black/5">
            <div className="px-6 py-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-10">
                 <img
                  className="h-20 object-contain mx-auto mb-4"
                  src="/OAKU-Logo-nobg.png"
                  alt="OAKU Logo"
                />
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  เลือกบทบาทเพื่อเข้าใช้งาน
                </h1>
                <p className="mt-2 text-md text-gray-600 max-w-2xl mx-auto">
                  คุณมี {roleOptions.length} บทบาทที่สามารถเข้าถึงได้ กรุณาเลือกบทบาทที่ต้องการเพื่อดำเนินการต่อ
                </p>
              </div>

              {/* --- START: Redesigned Role Cards --- */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {roleOptions.map((option) => {
                  const roleId = `${option.type}-${JSON.stringify(option.data)}`;
                  const isSelected = selectedRole === roleId;

                  // Determine Role Type and Styling
                  const isAdmin = option.type === "admin";
                  const roleInfo = {
                    label: "",
                    color: "bg-gray-100 text-gray-600",
                  };

                  if (isAdmin) {
                    const role = (option.data as UserRole).role;
                    switch (role) {
                      case "SUPER_ADMIN":
                        roleInfo.label = "ผู้ดูแลระบบสูงสุด";
                        roleInfo.color = "bg-red-50 border border-red-200 text-red-700";
                        break;
                      case "ADMIN":
                        roleInfo.label = "ผู้ดูแลระบบ";
                        roleInfo.color = "bg-blue-50 border border-blue-200 text-blue-700";
                        break;
                      case "CAMPUS_ADMIN":
                        roleInfo.label = "ผู้ดูแลวิทยาเขต";
                        roleInfo.color = "bg-purple-50 border border-purple-200 text-purple-700";
                        break;
                      default:
                        roleInfo.label = "ผู้ดูแลระบบ";
                        roleInfo.color = "bg-gray-100 border border-gray-200 text-gray-700";
                    }
                  } else {
                    roleInfo.label = "สมาชิกองค์กร";
                    roleInfo.color = "bg-teal-50 border border-teal-200 text-[#006C67]";
                  }

                  return (
                    <div
                      key={roleId}
                      onClick={() => handleCardClick(option)}
                      className={`group relative flex flex-col justify-between bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-xl hover:-translate-y-1.5 ${
                        isSelected
                          ? "border-[#006C67] ring-2 ring-[#006C67]/30"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* --- Selection Badge --- */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-[#006C67] rounded-full p-1 text-white shadow-md">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}

                      {/* --- Card Content --- */}
                      <div className="p-6">
                        {/* Role Type Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${roleInfo.color}`}
                        >
                          {roleInfo.label}
                        </span>

                        {/* Main Info */}
                        <div className="mt-4">
                          <h3 className="font-bold text-gray-800 text-xl line-clamp-2 h-14">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {/* --- Footer Details --- */}
                      <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 text-sm text-gray-600">
                            {isAdmin ? (
                              <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            ) : (
                              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="font-medium">
                              {isAdmin ? "สิทธิ์ผู้ดูแลระบบ" : "สมาชิกองค์กร"}
                            </span>
                          </div>

                          {option.type === "organization" && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">
                                {(option.data as UserOrganization).organization?.organizationType?.name || "ไม่ระบุประเภท"}
                              </span>
                            </div>
                          )}

                          {isAdmin && (option.data as UserRole).campus && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">
                                {(option.data as UserRole).campus?.name || "ไม่ระบุวิทยาเขต"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* --- END: Redesigned Role Cards --- */}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedRole}
                  className={`flex items-center gap-3 px-10 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedRole
                      ? "bg-[#006C67] text-white hover:bg-[#005A56] shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>{selectedRole ? "เข้าสู่ระบบ" : "กรุณาเลือกบทบาท"}</span>
                  {selectedRole && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 z-10 w-full p-4">
        <div className="text-center text-white/70 text-sm">
          <div className="flex justify-center gap-x-4 mb-1">
            <a href="https://sa.ku.ac.th/website-policy/" target="_blank" className="hover:text-white">
              นโยบายคุ้มครองข้อมูล
            </a>
            <span>●</span>
            <a href="https://sa.ku.ac.th/" target="_blank" className="hover:text-white">
              เว็บไซต์
            </a>
            <span>●</span>
            <a href="mailto:saku@ku.th" className="hover:text-white">ติดต่อเรา</a>
          </div>
          <p>
            สงวนลิขสิทธิ์ © {new Date().getFullYear()} กองพัฒนานิสิต มหาวิทยาลัยเกษตรศาสตร์
          </p>
           <p className="text-xs opacity-80">
            {process.env.NEXT_PUBLIC_BUILD_MESSAGE ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}