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
  roles?: string[]; 
  primaryRole?: string;
  userOrganizations?: UserOrganization[];
  userRoles?: UserRole[];
}