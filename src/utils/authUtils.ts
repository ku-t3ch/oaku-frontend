import { Role, Position, getDefaultRole, getDefaultPosition } from './roleUtils';

export interface UserAuth {
  isAuthenticated: boolean;
  role: Role;
  position: Position;
}

/**
 * รับข้อมูล role และ position จากระบบ authentication
 * หากไม่ได้ login จะคืนค่า PUBLIC role
 */
export const getUserAuthInfo = (
  isLoggedIn: boolean = false,
  userRole?: Role,
  userPosition?: Position
): UserAuth => {
  if (!isLoggedIn) {
    return {
      isAuthenticated: false,
      role: getDefaultRole(),
      position: getDefaultPosition(getDefaultRole()),
    };
  }

  const role = userRole || getDefaultRole();
  const position = userPosition || getDefaultPosition(role);

  return {
    isAuthenticated: true,
    role,
    position,
  };
};