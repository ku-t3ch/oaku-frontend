"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

interface LayoutWrapperProps {
  children: React.ReactNode;
  menuItems: any[];
}

export default function LayoutWrapper({ children, menuItems }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  const isAuthRoute = pathname.includes("/login");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar menuItems={menuItems} />
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}