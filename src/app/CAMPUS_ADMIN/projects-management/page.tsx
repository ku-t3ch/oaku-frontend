"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { Project, ProjectFilters } from "@/interface/project";
import { User } from "@/interface/user";
import { ProjectTable } from "@/components/ui/Project/ProjectTable";
import { ProjectsFilter } from "@/components/ui/Project/ProjectsFilter";
import { ProjectsStatistics } from "@/components/ui/Project/ProjectsStatistics";

export default function CampusAdminProjectsManagePage() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [campusId] = useState<string>("");
  const [campusName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrgType, setSelectedOrgType] = useState<string>("all");
  const [showOrgTypeDropdown, setShowOrgTypeDropdown] = useState(false);

  // Initialize token and user info
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userString = localStorage.getItem("user");

    if (accessToken) {
      setToken(accessToken);
    }

    if (userString) {
      try {
        const userData: User = JSON.parse(userString);
        setUserId(userData.id);

      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // API Filters
  const apiFilters: ProjectFilters = useMemo(() => {
    const filters: ProjectFilters = {};
    if (campusId) filters.campusId = campusId;
    if (selectedOrgType !== "all") filters.organizationTypeId = selectedOrgType;
    return filters;
  }, [campusId, selectedOrgType]);

  // Hooks
  const { projects, loading, error, fetchProjects } = useProjects(token, apiFilters);
  const { organizationTypes } = useOrganizationType(token, campusId);

  // Load data
  useEffect(() => {
    if (token && campusId) {
      fetchProjects();
    }
  }, [token, campusId, fetchProjects]);

  // Filter options
  const orgTypeOptions = useMemo(
    () => [
      { value: "all", label: "ทุกประเภท" },
      ...organizationTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    ],
    [organizationTypes]
  );

  // Local filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.nameTh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.activityCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.organization?.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.organization?.nameTh?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  // Active filters
  const activeFilters = [
    ...(selectedOrgType !== "all"
      ? [
          {
            type: "orgType",
            label: `ประเภท: ${orgTypeOptions.find((t) => t.value === selectedOrgType)?.label}`,
            value: selectedOrgType,
            onRemove: () => setSelectedOrgType("all"),
          },
        ]
      : []),
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
    router.push(`/CAMPUS_ADMIN/projects-management/${project.id}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedOrgType("all");
  };

  if (!token || !userId) {
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
          <button
            onClick={() => fetchProjects()}
            className="px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
          >
            ลองใหม่
          </button>
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
              <h1 className="text-3xl font-bold text-slate-900">จัดการโครงการ</h1>
              <p className="text-slate-600 mt-2">
                ติดตาม จัดการ และรายงานผลโครงการใน{campusName}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <ProjectsStatistics projects={projects} />

        {/* Filters */}
        <ProjectsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="ค้นหาโครงการ (ชื่อ, รหัส, หน่วยงาน)..."
          showOrgTypeFilter={true}
          selectedOrgType={selectedOrgType}
          orgTypeOptions={orgTypeOptions}
          onOrgTypeChange={setSelectedOrgType}
          showOrgTypeDropdown={showOrgTypeDropdown}
          onToggleOrgTypeDropdown={() => setShowOrgTypeDropdown(!showOrgTypeDropdown)}
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
                ไม่พบโครงการที่ค้นหา
              </h3>
              <p className="text-gray-500 mb-6">
                กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#006C67] text-white rounded-xl hover:bg-[#005A56] transition-colors"
              >
                ล้างการค้นหา
              </button>
            </div>
          )}

          {/* Loading indicator */}
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