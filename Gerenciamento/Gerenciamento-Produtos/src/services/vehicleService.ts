import { apiJson } from './api'
import type { Vehicle, VehicleCreateBody, VehicleUpdateBody } from '../types/vehicle'

export const vehicleService = {
  list() {
    return apiJson<Vehicle[]>('/vehicle')
  },

  create(body: VehicleCreateBody) {
    return apiJson<{ message: string }>('/vehicle', {
      method: 'POST',
      json: body,
    })
  },

  update(id: number, body: VehicleUpdateBody) {
    return apiJson<{ message: string }>(`/vehicle/${id}`, {
      method: 'PUT',
      json: body,
    })
  },

  activate(id: number) {
    return apiJson<{ message: string }>(`/vehicle/active/${id}`, {
      method: 'PUT',
    })
  },

  deactivate(id: number) {
    return apiJson<{ message: string }>(`/vehicle/delete/${id}`, {
      method: 'DELETE',
    })
  },
}
