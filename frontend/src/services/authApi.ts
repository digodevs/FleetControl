import { api } from './api';
import type { CurrentUser } from '../types/auth';

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await api.get<CurrentUser>('/auth/me');
  return response.data;
}

