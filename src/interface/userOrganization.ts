export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  userIdCode: string;
  organizationIdCode: string;
  role: "USER" | "ADMIN" | "CAMPUS_ADMIN" | "SUPER_ADMIN";
  position: "HEAD" | "MEMBER" | "NON_POSITION";
  joinedAt: string;
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
