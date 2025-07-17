import React from "react";
import { X, Building2, MapPin, Tag, Plus, Hash } from "lucide-react";
import { Campus } from "@/interface/campus";
import { CustomSelect } from "./CustomSelect";
import { organizationType } from "@/interface/organizationType";
import { User } from "@/interface/user";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    nameTh: string;
    nameEn: string;
    campusId: string;
    organizationTypeId: string;
    publicOrganizationId: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCampusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  campuses: Campus[];
  organizationTypes: organizationType[];
  loading: boolean;
  error: string | null;
  currentUser?: User | null;
}

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  onCampusChange,
  onTypeChange,
  campuses,
  organizationTypes,
  loading,
  error,
  currentUser,
}) => {
  if (!isOpen) return null;

    // Convert campuses to options
  const campusOptions = campuses.map((campus) => ({
    value: campus.id,
    label: campus.name,
  }));

  // Convert organization types to options (filtered by campus)
  const typeOptions = organizationTypes
    .filter((type) => type.campusId === formData.campusId)
    .map((type) => ({
      value: type.id,
      label: type.name,
    }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#006C67]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                สร้างองค์กรใหม่
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-red-600" />
                </div>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Campus */}
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
                onChange={onCampusChange}
                placeholder="เลือกวิทยาเขต"
                disabled={!!currentUser?.campusId}
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  ประเภทองค์กร
                </div>
              </label>
              <CustomSelect
                options={typeOptions}
                value={formData.organizationTypeId}
                onChange={onTypeChange}
                placeholder="เลือกประเภทองค์กร"
                disabled={!formData.campusId}
              />
              {!formData.campusId && (
                <p className="text-xs text-slate-500 mt-1">
                  กรุณาเลือกวิทยาเขตก่อน
                </p>
              )}
            </div>

            {/* Organization ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  รหัสองค์กร
                </div>
              </label>
              <input
                type="text"
                name="publicOrganizationId"
                value={formData.publicOrganizationId}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-black"
                placeholder="เช่น KU-ENG-001"
                required
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  ชื่อภาษาอังกฤษ
                </div>
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-black"
                placeholder="Organization Name"
                required
              />
            </div>

            {/* Thai Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  ชื่อภาษาไทย
                </div>
              </label>
              <input
                type="text"
                name="nameTh"
                value={formData.nameTh}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-black"
                placeholder="ชื่อองค์กร"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#006C67] text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  สร้าง...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  สร้างองค์กร
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};