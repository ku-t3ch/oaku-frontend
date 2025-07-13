import { Users, Crown, Shield, UserCog, User, UserX } from "lucide-react";
import { User as UserType } from "@/interface/user";

export function getStatSuperAdmin(users: UserType[]) {
  return [
    {
      label: "ผู้ใช้ทั้งหมด",
      count: users.length,
      icon: Users,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: "Super Admin",
      count: users.filter((user) =>
        user.userRoles?.some((role) => role.role === "SUPER_ADMIN")
      ).length,
      icon: Crown,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: "Campus Admin",
      count: users.filter((user) =>
        user.userRoles?.some((role) => role.role === "CAMPUS_ADMIN")
      ).length,
      icon: Shield,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: "Head",
      count: users.filter((user) =>
        user.userOrganizations?.some((org) => org.position === "HEAD")
      ).length,
      icon: UserCog,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: "Member",
      count: users.filter((user) =>
        user.userOrganizations?.some((org) => org.position === "MEMBER")
      ).length,
      icon: User,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: "ถูกระงับ",
      count: users.filter((user) => user.isSuspended).length,
      icon: UserX,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
  ];
}

export function getStatCampusAdmin(users: UserType[], campusName: string) {
  return [
    {
      label: `ผู้ใช้ทั้งหมด (${campusName})`,
      count: users.length,
      icon: Users,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: `หัวหน้าองค์กร (${campusName})`,
      count: users.filter((user) =>
        user.userOrganizations?.some(
          (org) =>
            org.position === "HEAD" &&
            org.organization.campus.name === campusName
        )
      ).length,
      icon: UserCog,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: `สมาชิกองค์กร (${campusName})`,
      count: users.filter((user) =>
        user.userOrganizations?.some(
          (org) =>
            org.position === "MEMBER" &&
            org.organization.campus.name === campusName
        )
      ).length,
      icon: User,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
    {
      label: `ถูกระงับ (${campusName})`,
      count: users.filter(
        (user) =>
          user.isSuspended &&
          user.userOrganizations?.some(
            (org) => org.organization.campus.name === campusName
          )
      ).length,
      icon: UserX,
      bgColor: "from-[#006C67]/15 to-[#006C67]/25",
      textColor: "text-[#006C67]",
    },
  ];
}
