"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Plus,
  ArrowRight,
  Clock,
  Building,
  Target,
  Filter,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { Project, ProjectFilters } from "@/interface/project";

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

// Helper functions
const getStatusProps = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return {
        text: "เสร็จสิ้น",
        color: "bg-primary text-primary-foreground",
        bgColor: "bg-primary/10",
      };
    case "IN_PROGRESS":
      return {
        text: "กำลังดำเนินการ",
        color: "bg-blue-600 text-white",
        bgColor: "bg-blue-50",
      };
    case "PADDING":
      return {
        text: "รอดำเนินการ",
        color: "bg-amber-500 text-white",
        bgColor: "bg-amber-50",
      };
    case "CANCELED":
      return {
        text: "ยกเลิก",
        color: "bg-red-600 text-white",
        bgColor: "bg-red-50",
      };
    default:
      return {
        text: status,
        color: "bg-gray-400 text-white",
        bgColor: "bg-gray-50",
      };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateParticipants = (data: Array<Record<string, number>> | null) => {
  if (!data) return 0;
  return data.reduce(
    (total, group) =>
      total + Object.values(group).reduce((sum, count) => sum + count, 0),
    0
  );
};

const formatBudget = (budget: number | null) => {
  if (!budget) return "ไม่ระบุ";
  return new Intl.NumberFormat("th-TH").format(budget) + " บาท";
};

