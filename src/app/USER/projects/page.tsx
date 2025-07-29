"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter } from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import { Project, ProjectFilters } from "@/interface/project";
import { User } from "@/interface/user";
import { ProjectTable } from "@/components/ui/Project/ProjectTable";
import { ProjectsFilter } from "@/components/ui/Project/ProjectsFilter";
import { ProjectsStatistics } from "@/components/ui/Project/ProjectsStatistics";

export default function UserProjectsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [campusName, setCampusName] = useState<string>("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Initialize token and selected organization
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const selectedOrgStr = localStorage.getItem("selectedOrganization");

    if (accessToken) {
      setToken(accessToken);
    }

    if (selectedOrgStr) {
      try {
        const selectedOrg = JSON.parse(selectedOrgStr);

        // ตรวจสอบ structure หลายแบบ
        let orgId, orgNameTh, orgNameEn, campusName;

        if (selectedOrg.data) {
          // Structure: {type: "organization", data: {...}}
          orgId = selectedOrg.data.id;
          orgNameTh = selectedOrg.data.nameTh;
          orgNameEn = selectedOrg.data.nameEn;
          campusName = selectedOrg.data.campus?.name;
        } else if (selectedOrg.organization) {
          // Structure: {organization: {...}}
          orgId = selectedOrg.organization.id;
          orgNameTh = selectedOrg.organization.nameTh;
          orgNameEn = selectedOrg.organization.nameEn;
          campusName = selectedOrg.organization.campus?.name;
        } else if (selectedOrg.id) {
          // Structure: {id: "...", nameTh: "...", ...}
          orgId = selectedOrg.id;
          orgNameTh = selectedOrg.nameTh;
          orgNameEn = selectedOrg.nameEn;
          campusName = selectedOrg.campus?.name;
        }

        if (orgId) {
          setOrganizationId(orgId);
          setOrganizationName(orgNameTh || orgNameEn || "องค์กรของคุณ");
          setCampusName(campusName || "");
        } else {
          console.warn("Cannot find organization ID in:", selectedOrg);
          fallbackToUserData();
        }
      } catch (error) {
        console.error("Error parsing selected organization:", error);
        fallbackToUserData();
      }
    } else {
      fallbackToUserData();
    }
  }, []);

  // Fallback function to use user data
  const fallbackToUserData = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData: User = JSON.parse(userString);
        const userOrganization = userData.userOrganizations?.[0];

        if (userOrganization?.organization) {
          setOrganizationId(userOrganization.organization.id);
          setOrganizationName(
            userOrganization.organization.nameTh ||
              userOrganization.organization.nameEn ||
              "องค์กรของคุณ"
          );
          setCampusName(userOrganization.organization.campus?.name || "");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  // Listen for organization selection changes
  useEffect(() => {
    const handleRoleSelected = () => {
      const selectedOrgStr = localStorage.getItem("selectedOrganization");
      if (selectedOrgStr) {
        try {
          const selectedOrg = JSON.parse(selectedOrgStr);

          // แก้ไขจาก selectedOrg.id เป็น selectedOrg.data.id
          setOrganizationId(selectedOrg.data.id);
          setOrganizationName(
            selectedOrg.data.nameTh || selectedOrg.data.nameEn || "องค์กรของคุณ"
          );
          setCampusName(selectedOrg.data.campus?.name || "");
        } catch (error) {
          console.error("Error parsing selected organization:", error);
        }
      }
    };

    window.addEventListener("roleSelected", handleRoleSelected);
    return () => window.removeEventListener("roleSelected", handleRoleSelected);
  }, []);
  // API Filters - ใช้ organizationId ที่ถูกต้อง
  const apiFilters: ProjectFilters = useMemo(() => {
    const filters: ProjectFilters = {};
    if (organizationId) {
      filters.organizationId = organizationId;
    }
    return filters;
  }, [organizationId]);

  // Hooks
  const { projects, loading, error, fetchProjects } = useProjects(
    token,
    apiFilters
  );

  // Load data
  useEffect(() => {
    if (token && organizationId) {
      fetchProjects();
    }
  }, [token, organizationId, fetchProjects]);

  // Local filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.nameTh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.activityCode?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  // Active filters
  const activeFilters = [
    ...(searchTerm
      ? [
          {
            type: "search",
            label: `ค้นหา: ${searchTerm}`,
            value: searchTerm,
            onRemove: () => setSearchTerm(""),
          },
        ]
      : []),
  ];

  // Handlers
  const handleProjectClick = (project: Project) => {
    router.push(`/USER/projects/${project.id}`);
  };

  const handleCreateProject = () => {
    router.push("/USER/projects/create-project");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  // Loading states
  if (!organizationId && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#006C67] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูลองค์กร...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#006C67] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูลผู้ใช้...</p>
        </div>
      </div>
    );
  }

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#006C67] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูลโครงการ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => fetchProjects()}
              className="px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
            >
              ลองใหม่
            </button>
            <button
              onClick={() => router.push("/auth/select")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              เปลี่ยนองค์กร
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                โครงการของฉัน
              </h1>
              <p className="text-slate-600 mt-2">
                ติดตามและจัดการโครงการของ {organizationName}
                {campusName && ` • ${campusName}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#006C67] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
                สร้างโครงการใหม่
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <ProjectsStatistics projects={projects} />

        {/* Filters */}
        <ProjectsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="ค้นหาโครงการ (ชื่อ, รหัส)..."
          organizationName={organizationName}
          campusName={campusName}
          activeFilters={activeFilters}
          onClearAll={clearFilters}
        />

        {/* Projects Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
          {/* Status Filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">สถานะ :</span>
              {[
                { key: "ALL", label: "ทั้งหมด" },
                { key: "IN_PROGRESS", label: "ดำเนินการ" },
                { key: "COMPLETED", label: "เสร็จสิ้น" },
                { key: "PADDING", label: "ร่างโครงการ" },
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setStatusFilter(status.key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status.key
                      ? "bg-[#006C67] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>


          <ProjectTable
            projects={filteredProjects}
            loading={loading}
            onProjectClick={handleProjectClick}
          />

          {/* Empty State */}
          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {projects.length === 0
                  ? "ยังไม่มีโครงการ"
                  : "ไม่พบโครงการที่ค้นหา"}
              </h3>
              <p className="text-gray-500 mb-6">
                {projects.length === 0
                  ? `ยังไม่มีโครงการในองค์กร ${organizationName}`
                  : "กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ"}
              </p>
              <div className="space-x-4">
                {projects.length === 0 ? (
                  <button
                    onClick={handleCreateProject}
                    className="px-6 py-3 bg-[#006C67] text-white rounded-xl hover:bg-[#005A56] transition-colors"
                  >
                    สร้างโครงการแรก
                  </button>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-[#006C67] text-white rounded-xl hover:bg-[#005A56] transition-colors"
                  >
                    ล้างการค้นหา
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && filteredProjects.length > 0 && (
            <div className="text-center py-8">
              <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#006C67] border-t-transparent mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}