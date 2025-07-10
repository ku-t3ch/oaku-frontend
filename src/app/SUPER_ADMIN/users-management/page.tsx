"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { User } from "@/interface/user"; // FIX: Import defined types
import { Campus } from "@/interface/campus"; // FIX: Import defined types
import {
  getRoleLabel,
  getPositionLabel,
  getRolePriority,
} from "@/utils/roleUtils";
import { UserRole } from "@/interface/userRole"; // FIX: Import defined types
import { getStats } from "@/constants/Stat";
import { useUsers } from "@/hooks/useUsers";
import { useCampus } from "@/hooks/useCampus";
import { useOrganization } from "@/hooks/useOrganization";
import { StatCard } from "@/components/ui/statcard";
import { ListUserCard } from "@/components/ui/ListUserCard";
import { CardInfoUser } from "@/components/ui/CardInfoUser";
import {
  Users,
  Crown,
  Shield,
  UserCheck,
  ChevronDown,
  Filter,
  Loader2,
  UserX,
  MapPin,
  Search,
} from "lucide-react";


function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function UsersManagementPage() {
  const { users, refetch: refetchUsers } = useUsers();
  const { campuses, loading: isCampusLoading } = useCampus();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const roleFilterRef = useRef<HTMLDivElement>(null);
  useClickOutside(roleFilterRef, () => setShowRoleFilter(false));
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [showCampusFilter, setShowCampusFilter] = useState(false);
  const campusFilterRef = useRef<HTMLDivElement>(null);
  useClickOutside(campusFilterRef, () => setShowCampusFilter(false));
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [showOrganizationFilter, setShowOrganizationFilter] = useState(false);
  const organizationFilterRef = useRef<HTMLDivElement>(null);
  useClickOutside(organizationFilterRef, () => setShowOrganizationFilter(false));
  const { organizations, orgLoading } = useOrganization(selectedCampus);

  const stats = getStats(users);

  // หา user ที่เลือกจาก users ที่อัพเดตล่าสุด
  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  // ฟังก์ชันเปิด modal
  const handleSelectUser = (userId: string) => setSelectedUserId(userId);

  // ฟังก์ชันปิด modal
  const handleCloseModal = () => setSelectedUserId(null);

  const getHighestRole = (userRoles?: UserRole[]) => {
    if (!userRoles || userRoles.length === 0) return null;
    return userRoles.reduce((prev, curr) =>
      getRolePriority(curr.role) > getRolePriority(prev.role) ? curr : prev
    );
  };

  const sortUsersByRole = (users: User[]) => {
    return [...users].sort((a, b) => {
      const aRole = getHighestRole(a.userRoles)?.role ?? "USER";
      const bRole = getHighestRole(b.userRoles)?.role ?? "USER";
      return getRolePriority(bRole) - getRolePriority(aRole);
    });
  };

  const roleFilterOptions = useMemo(
    () => [
      { value: "all", label: "ทั้งหมด", count: users.length },
      {
        value: "SUPER_ADMIN",
        label: "Super Admin",
        count: users.filter((u) =>
          u.userRoles?.some((r) => r.role === "SUPER_ADMIN")
        ).length,
      },
      {
        value: "CAMPUS_ADMIN",
        label: "Campus Admin",
        count: users.filter((u) =>
          u.userRoles?.some((r) => r.role === "CAMPUS_ADMIN")
        ).length,
      },
      {
        value: "USER",
        label: "สมาชิก",
        count: users.filter(
          (u) => u.userOrganizations && u.userOrganizations.length > 0
        ).length,
      },
      {
        value: "ACTIVE",
        label: "ใช้งานอยู่",
        count: users.filter((u) => !u.isSuspended).length,
      },
      {
        value: "SUSPENDED",
        label: "ถูกระงับ",
        count: users.filter((u) => u.isSuspended).length,
      },
    ],
    [users]
  );

  const campusFilterOptions = useMemo(
    () => [
      { value: "all", label: "ทุกวิทยาเขต" },
      ...campuses.map((c: Campus) => ({ value: c.id, label: c.name })),
    ],
    [campuses]
  );


  const organizationFilterOptions = useMemo(
    () =>
      selectedCampus !== "all"
        ? [
            { value: "all", label: "ทุกองค์กร" },
            ...organizations.map((o) => ({
              value: o.id,
              label: o.nameTh || o.nameEn ,
            })),
          ]
        : [{ value: "all", label: "ทุกองค์กร" }],
    [organizations, selectedCampus]
  );

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRoleFilter !== "all") {
      switch (selectedRoleFilter) {
        case "SUPER_ADMIN":
        case "CAMPUS_ADMIN":
          filtered = filtered.filter((user) =>
            user.userRoles?.some((role) => role.role === selectedRoleFilter)
          );
          break;
        case "USER":
          filtered = filtered.filter(
            (user) =>
              user.userOrganizations && user.userOrganizations.length > 0
          );
          break;
        case "ACTIVE":
          filtered = filtered.filter((user) => !user.isSuspended);
          break;
        case "SUSPENDED":
          filtered = filtered.filter((user) => user.isSuspended);
          break;
      }
    }

    if (selectedCampus !== "all") {
      filtered = filtered.filter((user) => user.campus?.id === selectedCampus);
    }

    if (selectedOrganization !== "all" && selectedCampus !== "all") {
      filtered = filtered.filter((user) =>
        user.userOrganizations?.some((org) => org.organization.id === selectedOrganization)
      );
    }

    return filtered;
  }, [users, selectedRoleFilter, selectedCampus, selectedOrganization, searchTerm]);

  const getRoleBadge = (user: User) => {
    const highestRole = getHighestRole(user.userRoles);
    if (highestRole) {
      switch (highestRole.role) {
        case "SUPER_ADMIN":
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200/50">
              <Crown size={12} />
              {getRoleLabel("SUPER_ADMIN")}
            </span>
          );
        case "CAMPUS_ADMIN":
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50">
              <Shield size={12} />
              {getRoleLabel("CAMPUS_ADMIN")}
            </span>
          );
      }
    }
    // ถ้าไม่มี userRoles หรือ highestRole เป็น null ให้ถือว่าเป็น USER
    if (user.userOrganizations && user.userOrganizations.length > 0) {
      // แสดงตำแหน่งจาก userOrganizations ตัวแรก (หรือวนลูปแสดงทั้งหมดได้)
      const firstOrg = user.userOrganizations[0];
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50">
          <UserCheck size={12} />
          {getRoleLabel("USER")}
          {firstOrg?.position && firstOrg.position !== "NON_POSITION" && (
            <span className="ml-1 font-normal">
              ({getPositionLabel(firstOrg.position)})
            </span>
          )}
        </span>
      );
    }
    // fallback กรณีไม่มี role และไม่มี organization
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border border-gray-200/50">
        <Users size={12} />
        User
      </span>
    );
  };

  if (isCampusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้งาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors placeholder-slate-400"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {/* Role Filter */}
              <div className="relative" ref={roleFilterRef}>
                <button
                  onClick={() => setShowRoleFilter((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
                >
                  <Filter size={16} />
                  <span className="hidden sm:block">
                    {
                      roleFilterOptions.find(
                        (f) => f.value === selectedRoleFilter
                      )?.label
                    }
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showRoleFilter ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showRoleFilter && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                    {roleFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedRoleFilter(option.value);
                          setShowRoleFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                          selectedRoleFilter === option.value
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedRoleFilter === option.value
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Campus Filter */}
              <div className="relative" ref={campusFilterRef}>
                <button
                  onClick={() => setShowCampusFilter((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
                >
                  <MapPin size={16} />
                  <span className="hidden sm:block">
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showCampusFilter ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showCampusFilter && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                    {campusFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCampus(option.value);
                          setShowCampusFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                          selectedCampus === option.value
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Organization Filter */}
              <div className="relative" ref={organizationFilterRef}>
                <button
                  onClick={() => setShowOrganizationFilter((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 ${
                    selectedCampus === "all" ? "opacity-50 pointer-events-none" : ""
                  }`}
                  disabled={selectedCampus === "all"}
                >
                  <Users size={16} />
                  <span className="hidden sm:block">
                    {
                      organizationFilterOptions.find(
                        (o) => o.value === selectedOrganization
                      )?.label
                    }
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showOrganizationFilter ? "rotate-180" : ""
                    }`}
                  />
                  {orgLoading && (
                    <Loader2 className="ml-2 w-4 h-4 animate-spin text-emerald-400" />
                  )}
                </button>
                {showOrganizationFilter && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                    {organizationFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedOrganization(option.value);
                          setShowOrganizationFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                          selectedOrganization === option.value
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedRoleFilter !== "all" ||
            selectedCampus !== "all" ||
            selectedOrganization !== "all" ||
            searchTerm) && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">
                  ตัวกรองที่ใช้งาน:
                </span>
                {selectedRoleFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                    บทบาท:{" "}
                    {
                      roleFilterOptions.find(
                        (f) => f.value === selectedRoleFilter
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedRoleFilter("all")}
                      className="ml-1 hover:text-emerald-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCampus !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    วิทยาเขต:{" "}
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedCampus("all")}
                      className="ml-1 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedOrganization !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    องค์กร:{" "}
                    {
                      organizationFilterOptions.find(
                        (o) => o.value === selectedOrganization
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedOrganization("all")}
                      className="ml-1 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    ค้นหา: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {sortUsersByRole(filteredUsers).map((user, index) => (
                <div
                  key={user.id}
                  className={`${
                    index === 0 ? "" : ""
                  } hover:bg-slate-50/50 transition-colors duration-200`}
                >
                  <ListUserCard
                    userId={user.userId}
                    name={user.name || "ไม่ระบุชื่อ"}
                    email={user.email}
                    image={user.image}
                    phoneNumber={user.phoneNumber}
                    roleBadge={getRoleBadge(user)}
                    campus={user.campus?.name}
                    status={user.isSuspended ? "suspended" : "active"}
                    onClick={() => handleSelectUser(user.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserX className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  ไม่พบผู้ใช้งาน
                </h3>
                <p className="text-slate-600 mb-6">
                  ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไขการค้นหา
                </p>
                <button
                  onClick={() => {
                    setSelectedRoleFilter("all");
                    setSelectedCampus("all");
                    setSearchTerm("");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              แสดงผลลัพธ์ {filteredUsers.length} จาก {users.length} ผู้ใช้งาน
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedUser && (
        <CardInfoUser
          user={selectedUser}
          roleBadge={getRoleBadge(selectedUser)}
          isOpen={!!selectedUser}
          onEdit={() => {}}
          onClose={handleCloseModal}
          onUserUpdate={refetchUsers}
          isCurrentUserSuperAdmin={true}
        />
      )}
    </div>
  );
}
