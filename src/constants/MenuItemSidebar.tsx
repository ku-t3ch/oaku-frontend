import React from "react";
import {
  Gauge,
  Calendar,
  Users,
  Building2,
  FileText,
  BarChart2,
} from "lucide-react";

export type MenuItem = {
  icon: React.ReactNode;
  label: string;
};

export const menuItemsPublic: MenuItem[] = [
  { icon: <Gauge size={20} />, label: "แดชบอร์ด" },
  { icon: <Calendar size={20} />, label: "ปฏิทิน" },
];

export const menuItemsSuperAdmin: MenuItem[] = [
  { icon: <Users size={20} />, label: "จัดการผู้ใช้" },
  { icon: <Building2 size={20} />, label: "จัดการองค์กร" },
  { icon: <FileText size={20} />, label: "จัดการโครงการ" },
  { icon: <BarChart2 size={20} />, label: "รายงานกิจกรรม" },
];

export const menuItemsAdmin: MenuItem[] = [
  { icon: <Users size={20} />, label: "จัดการผู้ใช้" },
  { icon: <Building2 size={20} />, label: "จัดการองค์กร" },
  { icon: <FileText size={20} />, label: "จัดการโครงการ" },
  { icon: <BarChart2 size={20} />, label: "รายงานกิจกรรม" },
];

export const menuItemsAdminCampus: MenuItem[] = [
  { icon: <Users size={20} />, label: "จัดการผู้ใช้" },
  { icon: <Building2 size={20} />, label: "จัดการองค์กร" },
  { icon: <FileText size={20} />, label: "จัดการโครงการ" },
  { icon: <BarChart2 size={20} />, label: "รายงานกิจกรรม" },
];

export const menuItemsUser: MenuItem[] = [
  { icon: <Gauge size={20} />, label: "แดชบอร์ด" },
  { icon: <Calendar size={20} />, label: "ปฏิทิน" },
  { icon: <FileText size={20} />, label: "กิจกรรมของฉัน" },
  { icon: <BarChart2 size={20} />, label: "สรุปชั่วโมงกิจกรรม" },
];
