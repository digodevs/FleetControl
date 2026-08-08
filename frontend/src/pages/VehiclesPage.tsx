import { FormEvent, useMemo, useState } from 'react';
import { ArrowUpDown, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Pagination } from '../components/ui/Pagination';
import { SearchBar } from '../components/ui/SearchBar';
import { Select } from '../components/ui/Select';
import { Table, Td, Th } from '../components/ui/Table';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useCreateVehicle, useDeleteVehicle, useUpdateVehicle, useVehicles } from '../hooks/useVehicles';
import type { FuelType, Vehicle, VehiclePayload, VehicleStatus, VehicleType } from '../types/vehicle';

const statusOptions: Array<{ value: VehicleStatus; label: string }> = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'IN_USE', label: 'In use' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const typeOptions: Array<{ value: VehicleType; label: string }> = [
  { value: 'CAR', label: 'Car' },
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'BUS', label: 'Bus' },
  { value: 'OTHER', label: 'Other' },
];

const fuelOptions: Array<{ value: FuelType; label: string }> = [
  { value: 'GASOLINE', label: 'Gasoline' },
  { value: 'ETHANOL', label: 'Ethanol' },
  { value: 'FLEX', label: 'Flex' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'OTHER', label: 'Other' },
];

const initialForm: VehiclePayload = {
  licensePlate: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'CAR',
  fuelType: 'FLEX',
  mileage: 0,
  status: 'AVAILABLE',
  color: '',
  renavam: '',
  chassis: '',
};

const sortableColumns = [
  { value: 'createdAt,desc', label: 'Newest' },
  { value: 'licensePlate,asc', label: 'Plate A-Z' },
  { value: 'brand,asc', label: 'Brand A-Z' },
  { value: 'year,desc', label: 'Year desc' },
  { value: 'mileage,desc', label: 'Mileage desc' },
];

const typeLabels = Object.fromEntries(typeOptions.map((option) => [option.value, option.label])) as Record<VehicleType, string>;
const fuelLabels = Object.fromEntries(fuelOptions.map((option) => [option.value, option.label])) as Record<FuelType, string>;

export function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VehicleStatus | ''>('');
  const [type, setType] = useState<VehicleType | ''>('');
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<VehiclePayload>(initialForm);
  const [formOpen, setFormOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);
  const { showToast } = useToast();
  const { user } = useAuth();

  const canManageVehicles = user?.roles?.includes('ADMIN') ?? false;
  const queryParams = useMemo(
    () => ({ page, size: 10, sort, search: debouncedSearch, status, type }),
    [debouncedSearch, page, sort, status, type],
  );
  const vehiclesQuery = useVehicles(queryParams);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const vehicles = vehiclesQuery.data?.content ?? [];
  const hasFilters = Boolean(search || status || type);

  function resetFilters() {
    setSearch('');
    setStatus('');
    setType('');
    setSort('createdAt,desc');
    setPage(0);
  }

  function openCreateModal() {
    setEditingVehicle(null);
    setForm(initialForm);
    setFormOpen(true);
  }

  function openEditModal(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setForm({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      fuelType: vehicle.fuelType,
      mileage: vehicle.mileage,
      status: vehicle.status,
      color: vehicle.color ?? '',
      renavam: vehicle.renavam ?? '',
      chassis: vehicle.chassis ?? '',
    });
    setFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.licensePlate.trim() || !form.brand.trim() || !form.model.trim()) {
      showToast('Plate, brand, and model are required.', 'error');
      return;
    }

    const payload: VehiclePayload = {
      ...form,
      licensePlate: form.licensePlate.trim().toUpperCase(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      color: form.color?.trim() || undefined,
      renavam: form.renavam?.trim() || undefined,
      chassis: form.chassis?.trim() || undefined,
      year: Number(form.year),
      mileage: Number(form.mileage),
    };

    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({ id: editingVehicle.id, payload });
        showToast('Vehicle updated successfully.', 'success');
      } else {
        await createVehicle.mutateAsync(payload);
        showToast('Vehicle created successfully.', 'success');
      }
      setFormOpen(false);
    } catch {
      showToast('Could not save the vehicle. Check the fields and try again.', 'error');
    }
  }

  async function handleDelete() {
    if (!vehicleToDelete) {
      return;
    }

    try {
      await deleteVehicle.mutateAsync(vehicleToDelete.id);
      showToast('Vehicle deleted successfully.', 'success');
      setVehicleToDelete(null);
    } catch {
      showToast('Could not delete the vehicle.', 'error');
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Manage fleet records with live data from the API."
        actions={
          canManageVehicles ? (
            <Button onClick={openCreateModal} icon={<Plus size={18} />}>
              New vehicle
            </Button>
          ) : null
        }
      />

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px_180px_auto]">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
            placeholder="Search by plate, brand, or model"
          />
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as VehicleStatus | '');
              setPage(0);
            }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={type}
            onChange={(event) => {
              setType(event.target.value as VehicleType | '');
              setPage(0);
            }}
            aria-label="Filter by type"
          >
            <option value="">All types</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort vehicles">
            {sortableColumns.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={resetFilters} icon={<RefreshCw size={17} />} disabled={!hasFilters && sort === 'createdAt,desc'}>
            Reset
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Fleet inventory</h2>
            <p className="text-xs text-slate-400">{vehiclesQuery.data?.totalElements ?? 0} records found</p>
          </div>
          <ArrowUpDown size={18} className="text-slate-500" aria-hidden="true" />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <thead className="bg-surface-900">
              <tr>
                <Th>Vehicle</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Fuel</Th>
                <Th>Year</Th>
                <Th>Mileage</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vehiclesQuery.isLoading ? <VehicleRowsSkeleton /> : null}
              {!vehiclesQuery.isLoading && vehiclesQuery.isError ? <ErrorRow onRetry={() => vehiclesQuery.refetch()} /> : null}
              {!vehiclesQuery.isLoading && !vehiclesQuery.isError && vehicles.length === 0 ? <EmptyRow hasFilters={hasFilters} /> : null}
              {!vehiclesQuery.isLoading &&
                !vehiclesQuery.isError &&
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-surface-900/70">
                    <Td>
                      <div>
                        <p className="font-medium text-white">{vehicle.licensePlate}</p>
                        <p className="text-xs text-slate-400">
                          {vehicle.brand} {vehicle.model}
                        </p>
                      </div>
                    </Td>
                    <Td>{typeLabels[vehicle.type]}</Td>
                    <Td>
                      <StatusBadge status={vehicle.status} />
                    </Td>
                    <Td>{fuelLabels[vehicle.fuelType]}</Td>
                    <Td>{vehicle.year}</Td>
                    <Td>{vehicle.mileage.toLocaleString()} km</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0"
                          disabled={!canManageVehicles}
                          onClick={() => openEditModal(vehicle)}
                          icon={<Pencil size={16} />}
                          aria-label={`Edit ${vehicle.licensePlate}`}
                        />
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 text-red-300 hover:bg-red-950/60 hover:text-red-100"
                          disabled={!canManageVehicles}
                          onClick={() => setVehicleToDelete(vehicle)}
                          icon={<Trash2 size={16} />}
                          aria-label={`Delete ${vehicle.licensePlate}`}
                        />
                      </div>
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>

        <Pagination
          page={vehiclesQuery.data?.number ?? page}
          totalPages={vehiclesQuery.data?.totalPages ?? 1}
          totalElements={vehiclesQuery.data?.totalElements ?? 0}
          onPageChange={setPage}
        />
      </Card>

      <Modal
        open={formOpen}
        title={editingVehicle ? 'Edit vehicle' : 'New vehicle'}
        description="Keep the operational record accurate for reporting and availability controls."
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="vehicle-form" disabled={createVehicle.isPending || updateVehicle.isPending}>
              {editingVehicle ? 'Save changes' : 'Create vehicle'}
            </Button>
          </>
        }
      >
        <VehicleForm form={form} onChange={setForm} onSubmit={handleSubmit} />
      </Modal>

      <Modal
        open={Boolean(vehicleToDelete)}
        title="Delete vehicle"
        description="This action cannot be undone."
        onClose={() => setVehicleToDelete(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setVehicleToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteVehicle.isPending} icon={<Trash2 size={17} />}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Confirm deletion of <span className="font-semibold text-white">{vehicleToDelete?.licensePlate}</span>.
        </p>
      </Modal>
    </section>
  );
}

