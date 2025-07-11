import React, { useState } from "react";
import { User } from "@/interface/user";
import { getRoleLabel } from "@/utils/roleUtils";
import {
  useEditUser,
  useAddOrRemoveCampusAdmin,
  useAddSuperAdmin,
} from "@/hooks/useUserApi";

interface CardInfoUserProps {
  user: User;
  roleBadge: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
  isCurrentUserSuperAdmin: boolean;
}

export const CardInfoUser: React.FC<CardInfoUserProps> = ({
  user,
  roleBadge,
  isOpen,
  onClose,
  onUserUpdate,
  isCurrentUserSuperAdmin,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    image: user.image || "",
  });
  const [pendingRole, setPendingRole] = useState<null | {
    role: "SUPER_ADMIN" | "CAMPUS_ADMIN";
    checked: boolean;
  }>(null);

  const { edit, loading: editLoading } = useEditUser(
    localStorage.getItem("accessToken") || ""
  );
  const { mutate: mutateCampusAdmin, loading: campusAdminLoading } =
    useAddOrRemoveCampusAdmin(localStorage.getItem("accessToken") || "");
  const { mutate: mutateSuperAdmin, loading: superAdminLoading } =
    useAddSuperAdmin(localStorage.getItem("accessToken") || "");

  if (!isOpen) return null;

  const status = user.isSuspended ? "suspended" : "active";
  const getStatusColor = (s: "active" | "suspended") =>
    s === "active" ? "text-emerald-600" : "text-red-500";
  const getStatusText = (s: "active" | "suspended") =>
    s === "active" ? "ใช้งานอยู่" : "ถูกระงับ";

  // ตรวจสอบสิทธิ์
  const hasSuperAdmin = user.userRoles?.some((r) => r.role === "SUPER_ADMIN");
  const hasCampusAdmin = user.userRoles?.some((r) => r.role === "CAMPUS_ADMIN");

  // ฟังก์ชันแก้ไขข้อมูล
  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEditSave = async () => {
    await edit(user.id, editForm);
    setEditMode(false);
    onUserUpdate();
  };

  // ฟังก์ชันจัดการ role
  const handleCheckboxChange = (
    role: "SUPER_ADMIN" | "CAMPUS_ADMIN",
    checked: boolean
  ) => {
    setPendingRole({ role, checked });
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRole) return;
    
    try {
      if (pendingRole.role === "SUPER_ADMIN") {
        await mutateSuperAdmin(user.id);
      } else if (pendingRole.role === "CAMPUS_ADMIN" && user.campus?.id) {
        await mutateCampusAdmin(user.id, {
          role: "CAMPUS_ADMIN",
          campusId: user.campus.id,
        });
      }
      
      setPendingRole(null);
      onUserUpdate();
      
      // Dispatch multiple events to ensure role updates are captured
      window.dispatchEvent(new Event("roleChanged"));
      window.dispatchEvent(new CustomEvent("userRoleUpdated", {
        detail: { userId: user.id, role: pendingRole.role }
      }));
      
      // Also dispatch the roleSelected event to trigger role options refresh
      window.dispatchEvent(new Event("roleSelected"));
      
    } catch (error) {
      console.error("Error updating role:", error);
      setPendingRole(null);
    }
  };

  const handleCancelRoleChange = () => setPendingRole(null);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 md:gap-5">
              {/* Avatar */}
              <div className="relative">
                {editMode ? (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                    <input
                      name="image"
                      value={editForm.image}
                      onChange={handleEditInput}
                      placeholder="URL รูปภาพ"
                      className="w-full text-xs text-center border-0 bg-transparent focus:outline-none text-gray-500"
                    />
                  </div>
                ) : user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-lg md:text-2xl font-medium">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Name and Status */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-medium text-gray-900 mb-1 truncate">
                  {user.name || "ไม่ระบุชื่อ"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-medium ${getStatusColor(status)}`}
                  >
                    {getStatusText(status)}
                  </span>
                  <div className="text-gray-600 text-xs">{roleBadge}</div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="ปิด"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Contact Information */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2 md:mb-3">
              ข้อมูลติดต่อ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  รหัสประจำตัวผู้ใช้
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 text-sm truncate">
                  {user.userId || "ไม่ระบุ"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ชื่อ - นามสกุล
                </label>
                {editMode ? (
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditInput}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    type="text"
                    required
                    placeholder="ชื่อ - นามสกุล"
                    maxLength={100}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 text-sm truncate">
                    {user.name || "ไม่ระบุ"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  อีเมล
                </label>
                {editMode ? (
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditInput}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    type="email"
                    required
                    placeholder="example@email.com"
                    maxLength={100}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 text-sm truncate">
                    {user.email || "ไม่ระบุ"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  เบอร์โทรศัพท์
                </label>
                {editMode ? (
                  <input
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleEditInput}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="เช่น 0812345678"
                    maxLength={20}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 text-sm truncate">
                    {user.phoneNumber || "ไม่ระบุ"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campus & Organizations */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2 md:mb-3">
              สังกัด
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {user.campus && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    วิทยาเขต
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 text-sm truncate">
                    {user.campus.name}
                  </div>
                </div>
              )}
              {user.userOrganizations && user.userOrganizations.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    องค์กรที่สังกัด
                  </label>
                  <div className="space-y-2">
                    {user.userOrganizations.map((org) => (
                      <div
                        key={org.id}
                        className="px-3 py-2 bg-gray-50 rounded-lg"
                      >
                        <div className="text-gray-900 font-medium text-sm truncate">
                          {org.organization.nameTh || org.organization.nameEn}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {org.organization.organizationType.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Roles */}
          {user.userRoles && user.userRoles.length > 0 && (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2 md:mb-3">
                บทบาท
              </h3>
              <div className="space-y-2">
                {user.userRoles.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {getRoleLabel(role.role)}
                      </p>
                      {role.role === "CAMPUS_ADMIN" && user.campus && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          วิทยาเขต {user.campus.name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        role.role === "SUPER_ADMIN"
                          ? "bg-red-100 text-red-700"
                          : role.role === "CAMPUS_ADMIN"
                          ? "bg-[#006C67]/15 text-[#006C67]"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {role.role === "SUPER_ADMIN"
                        ? "Super Admin"
                        : role.role === "CAMPUS_ADMIN"
                        ? "Campus Admin"
                        : "User"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {isCurrentUserSuperAdmin && (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2 md:mb-3">
                การจัดการสิทธิ์
              </h3>
              <div className="space-y-3">
                <AdminAction
                  label="Super Admin"
                  description="สามารถเข้าถึงและจัดการระบบทั้งหมดได้"
                  hasPermission={!!hasSuperAdmin}
                  onChange={(checked) =>
                    handleCheckboxChange("SUPER_ADMIN", checked)
                  }
                  loading={superAdminLoading}
                  disabled={!isCurrentUserSuperAdmin}
                />
                <AdminAction
                  label="Campus Admin"
                  description="สามารถจัดการข้อมูลภายในวิทยาเขตที่สังกัดได้"
                  hasPermission={!!hasCampusAdmin}
                  onChange={(checked) =>
                    handleCheckboxChange("CAMPUS_ADMIN", checked)
                  }
                  loading={campusAdminLoading}
                  disabled={!isCurrentUserSuperAdmin || !user.campus?.id}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
          {editMode ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleEditSave}
                className="flex-1 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#006C67] transition-colors font-medium text-sm"
                disabled={editLoading}
              >
                {editLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                disabled={editLoading}
              >
                ยกเลิก
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="w-full px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#006C67] transition-colors font-medium text-sm"
            >
              แก้ไขข้อมูลผู้ใช้
            </button>
          )}
        </div>

        {/* Role Change Confirmation Dialog */}
        {pendingRole && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยืนยันการเปลี่ยนแปลงสิทธิ์
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                {pendingRole.checked
                  ? `คุณกำลังจะเพิ่มสิทธิ์ ${
                      pendingRole.role === "SUPER_ADMIN"
                        ? "Super Admin"
                        : "Campus Admin"
                    } ให้กับผู้ใช้รายนี้`
                  : `คุณกำลังจะลบสิทธิ์ ${
                      pendingRole.role === "SUPER_ADMIN"
                        ? "Super Admin"
                        : "Campus Admin"
                    } จากผู้ใช้รายนี้`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelRoleChange}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  disabled={superAdminLoading || campusAdminLoading}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  className="flex-1 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#006C67] transition-colors font-medium text-sm"
                  disabled={superAdminLoading || campusAdminLoading}
                >
                  {superAdminLoading || campusAdminLoading
                    ? "กำลังดำเนินการ..."
                    : "ยืนยัน"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminAction: React.FC<{
  label: string;
  description?: string;
  hasPermission: boolean;
  onChange: (checked: boolean) => void;
  loading: boolean;
  disabled?: boolean;
}> = ({ label, description, hasPermission, onChange, loading, disabled }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        disabled
          ? "opacity-50 border-gray-200 bg-gray-50"
          : "bg-white hover:shadow-md border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex-1">
        <p className="font-medium text-gray-900 mb-1 text-sm">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>

      <label className="relative inline-flex items-center cursor-pointer ml-3">
        <input
          type="checkbox"
          checked={hasPermission}
          disabled={loading || disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-10 h-5 rounded-full peer transition-all duration-200 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed ${
            hasPermission ? "bg-[#006C67] shadow-lg" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 transition-transform duration-200 shadow-md ${
              hasPermission ? "translate-x-5" : ""
            }`}
          />
        </div>
      </label>
    </div>
  );
};