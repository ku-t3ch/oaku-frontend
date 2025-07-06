import React from "react";
import {
  Gauge,
  Calendar,
  Users,
  Building2,
  FileText,
  BarChart2,
  Settings,
  Shield,
  UserPlus,
  FolderOpen,
  Activity,
  PieChart,
  School,
  MapPin,
} from "lucide-react";
import { MenuItem, UserRole } from "@/interface/menuItem";

// ✅ Menu Items สำหรับ Public (ผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ)
export const menuItemsPublic: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "หน้าแรก",
    href: "/",
    description: "หน้าหลักของระบบ",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินกิจกรรม",
    href: "/calendar",
    description: "ดูปฏิทินกิจกรรมทั้งหมด",
  },
];

// ✅ Menu Items สำหรับ SUPER_ADMIN
export const menuItemsSuperAdmin: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/SUPER_ADMIN",
    description: "ภาพรวมของระบบ",
    group: "หลัก",
  },
  {
    icon: <Users size={20} />,
    label: "จัดการผู้ใช้",
    href: "/SUPER_ADMIN/users",
    description: "จัดการข้อมูลผู้ใช้ทั้งหมด",
    group: "การจัดการ",
  },
  {
    icon: <Building2 size={20} />,
    label: "จัดการองค์กร",
    href: "/SUPER_ADMIN/organizations",
    description: "จัดการหน่วยงานและองค์กร",
    group: "การจัดการ",
  },
  {
    icon: <School size={20} />,
    label: "จัดการวิทยาเขต",
    href: "/SUPER_ADMIN/campuses",
    description: "จัดการข้อมูลวิทยาเขต",
    group: "การจัดการ",
  },
  {
    icon: <FileText size={20} />,
    label: "จัดการโครงการ",
    href: "/SUPER_ADMIN/projects",
    description: "จัดการโครงการทั้งหมด",
    group: "โครงการ",
  },
  {
    icon: <Activity size={20} />,
    label: "กิจกรรมทั้งหมด",
    href: "/SUPER_ADMIN/activities",
    description: "ดูกิจกรรมทั้งหมดในระบบ",
    group: "โครงการ",
  },
  {
    icon: <BarChart2 size={20} />,
    label: "รายงานกิจกรรม",
    href: "/SUPER_ADMIN/reports",
    description: "รายงานและสถิติต่างๆ",
    group: "รายงาน",
  },
  {
    icon: <PieChart size={20} />,
    label: "สถิติระบบ",
    href: "/SUPER_ADMIN/analytics",
    description: "วิเคราะห์การใช้งานระบบ",
    group: "รายงาน",
  },
  {
    icon: <Settings size={20} />,
    label: "ตั้งค่าระบบ",
    href: "/SUPER_ADMIN/settings",
    description: "การตั้งค่าระบบทั่วไป",
    group: "ระบบ",
  },
];

// ✅ Menu Items สำหรับ ADMIN
export const menuItemsAdmin: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/ADMIN",
    description: "ภาพรวมของหน่วยงาน",
    group: "หลัก",
  },
  {
    icon: <Users size={20} />,
    label: "จัดการสมาชิก",
    href: "/ADMIN/members",
    description: "จัดการสมาชิกในหน่วยงาน",
    group: "การจัดการ",
  },
  {
    icon: <UserPlus size={20} />,
    label: "เชิญสมาชิกใหม่",
    href: "/ADMIN/invite",
    description: "เชิญสมาชิกใหม่เข้าหน่วยงาน",
    group: "การจัดการ",
  },
  {
    icon: <FileText size={20} />,
    label: "จัดการโครงการ",
    href: "/ADMIN/projects",
    description: "โครงการของหน่วยงาน",
    group: "โครงการ",
  },
  {
    icon: <Activity size={20} />,
    label: "กิจกรรมหน่วยงาน",
    href: "/ADMIN/activities",
    description: "กิจกรรมในหน่วยงาน",
    group: "โครงการ",
  },
  {
    icon: <BarChart2 size={20} />,
    label: "รายงานกิจกรรม",
    href: "/ADMIN/reports",
    description: "รายงานของหน่วยงาน",
    group: "รายงาน",
  },
  {
    icon: <Settings size={20} />,
    label: "ตั้งค่าหน่วยงาน",
    href: "/ADMIN/settings",
    description: "การตั้งค่าหน่วยงาน",
    group: "การตั้งค่า",
  },
];

// ✅ Menu Items สำหรับ CAMPUS_ADMIN
export const menuItemsAdminCampus: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/CAMPUS_ADMIN",
    description: "ภาพรวมของวิทยาเขต",
    group: "หลัก",
  },
  {
    icon: <Building2 size={20} />,
    label: "หน่วยงานในวิทยาเขต",
    href: "/CAMPUS_ADMIN/organizations",
    description: "จัดการหน่วยงานในวิทยาเขต",
    group: "การจัดการ",
  },
  {
    icon: <Users size={20} />,
    label: "ผู้ใช้ในวิทยาเขต",
    href: "/CAMPUS_ADMIN/users",
    description: "ดูข้อมูลผู้ใช้ในวิทยาเขต",
    group: "การจัดการ",
  },
  {
    icon: <FileText size={20} />,
    label: "โครงการวิทยาเขต",
    href: "/CAMPUS_ADMIN/projects",
    description: "โครงการในวิทยาเขต",
    group: "โครงการ",
  },
  {
    icon: <Activity size={20} />,
    label: "กิจกรรมวิทยาเขต",
    href: "/CAMPUS_ADMIN/activities",
    description: "กิจกรรมในวิทยาเขต",
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

// ✅ Menu Items สำหรับ USER
export const menuItemsUser: MenuItem[] = [
  {
    icon: <Gauge size={20} />,
    label: "แดชบอร์ด",
    href: "/USER",
    description: "ภาพรวมส่วนตัว",
    group: "หลัก",
  },
  {
    icon: <Calendar size={20} />,
    label: "ปฏิทินของฉัน",
    href: "/USER/calendar",
    description: "ปฏิทินกิจกรรมส่วนตัว",
    group: "หลัก",
  },
  {
    icon: <FileText size={20} />,
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
    label: "สรุปชั่วโมงกิจกรรม",
    href: "/USER/hours-summary",
    description: "สรุปชั่วโมงการเข้าร่วมกิจกรรม",
    group: "รายงาน",
  },
  {
    icon: <Settings size={20} />,
    label: "ตั้งค่าโปรไฟล์",
    href: "/USER/profile",
    description: "การตั้งค่าข้อมูลส่วนตัว",
    group: "การตั้งค่า",
  },
];

// ✅ Helper function เพื่อดึง menu items ตาม role
export const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
  switch (role) {
    case "SUPER_ADMIN":
      return menuItemsSuperAdmin;
    case "ADMIN":
      return menuItemsAdmin;
    case "CAMPUS_ADMIN":
      return menuItemsAdminCampus;
    case "USER":
      return menuItemsUser;
    case "PUBLIC":
    default:
      return menuItemsPublic;
  }
};

// ✅ Helper function เพื่อจัดกลุ่ม menu items
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