export default function ProjectsManagePage() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedOrgType, setSelectedOrgType] = useState<string>("all");
  const [showCampusFilter, setShowCampusFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  // Refs for dropdowns
  const campusFilterRef = useRef<HTMLDivElement>(null);
  const typeFilterRef = useRef<HTMLDivElement>(null);

  useClickOutside(campusFilterRef, () => setShowCampusFilter(false));
  useClickOutside(typeFilterRef, () => setShowTypeFilter(false));

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
  const { projects, loading, error, fetchProjects } = useProjects(
    token,
    apiFilters
  );
  const { campuses, fetchCampuses } = useCampuses();
  const { organizationTypes } = useOrganizationType(
    token,
    selectedCampus
  );

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, fetchProjects]);

  // Fetch campuses on mount
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
        project.activityCode
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.organization?.nameEn
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.organization?.nameTh
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  // Statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgressProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const pendingProjects = projects.filter((p) => p.status === "PADDING").length;

  const handleProjectClick = (project: Project) => {
    router.push(`/SUPER_ADMIN/projects-management/${project.id}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedCampus("all");
    setSelectedOrgType("all");
  };

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
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#006C67] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
              <Plus className="w-5 h-5" />
              สร้างโครงการใหม่
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">โครงการทั้งหมด</p>
                <p className="text-3xl font-bold text-[#006C67]">{totalProjects}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-[#006C67]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
                <p className="text-3xl font-bold text-[#006C67]">{completedProjects}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-[#006C67]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">กำลังดำเนินการ</p>
                <p className="text-3xl font-bold text-[#006C67]">{inProgressProjects}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#006C67]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
                <p className="text-3xl font-bold text-[#006C67]">{pendingProjects}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-[#006C67]" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาโครงการ (ชื่อ, รหัส, หน่วยงาน)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:border-[#006C67] focus:ring-0 transition-colors placeholder-slate-400"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {/* Campus Filter */}
              <div className="relative" ref={campusFilterRef}>
                <button
                  onClick={() => setShowCampusFilter(!showCampusFilter)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-[#006C67] hover:bg-[#006C67]/5 transition-all duration-200"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:block">
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
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
                            ? "bg-[#006C67]/10 text-[#006C67]"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Filter */}
              <div className="relative" ref={typeFilterRef}>
                <button
                  onClick={() => setShowTypeFilter(!showTypeFilter)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-[#006C67] hover:bg-[#006C67]/5 transition-all duration-200"
                >
                  <Building className="w-4 h-4" />
                  <span className="hidden sm:block">
                    {
                      typeFilterOptions.find(
                        (t) => t.value === selectedOrgType
                      )?.label
                    }
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showTypeFilter ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showTypeFilter && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                    {typeFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedOrgType(option.value);
                          setShowTypeFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                          selectedOrgType === option.value
                            ? "bg-[#006C67]/10 text-[#006C67]"
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

          {/* Active Filters */}
          {(searchTerm ||
            statusFilter !== "ALL" ||
            selectedCampus !== "all" ||
            selectedOrgType !== "all") && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">ตัวกรองที่ใช้งาน:</span>
                {statusFilter !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    สถานะ: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("ALL")}
                      className="ml-1 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCampus !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    วิทยาเขต:{" "}
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedCampus("all")}
                      className="ml-1 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedOrgType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    ประเภท:{" "}
                    {
                      typeFilterOptions.find(
                        (t) => t.value === selectedOrgType
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedOrgType("all")}
                      className="ml-1 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                    ค้นหา: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-amber-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Project Cards Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
          {/* Status Filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">สถานะ :</span>
              {[
                { key: "ALL", label: "ทั้งหมด" },
                { key: "IN_PROGRESS", label: "กำลังดำเนินการ" },
                { key: "COMPLETED", label: "เสร็จสิ้น" },
                { key: "PADDING", label: "รอดำเนินการ" },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const status = getStatusProps(project.status);
              const currentParticipants = calculateParticipants(
                project.participants || []
              );
              const targetParticipants = calculateParticipants(
                project.targetUser
              );

              return (
                <div
                  key={project.id}
                  className="group bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200/50 shadow-md overflow-hidden cursor-pointer rounded-xl"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Status Header */}
                  <div
                    className={`h-2 ${
                      status.color.includes("bg-primary") ||
                      status.color.includes("text-primary-foreground")
                        ? "bg-[#006C67]"
                        : status.color.includes("bg-blue")
                        ? "bg-blue-600"
                        : status.color.includes("bg-amber")
                        ? "bg-amber-500"
                        : "bg-red-600"
                    }`}
                  />

                  <div className="p-6">
                    <div className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {project.activityCode}
                          </span>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${status.color.includes("bg-primary") || status.color.includes("text-primary-foreground") ? "bg-[#006C67] text-white" : status.color.includes("bg-blue") ? "bg-blue-600 text-white" : status.color.includes("bg-amber") ? "bg-amber-500 text-white" : "bg-red-600 text-white"}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-[#006C67] transition-colors mb-1">
                        {project.nameTh}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {project.nameEn}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Date and Duration */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-[#006C67]" />
                        <span>
                          {formatDate(project.dateStart)} -{" "}
                          {formatDate(project.dateEnd)}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-[#006C67]" />
                        <span className="truncate">
                          {project.location?.location || "ไม่ระบุสถานที่"}
                          {project.location?.outside &&
                            project.location.outside.length > 0 &&
                            `, ${project.location.outside[0].province}`}
                        </span>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="h-4 w-4 mr-2 text-[#006C67]" />
                        <span>
                          {currentParticipants} / {targetParticipants} คน
                        </span>
                      </div>

                      {/* Budget */}
                      {project.budgetUsed && (
                        <div className="text-sm">
                          <span className="text-gray-600">งบประมาณที่ใช้: </span>
                          <span className="font-semibold text-gray-800">
                            {formatBudget(project.budgetUsed)}
                          </span>
                        </div>
                      )}

                      {/* SDG Tags */}
                      {project.sustainableDevelopmentGoals && project.sustainableDevelopmentGoals.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.sustainableDevelopmentGoals.slice(0, 3).map((sdg) => (
                            <span
                              key={sdg}
                              className="px-2 py-1 text-xs text-[#006C67] border border-[#006C67]/30 bg-[#006C67]/5 hover:bg-[#006C67]/10 rounded-full"
                            >
                              {sdg}
                            </span>
                          ))}
                          {project.sustainableDevelopmentGoals.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-full">
                              +{project.sustainableDevelopmentGoals.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm">
                        <p className="text-gray-500 text-xs">หน่วยงาน</p>
                        <p className="font-medium text-gray-700 truncate">
                          {project.organization?.nameTh ||
                            project.organization?.nameEn ||
                            "ไม่ระบุหน่วยงาน"}
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-2 text-[#006C67] hover:bg-[#006C67]/10 px-3 py-1 rounded-lg font-semibold group-hover:translate-x-1 transition-transform text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project);
                        }}
                      >
                        ดูรายละเอียด
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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

          {/* Loading State */}
          {loading && filteredProjects.length > 0 && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#006C67] mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}