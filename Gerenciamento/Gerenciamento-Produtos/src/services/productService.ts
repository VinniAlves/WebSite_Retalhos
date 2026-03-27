import { apiJson } from './api'
import type {
  CreateProductBody,
  CreateProductResponse,
  ProductDetailResponse,
  ProductFilterBody,
  ProductListResponse,
  ProductSearchBody,
  ProductUpdateBody,
} from '../types/product'

export const productService = {
  filter(body: ProductFilterBody) {
    return apiJson<ProductListResponse>('/products/filter', {
      method: 'POST',
      json: { ...body, includeDeleted: true },
    })
  },

  search(body: ProductSearchBody) {
    return apiJson<ProductListResponse>('/products/search', {
      method: 'POST',
      json: { ...body, includeDeleted: true },
    })
  },

  create(body: CreateProductBody) {
    return apiJson<CreateProductResponse>('/products', {
      method: 'POST',
      json: {
        ...body,
        valor_ml: body.valor_ml ?? null,
      },
    })
  },

  getById(id: number) {
    return apiJson<ProductDetailResponse>(`/products/${id}`)
  },

  update(id: number, body: ProductUpdateBody) {
    return apiJson<{ message: string }>(`/products/${id}`, {
      method: 'PUT',
      json: body,
    })
  },

  activate(id: number) {
    return apiJson<{ message: string }>(`/products/active/${id}`, {
      method: 'PUT',
    })
  },

  deactivate(id: number) {
    return apiJson<{ message: string }>(`/products/delete/${id}`, {
      method: 'DELETE',
    })
  },
}
