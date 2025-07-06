"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserOrganization } from "@/interface/userOrganization";
import {
  getRoleLabel,
  getPositionLabel,
  getRoleBadgeClasses,
} from "@/utils/roleUtils";
import { formatShortDate } from "@/utils/formatUtils";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img
              className="h-16 object-contain"
              src="/OAKU-Logo-nobg.png"
              alt="OAKU Logo"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            เลือกหน่วยงานและตำแหน่ง
          </h1>
          <p className="text-gray-600">
            คุณเป็นสมาชิกของหลายหน่วยงาน
            กรุณาเลือกหน่วยงานและตำแหน่งที่ต้องการเข้าใช้งาน
          </p>
        </div>

        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
          {userOrganizations.map((userOrg) => (
            <label
              key={userOrg.id}
              className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                selectedOrg === userOrg.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="organization"
                value={userOrg.id}
                checked={selectedOrg === userOrg.id}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Organization Info */}
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {userOrg.organization?.nameTh || "ไม่ระบุชื่อองค์กร"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {userOrg.organization?.nameEn || "No English name"}
                    </p>
                    {/* ✅ เพิ่ม optional chaining และ fallback */}
                    <p className="text-sm text-gray-500">
                      📍{" "}
                      {userOrg.organization?.campus?.name || "ไม่ระบุวิทยาเขต"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {userOrg.organization?.organizationType?.name ||
                        "ไม่ระบุประเภท"}{" "}
                      • {userOrg.organizationIdCode || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="text-right ml-4">
                  {/* Role Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getRoleBadgeClasses(
                      userOrg.role
                    )}`}
                  >
                    {getRoleLabel(userOrg.role)}
                  </span>

                  {/* Position Badge */}
                  {userOrg.position && userOrg.position !== "NON_POSITION" && (
                    <div>
                      <span className="inline-block px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                        {getPositionLabel(userOrg.position)}
                      </span>
                    </div>
                  )}

                  {/* Join Date */}
                  {userOrg.joinedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      เข้าร่วม: {formatShortDate(userOrg.joinedAt)}
                    </p>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="border-t pt-6">
          <button
            onClick={handleSelectOrganization}
            disabled={!selectedOrg}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
              selectedOrg
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedOrg ? "เข้าสู่ระบบ" : "กรุณาเลือกหน่วยงาน"}
          </button>
        </div>
      </div>
    </div>
  );
}
