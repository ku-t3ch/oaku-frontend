"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useUsersByFilter } from "@/hooks/useUserApi";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizations } from "@/hooks/useOrganization";
import { ListUserCard } from "@/components/ui/ListUserCard";
import { CardInfoUser } from "@/components/ui/CardInfoUser";
import { getRolePriority } from "@/utils/roleUtils";
import { UserFilterBar } from "./UserFilterBar";
import { User } from "@/interface/user";
import { UserOrganization } from "@/interface/userOrganization";
import { useCampusAdminSuspendUser } from "@/hooks/useCampusAdmin";
import { Organization } from "@/interface/organization";

// Helper: Clean undefined/null/empty params for API calls
function cleanParams(obj: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && v !== "all"
    )
  );
}

export default function UsersManagementPage() {
  // --- STATE ---
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(""); // default เป็น ""
  const [selectedOrganizationType, setSelectedOrganizationType] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [organizationId, setOrganizationId] = useState<string>("");
  const [campusId, setCampusId] = useState<string>("");
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null); // เก็บข้อมูล organization ทั้งหมด

  // --- GET organizationId จาก localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectOrg = localStorage.getItem("selectedOrganization");
      if (selectOrg) {
        try {
          const parsed = JSON.parse(selectOrg);
          console.log("Parsed selectedOrganization:", parsed);
          
          // ตรวจสอบโครงสร้างข้อมูลตามที่คุณแสดง
          // case 1: ถ้าเป็น object ที่มี organization.id โดยตรง
          if (parsed?.organization?.id) {
            setOrganizationId(parsed.organization.id);
            setSelectedOrganization(parsed.organization.id);
            setCurrentOrganization(parsed.organization); // เก็บข้อมูล organization ทั้งหมด
            
            // ตั้งค่า campusId จาก organization.campus.id
            if (parsed.organization.campus?.id) {
              setCampusId(parsed.organization.campus.id);
            }
          }
          // case 2: ถ้าเป็น object ที่มี data.organization.id
          else if (parsed?.data?.organization?.id) {
            setOrganizationId(parsed.data.organization.id);
            setSelectedOrganization(parsed.data.organization.id);
            setCurrentOrganization(parsed.data.organization); // เก็บข้อมูล organization ทั้งหมด
            
            // ตั้งค่า campusId
            if (parsed.data.organization.campus?.id) {
              setCampusId(parsed.data.organization.campus.id);
            }
          }
          // case 3: ถ้าเป็น string id โดยตรง
          else if (typeof parsed === "string") {
            setOrganizationId(parsed);
            setSelectedOrganization(parsed);
          }
          // case 4: ถ้าเป็น object ที่มี id โดยตรง
          else if (parsed?.id) {
            setOrganizationId(parsed.id);
            setSelectedOrganization(parsed.id);
            setCurrentOrganization(parsed); // เก็บข้อมูล organization ทั้งหมด
          }
          
        } catch (error) {
          console.error("Error parsing selectedOrganization from localStorage", error);
        }
      }
    }
  }, []);

  // --- HOOKS ---
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

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

  const { suspend: campusSuspend, loading: campusSuspendLoading } =
    useCampusAdminSuspendUser(token);

  // --- PARAMS & OPTIONS FOR FILTERS ---
  const getFilterParams = useCallback(
    () =>
      cleanParams({
        organizationId: selectedOrganization || undefined, // ใช้ selectedOrganization ที่ได้จาก localStorage
      }),
    [selectedOrganization]
  );

  const organizationOptions = useMemo(
    () => {
      // ถ้ามี currentOrganization ให้แสดงแค่องค์กรเดียว
      if (currentOrganization) {
        return [
          {
            value: currentOrganization.id,
            label: currentOrganization.nameTh || currentOrganization.nameEn,
          }
        ];
      }
      
      // fallback กรณีไม่มี currentOrganization
      return organizations
        .filter(
          (o) =>
            o.campus.id === campusId &&
            (selectedOrganizationType === "all" ||
              o.organizationType.id === selectedOrganizationType)
        )
        .map((o) => ({
          value: o.id,
          label: o.nameTh || o.nameEn,
        }));
    },
    [organizations, campusId, selectedOrganizationType, currentOrganization]
  );

  const organizationTypeOptions = useMemo(
    () => [
      { value: "all", label: "ทุกประเภทองค์กร" },
      ...organizations.map((ot) => ({ value: ot.id, label: ot.nameTh })),
    ],
    [organizations]
  );

  const positionOptions = [
    { value: "all", label: "ทุกตำแหน่ง" },
    { value: "HEAD", label: "หัวหน้า" },
    { value: "MEMBER", label: "สมาชิก" },
  ];

  const campusOptions = useMemo(
    () => {
      // ถ้ามี currentOrganization ใช้ข้อมูลจาก currentOrganization.campus
      if (currentOrganization?.campus) {
        return [
          {
            value: currentOrganization.campus.id,
            label: currentOrganization.campus.name,
          }
        ];
      }
      
      // fallback กรณีไม่มี currentOrganization
      return campusId
        ? [
            {
              value: campusId,
              label:
                campuses.find((c) => c.id === campusId)?.name ||
                "วิทยาเขตของฉัน",
            },
          ]
        : [];
    },
    [campuses, campusId, currentOrganization]
  );

  // --- EFFECTS ---
  // Initial data fetch for dropdowns
  useEffect(() => {
    fetchOrganizations({});
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users เมื่อ selectedOrganization มีค่าเท่านั้น
  useEffect(() => {
    if (selectedOrganization) {
      console.log("Fetching users with organizationId:", selectedOrganization);
      fetchUsersByFilter(getFilterParams());
    }
  }, [selectedOrganization, getFilterParams, fetchUsersByFilter]);

  // --- MEMOIZED DATA ---
  const getUserMaxRolePriority = useCallback((user: User) => {
    const userOrgPriorities =
      user.userOrganizations?.map((org: UserOrganization) =>
        getRolePriority(org.role, org.position)
      ) || [];
    return userOrgPriorities.length === 0 ? 0 : Math.max(...userOrgPriorities);
  }, []);

  // FILTER & SORT USERS
  const filteredUsers = useMemo(() => {
    let filtered = [...users].filter((u) => u.campus?.id === campusId);
    if (selectedPosition !== "all") {
      filtered = filtered.filter((u) =>
        u.userOrganizations?.some((org) => 
          org.position === selectedPosition && 
          (!currentOrganization || org.organization?.id === currentOrganization.id) // กรองตาม organization ด้วย
        )
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
      return getUserMaxRolePriority(b) - getUserMaxRolePriority(a);
    });
  }, [users, campusId, selectedPosition, search, getUserMaxRolePriority, currentOrganization]);

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  // --- RENDER LOGIC ---
  const isLoading = usersLoading || campusesLoading || orgLoading;
  const error = usersError || campusesError || orgError;

  if (isLoading) {
    return <div className="text-center p-10">กำลังโหลดข้อมูล...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-2">

      <UserFilterBar
        search={search}
        setSearch={setSearch}
        campusOptions={campusOptions}
        selectedCampus={campusId}
        setSelectedCampus={() => {}} // campus เดียว ไม่ให้เปลี่ยน
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
              ...(user.userRoles ?? []).map((role) => ({ role: role.role })),
              // กรองให้แสดงแค่ role ของ organization ที่เลือก
              ...(user.userOrganizations ?? [])
                .filter(org => !currentOrganization || org.organization?.id === currentOrganization.id)
                .map((org) => ({
                  role: org.role,
                  position: org.position,
                })),
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
                campus={currentOrganization?.campus?.name || user.campus?.name} // ใช้ campus จาก currentOrganization ก่อน
                organizations={user.userOrganizations
                  ?.filter(org => !currentOrganization || org.organization?.id === currentOrganization.id) // กรองให้แสดงแค่ org เดียว
                  ?.map((org) => ({
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
            // ใช้ organizationId จาก currentOrganization ถ้ามี หรือใช้ค่าที่ส่งมา
            const orgId = organizationId || currentOrganization?.id || "";
            await campusSuspend(id, isSuspended, orgId);
            fetchUsersByFilter(getFilterParams());
          }}
          suspendLoading={campusSuspendLoading}
        />
      )}
    </div>
  );
}