import { useCallback, useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService'
import { markService } from '../services/markService'
import { modelService } from '../services/modelService'
import { vehicleService } from '../services/vehicleService'
import type { Category } from '../types/category'
import type { Mark } from '../types/mark'
import type { VehicleModel } from '../types/model'
import type { Vehicle } from '../types/vehicle'
import { ApiError } from '../services/api'

export function useReferenceLists() {
  const [categories, setCategories] = useState<Category[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, m, mo, v] = await Promise.all([
        categoryService.list(),
        markService.list(),
        modelService.list(),
        vehicleService.list(),
      ])
      setCategories(c)
      setMarks(m)
      setModels(mo)
      setVehicles(v)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erro ao carregar listas auxiliares')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    categories,
    marks,
    models,
    vehicles,
    loading,
    error,
    refresh,
  }
}
