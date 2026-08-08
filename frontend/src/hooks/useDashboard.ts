import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../services/dashboardApi';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });
}

