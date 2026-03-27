import EntityAdminPage, {
  type EntityCrudConfig,
} from '../crud/EntityAdminPage'
import { modelService } from '../../services/modelService'
import type { VehicleModel } from '../../types/model'

const modelConfig: EntityCrudConfig<VehicleModel> = {
  title: 'Modelos',
  description: 'Cadastro de modelos vinculados às marcas nos produtos.',
  fields: [{ name: 'modelo', label: 'Modelo' }],
  load: () => modelService.list(),
  rowLabel: (r) => r.modelo,
  rowSearchText: (r) => r.modelo,
  create: async (v) => {
    await modelService.create({ modelo: v.modelo })
  },
  update: async (id, v) => {
    await modelService.update(id, { modelo: v.modelo })
  },
  activate: (id) => modelService.activate(id),
  deactivate: (id) => modelService.deactivate(id),
}

export default function ModelPage() {
  return <EntityAdminPage config={modelConfig} />
}
