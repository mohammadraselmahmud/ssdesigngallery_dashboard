export const ADMIN_MANAGEMENT_ROLES = ["admin", "sub_admin", "super_admin"];

export const canManageAdminResources = (user) =>
  ADMIN_MANAGEMENT_ROLES.includes(user?.role);
