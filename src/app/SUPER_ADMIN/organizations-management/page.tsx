"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCampuses } from "../../../hooks/useCampuses";
import { useOrganizationType } from "../../../hooks/useOrganizationType";
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
} from "../../../hooks/useOrganization";
import { OrganizationList } from "@/components/ui/Organization/OrganizationList";
import { Organization } from "../../../interface/organization";
import { StatCard } from "@/components/ui/Organization/StatCard";
import { CreateOrganizationModal } from "@/components/ui/Organization/CreateOrganizationModal";
import {
  Building2,
  MapPin,
  Users,
  Tag,
  Plus,
  Search,
  ChevronDown,
  Loader2,
  X,
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

export default function OrganizationsManagePage() {
  // Get token from localStorage
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  // Component state
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedOrganizationType, setSelectedOrganizationType] =
    useState<string>("all");
  const [showCampusFilter, setShowCampusFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  // Refs for dropdowns
  const campusFilterRef = useRef<HTMLDivElement>(null);
  const typeFilterRef = useRef<HTMLDivElement>(null);

  useClickOutside(campusFilterRef, () => setShowCampusFilter(false));
  useClickOutside(typeFilterRef, () => setShowTypeFilter(false));

  // Form state
  const [formData, setFormData] = useState({
    nameTh: "",
    nameEn: "",
    campusId: "",
    organizationTypeId: "",
    publicOrganizationId: "",
  });

  // Initialize token
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  const handleOrganizationClick = (organization: Organization) => {
    router.push(`/SUPER_ADMIN/organizations-management/${organization.id}`);
  };

  // Use custom hooks
  const {
    campuses,
    loading: campusesLoading,
    error: campusesError,
    fetchCampuses,
  } = useCampuses();
  const {
    organizationTypes,
    loading: typesLoading,
    error: typesError,
  } = useOrganizationType(token, selectedCampus);
  const {
    organizations,
    loading: orgsLoading,
    error: orgsError,
    fetchOrganizations,
  } = useOrganizations(token);
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateOrganization(token);
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateOrganization(token);

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchCampuses();
      fetchOrganizations();
    }
  }, [token, fetchCampuses, fetchOrganizations]);

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

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (org) =>
          org.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.nameTh.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Campus filter
    if (selectedCampus !== "all") {
      filtered = filtered.filter((org) => org.campus?.id === selectedCampus);
    }

    // Organization type filter
    if (selectedOrganizationType !== "all") {
      filtered = filtered.filter(
        (org) => org.organizationType?.id === selectedOrganizationType
      );
    }

    return filtered;
  }, [organizations, searchTerm, selectedCampus, selectedOrganizationType]);

  // Stats
  const stats = useMemo(
    () => [
      {
        icon: Building2,
        label: "องค์กรทั้งหมด",
        count: organizations.length,
      },
      {
        icon: MapPin,
        label: "วิทยาเขต",
        count: campuses.length,
      },
      {
        icon: Tag,
        label: "ประเภทองค์กร",
        count: organizationTypes.length,
      },
      {
        icon: Users,
        label: "ผลลัพธ์",
        count: filteredOrganizations.length,
      },
    ],
    [
      organizations.length,
      campuses.length,
      organizationTypes.length,
      filteredOrganizations.length,
    ]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      nameTh: "",
      nameEn: "",
      campusId: "",
      organizationTypeId: "",
      publicOrganizationId: "",
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCampus("all");
    setSelectedOrganizationType("all");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const submitData = {
        nameEn: formData.nameEn,
        nameTh: formData.nameTh,
        campusId: formData.campusId,
        organizationTypeId: formData.organizationTypeId,
        publicOrganizationId: formData.publicOrganizationId,
        image: "",
      };

      await create(submitData);

      // Refresh data
      await fetchOrganizations();

      setSuccess(
        "สร้างองค์กรสำเร็จ! ข้อมูลเพิ่มเติมจะให้ผู้ใช้งานกรอกเองภายหลัง"
      );
      resetForm();
      setShowForm(false);
      setError(null);
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(createError || "เกิดข้อผิดพลาดในการสร้างองค์กร");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
    setError(null);
  };

  // Handle edit
  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setFormData({
      nameTh: organization.nameTh,
      nameEn: organization.nameEn,
      campusId: organization.campus.id,
      organizationTypeId: organization.organizationType.id,
      publicOrganizationId: organization.publicOrganizationId,
    });
    setShowEditForm(true);
  };

  // Handle update submit
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrganization) return;

    setError(null);
    setSuccess(null);

    try {
      const submitData = {
        nameEn: formData.nameEn,
        nameTh: formData.nameTh,
        campusId: formData.campusId,
        organizationTypeId: formData.organizationTypeId,
        publicOrganizationId: formData.publicOrganizationId,
        image: editingOrganization.image,
      };

      await update(editingOrganization.id, submitData);

      // Refresh data
      await fetchOrganizations();

      setSuccess("อัปเดตองค์กรสำเร็จ!");
      setShowEditForm(false);
      setEditingOrganization(null);
      resetForm();

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(updateError || "เกิดข้อผิดพลาดในการอัปเดตองค์กร");
    }
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingOrganization(null);
    resetForm();
    setError(null);
  };

  const isLoading = campusesLoading || typesLoading || orgsLoading;
  const hasError = campusesError || typesError || orgsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-4">{hasError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              <h1 className="text-3xl font-bold text-slate-900">
                จัดการองค์กร
              </h1>
              <p className="text-slate-600 mt-2">
                จัดการข้อมูลองค์กรและสร้างองค์กรใหม่
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#006C67] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              สร้างองค์กร
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                count={stat.count}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
              <X className="w-3 h-3" />
            </div>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <span>{success}</span>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาองค์กร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors placeholder-slate-400"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {/* Campus Filter */}
              <div className="relative" ref={campusFilterRef}>
                <button
                  onClick={() => setShowCampusFilter(!showCampusFilter)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
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
                            ? "bg-blue-50 text-blue-700"
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
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <Tag className="w-4 h-4" />
                  <span className="hidden sm:block">
                    {
                      typeFilterOptions.find(
                        (t) => t.value === selectedOrganizationType
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
                          setSelectedOrganizationType(option.value);
                          setShowTypeFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                          selectedOrganizationType === option.value
                            ? "bg-blue-50 text-blue-700"
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
          {(selectedCampus !== "all" ||
            selectedOrganizationType !== "all" ||
            searchTerm) && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">
                  ตัวกรองที่ใช้งาน:
                </span>
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
                {selectedOrganizationType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    ประเภท:{" "}
                    {
                      typeFilterOptions.find(
                        (t) => t.value === selectedOrganizationType
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedOrganizationType("all")}
                      className="ml-1 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    ค้นหา: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Organizations List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
          <OrganizationList
            organizations={filteredOrganizations}
            onClick={handleOrganizationClick}
            loading={orgsLoading}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Create Organization Modal */}
        <CreateOrganizationModal
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
          onCampusChange={(value) =>
            setFormData((prev) => ({ ...prev, campusId: value }))
          }
          onTypeChange={(value) =>
            setFormData((prev) => ({ ...prev, organizationTypeId: value }))
          }
          campuses={campuses}
          organizationTypes={organizationTypes}
          loading={createLoading}
          error={error || createError}
        />
      </div>
    </div>
  );
}
