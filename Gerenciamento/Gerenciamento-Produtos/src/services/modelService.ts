import { apiJson } from './api'
import type { VehicleModel, ModelCreateBody, ModelUpdateBody } from '../types/model'

export const modelService = {
  list() {
    return apiJson<VehicleModel[]>('/model')
  },

  create(body: ModelCreateBody) {
    return apiJson<{ message: string }>('/model', {
      method: 'POST',
      json: body,
    })
  },

  update(id: number, body: ModelUpdateBody) {
    return apiJson<{ message: string }>(`/model/${id}`, {
      method: 'PUT',
      json: body,
    })
  },

  activate(id: number) {
    return apiJson<{ message: string }>(`/model/active/${id}`, {
      method: 'PUT',
    })
  },

  deactivate(id: number) {
    return apiJson<{ message: string }>(`/model/delete/${id}`, {
      method: 'DELETE',
    })
  },
}
