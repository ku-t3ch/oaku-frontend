"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCampuses } from "../../../hooks/useCampuses";
import { useOrganizationType } from "../../../hooks/useOrganizationType";
import {
  useOrganizations,
  useCreateOrganization,
} from "../../../hooks/useOrganization";
import { OrganizationList } from "@/components/ui/Organization/OrganizationList";
import { Organization } from "../../../interface/organization";
import { CreateOrganizationModal } from "@/components/ui/Organization/CreateOrganizationModal";
import {
  MapPin,
  Tag,
  Plus,
  Search,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { User } from "@/interface/user";

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Component state
  const [showForm, setShowForm] = useState(false);
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

  // Initialize token and user
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    if (accessToken) {
      setToken(accessToken);
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
      
      // Set selected campus to user's campus automatically
      if (parsedUser.campus.id) {
        setSelectedCampus(parsedUser.campus.id);
        // Auto-set campusId in form when user has campusId
        setFormData(prev => ({
          ...prev,
          campusId: parsedUser.campus.id
        }));
      }
    }
  }, []);

  const handleOrganizationClick = (organization: Organization) => {
    router.push(`/CAMPUS_ADMIN/organizations-management/${organization.id}`);
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

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchCampuses();
      fetchOrganizations();
    }
  }, [token, fetchCampuses, fetchOrganizations]);

  // Filter options - แก้ไขส่วนนี้
  const campusFilterOptions = useMemo(() => {
    if (currentUser?.campus.id) {
      // หาก user มี campusId ให้แสดงเฉพาะวิทยาเขตของ user
      const userCampus = campuses.find(campus => campus.id === currentUser.campus.id);
      return userCampus ? [{ value: userCampus.id, label: userCampus.name }] : [];
    }
    
    // สำหรับ SUPER_ADMIN หรือ user ที่ไม่มี campusId
    return [
      { value: "all", label: "ทุกวิทยาเขต" },
      ...campuses.map((campus) => ({ value: campus.id, label: campus.name })),
    ];
  }, [campuses, currentUser]);

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
      campusId: currentUser?.campus.id || "", // Keep user's campus if exists
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
    } catch {
      setError(createError || "เกิดข้อผิดพลาดในการสร้างองค์กร");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
    setError(null);
  };

  // Filter campuses for modal based on user role
  const modalCampusOptions = useMemo(() => {
    if (currentUser?.campus.id) {
      // หาก user มี campusId ให้แสดงเฉพาะวิทยาเขตของ user
      const userCampus = campuses.find(campus => campus.id === currentUser.campus.id);
      return userCampus ? [userCampus] : [];
    }
    
    // สำหรับ SUPER_ADMIN หรือ user ที่ไม่มี campusId
    return campuses;
  }, [campuses, currentUser]);

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
                จัดการข้อมูลองค์กร
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
                className="w-full pl-12 pr-4 py-3 text-black text-sm border-2 border-slate-200 rounded-xl focus:border-[#006C67] focus:ring-0 focus:outline-none transition-colors placeholder-slate-400"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {/* Campus Filter */}
              <div className="relative" ref={campusFilterRef}>
                <button
                  onClick={() => {
                    if (!currentUser?.campus.id) {
                      setShowCampusFilter(!showCampusFilter);
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    currentUser?.campus.id
                      ? "text-slate-400 bg-slate-100 border-2 border-slate-200 cursor-not-allowed"
                      : "text-slate-700 bg-white border-2 border-slate-200 hover:border-[#006C67] hover:bg-[#006C67]/10"
                  }`}
                  disabled={!!currentUser?.campus.id}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:block">
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                  </span>
                  {!currentUser?.campus.id && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showCampusFilter ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                
                {showCampusFilter && !currentUser?.campus.id && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                    {campusFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCampus(option.value);
                          setShowCampusFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#006C67]/10 hover:text-[#006C67] transition-colors ${
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
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-[#006C67] hover:bg-[#006C67]/10 transition-all duration-200"
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
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#006C67]/10 hover:text-[#006C67] transition-colors ${
                          selectedOrganizationType === option.value
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
          {((!currentUser?.campus.id && selectedCampus !== "all") ||
            selectedOrganizationType !== "all" ||
            searchTerm) && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">
                  ตัวกรองที่ใช้งาน:
                </span>
                
                {!currentUser?.campus.id && selectedCampus !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#006C67]/10 text-[#006C67] rounded-full">
                    วิทยาเขต:{" "}
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedCampus("all")}
                      className="ml-1 hover:text-[#005A56]"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {currentUser?.campus.id && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                    วิทยาเขต:{" "}
                    {
                      campusFilterOptions.find(
                        (c) => c.value === selectedCampus
                      )?.label
                    }
                  </span>
                )}
                
                {selectedOrganizationType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#006C67]/10 text-[#006C67] rounded-full">
                    ประเภท:{" "}
                    {
                      typeFilterOptions.find(
                        (t) => t.value === selectedOrganizationType
                      )?.label
                    }
                    <button
                      onClick={() => setSelectedOrganizationType("all")}
                      className="ml-1 hover:text-[#005A56]"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#006C67]/10 text-[#006C67] rounded-full">
                    ค้นหา: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-[#005A56]"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedOrganizationType("all");
                    if (!currentUser?.campus.id) {
                      setSelectedCampus("all");
                    }
                  }}
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
          campuses={modalCampusOptions} // ใช้ modalCampusOptions แทน campuses
          organizationTypes={organizationTypes}
          loading={createLoading}
          error={error || createError}
          currentUser={currentUser} // ส่ง currentUser ไปยัง modal
        />
      </div>
    </div>
  );
}
