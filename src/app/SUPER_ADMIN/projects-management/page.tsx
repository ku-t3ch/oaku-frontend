"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Filter, Loader2, X, Search } from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { ProjectFilters } from "@/interface/project";
import { ProjectTable } from "@/components/ui/Project/ProjectTable";
import { ProjectsStatistics } from "@/components/ui/Project/ProjectsStatistics";
import { ProjectsFilter } from "@/components/ui/Project/ProjectsFilter";

export default function ProjectsManagePage() {
  const [token, setToken] = useState<string>("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedOrgType, setSelectedOrgType] = useState<string>("all");
  const [showCampusFilter, setShowCampusFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  // Initialize token
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  // Prepare filters for API
  const apiFilters: ProjectFilters = useMemo(() => {
    const filters: ProjectFilters = {};
    if (selectedCampus !== "all") filters.campusId = selectedCampus;
    if (selectedOrgType !== "all") filters.organizationTypeId = selectedOrgType;
    return filters;
  }, [selectedCampus, selectedOrgType]);

  // Use hooks
  const { projects, loading, error, fetchProjects } = useProjects(token, apiFilters);
  const { campuses, fetchCampuses } = useCampuses();
  const { organizationTypes } = useOrganizationType(token, selectedCampus);

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, fetchProjects]);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  // Filter options
  const campusFilterOptions = useMemo(
    () => [
      { value: "all", label: "ทุกวิทยาเขต" },
      ...campuses.map((campus) => ({ value: campus.id, label: campus.name })),
    ],
    [campuses]
  );

  const typeFilterOptions = useMemo(
    () => [
      { value: "all", label: "ทุกประเภท" },
      ...organizationTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    ],
    [organizationTypes]
  );

  // Filter projects locally
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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedCampus("all");
    setSelectedOrgType("all");
  };

  // Prepare active filters
  const activeFilters = [
    ...(selectedCampus !== "all" ? [{
      type: "campus",
      label: `วิทยาเขต: ${campusFilterOptions.find(c => c.value === selectedCampus)?.label}`,
      value: selectedCampus,
      onRemove: () => setSelectedCampus("all")
    }] : []),
    ...(selectedOrgType !== "all" ? [{
      type: "orgType",
      label: `ประเภท: ${typeFilterOptions.find(t => t.value === selectedOrgType)?.label}`,
      value: selectedOrgType,
      onRemove: () => setSelectedOrgType("all")
    }] : []),
    ...(searchTerm ? [{
      type: "search",
      label: `ค้นหา: ${searchTerm}`,
      value: searchTerm,
      onRemove: () => setSearchTerm("")
    }] : []),
  ];

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#006C67] mx-auto mb-4" />
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
            <X className="w-8 h-8 text-red-600" />
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
                ติดตาม จัดการ และรายงานผลโครงการทุกประเภท
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <ProjectsStatistics projects={projects} />

        {/* Search and Filters */}
        <ProjectsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showCampusFilter={true}
          selectedCampus={selectedCampus}
          campusOptions={campusFilterOptions}
          onCampusChange={setSelectedCampus}
          showCampusDropdown={showCampusFilter}
          onToggleCampusDropdown={() => setShowCampusFilter(!showCampusFilter)}
          showOrgTypeFilter={true}
          selectedOrgType={selectedOrgType}
          orgTypeOptions={typeFilterOptions}
          onOrgTypeChange={setSelectedOrgType}
          showOrgTypeDropdown={showTypeFilter}
          onToggleOrgTypeDropdown={() => setShowTypeFilter(!showTypeFilter)}
          activeFilters={activeFilters}
          onClearAll={clearFilters}
        />

        {/* Project Cards Grid */}
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
          />

          {/* Empty State */}
          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">ไม่พบโครงการที่ค้นหา</h3>
              <p className="text-gray-500 mb-6">กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#006C67] text-white rounded-xl hover:bg-[#005A56] transition-colors"
              >
                ล้างการค้นหา
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}