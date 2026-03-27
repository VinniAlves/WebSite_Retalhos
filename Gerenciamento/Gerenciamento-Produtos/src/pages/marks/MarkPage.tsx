import EntityAdminPage, {
  type EntityCrudConfig,
} from '../crud/EntityAdminPage'
import { markService } from '../../services/markService'
import type { Mark } from '../../types/mark'

const markConfig: EntityCrudConfig<Mark> = {
  title: 'Marcas',
  description: 'Cadastro de marcas de veículos e peças.',
  fields: [{ name: 'marca', label: 'Marca' }],
  load: () => markService.list(),
  rowLabel: (r) => r.marca,
  rowSearchText: (r) => r.marca,
  create: async (v) => {
    await markService.create({ marca: v.marca })
  },
  update: async (id, v) => {
    await markService.update(id, { marca: v.marca })
  },
  activate: (id) => markService.activate(id),
  deactivate: (id) => markService.deactivate(id),
}

export default function MarkPage() {
  return <EntityAdminPage config={markConfig} />
}
