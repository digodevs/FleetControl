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

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: CurrentUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}
