import { useCallback, useState } from 'react'
import { productService } from '../services/productService'
import type { ProductFilterBody, ProductListResponse, ProductSearchBody } from '../types/product'
import { ApiError } from '../services/api'

export function useProducts() {
  const [data, setData] = useState<ProductListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFilter = useCallback(async (body: ProductFilterBody) => {
    setLoading(true)
    setError(null)
    try {
      const res = await productService.filter(body)
      setData(res)
      return res
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Erro ao listar produtos'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSearch = useCallback(async (body: ProductSearchBody) => {
    setLoading(true)
    setError(null)
    try {
      const res = await productService.search(body)
      setData(res)
      return res
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Erro na busca'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchFilter, fetchSearch, setError }
}
