export interface Category {
  id: number
  nome_categoria: string
  descricao: string
  delete_logic: boolean
}

export interface CategoryCreateBody {
  nome_categoria: string
  descricao: string
}

export interface CategoryUpdateBody {
  nome_categoria: string
  descricao: string
}
