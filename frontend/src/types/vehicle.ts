export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'INACTIVE';

export type VehicleType = 'CAR' | 'MOTORCYCLE' | 'VAN' | 'TRUCK' | 'BUS' | 'OTHER';

export type FuelType = 'GASOLINE' | 'ETHANOL' | 'FLEX' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'OTHER';

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  mileage: number;
  status: VehicleStatus;
  color: string | null;
  renavam: string | null;
  chassis: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePayload {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  mileage: number;
  status: VehicleStatus;
  color?: string;
  renavam?: string;
  chassis?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface VehicleListParams {
  page: number;
  size: number;
  sort: string;
  search?: string;
  status?: VehicleStatus | '';
  type?: VehicleType | '';
}

