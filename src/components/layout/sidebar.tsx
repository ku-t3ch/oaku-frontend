"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { MenuItem } from "@/interface/menuItem";
import { getRoleLabel } from "@/utils/roleUtils";

// ✅ Component สำหรับแต่ละ menu item
type SidebarItemProps = {
  item: MenuItem;
  isActive: boolean;
};

function SidebarItem({ item, isActive }: SidebarItemProps) {
  return (
    <Link href={item.href}>
      <div className={`hover:bg-[#006C67]/20 rounded-md p-2 text-md mb-2 cursor-pointer transition-colors ${
        isActive ? 'bg-[#006C67]/30 text-[#004D49]' : ''
      }`}>
        <div className="flex gap-2 items-center">
          {item.icon}
          <h3 className="truncate">{item.label}</h3>
        </div>
      </div>
    </Link>
  );
}

// ✅ Main Sidebar Component
interface SidebarProps {
  menuItems: MenuItem[];
  currentRole: string;
}

export default function Sidebar({ menuItems, currentRole }: SidebarProps) {
  const pathname = usePathname();
  const safeMenuItems = menuItems || [];

  console.log('🎛️ Sidebar Debug:', {
    currentRole,
    menuItemsCount: safeMenuItems.length,
    pathname
  });

  return (
    <aside className="fixed top-0 left-0 w-60 h-full bg-white border-r border-gray-100 text-[#006C67] flex flex-col items-center py-2 z-20 shadow-sm">
      {/* Logo */}
      <img
        src="/OAKU-LOGO.png"
        alt="Oaku Logo"
        className="w-full mb-4 object-cover px-4"
        onError={(e) => {
          // Fallback หาก logo ไม่โหลดได้
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'block';
        }}
      />
      
      {/* Fallback Logo */}
      <div 
        className="w-full mb-4 px-4 hidden"
        style={{ display: 'none' }}
      >
        <div className="flex items-center justify-center h-16 bg-[#006C67] rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#006C67] font-bold text-lg">O</span>
            </div>
            <h1 className="ml-2 text-white font-bold text-lg">OAKU</h1>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="w-full px-4 mb-4">
        <div className="text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            currentRole === 'PUBLIC' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {getRoleLabel(currentRole)}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col w-full px-4 mb-6 flex-1 overflow-y-auto">
        {safeMenuItems.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">ไม่มีเมนูที่ใช้ได้</p>
          </div>
        ) : (
          safeMenuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <SidebarItem 
                key={idx} 
                item={item} 
                isActive={isActive}
              />
            );
          })
        )}
      </nav>

      {/* Footer */}
      <div className="w-full px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          OAKU System v1.0
        </p>
        {/* Debug Info (เฉพาะ development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-1 text-xs text-gray-400 text-center">
            {currentRole} | {safeMenuItems.length} items
          </div>
        )}
      </div>
    </aside>
  );
}