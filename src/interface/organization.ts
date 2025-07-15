import { Campus } from "./campus";
import { organizationType } from "./organizationType";

export interface Organization {
  id: string;
  publicOrganizationId: string;
  nameEn: string;
  nameTh: string;
  image?: string;
  details?: string;
  email?: string;
  phoneNumber?: string;
  campusId: string;
  organizationTypeId: string;
  campus: Campus;
  organizationType: organizationType;
  createdAt: string;
  updatedAt: string;
}

interface UserOrganization {
  id: string;
  role: string;
  position: string;
  isSuspended: boolean;
  user: {
    id: string;
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    image: string;
    isSuspended: boolean;
  };
}

export interface OrganizationDetail extends Organization {
  userOrganizations: UserOrganization[];
}