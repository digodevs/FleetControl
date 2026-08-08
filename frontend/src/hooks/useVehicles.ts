import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVehicle, deleteVehicle, listVehicles, updateVehicle } from '../services/vehicleApi';
import type { VehicleListParams, VehiclePayload } from '../types/vehicle';

export function useVehicles(params: VehicleListParams) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => listVehicles(params),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VehiclePayload }) => updateVehicle(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

