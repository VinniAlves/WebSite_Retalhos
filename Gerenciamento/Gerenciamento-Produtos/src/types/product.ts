import type { PaginationMeta } from './pagination'

export interface ProductListRow {
  id: number
  descricao: string
  ano: number
  codigo: string
  anuncio_ml: string | null
  valor_original: string | number
  titulo: string | null
  destaque?: boolean
  delete_logic?: boolean
  marca: string
  modelo: string
  nome_categoria: string
  categoria_descricao?: string
  veiculo: string
  imagens?: string[]
}

export interface ProductFilterBody {
  categoria?: number[]
  marca?: number[]
  veiculo?: number[]
  modelo?: number[]
  preco?: unknown[]
  destaque?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  includeDeleted?: boolean
}

export interface ProductSearchBody {
  search: string
  page?: number
  includeDeleted?: boolean
}

export interface ProductListResponse {
  products: ProductListRow[]
  pagination: PaginationMeta
}

export interface CreateProductBody {
  id_categoria: number
  id_marca: number
  id_modelo: number
  id_veiculo: number
  titulo: string
  descricao: string
  ano: number
  codigo: string
  data_entrada: string
  data_venda?: string | null
  anuncio_ml: string
  valor_original: string
  valor_ml?: string | number | null
  destaque: boolean
}

export interface CreateProductResponse {
  message: string
  id: number
  body?: { product: Record<string, unknown> }
}

export interface ProductDetail {
  id: number
  descricao: string
  ano: number
  codigo: string
  anuncio_ml: string | null
  valor_original: string | number
  titulo: string | null
  id_categoria: number
  id_marca: number
  id_modelo: number
  id_veiculo: number
  data_entrada: string | null
  destaque: boolean
  valor_ml: string | number | null
  valor_venda?: string | number | null
  delete_logic?: boolean
  marca: string
  modelo: string
  nome_categoria: string
  categoria_descricao?: string
  veiculo: string
  imagens: string[]
}

export interface ProductDetailResponse {
  product: ProductDetail
}

export type ProductUpdateBody = Partial<{
  id_categoria: number
  id_marca: number
  id_modelo: number
  id_veiculo: number
  titulo: string
  descricao: string
  ano: number
  codigo: string
  data_entrada: string
  anuncio_ml: string
  valor_original: string
  valor_ml: string | number | null
  destaque: boolean
  valor_venda: string | number | null
}>