function VehicleForm({
  form,
  onChange,
  onSubmit,
}: {
  form: VehiclePayload;
  onChange: (form: VehiclePayload) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const updateField = <K extends keyof VehiclePayload>(field: K, value: VehiclePayload[K]) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <form id="vehicle-form" className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <Input label="Plate" value={form.licensePlate} onChange={(event) => updateField('licensePlate', event.target.value)} required />
      <Input label="Brand" value={form.brand} onChange={(event) => updateField('brand', event.target.value)} required />
      <Input label="Model" value={form.model} onChange={(event) => updateField('model', event.target.value)} required />
      <Input label="Year" type="number" min={1950} max={2100} value={form.year} onChange={(event) => updateField('year', Number(event.target.value))} required />
      <Select label="Type" value={form.type} onChange={(event) => updateField('type', event.target.value as VehicleType)}>
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select label="Fuel" value={form.fuelType} onChange={(event) => updateField('fuelType', event.target.value as FuelType)}>
        {fuelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input label="Mileage" type="number" min={0} value={form.mileage} onChange={(event) => updateField('mileage', Number(event.target.value))} required />
      <Select label="Status" value={form.status} onChange={(event) => updateField('status', event.target.value as VehicleStatus)}>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input label="Color" value={form.color ?? ''} onChange={(event) => updateField('color', event.target.value)} />
      <Input label="RENAVAM" value={form.renavam ?? ''} onChange={(event) => updateField('renavam', event.target.value)} />
      <Input label="Chassis" className="sm:col-span-2" value={form.chassis ?? ''} onChange={(event) => updateField('chassis', event.target.value)} />
    </form>
  );
}

function VehicleRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: 7 }).map((__, cellIndex) => (
            <Td key={cellIndex}>
              <div className="h-4 w-full max-w-32 animate-pulse rounded bg-slate-800" />
            </Td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ErrorRow({ onRetry }: { onRetry: () => void }) {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-10 text-center">
        <div className="mx-auto max-w-sm space-y-3">
          <p className="text-sm font-medium text-white">Vehicles could not be loaded.</p>
          <p className="text-sm text-slate-400">Check your connection and try again.</p>
          <Button variant="secondary" onClick={onRetry} icon={<RefreshCw size={17} />}>
            Try again
          </Button>
        </div>
      </td>
    </tr>
  );
}

function EmptyRow({ hasFilters }: { hasFilters: boolean }) {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-12 text-center">
        <div className="mx-auto max-w-md space-y-2">
          <p className="text-sm font-medium text-white">{hasFilters ? 'No vehicles match these filters.' : 'No vehicles registered yet.'}</p>
          <p className="text-sm text-slate-400">
            {hasFilters ? 'Adjust the search terms or filters to broaden the results.' : 'Create the first fleet record when the operation is ready.'}
          </p>
        </div>
      </td>
    </tr>
  );
}
