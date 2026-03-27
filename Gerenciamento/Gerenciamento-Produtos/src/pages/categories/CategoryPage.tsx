import EntityAdminPage, {
  type EntityCrudConfig,
} from '../crud/EntityAdminPage'
import { categoryService } from '../../services/categoryService'
import type { Category } from '../../types/category'

const categoryConfig: EntityCrudConfig<Category> = {
  title: 'Categorias',
  description: 'Cadastro de categorias utilizadas nos produtos.',
  fields: [
    { name: 'nome_categoria', label: 'Nome' },
    { name: 'descricao', label: 'Descrição', type: 'textarea' },
  ],
  load: () => categoryService.list(),
  rowLabel: (r) => r.nome_categoria,
  rowSearchText: (r) => `${r.nome_categoria} ${r.descricao ?? ''}`,
  create: async (v) => {
    await categoryService.create({
      nome_categoria: v.nome_categoria,
      descricao: v.descricao,
    })
  },
  update: async (id, v) => {
    await categoryService.update(id, {
      nome_categoria: v.nome_categoria,
      descricao: v.descricao,
    })
  },
  activate: (id) => categoryService.activate(id),
  deactivate: (id) => categoryService.deactivate(id),
}

export default function CategoryPage() {
  return <EntityAdminPage config={categoryConfig} />
}
