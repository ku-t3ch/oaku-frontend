export interface UserRole {
  id: string;
  userId: string;
  role: "ADMIN" | "CAMPUS_ADMIN" | "SUPER_ADMIN";
  campusId?: string;
  createdAt: string;
  campus?: {
    id: string;
    name: string;
  };
}