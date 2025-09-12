"use client";
import React, { useEffect, useState } from "react";
import { User } from "@/interface/user";
import Image from "next/image";
import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaGraduationCap,
  FaUserTag,
  FaIdBadge,
} from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("user?.image:", user?.image);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const parsedUser = JSON.parse(userString);
          setUser(parsedUser);
        } catch {
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-emerald-200">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin mb-4"></div>
        <p className="text-lg text-emerald-700">กำลังโหลดข้อมูลโปรไฟล์...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-100 to-red-300 text-white p-4">
        <h1 className="text-3xl font-bold mb-2">โปรไฟล์</h1>
        <p className="text-lg mb-4">
          ไม่พบข้อมูลผู้ใช้ กรุณาลองเข้าสู่ระบบอีกครั้ง
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-red-600 font-semibold rounded-full shadow hover:bg-red-50 transition"
        >
          รีเฟรชหน้า
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2">
      <div className="relative w-full max-w-xl p-0">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-emerald-50 blur-sm opacity-80"></div>
        <div className="relative bg-white rounded-3xl shadow-xl p-10 border border-emerald-200 ring-1 ring-emerald-100/40 backdrop-blur-md">
          <div className="flex flex-col items-center mb-8">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border border-emerald-200 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-200 flex items-center justify-center text-3xl font-bold text-white shadow">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {user.name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            {user.phoneNumber && (
              <p className="text-gray-500">{user.phoneNumber}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaIdBadge className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">รหัสผู้ใช้</div>
                <div className="text-gray-800 font-medium">
                  {user.userId || "-"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaGraduationCap className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">วิทยาเขต</div>
                <div className="text-gray-800 font-medium">
                  {user.campus?.name || "-"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaUserTag className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">บทบาท</div>
                <div className="text-gray-800 font-medium">
                  {user.userRoles && user.userRoles.length > 0
                    ? user.userRoles.map((r) => r.role).join(", ")
                    : "-"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaBuilding className="text-emerald-400 mt-1" />
              <div>
                <div className="text-xs text-gray-500">องค์กรที่สังกัด</div>
                <div className="text-gray-800 font-medium">
                  {user.userOrganizations && user.userOrganizations.length > 0
                    ? user.userOrganizations
                        .map(
                          (org) =>
                            `${
                              org.organization?.nameTh ||
                              org.organization?.nameEn ||
                              "-"
                            } (${org.position || "-"})`
                        )
                        .join(", ")
                    : "-"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaEnvelope className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">อีเมล</div>
                <div className="text-gray-800 font-medium">
                  {user.email || "-"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaPhone className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">เบอร์โทร</div>
                <div className="text-gray-800 font-medium">
                  {user.phoneNumber || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
