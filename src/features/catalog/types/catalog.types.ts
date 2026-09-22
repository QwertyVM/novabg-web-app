export interface NovaCategory {
  id: string
  nombre: string
  slug: string
  descripcion?: string | null
}

export interface ProductItem {
  id: string
  nombreModelo: string
  lineaCategoria: string
  precioMercado: number
  precioAmigos?: number
  costoBase?: number
  pesoGramos?: number
  activo?: boolean
  imagen?: string
  rating?: number
  reviewsCount?: number
  isBestSeller?: boolean
  isAmazonChoice?: boolean
}
