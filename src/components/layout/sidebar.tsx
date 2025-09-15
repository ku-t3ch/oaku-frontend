"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { MenuItem } from "@/interface/menuItem";
import Image from "next/image";

type SidebarItemProps = {
  item: MenuItem;
  isActive: boolean;
};

const SidebarItem = React.memo(function SidebarItem({
  item,
  isActive,
}: SidebarItemProps) {
  return (
    <Link href={item.href}>
      <div
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-4 ${
          isActive
            ? "bg-[#006C67] text-white"
            : "text-gray-700 hover:bg-gray-50 hover:text-[#006C67]"
        }`}
      >
        <div className={`${isActive ? "text-white" : "text-gray-500"}`}>
          {item.icon}
        </div>
        <span className="font-medium text-sm">{item.label}</span>
      </div>
    </Link>
  );
});

interface SidebarProps {
  menuItems: MenuItem[];
  currentRole: string;
}

const Sidebar = React.memo(
  function Sidebar({ menuItems }: SidebarProps) {
    const pathname = usePathname();
    const safeMenuItems = menuItems || [];

    // ฟังก์ชันตรวจสอบว่า menu item ไหนควรเป็น active
    const getActiveState = (item: MenuItem, index: number) => {
      // ตรวจสอบว่า path ตรงกันแบบเฉพาะเจาะจง
      if (pathname === item.href) {
        return true;
      }

      // ตรวจสอบว่า path ปัจจุบันเป็น sub-path ของ menu item หรือไม่
      if (item.href !== "/" && pathname.startsWith(item.href)) {
        return true;
      }

      // ถ้าไม่มี item ไหนตรงกับ pathname และเป็น item แรก ให้เป็น active
      const hasMatchingPath = safeMenuItems.some(
        (menuItem) =>
          pathname === menuItem.href ||
          (menuItem.href !== "/" && pathname.startsWith(menuItem.href))
      );

      if (
        !hasMatchingPath &&
        index === 0 &&
        !(item.href !== "/" && pathname.startsWith(item.href))
      ) {
        return true;
      }

      return false;
    };

    return (
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-20 shadow-lg">
        {/* Header */}
        <div className="flex-shrink-0 mt-4 mx-auto">
          <div className="flex items-center">
            <Image
              width={320}
              height={80}
              src="/OAKU-LOGO.png"
              alt="Oaku Logo"
              className=" w-full h-20 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />

            {/* Fallback */}
            <div className="hidden items-center gap-2">
              <div className="w-8 h-8 bg-[#006C67] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-[#006C67] font-bold text-lg">OAKU</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 mt-4 overflow-y-auto">
          {safeMenuItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">ไม่มีเมนูที่ใช้ได้</p>
            </div>
          ) : (
            <div className="space-y-1">
              {safeMenuItems.map((item, idx) => {
                const isActive = getActiveState(item, idx);
                return (
                  <SidebarItem key={idx} item={item} isActive={isActive} />
                );
              })}
            </div>
          )}
        </nav>
      </aside>
    );
  },
  (prevProps, nextProps) => {
    function areMenuItemsEqual(a: MenuItem[], b: MenuItem[]) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i].label !== b[i].label || a[i].href !== b[i].href) {
          return false;
        }
      }
      return true;
    }

    return (
      prevProps.currentRole === nextProps.currentRole &&
      areMenuItemsEqual(prevProps.menuItems, nextProps.menuItems)
    );
  }
);

export default Sidebar;
