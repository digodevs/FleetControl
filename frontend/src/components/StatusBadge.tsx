import { Badge } from './ui/Badge';
import type { VehicleStatus } from '../types/vehicle';

const labels: Record<VehicleStatus, string> = {
  AVAILABLE: 'Disponível',
  IN_USE: 'Em uso',
  MAINTENANCE: 'Em manutenção',
  INACTIVE: 'Inativo',
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
