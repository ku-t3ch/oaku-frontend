"use client";
import { useEffect, useState, useMemo } from "react";
import { useUsers } from "@/hooks/useUserApi";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizations } from "@/hooks/useOrganization";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { ListUserCard } from "@/components/ui/ListUserCard";
import { CardInfoUser } from "@/components/ui/CardInfoUser";
import { StatCard } from "@/components/ui/statcard";
import { getStats } from "@/constants/Stat";
import { getRolePriority } from "@/utils/roleUtils";
import { UserFilterBar } from "./UserFilterBar";
import { User } from "@/interface/user";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";

export default function UsersManagementPage() {
  // UI State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [showCampusFilter, setShowCampusFilter] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [showOrganizationFilter, setShowOrganizationFilter] = useState(false);
  const [selectedOrganizationType, setSelectedOrganizationType] =
    useState("all");
  const [showOrganizationTypeFilter, setShowOrganizationTypeFilter] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const getUserMaxRolePriority = (user: User) => {
    const adminPriorities =
      user.userRoles?.map((r: UserRole) => getRolePriority(r.role)) || [];
    const userOrgPriorities =
      user.userOrganizations?.map((org: UserOrganization) =>
        getRolePriority(org.role, org.position)
      ) || [];
    const allPriorities = [...adminPriorities, ...userOrgPriorities];
    if (allPriorities.length === 0) return 0;
    return Math.max(...allPriorities);
  };

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  // Hooks
  const {
    users,
    loading: usersLoading,
    error: usersError,
    fetchUsers,
  } = useUsers(token);
  const {
    campuses,
    loading: campusesLoading,
    error: campusesError,
    fetchCampuses,
  } = useCampuses();
  const {
    organizations,
    loading: orgLoading,
    error: orgError,
    fetchOrganizations,
  } = useOrganizations(token);

  const { organizationTypes } = useOrganizationType(token, selectedCampus);

  const campusOptions = [{ value: "all", label: "ทุกวิทยาเขต" }].concat(
    campuses.map((c) => ({ value: c.id, label: c.name }))
  );

  const organizationOptions = [{ value: "all", label: "ทุกองค์กร" }].concat(
    organizations
      .filter(
        (o) =>
          (selectedCampus === "all" || o.campus.id === selectedCampus) &&
          (selectedOrganizationType === "all" ||
            o.organizationType.id === selectedOrganizationType)
      )
      .map((o) => ({
        value: o.id,
        label: o.nameTh || o.nameEn,
      }))
  );

  const organizationTypeOptions = [
    { value: "all", label: "ทุกประเภทองค์กร" },
  ].concat(
    organizationTypes.map((ot) => ({
      value: ot.id,
      label: ot.name,
    }))
  );

  const roleOptions = [
    { value: "all", label: "ทุกบทบาท" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "CAMPUS_ADMIN", label: "Campus Admin" },
    { value: "MEMBER", label: "Member" },
    { value: "HEAD", label: "Head" },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchUsers();
    fetchCampuses();
    fetchOrganizations({});
  }, [fetchUsers, fetchCampuses, fetchOrganizations]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.userId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCampus !== "all") {
      filtered = filtered.filter((u) => u.campus?.id === selectedCampus);
    }
    if (selectedOrganization !== "all") {
      filtered = filtered.filter((u) =>
        u.userOrganizations?.some(
          (org) => org.organization.id === selectedOrganization
        )
      );
    }
    if (selectedOrganizationType !== "all") {
      filtered = filtered.filter((u) =>
        u.userOrganizations?.some(
          (org) =>
            org.organization.organizationType.id === selectedOrganizationType
        )
      );
    }
    if (selectedRole !== "all") {
      filtered = filtered.filter(
        (u) =>
          u.userRoles?.some((role) => role.role === selectedRole) ||
          (selectedRole === "MEMBER" &&
            u.userOrganizations?.some((org) => org.position === "MEMBER")) ||
          (selectedRole === "HEAD" &&
            u.userOrganizations?.some((org) => org.position === "HEAD"))
      );
    }
    return [...filtered].sort(
      (a, b) => getUserMaxRolePriority(b) - getUserMaxRolePriority(a)
    );
  }, [
    users,
    search,
    selectedCampus,
    selectedOrganization,
    selectedOrganizationType,
    selectedRole,
  ]);

  const stats = useMemo(() => getStats(users), [users]);
  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  if (usersLoading || campusesLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }
  if (usersError || campusesError || orgError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500">
          {usersError || campusesError || orgError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Filter Section */}
      <UserFilterBar
        search={search}
        setSearch={setSearch}
        campusOptions={campusOptions}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        showCampusFilter={showCampusFilter}
        setShowCampusFilter={setShowCampusFilter}
        organizationOptions={organizationOptions}
        selectedOrganization={selectedOrganization}
        setSelectedOrganization={setSelectedOrganization}
        showOrganizationFilter={showOrganizationFilter}
        setShowOrganizationFilter={setShowOrganizationFilter}
        organizationTypeOptions={organizationTypeOptions}
        selectedOrganizationType={selectedOrganizationType}
        setSelectedOrganizationType={setSelectedOrganizationType}
        showOrganizationTypeFilter={showOrganizationTypeFilter}
        setShowOrganizationTypeFilter={setShowOrganizationTypeFilter}
        roleOptions={roleOptions}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      <div className="bg-white rounded-xl shadow border">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ไม่พบผู้ใช้งาน</div>
        ) : (
          [...filteredUsers]
            .sort(
              (a, b) => getUserMaxRolePriority(b) - getUserMaxRolePriority(a)
            )
            .map((user) => {
              const allRoles = [
                ...(user.userRoles?.map((r) => ({ role: r.role })) || []),
                ...(user.userOrganizations
                  ?.filter((org) => org.position === "HEAD")
                  .map((org) => ({ role: org.role, position: org.position })) ||
                  []),
                ...(user.userOrganizations
                  ?.filter((org) => org.position === "MEMBER")
                  .map((org) => ({ role: org.role, position: org.position })) ||
                  []),
              ];
              return (
                <ListUserCard
                  key={user.id}
                  userId={user.userId}
                  name={user.name}
                  email={user.email}
                  image={user.image}
                  phoneNumber={user.phoneNumber}
                  roles={allRoles}
                  campus={user.campus?.name}
                  organizations={user.userOrganizations?.map((org) => ({
                    nameTh: org.organization?.nameTh,
                    nameEn: org.organization?.nameEn,
                  }))}
                  status={user.isSuspended ? "suspended" : "active"}
                  onClick={() => setSelectedUserId(user.id)}
                />
              );
            })
        )}
      </div>
      {/* User Info Modal */}
      {selectedUser && (
        <CardInfoUser
          user={selectedUser}
          roleBadge={null}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUserId(null)}
          onUserUpdate={fetchUsers}
          isCurrentUserSuperAdmin={true}
        />
      )}
    </div>
  );
}
