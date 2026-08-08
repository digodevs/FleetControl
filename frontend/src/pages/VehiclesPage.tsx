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
  { value: 'AVAILABLE', label: 'Disponível' },
  { value: 'IN_USE', label: 'Em uso' },
  { value: 'MAINTENANCE', label: 'Em manutenção' },
  { value: 'INACTIVE', label: 'Inativo' },
];

const typeOptions: Array<{ value: VehicleType; label: string }> = [
  { value: 'CAR', label: 'Carro' },
  { value: 'MOTORCYCLE', label: 'Moto' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Caminhão' },
  { value: 'BUS', label: 'Ônibus' },
  { value: 'OTHER', label: 'Outro' },
];

const fuelOptions: Array<{ value: FuelType; label: string }> = [
  { value: 'GASOLINE', label: 'Gasolina' },
  { value: 'ETHANOL', label: 'Etanol' },
  { value: 'FLEX', label: 'Flex' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Elétrico' },
  { value: 'HYBRID', label: 'Híbrido' },
  { value: 'OTHER', label: 'Outro' },
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
  { value: 'createdAt,desc', label: 'Mais recentes' },
  { value: 'licensePlate,asc', label: 'Placa A-Z' },
  { value: 'brand,asc', label: 'Marca A-Z' },
  { value: 'year,desc', label: 'Ano desc' },
  { value: 'mileage,desc', label: 'Quilometragem desc' },
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
      showToast('Placa, marca e modelo são obrigatórios.', 'error');
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
        showToast('Veículo atualizado com sucesso.', 'success');
      } else {
        await createVehicle.mutateAsync(payload);
        showToast('Veículo criado com sucesso.', 'success');
      }
      setFormOpen(false);
    } catch {
      showToast('Não foi possível salvar o veículo. Confira os campos e tente novamente.', 'error');
    }
  }

  async function handleDelete() {
    if (!vehicleToDelete) {
      return;
    }

    try {
      await deleteVehicle.mutateAsync(vehicleToDelete.id);
      showToast('Veículo excluído com sucesso.', 'success');
      setVehicleToDelete(null);
    } catch {
      showToast('Não foi possível excluir o veículo.', 'error');
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Veículos"
        description="Gerencie os registros da frota com dados em tempo real da API."
        actions={
          canManageVehicles ? (
            <Button onClick={openCreateModal} icon={<Plus size={18} />}>
              Novo veículo
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
            placeholder="Pesquisar por placa, marca ou modelo"
          />
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as VehicleStatus | '');
              setPage(0);
            }}
            aria-label="Filtrar por status"
          >
            <option value="">Todos os status</option>
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
            aria-label="Filtrar por tipo"
          >
            <option value="">Todos os tipos</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar veículos">
            {sortableColumns.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={resetFilters} icon={<RefreshCw size={17} />} disabled={!hasFilters && sort === 'createdAt,desc'}>
            Limpar
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Inventário da frota</h2>
            <p className="text-xs text-slate-400">{vehiclesQuery.data?.totalElements ?? 0} registros encontrados</p>
          </div>
          <ArrowUpDown size={18} className="text-slate-500" aria-hidden="true" />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <thead className="bg-surface-900">
              <tr>
                <Th>Veículo</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Combustível</Th>
                <Th>Ano</Th>
                <Th>Quilometragem</Th>
                <Th className="text-right">Ações</Th>
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
                          aria-label={`Editar ${vehicle.licensePlate}`}
                        />
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 text-red-300 hover:bg-red-950/60 hover:text-red-100"
                          disabled={!canManageVehicles}
                          onClick={() => setVehicleToDelete(vehicle)}
                          icon={<Trash2 size={16} />}
                          aria-label={`Excluir ${vehicle.licensePlate}`}
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
        title={editingVehicle ? 'Editar veículo' : 'Novo veículo'}
        description="Mantenha o registro operacional correto para relatórios e controles de disponibilidade."
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="vehicle-form" disabled={createVehicle.isPending || updateVehicle.isPending}>
              {editingVehicle ? 'Salvar alterações' : 'Criar veículo'}
            </Button>
          </>
        }
      >
        <VehicleForm form={form} onChange={setForm} onSubmit={handleSubmit} />
      </Modal>

      <Modal
        open={Boolean(vehicleToDelete)}
        title="Excluir veículo"
        description="Esta ação não pode ser desfeita."
        onClose={() => setVehicleToDelete(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setVehicleToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteVehicle.isPending} icon={<Trash2 size={17} />}>
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Confirme a exclusão de <span className="font-semibold text-white">{vehicleToDelete?.licensePlate}</span>.
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
      <Input label="Placa" value={form.licensePlate} onChange={(event) => updateField('licensePlate', event.target.value)} required />
      <Input label="Marca" value={form.brand} onChange={(event) => updateField('brand', event.target.value)} required />
      <Input label="Modelo" value={form.model} onChange={(event) => updateField('model', event.target.value)} required />
      <Input label="Ano" type="number" min={1950} max={2100} value={form.year} onChange={(event) => updateField('year', Number(event.target.value))} required />
      <Select label="Tipo" value={form.type} onChange={(event) => updateField('type', event.target.value as VehicleType)}>
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select label="Combustível" value={form.fuelType} onChange={(event) => updateField('fuelType', event.target.value as FuelType)}>
        {fuelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input label="Quilometragem" type="number" min={0} value={form.mileage} onChange={(event) => updateField('mileage', Number(event.target.value))} required />
      <Select label="Status" value={form.status} onChange={(event) => updateField('status', event.target.value as VehicleStatus)}>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input label="Cor" value={form.color ?? ''} onChange={(event) => updateField('color', event.target.value)} />
      <Input label="RENAVAM" value={form.renavam ?? ''} onChange={(event) => updateField('renavam', event.target.value)} />
      <Input label="Chassi" className="sm:col-span-2" value={form.chassis ?? ''} onChange={(event) => updateField('chassis', event.target.value)} />
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
          <p className="text-sm font-medium text-white">Não foi possível carregar os veículos.</p>
          <p className="text-sm text-slate-400">Verifique sua conexão e tente novamente.</p>
          <Button variant="secondary" onClick={onRetry} icon={<RefreshCw size={17} />}>
            Tentar novamente
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
          <p className="text-sm font-medium text-white">{hasFilters ? 'Nenhum veículo corresponde a estes filtros.' : 'Nenhum veículo cadastrado ainda.'}</p>
          <p className="text-sm text-slate-400">
            {hasFilters ? 'Ajuste a busca ou os filtros para ampliar os resultados.' : 'Crie o primeiro registro da frota quando a operação estiver pronta.'}
          </p>
        </div>
      </td>
    </tr>
  );
}
