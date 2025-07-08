export type Position = "HEAD" | "MEMBER" | "NON_POSITION";

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  userIdCode: string;
  organizationIdCode: string;
  role: "USER"; // ✅ จะเป็น USER เสมอตาม schema ใหม่
  position: Position; // ✅ ลบ NON_POSITION ออก
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
