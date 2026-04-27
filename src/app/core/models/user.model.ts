export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  activityId?: string;
  mustChangePassword?: boolean;
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  TenantAdmin = 'TenantAdmin',
  ActivityManager = 'ActivityManager',
  Viewer = 'Viewer',
}
