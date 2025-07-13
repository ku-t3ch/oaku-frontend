import React, { useState } from "react";
import { User } from "@/interface/user";
import { getRoleLabel } from "@/utils/roleUtils";
import {
  useEditUser,
  useAddOrRemoveCampusAdmin,
  useAddSuperAdmin,
  fetchUserById,
} from "@/hooks/useUserApi";

interface CardInfoUserProps {
  user: User;
  roleBadge: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
  isCurrentUserSuperAdmin: boolean;
  suspendLoading: boolean;
  onSuspendUser: (userId: string, suspend: boolean) => Promise<void>;
}

export const CardInfoUser: React.FC<CardInfoUserProps> = ({
  user,
  roleBadge,
  isOpen,
  onClose,
  onUserUpdate,
  isCurrentUserSuperAdmin,
  onSuspendUser,
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
  const hasSuperAdmin = user.userRoles?.some((r) => r.role === "SUPER_ADMIN");
  const hasCampusAdmin = user.userRoles?.some((r) => r.role === "CAMPUS_ADMIN");

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    await edit(user.id, editForm);
    setEditMode(false);
    onUserUpdate();
  };

  const handleCheckboxChange = (
    role: "SUPER_ADMIN" | "CAMPUS_ADMIN",
    checked: boolean
  ) => {
    if (role === "SUPER_ADMIN" && checked && !hasSuperAdmin) {
      if (
        !window.confirm(
          "หากเพิ่มสิทธิ์ Super Admin ให้ผู้ใช้นี้ จะไม่สามารถถอดสิทธิ์นี้ออกได้ คุณต้องการดำเนินการต่อหรือไม่?"
        )
      ) {
        setPendingRole(null);
        return;
      }
    }
    setPendingRole({ role, checked });
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRole) return;

    try {
      const token = localStorage.getItem("accessToken") || "";

      if (pendingRole.role === "SUPER_ADMIN") {
        await mutateSuperAdmin(user.id);
      } else if (pendingRole.role === "CAMPUS_ADMIN" && user.campus?.id) {
        await mutateCampusAdmin(user.id, {
          role: "CAMPUS_ADMIN",
          campusId: user.campus.id,
        });
      }

      // Fetch latest user data and update localStorage
      const updatedUser = await fetchUserById(token, user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("authStateChanged"));

      setPendingRole(null);
      onUserUpdate();

      window.dispatchEvent(new Event("roleChanged"));
      window.dispatchEvent(
        new CustomEvent("userRoleUpdated", {
          detail: { userId: user.id, role: pendingRole.role },
        })
      );
      window.dispatchEvent(new Event("roleSelected"));
    } catch (error) {
      console.error("Error updating role:", error);
      setPendingRole(null);
    }
  };

  const handleCancelRoleChange = () => setPendingRole(null);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-8 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#006C67] to-[#00BFAE] flex items-center justify-center text-white text-xl font-medium">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                status === "active" ? "bg-green-500" : "bg-red-500"
              }`} />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                {user.name || "ไม่ระบุชื่อ"}
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  status === "active" ? "text-green-600" : "text-red-600"
                }`}>
                  {status === "active" ? "ใช้งานอยู่" : "ถูกระงับ"}
                </span>
                <span className="text-gray-300">•</span>
                <div className="text-sm text-gray-500">{roleBadge}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Save Button - Show only in edit mode */}
              {editMode && (
                <button
                  onClick={handleEditSave}
                  disabled={editLoading}
                  className="px-4 py-2 bg-[#006C67] text-white text-sm font-medium rounded-lg hover:bg-[#005B5B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {editLoading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              )}
              
              {/* Edit/Cancel Button */}
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  editMode
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#006C67] text-white hover:bg-[#005B5B]"
                }`}
              >
                {editMode ? "ยกเลิก" : "แก้ไข"}
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>

        {/* Content - Horizontal Layout */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
                ข้อมูลพื้นฐาน
              </h3>
              <InfoField
                label="รหัสผู้ใช้"
                value={user.userId || "ไม่ระบุ"}
                readOnly
              />
              <InfoField
                label="ชื่อ - นามสกุล"
                value={editMode ? editForm.name : user.name || "ไม่ระบุ"}
                isEditing={editMode}
                name="name"
                onChange={handleEditInput}
              />
              <InfoField
                label="อีเมล"
                value={editMode ? editForm.email : user.email || "ไม่ระบุ"}
                isEditing={editMode}
                name="email"
                onChange={handleEditInput}
                type="email"
              />
              <InfoField
                label="เบอร์โทรศัพท์"
                value={editMode ? editForm.phoneNumber : user.phoneNumber || "ไม่ระบุ"}
                isEditing={editMode}
                name="phoneNumber"
                onChange={handleEditInput}
              />
            </div>

            {/* Middle Column - Campus & Organization */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
                สังกัด
              </h3>
              {user.campus && (
                <InfoField
                  label="วิทยาเขต"
                  value={user.campus.name}
                  readOnly
                />
              )}
              {user.userOrganizations && user.userOrganizations.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    องค์กรที่สังกัด
                  </label>
                  <div className="space-y-2">
                    {user.userOrganizations.map((org) => (
                      <div key={org.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">
                          {org.organization.nameTh || org.organization.nameEn}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {org.organization.organizationType.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roles */}
              {user.userRoles && user.userRoles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
                    บทบาท
                  </h3>
                  <div className="space-y-2">
                    {user.userRoles.map((role, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getRoleLabel(role.role)}
                          </div>
                          {role.role === "CAMPUS_ADMIN" && user.campus && (
                            <div className="text-xs text-gray-500 mt-1">
                              วิทยาเขต {user.campus.name}
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          role.role === "SUPER_ADMIN"
                            ? "bg-red-100 text-red-700"
                            : role.role === "CAMPUS_ADMIN"
                            ? "bg-[#006C67]/25 text-[#005B5B]"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {role.role === "SUPER_ADMIN" ? "Super Admin" : 
                           role.role === "CAMPUS_ADMIN" ? "Campus Admin" : "User"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Admin Actions */}
            {isCurrentUserSuperAdmin && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
                  การจัดการสิทธิ์
                </h3>
                <div className="space-y-3">
                  <AdminAction
                    label="Super Admin"
                    description="เข้าถึงและจัดการระบบทั้งหมด"
                    hasPermission={!!hasSuperAdmin}
                    onChange={(checked) => handleCheckboxChange("SUPER_ADMIN", checked)}
                    loading={superAdminLoading}
                    disabled={!!hasSuperAdmin}
                  />
                  <AdminAction
                    label="Campus Admin"
                    description="จัดการข้อมูลภายในวิทยาเขต"
                    hasPermission={!!hasCampusAdmin}
                    onChange={(checked) => handleCheckboxChange("CAMPUS_ADMIN", checked)}
                    loading={campusAdminLoading}
                    disabled={!isCurrentUserSuperAdmin || !user.campus?.id}
                  />
                </div>

                {/* Suspend/Unsuspend User Button */}
                {isCurrentUserSuperAdmin && !hasSuperAdmin && (
                  <button
                    onClick={async () => {
                      await onSuspendUser(user.id, !user.isSuspended);
                      onClose();
                    }}
                    disabled={superAdminLoading || campusAdminLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      user.isSuspended
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {superAdminLoading || campusAdminLoading
                      ? "กำลังดำเนินการ..."
                      : user.isSuspended
                      ? "ปลดระงับผู้ใช้"
                      : "ระงับผู้ใช้"}
                  </button>
                )}
            
              </div>
            )}
          </div>
        </div>

        {/* Role Change Confirmation Dialog */}
        {pendingRole && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยืนยันการเปลี่ยนแปลงสิทธิ์
              </h3>
              <p className="text-gray-600 mb-6">
                {pendingRole.checked
                  ? `เพิ่มสิทธิ์ ${pendingRole.role === "SUPER_ADMIN" ? "Super Admin" : "Campus Admin"} ให้ผู้ใช้นี้`
                  : `ลบสิทธิ์ ${pendingRole.role === "SUPER_ADMIN" ? "Super Admin" : "Campus Admin"} จากผู้ใช้นี้`}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelRoleChange}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={superAdminLoading || campusAdminLoading}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  className="flex-1 px-4 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005B5B] transition-colors"
                  disabled={superAdminLoading || campusAdminLoading}
                >
                  {superAdminLoading || campusAdminLoading ? "กำลังดำเนินการ..." : "ยืนยัน"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const InfoField: React.FC<{
  label: string;
  value: string;
  isEditing?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  readOnly?: boolean;
}> = ({ label, value, isEditing, name, onChange, type = "text", readOnly }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    {isEditing && !readOnly ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="w-full px-3 py-2 border border-gray-200 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006C67]/50 focus:border-transparent text-sm"
      />
    ) : (
      <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
        {value}
      </div>
    )}
  </div>
);

const AdminAction: React.FC<{
  label: string;
  description?: string;
  hasPermission: boolean;
  onChange: (checked: boolean) => void;
  loading: boolean;
  disabled?: boolean;
}> = ({ label, description, hasPermission, onChange, loading, disabled }) => (
  <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
    disabled ? "opacity-50 bg-gray-50 border-gray-200" : "bg-white hover:border-[#006C67] border-gray-200"
  }`}>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900">{label}</div>
      {description && (
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      )}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={hasPermission}
        disabled={loading || disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className={`w-10 h-6 rounded-full peer transition-all ${
        hasPermission ? "bg-[#006C67]" : "bg-gray-300"
      } peer-disabled:opacity-50`}>
        <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
          hasPermission ? "translate-x-4" : ""
        }`} />
      </div>
    </label>
  </div>
);