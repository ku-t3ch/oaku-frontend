"use client";
import { Kanit } from "next/font/google";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MantineProvider } from "@mantine/core"; // เพิ่มบรรทัดนี้

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="th" className={kanit.variable} suppressHydrationWarning>
      <body className={`${kanit.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider> 
            <LayoutWrapper>{children}</LayoutWrapper>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}