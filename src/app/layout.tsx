import { Kanit } from "next/font/google";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import {
  menuItemsSuperAdmin,
  menuItemsAdmin,
  menuItemsAdminCampus,
  menuItemsUser,
  menuItemsPublic,
} from "@/constants/MenuItemSidebar";
import LayoutWrapper from "../components/layout/LayoutWrapper";

import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

function getUserRole(): string {
  return "SUPER_ADMIN";
}

function getMenuItemsByRole(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return menuItemsSuperAdmin;
    case "ADMIN":
      return menuItemsAdmin;
    case "CAMPUS_ADMIN":
      return menuItemsAdminCampus;
    case "USER":
      return menuItemsUser;
    default:
      return menuItemsPublic;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = getUserRole();
  const menuItems = getMenuItemsByRole(role);

  return (
    <html lang="th" className={kanit.variable} suppressHydrationWarning>
      <body className={`${kanit.className} antialiased`}>
        <LayoutWrapper menuItems={menuItems}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}