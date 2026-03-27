import { useMemo } from 'react'
import PATHProduct from './Product.routes'
import PATHCategory from './Category.routes'
import PATHMark from './Mark.routes'
import PATHModel from './Model.routes'
import PATHVehicle from './Vehicle.routes'

function useRoutes() {
  const routes = useMemo(
    () => [...PATHProduct, ...PATHCategory, ...PATHMark, ...PATHModel, ...PATHVehicle],
    []
  )
  return routes
}

export default useRoutes
