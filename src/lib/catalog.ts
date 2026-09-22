import { Prisma } from '@prisma/client'

// Prisma filter to strictly scope queries ONLY to products registered under NOVA BG (negocio: 'BG')
export function getNovaBgProductsWhere(): Prisma.ProductoWhereInput {
  return {
    negocio: 'BG',
    activo: true,
  }
}
