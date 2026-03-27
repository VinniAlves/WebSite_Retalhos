import { apiJson } from './api'
import type { Category, CategoryCreateBody, CategoryUpdateBody } from '../types/category'

export const categoryService = {
  list() {
    return apiJson<Category[]>('/category')
  },

  create(body: CategoryCreateBody) {
    return apiJson<{ message: string }>('/category', {
      method: 'POST',
      json: body,
    })
  },

  update(id: number, body: CategoryUpdateBody) {
    return apiJson<{ message: string }>(`/category/${id}`, {
      method: 'PUT',
      json: body,
    })
  },

  activate(id: number) {
    return apiJson<{ message: string }>(`/category/active/${id}`, {
      method: 'PUT',
    })
  },

  deactivate(id: number) {
    return apiJson<{ message: string }>(`/category/delete/${id}`, {
      method: 'DELETE',
    })
  },
}
