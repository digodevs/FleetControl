import { Badge } from './ui/Badge';
import type { VehicleStatus } from '../types/vehicle';

const labels: Record<VehicleStatus, string> = {
  AVAILABLE: 'Available',
  IN_USE: 'In use',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive',
};

const tones: Record<VehicleStatus, 'green' | 'blue' | 'amber' | 'red'> = {
  AVAILABLE: 'green',
  IN_USE: 'blue',
  MAINTENANCE: 'amber',
  INACTIVE: 'red',
};

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge tone={tones[status]}>{labels[status]}</Badge>;
}

