import { api } from './api';
import type { PageResponse, Vehicle, VehicleListParams, VehiclePayload } from '../types/vehicle';

export async function listVehicles(params: VehicleListParams): Promise<PageResponse<Vehicle>> {
  const response = await api.get<PageResponse<Vehicle>>('/vehicles', {
    params: {
      page: params.page,
      size: params.size,
      sort: params.sort,
      search: params.search || undefined,
      status: params.status || undefined,
      type: params.type || undefined,
    },
  });
  return response.data;
}

export async function createVehicle(payload: VehiclePayload): Promise<Vehicle> {
  const response = await api.post<Vehicle>('/vehicles', payload);
  return response.data;
}

export async function updateVehicle(id: string, payload: VehiclePayload): Promise<Vehicle> {
  const response = await api.put<Vehicle>(`/vehicles/${id}`, payload);
  return response.data;
}

export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}

