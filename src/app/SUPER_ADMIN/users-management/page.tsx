"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useUsersByFilter } from "@/hooks/useUserApi";
import { useCampuses } from "@/hooks/useCampuses";
import { useSuspendUser } from "@/hooks/useSuperAdmin";
import { useCampusAdminSuspendUser } from "@/hooks/useCampusAdmin";
import { useOrganizations } from "@/hooks/useOrganization";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { ListUserCard } from "@/components/ui/ListUserCard";
import { CardInfoUser } from "@/components/ui/CardInfoUser";
import { StatCard } from "@/components/ui/statcard";
import { getStatSuperAdmin } from "@/constants/Stat";
import { getRolePriority } from "@/utils/roleUtils";
import { UserFilterBar } from "./UserFilterBar";
import { User } from "@/interface/user";
import { UserRole } from "@/interface/userRole";
import { UserOrganization } from "@/interface/userOrganization";

// Helper: Clean undefined/null params
function cleanParams(obj: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== "undefined"
    )
  );
}

export default function UsersManagementPage() {
  // State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [selectedOrganizationType, setSelectedOrganizationType] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // Token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const isCurrentCampusAdmin = (() => {
    if (typeof window === "undefined") return false;
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return (
        Array.isArray(user.userRoles) &&
        user.userRoles.some((r: UserRole) => r.role === "CAMPUS_ADMIN")
      );
    } catch {
      return false;
    }
  })();

  // Hooks
  const { suspend, loading: suspendLoading } = useSuspendUser(token);
  const { suspend: campusSuspend, loading: campusSuspendLoading } = useCampusAdminSuspendUser(token);

  const {
    users,
    loading: usersLoading,
    error: usersError,
    fetchUsersByFilter,
  } = useUsersByFilter(token);
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

  // Options
  const campusOptions = useMemo(
    () => [
      { value: "all", label: "ทุกวิทยาเขต" },
      ...campuses.map((c) => ({ value: c.id, label: c.name })),
    ],
    [campuses]
  );
  const organizationOptions = useMemo(
    () => [
      { value: "all", label: "ทุกองค์กร" },
      ...organizations
        .filter(
          (o) =>
            (selectedCampus === "all" || o.campus.id === selectedCampus) &&
            (selectedOrganizationType === "all" ||
              o.organizationType.id === selectedOrganizationType)
        )
        .map((o) => ({
          value: o.id,
          label: o.nameTh || o.nameEn,
        })),
    ],
    [organizations, selectedCampus, selectedOrganizationType]
  );
  const organizationTypeOptions = useMemo(
    () => [
      { value: "all", label: "ทุกประเภทองค์กร" },
      ...organizationTypes.map((ot) => ({ value: ot.id, label: ot.name })),
    ],
    [organizationTypes]
  );
  const roleOptions = [
    { value: "all", label: "ทุกบทบาท" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "CAMPUS_ADMIN", label: "Campus Admin" },
    { value: "MEMBER", label: "Member" },
    { value: "HEAD", label: "Head" },
  ];

  // Effect: Initial fetch
  useEffect(() => {
    fetchCampuses();
    fetchOrganizations({});
    fetchUsersByFilter(getFilterParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect: Refetch on filter change
  useEffect(() => {
    fetchUsersByFilter(getFilterParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedRole,
    selectedCampus,
    selectedOrganizationType,
    selectedOrganization,
  ]);

  // Helper: Filter params
  const getFilterParams = useCallback(
    () =>
      cleanParams({
        role: selectedRole !== "all" ? selectedRole : undefined,
        campusId: selectedCampus !== "all" ? selectedCampus : undefined,
        organizationTypeId:
          selectedOrganizationType !== "all"
            ? selectedOrganizationType
            : undefined,
        organizationId:
          selectedOrganization !== "all" ? selectedOrganization : undefined,
      }),
    [
      selectedRole,
      selectedCampus,
      selectedOrganizationType,
      selectedOrganization,
    ]
  );

  // Helper: User role priority
  const getUserMaxRolePriority = useCallback((user: User) => {
    const adminPriorities =
      user.userRoles?.map((r: UserRole) => getRolePriority(r.role)) || [];
    const userOrgPriorities =
      user.userOrganizations?.map((org: UserOrganization) =>
        getRolePriority(org.role, org.position)
      ) || [];
    const allPriorities = [...adminPriorities, ...userOrgPriorities];
    return allPriorities.length === 0 ? 0 : Math.max(...allPriorities);
  }, []);

  // Filtered & sorted users
  const filteredUsers = useMemo(() => {
    const sorted = [...users].sort(
      (a, b) => getUserMaxRolePriority(b) - getUserMaxRolePriority(a)
    );
    if (!search) return sorted;
    return sorted.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.userId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search, getUserMaxRolePriority]);

  const stats = useMemo(() => getStatSuperAdmin(users), [users]);
  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  // useEffect เฝ้าดู users และ pendingUserId
  useEffect(() => {
    if (pendingUserId) {
      const updated = users.find((u) => u.id === pendingUserId);
      if (updated) {
        setSelectedUserId(pendingUserId);
        setModalKey((prev) => prev + 1);
        setPendingUserId(null);
      }
    }
  }, [users, pendingUserId]);

  // Loading/Error UI
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

  // Main UI
  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        search={search}
        setSearch={setSearch}
        campusOptions={campusOptions}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        organizationOptions={organizationOptions}
        selectedOrganization={selectedOrganization}
        setSelectedOrganization={setSelectedOrganization}
        organizationTypeOptions={organizationTypeOptions}
        selectedOrganizationType={selectedOrganizationType}
        setSelectedOrganizationType={setSelectedOrganizationType}
        roleOptions={roleOptions}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      {/* User List */}
      <div className="bg-white rounded-xl shadow border">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ไม่พบผู้ใช้งาน</div>
        ) : (
          filteredUsers.map((user) => {
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
                  isSuspended: org.isSuspended,
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
          key={modalKey}
          user={selectedUser}
          roleBadge={null}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUserId(null)}
          onUserUpdate={() => fetchUsersByFilter(getFilterParams())}
          isCurrentUserSuperAdmin={true}
          isCurrentUserCampusAdmin={isCurrentCampusAdmin}
          onSuspendUser={async (id, isSuspended, organizationId) => {
            if (organizationId) {
              await campusSuspend(id, isSuspended, organizationId);
            } else {
              await suspend(id, isSuspended);
            }
            await fetchUsersByFilter(getFilterParams());
            setSelectedUserId(null); // ปิด modal ชั่วคราว
            setPendingUserId(id);    // รอ users อัปเดต แล้วเปิด modal ใหม่ user เดิม
          }}
          suspendLoading={suspendLoading || campusSuspendLoading}
        />
      )}
    </div>
  );
}