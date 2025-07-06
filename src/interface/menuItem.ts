import { ReactNode } from "react";

/**
 * Interface สำหรับ Menu Item ใน Sidebar
 */
export interface MenuItem {
  /** ไอคอนของเมนู */
  icon: ReactNode;
  /** ข้อความที่แสดงในเมนู */
  label: string;
  /** URL path ที่จะนำไปเมื่อคลิก */
  href: string;
  /** คำอธิบายเพิ่มเติม (optional) */
  description?: string;
  /** ระบุว่าเมนูนี้ต้องการสิทธิ์พิเศษหรือไม่ */
  requiresAuth?: boolean;
  /** Badge หรือจำนวนแจ้งเตือน (optional) */
  badge?: string | number;
  /** กลุ่มของเมนู (สำหรับจัดกลุ่ม) */
  group?: string;
  /** ซ่อนเมนูในบางกรณี */
  hidden?: boolean;
}

/**
 * Interface สำหรับกลุ่มเมนู
 */
export interface MenuGroup {
  /** ชื่อกลุ่ม */
  name: string;
  /** รายการเมนูในกลุ่ม */
  items: MenuItem[];
  /** ไอคอนของกลุ่ม (optional) */
  icon?: ReactNode;
  /** สามารถยุบได้หรือไม่ */
  collapsible?: boolean;
}

/**
 * Type สำหรับ Role ของผู้ใช้
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CAMPUS_ADMIN' | 'USER' | 'PUBLIC';

/**
 * Interface สำหรับ Menu Configuration
 */
export interface MenuConfig {
  /** Role ที่ใช้ menu config นี้ */
  role: UserRole;
  /** รายการเมนูสำหรับ role นี้ */
  items: MenuItem[];
  /** กลุ่มเมนู (optional) */
  groups?: MenuGroup[];
}