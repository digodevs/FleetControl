export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

