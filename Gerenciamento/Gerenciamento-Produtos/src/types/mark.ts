export interface Mark {
  id: number
  marca: string
  delete_logic: boolean
}

export interface MarkCreateBody {
  marca: string
}

export interface MarkUpdateBody {
  marca: string
}
