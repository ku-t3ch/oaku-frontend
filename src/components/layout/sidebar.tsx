import React from "react";
import { MenuItem } from "../../constants/MenuItemSidebar";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
};

function SidebarItem({ icon, label }: SidebarItemProps) {
  return (
    <div className="hover:bg-[#006C67]/20 rounded-md p-2 text-md mb-2 cursor-pointer transition-colors">
      <div className="flex gap-2 items-center">
        {icon}
        <h3 className="truncate">{label}</h3>
      </div>
    </div>
  );
}

type SidebarProps = {
  menuItems: MenuItem[];
};

export default function Sidebar({ menuItems }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 w-60 h-full bg-white border-r border-gray-100 text-[#006C67] flex flex-col items-center py-2 z-20 shadow-sm">
      <img
        src="/OAKU-LOGO.png"
        alt="Oaku Logo"
        className="w-full mb-8 object-cover"
      />

      <nav className="flex flex-col w-full px-4 mb-6">
        {menuItems.map((item, idx) => (
          <SidebarItem key={idx} icon={item.icon} label={item.label} />
        ))}
      </nav>
    </aside>
  );
}
