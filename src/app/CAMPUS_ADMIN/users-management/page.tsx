"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useUsersByFilter } from "@/hooks/useUserApi";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizations } from "@/hooks/useOrganization";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { ListUserCard } from "@/components/ui/ListUserCard";
import { CardInfoUser } from "@/components/ui/CardInfoUser";
import { StatCard } from "@/components/ui/statcard";
import { getStatCampusAdmin } from "@/constants/Stat";
import { getRolePriority } from "@/utils/roleUtils";
import { UserFilterBar } from "./UserFilterBar";
import { User } from "@/interface/user";
import { UserOrganization } from "@/interface/userOrganization";
import { useCampusAdminSuspendUser } from "@/hooks/useCampusAdmin";

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
  const [search, setSearch] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [selectedOrganizationType, setSelectedOrganizationType] =
    useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [campusId, setCampusId] = useState<string>("");

  // Token & campusId
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const { suspend: campusSuspend, loading: campusSuspendLoading } =
    useCampusAdminSuspendUser(token);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectRole = localStorage.getItem("selectedRole");
      if (selectRole) {
        try {
          const parsed = JSON.parse(selectRole);
          if (parsed?.data?.campus?.id) {
            setCampusId(parsed.data.campus.id);
          }
        } catch (unknown) {
          console.error("Failed to parse selectedRole:", unknown);
          setCampusId("");
        }
      }
    }
  }, []);

  // Hooks
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

  const { organizationTypes } = useOrganizationType(token, campusId);

  // Options
  const organizationOptions = useMemo(
    () => [
      { value: "all", label: "ทุกองค์กร" },
      ...organizations
        .filter(
          (o) =>
            o.campus.id === campusId &&
            (selectedOrganizationType === "all" ||
              o.organizationType.id === selectedOrganizationType)
        )
        .map((o) => ({
          value: o.id,
          label: o.nameTh || o.nameEn,
        })),
    ],
    [organizations, campusId, selectedOrganizationType]
  );
  const organizationTypeOptions = useMemo(
    () => [
      { value: "all", label: "ทุกประเภทองค์กร" },
      ...organizationTypes.map((ot) => ({ value: ot.id, label: ot.name })),
    ],
    [organizationTypes]
  );
  const positionOptions = [
    { value: "all", label: "ทุกตำแหน่ง" },
    { value: "HEAD", label: "หัวหน้า" },
    { value: "MEMBER", label: "สมาชิก" },
  ];

  // สร้าง campusOptions ให้มีแค่ campus เดียว
  const campusOptions = useMemo(
    () =>
      campusId
        ? [
            {
              value: campusId,
              label:
                campuses.find((c) => c.id === campusId)?.name ||
                "วิทยาเขตของฉัน",
            },
          ]
        : [],
    [campuses, campusId]
  );

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
    selectedOrganizationType,
    selectedOrganization,
    selectedPosition,
    search,
  ]);

  // Helper: Filter params
  const getFilterParams = useCallback(
    () =>
      cleanParams({
        campusId,
        organizationTypeId:
          selectedOrganizationType !== "all"
            ? selectedOrganizationType
            : undefined,
        organizationId:
          selectedOrganization !== "all" ? selectedOrganization : undefined,
        position: selectedPosition !== "all" ? selectedPosition : undefined,
        search: search || undefined,
      }),
    [
      campusId,
      selectedOrganizationType,
      selectedOrganization,
      selectedPosition,
      search,
    ]
  );

  // Helper: User role priority
  const getUserMaxRolePriority = useCallback((user: User) => {
    const userOrgPriorities =
      user.userOrganizations?.map((org: UserOrganization) =>
        getRolePriority(org.role, org.position)
      ) || [];
    return userOrgPriorities.length === 0 ? 0 : Math.max(...userOrgPriorities);
  }, []);

  // Filtered & sorted users
  const filteredUsers = useMemo(() => {
    let filtered = [...users].filter((u) => u.campus?.id === campusId);
    if (selectedPosition !== "all") {
      filtered = filtered.filter((u) =>
        u.userOrganizations?.some((org) => org.position === selectedPosition)
      );
    }
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.userId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    // ---- SORT: CAMPUS_ADMIN ขึ้นก่อน ----
    return filtered.sort((a, b) => {
      const aIsCampusAdmin =
        a.userRoles?.some((r) => r.role === "CAMPUS_ADMIN") ||
        a.userOrganizations?.some(
          (org) => (org.role as string) === "CAMPUS_ADMIN"
        );
      const bIsCampusAdmin =
        b.userRoles?.some((r) => r.role === "CAMPUS_ADMIN") ||
        b.userOrganizations?.some(
          (org) => (org.role as string) === "CAMPUS_ADMIN"
        );
      if (aIsCampusAdmin && !bIsCampusAdmin) return -1;
      if (!aIsCampusAdmin && bIsCampusAdmin) return 1;
      // ถ้าเท่ากัน ให้เรียงตาม priority เดิม
      return getUserMaxRolePriority(b) - getUserMaxRolePriority(a);
    });
  }, [users, campusId, selectedPosition, search, getUserMaxRolePriority]);

  const stats = useMemo(
    () =>
      getStatCampusAdmin(
        filteredUsers,
        campuses.find((c) => c.id === campusId)?.name || "วิทยาเขต"
      ),
    [filteredUsers, campuses, campusId]
  );
  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

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
        selectedCampus={campusId}
        setSelectedCampus={() => {}} // ไม่ให้เปลี่ยน
        organizationOptions={organizationOptions}
        selectedOrganization={selectedOrganization}
        setSelectedOrganization={setSelectedOrganization}
        organizationTypeOptions={organizationTypeOptions}
        selectedOrganizationType={selectedOrganizationType}
        setSelectedOrganizationType={setSelectedOrganizationType}
        roleOptions={positionOptions}
        selectedRole={selectedPosition}
        setSelectedRole={setSelectedPosition}
        isLoading={usersLoading || orgLoading}
      />

      {/* User List */}
      <div className="bg-white rounded-xl shadow border">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ไม่พบผู้ใช้งาน</div>
        ) : (
          filteredUsers.map((user) => {
            const allRoles = [
              ...(user.userRoles ?? []).map((role) => ({
                role: role.role,
              })),
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
                status={"active"}
                onClick={() => setSelectedUserId(user.id)}
                isCurrentUserCampusAdmin={true}
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
          onUserUpdate={() => fetchUsersByFilter(getFilterParams())}
          isCurrentUserSuperAdmin={false}
          isCurrentUserCampusAdmin={true}
          onSuspendUser={async (id, isSuspended, organizationId) => {
            await campusSuspend(id, isSuspended, organizationId ?? "");
            fetchUsersByFilter(getFilterParams());
          }}
          suspendLoading={campusSuspendLoading}
        />
      )}
    </div>
  );
}
