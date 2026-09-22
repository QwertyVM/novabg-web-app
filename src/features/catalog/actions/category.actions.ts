'use server'

import prisma from '@/core/database/prisma'
import { slugify } from '@/shared/utils/utils'
import { NovaCategory } from '../types/catalog.types'

export async function getNovaStoreCategories(negocio: string = 'BG'): Promise<NovaCategory[]> {
  try {
    // 1. Fetch from Categoria table for the specified business
    const dbCategories = await prisma.categoria.findMany({
      where: { negocio },
      orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    })

    if (dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        slug: c.slug || slugify(c.nombre),
        descripcion: c.descripcion,
        icono: c.icono,
        imagenUrl: c.imagenUrl,
        orden: c.orden,
        destacadaWeb: c.destacadaWeb,
        badgeWeb: c.badgeWeb,
      }))
    }

    // 2. Fallback to distinct lineaCategoria from active Producto records
    const distinctProducts = await prisma.producto.findMany({
      where: { negocio, activo: true },
      select: { lineaCategoria: true },
      distinct: ['lineaCategoria'],
    })

    return distinctProducts
      .filter((p) => p.lineaCategoria && p.lineaCategoria.trim().length > 0)
      .map((p, idx) => ({
        id: `prod-cat-${idx}`,
        nombre: p.lineaCategoria,
        slug: slugify(p.lineaCategoria),
        descripcion: `Artículos y novedades de ${p.lineaCategoria}`,
        orden: idx,
        destacadaWeb: true,
      }))
  } catch (error) {
    console.error(`Error obteniendo categorias de NOVA (${negocio}):`, error)
    return []
  }
}

// Backward-compatible alias for NOVA BG
export async function getNovaBgCategories(): Promise<NovaCategory[]> {
  return getNovaStoreCategories('BG')
}

