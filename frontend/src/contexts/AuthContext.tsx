import { createContext, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '../services/authApi';
import type { CurrentUser } from '../types/auth';

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const hasToken = Boolean(window.localStorage.getItem('fleetcontrol.accessToken'));

  const { data, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled: hasToken,
    retry: false,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      isLoading,
      isAuthenticated: Boolean(data),
      setSession: (accessToken: string, refreshToken: string) => {
        window.localStorage.setItem('fleetcontrol.accessToken', accessToken);
        window.localStorage.setItem('fleetcontrol.refreshToken', refreshToken);
        queryClient.invalidateQueries({ queryKey: ['current-user'] });
      },
      logout: () => {
        window.localStorage.removeItem('fleetcontrol.accessToken');
        window.localStorage.removeItem('fleetcontrol.refreshToken');
        queryClient.clear();
      },
    }),
    [data, isLoading, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
