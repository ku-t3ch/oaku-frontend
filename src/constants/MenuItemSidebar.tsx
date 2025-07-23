import React from "react";
import {
  Gauge,
  Calendar,
  Users,
  Building2,
  BarChart2,
  FolderOpen,
  MapPin,
  User,
  TrendingUp,
  Clock,
  Target,
  Award,
  Shield,
  UserCheck,
} from "lucide-react";
import { MenuItem, UserRole, UserPosition } from "@/interface/menuItem";

export const menuItemsPublic: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/dashboard",
    description: "แดชบอร์ดภาพรวม",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินกิจกรรม",
    href: "/calendar",
    description: "ดูปฏิทินกิจกรรมทั้งหมด",
  },
];

export const menuItemsSuperAdmin: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/dashboard",
    description: "ภาพรวมของระบบ",
    group: "หลัก",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินกิจกรรม",
    href: "/calendar",
    description: "ดูปฏิทินกิจกรรมทั้งหมด",
    group: "หลัก",
  },
  {
    icon: <Users size={20} />,
    label: "จัดการผู้ใช้",
    href: "/SUPER_ADMIN/users-management",
    description: "จัดการข้อมูลผู้ใช้ทั้งหมด",
    group: "การจัดการ",
  },
  {
    icon: <Building2 size={20} />,
    label: "จัดการองค์กร",
    href: "/SUPER_ADMIN/organizations-management",
    description: "จัดการหน่วยงานและองค์กร",
    group: "การจัดการ",
  },

  {
    icon: <Target size={20} />,
    label: "จัดการโครงการ",
    href: "/SUPER_ADMIN/projects-management",
    description: "จัดการโครงการทั้งหมด",
    group: "โครงการ",
  },
  {
    icon: <TrendingUp size={20} />,
    label: "สถิติ",
    href: "/SUPER_ADMIN/analytics",
    description: "วิเคราะห์การใช้งานระบบ",
    group: "รายงาน",
  },
];

export const menuItemsCampusAdmin: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/dashboard",
    description: "ภาพรวมของวิทยาเขต",
    group: "หลัก",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินกิจกรรม",
    href: "/calendar",
    description: "ดูปฏิทินกิจกรรมทั้งหมด",
    group: "หลัก",
  },
  {
    icon: <Building2 size={20} />,
    label: "จัดการหน่วยงานในวิทยาเขต",
    href: "/CAMPUS_ADMIN/organizations-management",
    description: "จัดการหน่วยงานในวิทยาเขต",
    group: "การจัดการ",
  },
  {
    icon: <Users size={20} />,
    label: "จัดการผู้ใช้ในวิทยาเขต",
    href: "/CAMPUS_ADMIN/users-management",
    description: "ดูข้อมูลผู้ใช้ในวิทยาเขต",
    group: "การจัดการ",
  },
  {
    icon: <Target size={20} />,
    label: "จัดการโครงการวิทยาเขต",
    href: "/CAMPUS_ADMIN/projects-management",
    description: "โครงการในวิทยาเขต",
    group: "โครงการ",
  },
  {
    icon: <BarChart2 size={20} />,
    label: "รายงานวิทยาเขต",
    href: "/CAMPUS_ADMIN/reports",
    description: "รายงานของวิทยาเขต",
    group: "รายงาน",
  },
  {
    icon: <MapPin size={20} />,
    label: "ข้อมูลวิทยาเขต",
    href: "/CAMPUS_ADMIN/campus-info",
    description: "ข้อมูลและการตั้งค่าวิทยาเขต",
    group: "การตั้งค่า",
  },
];

// User - HEAD position (หัวหน้าฝ่าย/กลุ่ม)
export const menuItemsUserHead: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/dashboard",
    description: "ภาพรวมส่วนตัวและทีม",
    group: "หลัก",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินกิจกรรม",
    href: "/calendar",
    description: "ดูปฏิทินกิจกรรมทั้งหมด",
    group: "หลัก",
  },
  {
    icon: <Shield size={20} />,
    label: "จัดการทีม",
    href: "/USER/team-management",
    description: "จัดการสมาชิกในทีม",
    group: "การจัดการ",
  },
  {
    icon: <UserCheck size={20} />,
    label: "อนุมัติการเข้าร่วม",
    href: "/USER/approvals",
    description: "อนุมัติการเข้าร่วมกิจกรรมของทีม",
    group: "การจัดการ",
  },
  {
    icon: <Award size={20} />,
    label: "กิจกรรมของฉัน",
    href: "/USER/activities",
    description: "กิจกรรมที่เข้าร่วม",
    group: "กิจกรรม",
  },
  {
    icon: <FolderOpen size={20} />,
    label: "โครงการที่เข้าร่วม",
    href: "/USER/projects",
    description: "โครงการที่เข้าร่วม",
    group: "กิจกรรม",
  },
  {
    icon: <BarChart2 size={20} />,
    label: "รายงานทีม",
    href: "/USER/team-reports",
    description: "รายงานกิจกรรมของทีม",
    group: "รายงาน",
  },
  {
    icon: <Clock size={20} />,
    label: "สรุปชั่วโมงกิจกรรม",
    href: "/USER/hours-summary",
    description: "สรุปชั่วโมงการเข้าร่วมกิจกรรม",
    group: "รายงาน",
  },
  {
    icon: <User size={20} />,
    label: "ตั้งค่าโปรไฟล์",
    href: "/USER/profile",
    description: "การตั้งค่าข้อมูลส่วนตัว",
    group: "การตั้งค่า",
  },
];

// User - MEMBER position (สมาชิกทั่วไป)
export const menuItemsUserMember: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/dashboard",
    description: "ภาพรวมส่วนตัว",
    group: "หลัก",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินกิจกรรม",
    href: "/calendar",
    description: "ดูปฏิทินกิจกรรมทั้งหมด",
    group: "หลัก",
  },
  {
    icon: <Award size={20} />,
    label: "กิจกรรมของฉัน",
    href: "/USER/activities",
    description: "กิจกรรมที่เข้าร่วม",
    group: "กิจกรรม",
  },
  {
    icon: <FolderOpen size={20} />,
    label: "โครงการที่เข้าร่วม",
    href: "/USER/projects",
    description: "โครงการที่เข้าร่วม",
    group: "กิจกรรม",
  },
  {
    icon: <Clock size={20} />,
    label: "สรุปชั่วโมงกิจกรรม",
    href: "/USER/hours-summary",
    description: "สรุปชั่วโมงการเข้าร่วมกิจกรรม",
    group: "รายงาน",
  },
  {
    icon: <User size={20} />,
    label: "ตั้งค่าโปรไฟล์",
    href: "/USER/profile",
    description: "การตั้งค่าข้อมูลส่วนตัว",
    group: "การตั้งค่า",
  },
];

export const getMenuItemsByRole = (
  role: UserRole,
  position?: UserPosition
): MenuItem[] => {
  switch (role) {
    case "SUPER_ADMIN":
      return menuItemsSuperAdmin;

    case "CAMPUS_ADMIN":
      return menuItemsCampusAdmin;
    case "USER":
      switch (position) {
        case "HEAD":
          return menuItemsUserHead;
        case "MEMBER":
          return menuItemsUserMember;
        default:
          return menuItemsUserMember; // Default to member for USER role
      }
    case "PUBLIC":
    default:
      return menuItemsPublic;
  }
};

export const groupMenuItems = (items: MenuItem[]) => {
  const groups: { [key: string]: MenuItem[] } = {};

  items.forEach((item) => {
    const groupName = item.group || "อื่นๆ";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(item);
  });

  return groups;
};
