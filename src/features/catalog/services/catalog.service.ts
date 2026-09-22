import prisma from '@/core/database/prisma'
import { Prisma } from '@prisma/client'

/**
 * Enterprise query filter to ensure only NOVA BG products are queried.
 */
export function getNovaBgProductsWhere(): Prisma.ProductoWhereInput {
  return {
    negocio: 'BG',
    activo: true,
  }
}
