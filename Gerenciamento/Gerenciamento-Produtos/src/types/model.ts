export interface VehicleModel {
  id: number
  modelo: string
  delete_logic: boolean
}

export interface ModelCreateBody {
  modelo: string
}

export interface ModelUpdateBody {
  modelo: string
}
