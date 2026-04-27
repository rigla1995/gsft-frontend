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
  SUPER_ADMIN = 'SUPER_ADMIN',
  FRANCHISE_ADMIN = 'FRANCHISE_ADMIN',
  ACTIVITY_MANAGER = 'ACTIVITY_MANAGER',
  STAFF = 'STAFF',
}
