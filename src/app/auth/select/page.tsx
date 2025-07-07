"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserOrganization } from "@/interface/userOrganization";
import {
  getRoleLabel,
  getPositionLabel,
} from "@/utils/roleUtils";
import {
  CheckCircle,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function AuthSelectPage() {
  const router = useRouter();
  const [userOrganizations, setUserOrganizations] = useState<
    UserOrganization[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string>("");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      router.push("/Login");
      return;
    }

    try {
      const userData = JSON.parse(userString);
      const orgs = userData.userOrganizations || userData.organizations || [];

      if (orgs && orgs.length > 0) {
        setUserOrganizations(orgs);
      } else {
        router.push("/USER");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/Login?error=parse_error");
    }

    setLoading(false);
  }, [router]);

  const handleSelectOrganization = () => {
    if (!selectedOrg) {
      alert("กรุณาเลือกหน่วยงานและตำแหน่ง");
      return;
    }

    const selected = userOrganizations.find((org) => org.id === selectedOrg);
    if (!selected) return;

    localStorage.setItem("selectedOrganization", JSON.stringify(selected));
    window.dispatchEvent(new Event("authStateChanged"));

    const role = selected.role;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl  mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img
              className="h-25 object-contain mx-auto"
              src="/OAKU-Logo-nobg.png"
              alt="OAKU Logo"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            เลือกหน่วยงานและตำแหน่ง
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            คุณเป็นสมาชิกของหลายหน่วยงาน กรุณาเลือกหน่วยงานที่ต้องการเข้าใช้งาน
          </p>
        </div>

        {/* Organization Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {userOrganizations.map((userOrg) => (
            <div
              key={userOrg.id}
              onClick={() => setSelectedOrg(userOrg.id)}
              className={`group relative bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                selectedOrg === userOrg.id
                  ? "border-[#006C67] ring-2 ring-[#006C67]/20 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Selection Indicator */}
              {selectedOrg === userOrg.id && (
                <div className="absolute -top-2 -right-2 bg-[#006C67] rounded-full p-1.5 shadow-lg z-10">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {userOrg.organization?.nameTh || "ไม่ระบุชื่อองค์กร"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                      {userOrg.organization?.nameEn || "No English name"}
                    </p>
                  </div>
                </div>

                {/* Role and Position Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#006C67] text-white">
                    {getRoleLabel(userOrg.role)}
                  </span>
                  {userOrg.position && userOrg.position !== "NON_POSITION" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {getPositionLabel(userOrg.position)}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {userOrg.organization?.campus?.name || "ไม่ระบุวิทยาเขต"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {userOrg.organization?.organizationType?.name ||
                        "ไม่ระบุประเภท"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div
                className={`px-6 py-3 rounded-b-2xl border-t transition-colors ${
                  selectedOrg === userOrg.id
                    ? "bg-[#006C67]/5 border-[#006C67]/20"
                    : "bg-gray-50/50 border-gray-100 group-hover:bg-gray-50"
                }`}
              >
                <p
                  className={`text-center text-sm font-medium ${
                    selectedOrg === userOrg.id
                      ? "text-[#006C67]"
                      : "text-gray-500"
                  }`}
                >
                  {selectedOrg === userOrg.id
                    ? "✓ เลือกแล้ว"
                    : "คลิกเพื่อเลือก"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSelectOrganization}
            disabled={!selectedOrg}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
              selectedOrg
                ? "bg-[#006C67] text-white hover:bg-[#005A56] shadow-sm hover:shadow-md"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>{selectedOrg ? "เข้าสู่ระบบ" : "กรุณาเลือกหน่วยงาน"}</span>
            {selectedOrg && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {selectedOrg && (
          <p className="text-center text-sm text-gray-500 mt-4">
            คลิกเพื่อเข้าสู่ระบบด้วยหน่วยงานที่เลือก
          </p>
        )}
      </div>
    </div>
  );
}
