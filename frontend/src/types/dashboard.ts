export type VehicleType = 'CAR' | 'MOTORCYCLE' | 'VAN' | 'TRUCK' | 'BUS' | 'OTHER';

export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'INACTIVE';

export interface TypeCount {
  type: VehicleType;
  count: number;
}

export interface StatusCount {
  status: VehicleStatus;
  count: number;
}

export interface MonthlyVehicleCount {
  month: string;
  count: number;
}

export interface DashboardResponse {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  inactiveVehicles: number;
  vehiclesCreatedThisMonth: number;
  vehiclesCreatedLastMonth: number;
  vehiclesByType: TypeCount[];
  vehiclesByStatus: StatusCount[];
  vehicleRegistrationsByMonth: MonthlyVehicleCount[];
}

