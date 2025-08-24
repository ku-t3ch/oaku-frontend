"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useOrganizationById,
  useUpdateOrganization,
} from "@/hooks/useOrganization";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { useProjects } from "@/hooks/useProject";
import { CustomSelect } from "@/components/ui/Organization/CustomSelect";
import { ProjectTable } from "@/components/ui/Project/ProjectTable";
import { AddMemberModal } from "@/components/ui/Organization/AddMemberModal";
import {
  Building2,
  MapPin,
  Tag,
  Users,
  Mail,
  Phone,
  ArrowLeft,
  Edit,
  Loader2,
  Save,
  X,
  Crown,
  User2,
  FolderOpen,
  TrendingUp,
  Filter,
  UserPlus,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import { User } from "@/interface/user";
import { Project } from "@/interface/project";
import { ImageCropper } from "@/components/ui/Organization/ImageCrop";
import { SocialMedia } from "@/interface/organization";

type TabType = "members" | "projects";
type StatusFilter =
  | "ALL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PADDING"
  | "CANCELED";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("members");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // เพิ่ม state สำหรับ AddMemberModal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const { organization, loading, error, fetchOrganizationById } =
    useOrganizationById(token);
  const {
    update: updateOrganization,
    loading: updateLoading,
    error: updateError,
  } = useUpdateOrganization(token);

  const { campuses, fetchCampuses } = useCampuses();
  const { organizationTypes, loading: typesLoading } = useOrganizationType(
    token,
    ""
  );

  const projectFilters = useMemo(() => {
    return params.id ? { organizationId: params.id as string } : undefined;
  }, [params.id]);

  const {
    projects: allProjects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects: refetchProjects,
  } = useProjects(token, projectFilters);

  const filteredProjects = useMemo(() => {
    if (statusFilter === "ALL") return allProjects;
    return allProjects.filter((project) => project.status === statusFilter);
  }, [allProjects, statusFilter]);

  const [formData, setFormData] = useState<{
    nameEn: string;
    nameTh: string;
    email: string;
    phoneNumber: string;
    details: string;
    campusId: string;
    organizationTypeId: string;
    socialMedia: SocialMedia[]; // <--- แก้ตรงนี้
  }>({
    nameEn: "",
    nameTh: "",
    email: "",
    phoneNumber: "",
    details: "",
    campusId: "",
    organizationTypeId: "",
    socialMedia: [], // <--- แก้ตรงนี้
  });

  const handleAddMemberSuccess = () => {
    if (params.id) {
      fetchOrganizationById(params.id as string);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");
      if (savedToken) {
        setToken(savedToken);
      }
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }
  }, []);

  // Fetch organization data
  useEffect(() => {
    if (token) {
      fetchCampuses();
      if (params.id) {
        fetchOrganizationById(params.id as string);
      }
    }
  }, [token, params.id, fetchOrganizationById, fetchCampuses]);

  // Set form data when organization is loaded
  useEffect(() => {
    if (organization) {
      setFormData({
        nameEn: organization.nameEn || "",
        nameTh: organization.nameTh || "",
        email: organization.email || "",
        phoneNumber: organization.phoneNumber || "",
        details: organization.details || "",
        campusId: organization.campusId || "",
        organizationTypeId: organization.organizationTypeId || "",
        socialMedia: Array.isArray(organization.socialMedia) ? organization.socialMedia : [],
      });
      setImagePreview(organization.image || null);
    }
  }, [organization]);

  // Handle image change and open cropper
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  // When crop is done
  const handleCropComplete = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File(
          [blob],
          selectedFile?.name || "cropped.jpg",
          { type: "image/jpeg" }
        );
        setImagePreview(URL.createObjectURL(croppedFile));
        setFormData((prev) => ({
          ...prev,
          image: croppedFile,
        }));
      }
      setShowCropper(false);
      setOriginalImageUrl(null);
      setSelectedFile(null);
    }, "image/jpeg");
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImageUrl(null);
    setSelectedFile(null);
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle campus change
  const handleCampusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      campusId: value,
      organizationTypeId: "", // Reset organization type when campus changes
    }));
  };

  // Handle organization type change
  const handleOrganizationTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationTypeId: value,
    }));
  };

  // Handle social media changes
  const handleSocialMediaChange = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSocialMedia = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "", url: "" }],
    }));
  };

  const removeSocialMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;

    // กรอง socialMedia ที่ platform หรือ url ไม่ว่าง
    const filteredSocialMedia = formData.socialMedia.filter(
      (item) => item.platform.trim() !== "" || item.url.trim() !== ""
    );

    try {
      await updateOrganization(params.id as string, {
        ...formData,
        socialMedia: filteredSocialMedia, // ส่งเฉพาะที่ไม่ว่าง
      });
      await fetchOrganizationById(params.id as string);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update organization:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (organization) {
      setFormData({
        nameEn: organization.nameEn || "",
        nameTh: organization.nameTh || "",
        email: organization.email || "",
        phoneNumber: organization.phoneNumber || "",
        details: organization.details || "",
        campusId: organization.campusId || "",
        organizationTypeId: organization.organizationTypeId || "",
        socialMedia: Array.isArray(organization.socialMedia) ? organization.socialMedia : [],
      });
      setImagePreview(organization.image || null);
    }
    setIsEditing(false);
  };

  // Handle project click
  const handleProjectClick = (project: Project) => {
    router.push(`/SUPER_ADMIN/projects-management/${project.id}`);
  };

  // Separate users by position
  const heads =
    organization?.userOrganizations?.filter(
      (userOrg) => userOrg.position?.toLowerCase() === "head"
    ) || [];

  const members =
    organization?.userOrganizations?.filter(
      (userOrg) => userOrg.position?.toLowerCase() !== "head"
    ) || [];

  // Convert data for dropdowns - filtered based on user's campus
  const campusOptions = currentUser?.campus.id
    ? campuses
        .filter((campus) => campus.id === currentUser.campus.id)
        .map((campus) => ({
          value: campus.id,
          label: campus.name,
        }))
    : campuses.map((campus) => ({
        value: campus.id,
        label: campus.name,
      }));

  const filteredOrganizationTypes = organizationTypes.filter(
    (type) => type.campusId === formData.campusId
  );

  const organizationTypeOptions = filteredOrganizationTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  // คำนวณสถิติโครงการจาก allProjects
  const projectStats = {
    total: allProjects.length,
    completed: allProjects.filter((p) => p.status === "COMPLETED").length,
    inProgress: allProjects.filter((p) => p.status === "IN_PROGRESS").length,
    draft: allProjects.filter((p) => p.status === "PADDING").length,
    canceled: allProjects.filter((p) => p.status === "CANCELED").length,
    totalBudget: allProjects.reduce((sum, p) => sum + (p.budgetUsed || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#006C67] mx-auto mb-4" />
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            ไม่พบข้อมูลองค์กร
          </h2>
          <p className="text-slate-600 mb-4">
            {error || "ไม่พบองค์กรที่ต้องการ"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
          >
            กลับไปหน้าก่อน
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xl text-slate-600 hover:text-slate-900 mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
            กลับ
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-30 h-30 relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  id="org-logo-upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
                <button
                  type="button"
                  className={`w-30 h-30 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center bg-white transition relative rounded-full ${
                    isEditing
                      ? "hover:opacity-80 cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    isEditing &&
                    document.getElementById("org-logo-upload")?.click()
                  }
                  tabIndex={0}
                  aria-label="เปลี่ยนโลโก้องค์กร"
                  disabled={!isEditing}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Organization Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-[#006C67]" />
                  )}
                  {isEditing && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs py-1 text-center">
                      เปลี่ยนรูป
                    </div>
                  )}
                </button>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {organization.nameEn}
                </h1>
                <p className="text-xl text-slate-600 mb-2">
                  {organization.nameTh}
                </p>
                <p className="text-slate-500">
                  {organization.publicOrganizationId}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={updateLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={updateLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {updateLoading ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  แก้ไข
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Update Error Message */}
        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                <X className="w-3 h-3 text-red-600" />
              </div>
              <span className="text-red-700">{updateError}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                ข้อมูลทั่วไป
              </h2>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          วิทยาเขต
                        </div>
                      </label>
                      <CustomSelect
                        options={campusOptions}
                        value={formData.campusId}
                        onChange={handleCampusChange}
                        placeholder="เลือกวิทยาเขต"
                        disabled={!!currentUser?.campus.id}
                      />
                      {currentUser?.campus.id && (
                        <p className="text-xs text-slate-500 mt-1">
                          คุณสามารถแก้ไององค์กรในวิทยาเขตของคุณเท่านั้น
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          ประเภทองค์กร
                        </div>
                      </label>
                      <CustomSelect
                        options={organizationTypeOptions}
                        value={formData.organizationTypeId}
                        onChange={handleOrganizationTypeChange}
                        placeholder="เลือกประเภทองค์กร"
                        disabled={!formData.campusId || typesLoading}
                      />
                      {!formData.campusId && (
                        <p className="text-xs text-slate-500 mt-1">
                          กรุณาเลือกวิทยาเขตก่อน
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ชื่อภาษาอังกฤษ
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                        placeholder="Organization Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ชื่อภาษาไทย
                      </label>
                      <input
                        type="text"
                        name="nameTh"
                        value={formData.nameTh}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                        placeholder="ชื่อองค์กร"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        อีเมล
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                        placeholder="organization@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                        placeholder="012-345-6789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      รายละเอียด
                    </label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                      placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับองค์กร..."
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">
                        โซเชียลมีเดีย
                      </label>
                      <button
                        type="button"
                        onClick={addSocialMedia}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-[#006C67] text-white rounded hover:bg-[#005A56] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        เพิ่ม
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.socialMedia.map((social, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={social.platform}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                index,
                                "platform",
                                e.target.value
                              )
                            }
                            className="w-64 px-3 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                            placeholder="ชื่อแพลตฟอร์ม"
                          />
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) =>
                              handleSocialMediaChange(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-[#006C67] focus:ring-2 focus:ring-[#006C67]/20 transition-colors text-black"
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialMedia(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {formData.socialMedia.length === 0 && (
                        <p className="text-sm text-slate-500 italic">
                          ยังไม่มีโซเชียลมีเดีย
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">วิทยาเขต</p>
                      <p className="font-medium text-slate-900">
                        {organization.campus?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">ประเภทองค์กร</p>
                      <p className="font-medium text-slate-900">
                        {organization.organizationType?.name}
                      </p>
                    </div>
                  </div>

                  {organization.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">อีเมล</p>
                        <p className="font-medium text-slate-900">
                          {organization.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {organization.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">โทรศัพท์</p>
                        <p className="font-medium text-slate-900">
                          {organization.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {organization.socialMedia &&
                    Array.isArray(organization.socialMedia) &&
                    organization.socialMedia.length > 0 && (
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-2">
                              โซเชียลมีเดีย
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {organization.socialMedia.map((social, index) => (
                                <a
                                  key={index}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
                                >
                                  <Globe className="w-3 h-3" />
                                  {social.platform}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {!isEditing && organization.details && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-2">
                    รายละเอียด
                  </h3>
                  <p className="text-slate-600">{organization.details}</p>
                </div>
              )}
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              {/* Tab Header */}
              <div className="border-b border-slate-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("members")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "members"
                        ? "border-[#006C67] text-[#006C67] bg-[#006C67]/5"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    สมาชิกในองค์กร
                  </button>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "projects"
                        ? "border-[#006C67] text-[#006C67] bg-[#006C67]/5"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    โครงการในองค์กร
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "members" && (
                  <div className="space-y-6">
                    {/* Add Member Button */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-slate-900">
                        สมาชิกในองค์กร
                      </h3>
                      {/* แสดงปุ่มเพิ่มสมาชิกเฉพาะ CAMPUS_ADMIN และ SUPER_ADMIN */}
                      {(currentUser?.roles?.includes("CAMPUS_ADMIN") ||
                        currentUser?.roles?.includes("SUPER_ADMIN")) && (
                        <button
                          onClick={() => setShowAddMemberModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          เพิ่มสมาชิก
                        </button>
                      )}
                    </div>

                    {/* Heads Section */}
                    {heads.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Crown className="w-5 h-5 text-amber-500" />
                          <h3 className="text-md font-semibold text-slate-900">
                            หัวหน้าองค์กร
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {heads.map((userOrg) => (
                            <div
                              key={userOrg.id}
                              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  {userOrg.user.image ? (
                                    <img
                                      src={userOrg.user.image}
                                      alt={userOrg.user.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                                      <span className="text-white font-medium text-sm">
                                        {(userOrg.user.name || "H")
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white">
                                    <Crown className="w-2 h-2 text-white absolute top-0.5 left-0.5" />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 transition-colors">
                                    {userOrg.user.name}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    {userOrg.user.email}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    หัวหน้า
                                  </span>
                                  {userOrg.isSuspended && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                      ถูกระงับ
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Members Section */}
                    {members.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User2 className="w-5 h-5 text-slate-500" />
                          <h3 className="text-md font-semibold text-slate-900">
                            สมาชิก
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {members.map((userOrg) => (
                            <div
                              key={userOrg.id}
                              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  {userOrg.user.image ? (
                                    <img
                                      src={userOrg.user.image}
                                      alt={userOrg.user.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#006C67] to-[#004D4D] rounded-full flex items-center justify-center">
                                      <span className="text-white font-medium text-sm">
                                        {(userOrg.user.name || "M")
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                      userOrg.isSuspended
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 transition-colors">
                                    {userOrg.user.name}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    {userOrg.user.email}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full">
                                    {userOrg.position || "สมาชิก"}
                                  </span>
                                  {userOrg.isSuspended && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                      ถูกระงับ
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Members */}
                    {organization.userOrganizations?.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-4">
                          ยังไม่มีสมาชิกในองค์กร
                        </p>
                        {/* แสดงปุ่มเพิ่มสมาชิกเมื่อไม่มีสมาชิก */}
                        {(currentUser?.roles?.includes("CAMPUS_ADMIN") ||
                          currentUser?.roles?.includes("SUPER_ADMIN")) && (
                          <button
                            onClick={() => setShowAddMemberModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors mx-auto"
                          >
                            <UserPlus className="w-4 h-4" />
                            เพิ่มสมาชิกคนแรก
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="space-y-6">
                    {/* Status Filter */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          สถานะ :
                        </span>
                        {[
                          { key: "ALL" as StatusFilter, label: "ทั้งหมด" },
                          {
                            key: "IN_PROGRESS" as StatusFilter,
                            label: "ดำเนินการ",
                          },
                          {
                            key: "COMPLETED" as StatusFilter,
                            label: "เสร็จสิ้น",
                          },
                          {
                            key: "PADDING" as StatusFilter,
                            label: "ร่างโครงการ",
                          },
                          { key: "CANCELED" as StatusFilter, label: "ยกเลิก" },
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

                    {projectsLoading && (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[#006C67] mx-auto mb-4" />
                        <p className="text-slate-600">กำลังโหลดโครงการ...</p>
                      </div>
                    )}

                    {projectsError && (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <X className="w-6 h-6 text-red-600" />
                        </div>
                        <p className="text-red-600">{projectsError}</p>
                        <button
                          onClick={refetchProjects}
                          className="mt-2 px-4 py-2 text-sm bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
                        >
                          ลองใหม่
                        </button>
                      </div>
                    )}

                    {!projectsLoading &&
                      !projectsError &&
                      filteredProjects.length > 0 && (
                        <ProjectTable
                          projects={filteredProjects}
                          loading={loading}
                          onProjectClick={handleProjectClick}
                        />
                      )}

                    {!projectsLoading &&
                      !projectsError &&
                      filteredProjects.length === 0 &&
                      allProjects.length > 0 && (
                        <div className="text-center py-8">
                          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500">ไม่พบโครงการ</p>
                          <button
                            onClick={() => setStatusFilter("ALL")}
                            className="mt-2 px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            แสดงทั้งหมด
                          </button>
                        </div>
                      )}

                    {!projectsLoading &&
                      !projectsError &&
                      allProjects.length === 0 && (
                        <div className="text-center py-8">
                          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500">
                            ยังไม่มีโครงการในองค์กรนี้
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Organization Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">สถิติองค์กร</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">หัวหน้าองค์กร</span>
                  <span className="font-semibold text-slate-900">
                    {heads.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">สมาชิกทั้งหมด</span>
                  <span className="font-semibold text-slate-900">
                    {members.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">สมาชิกที่ถูกระงับ</span>
                  <span className="font-semibold text-slate-900">
                    {organization.userOrganizations?.filter(
                      (u) => u.isSuspended
                    ).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">สร้างเมื่อ</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(organization.createdAt).toLocaleDateString(
                      "th-TH"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#006C67]" />
                <h3 className="font-semibold text-slate-900">สถิติโครงการ</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">โครงการทั้งหมด</span>
                  <span className="font-semibold text-slate-900">
                    {projectStats.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">เสร็จสิ้น</span>
                  <span className="font-semibold text-slate-900">
                    {projectStats.completed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ดำเนินการ</span>
                  <span className="font-semibold text-slate-900">
                    {projectStats.inProgress}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ร่างโครงการ</span>
                  <span className="font-semibold text-slate-900">
                    {projectStats.draft}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ยกเลิก</span>
                  <span className="font-semibold text-slate-900">
                    {projectStats.canceled}
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">งบประมาณใช้ไป</span>
                    <span className="font-semibold text-slate-900">
                      {new Intl.NumberFormat("th-TH").format(
                        projectStats.totalBudget
                      )}{" "}
                      ฿
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AddMemberModal */}
        {showAddMemberModal && currentUser && organization && (
          <AddMemberModal
            isOpen={showAddMemberModal}
            onClose={() => setShowAddMemberModal(false)}
            organizationId={organization.id}
            organizationTypeId={organization.organizationTypeId}
            currentUser={currentUser}
            token={token}
            onSuccess={handleAddMemberSuccess}
            userType="SUPER_ADMIN"
          />
        )}

        {/* Image Cropper Modal */}
        {showCropper && originalImageUrl && (
          <ImageCropper
            imageSrc={originalImageUrl}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={1}
          />
        )}
      </div>
    </div>
  );
}