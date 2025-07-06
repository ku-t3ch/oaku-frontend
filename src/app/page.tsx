"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Award,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <div className="min-h-screen"></div>;
}
