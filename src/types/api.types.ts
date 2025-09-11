export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface VideoDto {
  id: string
  title: string
  url: string
}

export interface ProductDto {
  id: string
  name: string
  price: number
}
