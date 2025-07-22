"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useOrganizationById,
  useUpdateOrganization,
} from "@/hooks/useOrganization";
import { useCampuses } from "@/hooks/useCampuses";
import { useOrganizationType } from "@/hooks/useOrganizationType";
import { CustomSelect } from "@/components/ui/Organization/CustomSelect";
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
} from "lucide-react";
import { ImageCropper } from "@/components/ui/Organization/ImageCrop";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { organization, loading, error, fetchOrganizationById } =
    useOrganizationById(token);
  const {
    update: updateOrganization,
    loading: updateLoading,
    error: updateError,
  } = useUpdateOrganization(token);

  const { campuses, loading: campusesLoading, fetchCampuses } = useCampuses();
  const { organizationTypes, loading: typesLoading } = useOrganizationType(
    token,
    ""
  );

  // Form data state
  const [formData, setFormData] = useState({
    nameEn: "",
    nameTh: "",
    email: "",
    phoneNumber: "",
    details: "",
    campusId: "",
    organizationTypeId: "",
  });

  // Initialize token and current user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken) {
        setToken(savedToken);
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
      });
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
    const croppedDataUrl = canvas.toDataURL("image/jpeg");
    setImagePreview(croppedDataUrl);
    setFormData((prev) => ({
      ...prev,
      image: selectedFile, // You may want to convert croppedDataUrl to File if you need only cropped image
    }));
    setShowCropper(false);
    setOriginalImageUrl(null);
    setSelectedFile(null);
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

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;

    try {
      await updateOrganization(params.id as string, formData);
      // Refresh organization data
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
      });
    }
    setIsEditing(false);
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

  // Convert data for dropdowns
  const campusOptions = campuses.map((campus) => ({
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#006C67]" />
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen bg-slate-50">
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
              <div className="w-20 h-20 relative">
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
                  className={`w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center bg-white transition relative ${
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
                      className="w-full h-full object-cover"
                    />
                  ) : organization.image ? (
                    <img
                      src={organization.image}
                      alt="Organization Logo"
                      className="w-full h-full object-cover"
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
              <X className="w-5 h-5 text-red-500" />
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
                        disabled={campusesLoading}
                      />
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

            {/* Members Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  สมาชิกในองค์กร ({organization.userOrganizations?.length || 0})
                </h2>
              </div>

              <div className="space-y-6">
                {/* Heads Section */}
                {heads.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="w-5 h-5 text-amber-500" />
                      <h3 className="text-md font-semibold text-slate-900">
                        หัวหน้าองค์กร ({heads.length})
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
                              <h4 className="font-medium text-slate-900 group-hover:text-[#006C67] transition-colors">
                                {userOrg.user.name}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {userOrg.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
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
                        สมาชิก ({members.length})
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
                              <h4 className="font-medium text-slate-900 group-hover:text-[#006C67] transition-colors">
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
                    <p className="text-slate-500">ยังไม่มีสมาชิกในองค์กร</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">สถิติ</h3>
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
          </div>
        </div>

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