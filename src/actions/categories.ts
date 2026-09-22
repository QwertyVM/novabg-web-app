'use server'

import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export interface NovaCategory {
  id: string
  nombre: string
  slug: string
  descripcion?: string | null
}

// Fetch categories registered strictly under NOVA BG (negocio: 'BG')
export async function getNovaBgCategories(): Promise<NovaCategory[]> {
  try {
    // 1. Fetch from Categoria table for negocio: 'BG'
    const dbCategories = await prisma.categoria.findMany({
      where: { negocio: 'BG' },
      orderBy: { nombre: 'asc' },
    })

    if (dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        slug: slugify(c.nombre),
        descripcion: c.descripcion,
      }))
    }

    // 2. Fallback to distinct lineaCategoria from active Producto records with negocio: 'BG'
    const distinctProducts = await prisma.producto.findMany({
      where: { negocio: 'BG', activo: true },
      select: { lineaCategoria: true },
      distinct: ['lineaCategoria'],
    })

    return distinctProducts
      .filter((p) => p.lineaCategoria && p.lineaCategoria.trim().length > 0)
      .map((p, idx) => ({
        id: `prod-cat-${idx}`,
        nombre: p.lineaCategoria,
        slug: slugify(p.lineaCategoria),
      }))
  } catch (error) {
    console.error('Error obteniendo categorias de NOVA BG:', error)
    return []
  }
}
