export type Role = "SUPER_ADMIN" | "CAMPUS_ADMIN" | "USER" | "PUBLIC";
export type Position = "HEAD" | "MEMBER" | "NON_POSITION";

/**
 * แปลง role เป็นภาษาไทย
 * @param role - Role enum value
 * @returns Thai label for the role
 */
export const getRoleLabel = (role: string): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "ผู้ดูแลระบบสูงสุด";

    case "CAMPUS_ADMIN":
      return "ผู้ดูแลระบบวิทยาเขต";
    case "USER":
      return "ผู้ใช้งาน";
    default:
      return "ไม่ระบุบทบาท";
  }
};

/**
 * แปลง position เป็นภาษาไทย
 * @param position - Position enum value
 * @returns Thai label for the position (empty string for NON_POSITION)
 */
export const getPositionLabel = (position: string): string => {
  switch (position) {
    case "HEAD":
      return "หัวหน้า";
    case "MEMBER":
      return "สมาชิก";
    case "NON_POSITION":
      return "ไม่มีตำแหน่ง";
    default:
      return "ไม่ระบุตำแหน่ง";
  }
};

/**
 * แปลง role เป็นสีของ badge
 * @param role - Role enum value
 * @returns Tailwind CSS classes for role badge
 */
export const getRoleBadgeClasses = (role: string): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-100 text-purple-800";
    case "CAMPUS_ADMIN":
      return "bg-orange-100 text-orange-800";
    case "USER":
      return "bg-blue-100 text-blue-800";
    case "PUBLIC":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * ตรวจสอบว่า role มีสิทธิ์ admin หรือไม่
 * @param role - Role enum value
 * @returns Boolean indicating if role has admin privileges
 */
export const isAdminRole = (role: string): boolean => {
  return ["SUPER_ADMIN", "CAMPUS_ADMIN"].includes(role);
};

/**
 * ตรวจสอบว่า role มีสิทธิ์สูงสุดหรือไม่
 * @param role - Role enum value
 * @returns Boolean indicating if role is super admin
 */
export const isSuperAdminRole = (role: string): boolean => {
  return role === "SUPER_ADMIN";
};

/**
 * เปรียบเทียบลำดับสิทธิ์ของ role
 * @param role - Role to check priority for
 * @returns Number indicating role priority (higher = more privileges)
 */
export const getRolePriority = (role: string): number => {
  switch (role) {
    case "SUPER_ADMIN":
      return 4;
    case "CAMPUS_ADMIN":
      return 3;
    case "USER":
      return 2;
    default:
      return 1;
  }
};

/**
 * ตรวจสอบว่าเป็น PUBLIC user หรือไม่
 * @param role - Role to check
 * @returns Boolean indicating if role is public
 */
export const isPublicRole = (role: string): boolean => {
  return role === "PUBLIC";
};

/**
 * รับ role เริ่มต้นสำหรับผู้ใช้ที่ไม่ได้ login
 * @returns Default role for non-authenticated users
 */
export const getDefaultRole = (): Role => {
  return "PUBLIC";
};

/**
 * รับ position เริ่มต้นตาม role
 * @param role - User role
 * @returns Default position for the given role
 */
export const getDefaultPosition = (role: Role): Position => {
  switch (role) {
    case "USER":
      return "MEMBER"; // USER default to MEMBER
    case "SUPER_ADMIN":
    case "CAMPUS_ADMIN":
      return "NON_POSITION"; // Admin roles have NON_POSITION
    case "PUBLIC":
    default:
      return "NON_POSITION"; // PUBLIC users have NON_POSITION
  }
};

/**
 * ตรวจสอบว่า position ถูกต้องสำหรับ role นั้นหรือไม่
 * @param role - User role
 * @param position - User position
 * @returns Boolean indicating if position is valid for the role
 */
export const isValidPositionForRole = (
  role: Role,
  position: Position
): boolean => {
  switch (role) {
    case "USER":
      return ["HEAD", "MEMBER"].includes(position);
    case "SUPER_ADMIN":
    case "CAMPUS_ADMIN":
      return position === "NON_POSITION";
    case "PUBLIC":
      return position === "NON_POSITION";
    default:
      return false;
  }
};
