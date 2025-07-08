import { useState } from "react";
import { addRoleAdminToUser, AddRoleRequest } from "@/lib/api/user";

export interface UseUserManagementReturn {
  addingRole: boolean;
  addRoleError: string | null;
  addAdminRoleToUser: (
    userId: string,
    role: "CAMPUS_ADMIN" | "SUPER_ADMIN",
    data: AddRoleRequest
  ) => Promise<boolean>;
  clearError: () => void;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [addingRole, setAddingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState<string | null>(null);

  const handleAddAdminRole = async (
    userId: string,
    role: "CAMPUS_ADMIN" | "SUPER_ADMIN",
    data: AddRoleRequest
  ): Promise<boolean> => {
    try {
      setAddingRole(true);
      setAddRoleError(null);

      await addRoleAdminToUser(userId, role, data);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add admin role";
      setAddRoleError(errorMessage);
      return false;
    } finally {
      setAddingRole(false);
    }
  };

  const clearError = () => {
    setAddRoleError(null);
  };

  return {
    addingRole,
    addRoleError,
    addAdminRoleToUser: handleAddAdminRole,
    clearError,
  };
};
