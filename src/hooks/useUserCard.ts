import { useState, useMemo, useEffect } from "react";
import { updateRoleAdmin, editInfoUser } from "@/lib/api/user";
import toast from "react-hot-toast";
import { User } from "@/interface/user";

export function useUserCard(user: User, onUserUpdate: () => void) {
  const [loading, setLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<null | {
    role: "SUPER_ADMIN" | "CAMPUS_ADMIN";
    checked: boolean;
  }>(null);
  const [editMode, setEditMode] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    image: user.image || "",
  });

  const { id, campus, userRoles } = user;

  const hasSuperAdmin = useMemo(
    () => userRoles?.some((r) => r.role === "SUPER_ADMIN"),
    [userRoles]
  );
  const hasCampusAdmin = useMemo(
    () => userRoles?.some((r) => r.role === "CAMPUS_ADMIN") ?? false,
    [userRoles]
  );

  const handleRoleUpdate = async (
    role: "SUPER_ADMIN" | "CAMPUS_ADMIN",
    action: "add" | "remove"
  ) => {
    setLoading(true);
    const actionText = action === "add" ? "เพิ่ม" : "ลบ";
    const roleText = role === "SUPER_ADMIN" ? "Super Admin" : "Campus Admin";
    try {
      await updateRoleAdmin(id, role, {
        action,
        campusId: role === "CAMPUS_ADMIN" ? campus?.id : undefined,
      });
      toast.success(`${actionText}สิทธิ์ ${roleText} สำเร็จ!`);
      onUserUpdate();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : `เกิดข้อผิดพลาดในการ${actionText}สิทธิ์`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (
    role: "SUPER_ADMIN" | "CAMPUS_ADMIN",
    checked: boolean
  ) => {
    setPendingRole({ role, checked });
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRole) return;
    await handleRoleUpdate(
      pendingRole.role,
      pendingRole.checked ? "add" : "remove"
    );
    setPendingRole(null);
  };

  const handleCancelRoleChange = () => setPendingRole(null);

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      await editInfoUser(user.id, editForm);
      toast.success("บันทึกข้อมูลสำเร็จ");
      setEditMode(false);
      onUserUpdate();
    } catch (e: unknown) {
      console.error("Error saving user info:", e);
      toast.error(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      image: user.image || "",
    });
  }, [user]);

  return {
    loading,
    pendingRole,
    editMode,
    setEditMode,
    editLoading,
    editForm,
    setEditForm,
    hasSuperAdmin,
    hasCampusAdmin,
    handleRoleUpdate,
    handleCheckboxChange,
    handleConfirmRoleChange,
    handleCancelRoleChange,
    handleEditInput,
    handleEditSave,
  };
}