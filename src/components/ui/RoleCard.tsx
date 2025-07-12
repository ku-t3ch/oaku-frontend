import {
  CheckCircle,
  Shield,
  Users,
  Building2,
  MapPin,
  AlertCircle,
  Lock,
} from "lucide-react";
import { RoleOption } from "@/hooks/useUserRoles";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";

interface RoleCardProps {
  option: RoleOption;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean; // เพิ่มรองรับ disabled
}

const getRoleStyling = (option: RoleOption) => {
  if (option.type === "admin") {
    const role = (option.data as UserRole).role;
    switch (role) {
      case "SUPER_ADMIN":
        return {
          label: "ผู้ดูแลระบบสูงสุด",
          color: "bg-red-50 text-red-600",
          dot: "bg-red-200",
        };
      case "CAMPUS_ADMIN":
        return {
          label: "ผู้ดูแลวิทยาเขต",
          color: "bg-[#006C67]/10 text-[#006C67]",
          dot: "bg-[#006C67]/60",
        };
      default:
        return {
          label: "ผู้ดูแลระบบ",
          color: "bg-slate-50 text-slate-600",
          dot: "bg-slate-200",
        };
    }
  }
  const position = (option.data as UserOrganization).position;
  if (position === "HEAD") {
    return {
      label: "หัวหน้าองค์กร",
      color: "bg-amber-50 text-amber-600",
      dot: "bg-amber-200",
    };
  }
  return {
    label: "สมาชิกองค์กร",
    color: "bg-blue-50 text-blue-600",
    dot: "bg-blue-200",
  };
};

export const RoleCard = ({
  option,
  isSelected,
  onClick,
  disabled = false,
}: RoleCardProps) => {
  const roleStyling = getRoleStyling(option);
  const isAdmin = option.type === "admin";

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`group relative bg-white/75 rounded-lg border-2 transition-all duration-200 p-4 w-64 h-40
        ${
          disabled
            ? "opacity-60 pointer-events-none cursor-not-allowed"
            : "cursor-pointer hover:shadow-sm hover:-translate-y-0.5"
        }
        ${
          isSelected
            ? disabled
              ? "border-red-300/70 bg-red-50/30"
              : "border-[#006C67]/50 bg-[#006C67]/50"
            : "border-white hover:border-white/50 hover:bg-white/80"
        }
      `}
    >
      {/* Suspended overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-red-50/80 rounded-lg border-2 border-red-200 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="bg-red-100 rounded-full p-2">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-red-700 mb-1">
              บัญชีถูกระงับ
            </div>
            <div className="text-xs text-red-600">ไม่สามารถเข้าใช้งานได้</div>
            {/* Show selection status even when disabled */}
            {isSelected && (
              <div className="mt-2 text-xs text-red-600 font-medium">
                (ถูกเลือกอยู่)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selection indicator and warning icon */}
      <div className="absolute top-3 right-3 z-20">
        {isSelected ? (
          <CheckCircle className="w-5 h-5 text-[#006C67]" />
        ) : disabled ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : null}
      </div>

      {/* Content */}
      <div className={`flex flex-col h-full ${disabled ? "opacity-40" : ""}`}>
        {/* Header with badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${roleStyling.dot}`} />
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md ${roleStyling.color}`}
          >
            {roleStyling.label}
          </span>
        </div>

        {/* Title and description */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2 mb-1">
            {option.label}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {option.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {isAdmin ? (
              <Shield className="w-3 h-3 text-gray-400" />
            ) : (
              <Users className="w-3 h-3 text-gray-400" />
            )}
            <span>
              {isAdmin
                ? (() => {
                    const role = (option.data as UserRole).role;
                    if (role === "SUPER_ADMIN") return "Super Admin";
                    if (role === "CAMPUS_ADMIN") return "Campus Admin";
                    return "Admin";
                  })()
                : (() => {
                    const position = (option.data as UserOrganization).position;
                    if (position === "HEAD") return "หัวหน้าองค์กร";
                    return "สมาชิกองค์กร";
                  })()}
            </span>
          </div>

          {option.type === "organization" && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building2 className="w-3 h-3 text-gray-400" />
              <span className="truncate">
                {(option.data as UserOrganization).organization
                  ?.organizationType?.name || "ไม่ระบุ"}
              </span>
            </div>
          )}

          {isAdmin && (option.data as UserRole).campus && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="truncate">
                {(option.data as UserRole).campus?.name || "ไม่ระบุ"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
