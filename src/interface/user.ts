import { UserOrganization } from "./userOrganization";
import { UserRole } from "./userRole";

export interface User {
  id: string;
  userId: string;
  email: string;
  name: string;
  phoneNumber?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  isSuspended?: boolean;
  campusId: string;
  campus: {
    id: string;
    name: string;
  };
  // Multiple roles support
  roles?: string[]; // ✅ Array of all roles
  primaryRole?: string; // ✅ Highest role for backward compatibility
  // User organization relationships (USER role)
  userOrganizations?: UserOrganization[];
  // Admin role relationships
  userRoles?: UserRole[];
}