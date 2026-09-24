import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/core/database/prisma'
import { getProductImage } from '@/shared/utils'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idsParam = searchParams.get('ids')

    if (!idsParam) {
      return NextResponse.json({ success: true, products: [] })
    }

    const ids = idsParam.split(',').filter(Boolean)

    if (ids.length === 0) {
      return NextResponse.json({ success: true, products: [] })
    }

    const productosDb = await prisma.producto.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        _count: {
          select: {
            favoritos: true,
          },
        },
      },
    })

    const products = productosDb.map((p) => {
      const isControlledStock = p.controlarStock === true
      const maxStock = isControlledStock ? (p.stock ?? 0) : 99
      const isOutOfStock = isControlledStock && maxStock <= 0

      return {
        id: p.id,
        nombreModelo: p.nombreModelo,
        lineaCategoria: p.lineaCategoria,
        precioMercado: Number(p.precioMercado),
        precioOferta: p.precioOferta ? Number(p.precioOferta) : null,
        enOferta: p.enOferta,
        porcentajeDescuento: p.porcentajeDescuento,
        badgePromocion: p.badgePromocion,
        imagen: p.imagenUrl || getProductImage(p.nombreModelo, p.lineaCategoria),
        stock: p.stock,
        controlarStock: p.controlarStock,
        isOutOfStock,
        maxStock,
        editorialMarca: p.editorialMarca,
        bggRating: p.bggRating ? Number(p.bggRating) : null,
        favoritosCount: p._count.favoritos,
      }
    })

    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.error('Error en GET /api/favoritos:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al obtener favoritos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      action,
      productoId,
      clienteEmail,
      clienteNombre,
      clienteTelefono,
      deseaAvisoStock,
    } = body

    if (!productoId) {
      return NextResponse.json(
        { success: false, error: 'productoId requerido' },
        { status: 400 }
      )
    }

    if (action === 'remove' && clienteEmail) {
      await prisma.favorito.deleteMany({
        where: {
          productoId,
          clienteEmail,
        },
      })
      return NextResponse.json({ success: true, removed: true })
    }

    if (action === 'alert') {
      // Buscar si ya existe un registro de este cliente para este producto
      let existing = null
      if (clienteEmail) {
        existing = await prisma.favorito.findFirst({
          where: {
            productoId,
            clienteEmail,
          },
        })
      }

      if (existing) {
        await prisma.favorito.update({
          where: { id: existing.id },
          data: {
            deseaAvisoStock: true,
            avisado: false,
            clienteNombre: clienteNombre || existing.clienteNombre,
            clienteTelefono: clienteTelefono || existing.clienteTelefono,
          },
        })
      } else {
        await prisma.favorito.create({
          data: {
            productoId,
            clienteEmail: clienteEmail || null,
            clienteNombre: clienteNombre || null,
            clienteTelefono: clienteTelefono || null,
            deseaAvisoStock: true,
            avisado: false,
          },
        })
      }

      return NextResponse.json({ success: true, alertRegistered: true })
    }

    // Default action: add / sync favorite
    if (clienteEmail) {
      const existing = await prisma.favorito.findFirst({
        where: {
          productoId,
          clienteEmail,
        },
      })

      if (!existing) {
        await prisma.favorito.create({
          data: {
            productoId,
            clienteEmail,
            clienteNombre: clienteNombre || null,
            deseaAvisoStock: deseaAvisoStock === true,
          },
        })
      }
    } else {
      // Para usuarios no logueados que marcan favorito, guardamos el registro anónimo para métricas
      await prisma.favorito.create({
        data: {
          productoId,
          deseaAvisoStock: deseaAvisoStock === true,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error en POST /api/favoritos:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al procesar favorito' },
      { status: 500 }
    )
  }
}
