export interface Vehicle {
  id: number
  veiculo: string
  delete_logic: boolean
}

export interface VehicleCreateBody {
  veiculo: string
}

export interface VehicleUpdateBody {
  veiculo: string
}
