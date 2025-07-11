import { CheckCircle, Shield, Users, Building2, MapPin } from "lucide-react";
import { RoleOption } from "@/hooks/useUserRoles";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";

interface RoleCardProps {
  option: RoleOption;
  isSelected: boolean;
  onClick: () => void;
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

export const RoleCard = ({ option, isSelected, onClick }: RoleCardProps) => {
  const roleStyling = getRoleStyling(option);
  const isAdmin = option.type === "admin";

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white/75 rounded-lg border-2 transition-all duration-200 cursor-pointer p-4 hover:shadow-sm hover:-translate-y-0.5 w-64 h-40 ${
        isSelected
          ? "border-[#006C67]/50 bg-[#006C67]/50"
          : "border-white hover:border-white/50 hover:bg-white/80"
      }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="w-4 h-4 text-[#006C67]" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Header with badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${roleStyling.dot}`} />
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${roleStyling.color}`}>
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
                {(option.data as UserOrganization).organization?.organizationType?.name || "ไม่ระบุ"}
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
