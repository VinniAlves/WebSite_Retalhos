import EntityAdminPage, {
  type EntityCrudConfig,
} from '../crud/EntityAdminPage'
import { vehicleService } from '../../services/vehicleService'
import type { Vehicle } from '../../types/vehicle'

const vehicleConfig: EntityCrudConfig<Vehicle> = {
  title: 'Veículos',
  description: 'Cadastro de tipos de veículo.',
  fields: [{ name: 'veiculo', label: 'Veículo' }],
  load: () => vehicleService.list(),
  rowLabel: (r) => r.veiculo,
  rowSearchText: (r) => r.veiculo,
  create: async (v) => {
    await vehicleService.create({ veiculo: v.veiculo })
  },
  update: async (id, v) => {
    await vehicleService.update(id, { veiculo: v.veiculo })
  },
  activate: (id) => vehicleService.activate(id),
  deactivate: (id) => vehicleService.deactivate(id),
}

export default function VehiclePage() {
  return <EntityAdminPage config={vehicleConfig} />
}
