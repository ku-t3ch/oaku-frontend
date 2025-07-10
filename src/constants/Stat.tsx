import {
  Users,
  Crown,
  Shield,
  UserCheck,
} from "lucide-react";
import { User } from "@/interface/user";

export function getStats(users: User[]) {
  return [
    {
      label: "ผู้ใช้ทั้งหมด",
      count: users.length,
      icon: Users,
    bgColor: "from-[#006C67]/10 to-[#006C67]/20",
      textColor: "text-[#006C67]",
    },
    {
      label: "ผู้ดูแลระบบสูงสุด",
      count: users.filter((user) =>
        user.userRoles?.some((role) => role.role === "SUPER_ADMIN")
      ).length,
      icon: Crown,
      bgColor: "from-[#006C67]/10 to-[#006C67]/20",
      textColor: "text-[#006C67]",
    },
    {
      label: "ผู้ดูแลวิทยาเขต",
      count: users.filter((user) =>
        user.userRoles?.some((role) => role.role === "CAMPUS_ADMIN")
      ).length,
      icon: Shield,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: "สมาชิกองค์กร",
      count: users.filter(
        (user) => user.userOrganizations && user.userOrganizations.length > 0
      ).length,
      icon: UserCheck,
      bgColor: "from-[#006C67]/20 to-[#006C67]/30",
      textColor: "text-[#006C67]",
    },
  ];
}