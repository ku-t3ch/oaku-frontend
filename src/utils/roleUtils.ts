export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CAMPUS_ADMIN' | 'USER' | 'PUBLIC';
export type Position = 'HEAD' | 'MEMBER' | 'NON_POSITION';

/**
 * แปลง role เป็นภาษาไทย
 * @param role - Role enum value
 * @returns Thai label for the role
 */
export const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'ผู้ดูแลระบบ';
    case 'ADMIN':
      return 'ผู้ดูแล';
    case 'CAMPUS_ADMIN':
      return 'ผู้ดูแลวิทยาเขต';
    case 'USER':
      return 'ผู้ใช้';
    case 'PUBLIC':
      return 'ผู้เยี่ยมชม';
    default:
      return 'ผู้เยี่ยมชม';
  }
};

/**
 * แปลง position เป็นภาษาไทย
 * @param position - Position enum value
 * @returns Thai label for the position (empty string for NON_POSITION)
 */
export const getPositionLabel = (position: string): string => {
  switch (position) {
    case 'HEAD':
      return 'หัวหน้า';
    case 'MEMBER':
      return 'สมาชิก';
    case 'NON_POSITION':
      return '';
    default:
      return position;
  }
};

/**
 * แปลง role เป็นสีของ badge
 * @param role - Role enum value
 * @returns Tailwind CSS classes for role badge
 */
export const getRoleBadgeClasses = (role: string): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'bg-purple-100 text-purple-800';
    case 'ADMIN':
      return 'bg-red-100 text-red-800';
    case 'CAMPUS_ADMIN':
      return 'bg-orange-100 text-orange-800';
    case 'USER':
      return 'bg-blue-100 text-blue-800';
    case 'PUBLIC':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * ตรวจสอบว่า role มีสิทธิ์ admin หรือไม่
 * @param role - Role enum value
 * @returns Boolean indicating if role has admin privileges
 */
export const isAdminRole = (role: string): boolean => {
  return ['SUPER_ADMIN', 'ADMIN', 'CAMPUS_ADMIN'].includes(role);
};

/**
 * ตรวจสอบว่า role มีสิทธิ์สูงสุดหรือไม่
 * @param role - Role enum value
 * @returns Boolean indicating if role is super admin
 */
export const isSuperAdminRole = (role: string): boolean => {
  return role === 'SUPER_ADMIN';
};

/**
 * เปรียบเทียบลำดับสิทธิ์ของ role
 * @param role - Role to check priority for
 * @returns Number indicating role priority (higher = more privileges)
 */
export const getRolePriority = (role: string): number => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 5;
    case 'ADMIN':
      return 4;
    case 'CAMPUS_ADMIN':
      return 3;
    case 'USER':
      return 2;
    case 'PUBLIC':
      return 1;
    default:
      return 0;
  }
};

/**
 * ตรวจสอบว่าเป็น PUBLIC user หรือไม่
 * @param role - Role to check
 * @returns Boolean indicating if role is public
 */
export const isPublicRole = (role: string): boolean => {
  return role === 'PUBLIC';
};