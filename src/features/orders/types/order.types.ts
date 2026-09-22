export interface OrderItemInput {
  productoId: string
  nombreProductoSnapshot: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface CreateOrderInput {
  cliente: string
  dni?: string
  telefono?: string
  canalVenta?: string
  destinoEnvio?: string
  notas?: string
  items: OrderItemInput[]
  metodoPago?: string
}

export interface FormattedOrderItem {
  id: string
  pedidoId: string
  productoId: string
  nombreProductoSnapshot: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface FormattedOrder {
  id: string
  negocio: string
  codigo: string
  cliente: string
  dni: string | null
  telefono: string | null
  canalVenta: string | null
  destinoEnvio: string | null
  notas: string | null
  subtotal: number
  costoEnvio: number
  total: number
  montoPagado: number
  saldoPendiente: number
  estado: string
  metodoPago: string | null
  createdAt: string
  updatedAt: string
  items: FormattedOrderItem[]
}
