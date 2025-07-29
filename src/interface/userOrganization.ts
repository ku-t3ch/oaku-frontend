export type Position = "HEAD" | "MEMBER" | "NON_POSITION";

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  userIdCode: string;
  publicOrganizationId: string;
  role: "USER"; 
  position: Position; 
  joinedAt: string;
  isSuspended: boolean;
  organization: {
    id: string;
    publicOrganizationId: string;
    nameEn: string;
    nameTh: string;
    image: string;
    details: string;
    email: string;
    phoneNumber?: string;
    campus: {
      id: string;
      name: string;
    };
    organizationType: {
      id: string;
      name: string;
    };
  };
}
