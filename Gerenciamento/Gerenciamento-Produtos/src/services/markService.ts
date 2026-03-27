import { apiJson } from './api'
import type { Mark, MarkCreateBody, MarkUpdateBody } from '../types/mark'

export const markService = {
  list() {
    return apiJson<Mark[]>('/mark')
  },

  create(body: MarkCreateBody) {
    return apiJson<{ message: string }>('/mark', {
      method: 'POST',
      json: body,
    })
  },

  update(id: number, body: MarkUpdateBody) {
    return apiJson<{ message: string }>(`/mark/${id}`, {
      method: 'PUT',
      json: body,
    })
  },

  activate(id: number) {
    return apiJson<{ message: string }>(`/mark/active/${id}`, {
      method: 'PUT',
    })
  },

  deactivate(id: number) {
    return apiJson<{ message: string }>(`/mark/delete/${id}`, {
      method: 'DELETE',
    })
  },
}
