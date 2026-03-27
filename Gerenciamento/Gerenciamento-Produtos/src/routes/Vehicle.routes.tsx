import type { JSX } from 'react'
import VehiclePage from '../pages/vehicles/VehiclePage'

const PATHVehicle: { path: string; element: JSX.Element }[] = [
  { path: 'veiculos', element: <VehiclePage /> },
]

export default PATHVehicle
