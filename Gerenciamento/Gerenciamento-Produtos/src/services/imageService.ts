import { apiFormData, apiJson } from './api'
import type { ProductImageRow } from '../types/image'

export const imageService = {
  listByProduct(productId: number) {
    return apiJson<ProductImageRow[]>(`/image/${productId}`)
  },

  upload(productId: number, files: File[]) {
    const fd = new FormData()
    files.forEach((f) => fd.append('imagens', f))
    return apiFormData<{ message: string }>(`/image/${productId}`, fd, 'POST')
  },

  activate(imageId: number) {
    return apiJson<{ message: string }>(`/image/active/${imageId}`, {
      method: 'PUT',
    })
  },

  deactivate(imageId: number) {
    return apiJson<{ message: string }>(`/image/delete/${imageId}`, {
      method: 'DELETE',
    })
  },
}
