export interface NovaCategory {
  id: string
  nombre: string
  slug: string
  descripcion?: string | null
  icono?: string | null
  imagenUrl?: string | null
  orden?: number
  destacadaWeb?: boolean
  badgeWeb?: string | null
}

export interface ProductItem {
  id: string
  negocio?: string
  nombreModelo: string
  lineaCategoria: string
  precioMercado: number
  precioAmigos?: number
  costoBase?: number
  pesoGramos?: number
  stock?: number
  controlarStock?: boolean
  enOferta?: boolean
  precioOferta?: number | null
  porcentajeDescuento?: number
  badgePromocion?: string
  destacadoWeb?: boolean
  descripcionWeb?: string
  activo?: boolean
  imagen?: string
  rating?: number
  reviewsCount?: number
  isBestSeller?: boolean
  isAmazonChoice?: boolean
}

