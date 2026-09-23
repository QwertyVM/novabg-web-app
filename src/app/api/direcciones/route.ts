import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/core/auth'
import prisma from '@/core/database/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    let direcciones = await prisma.direccionEntrega.findMany({
      where: { userEmail: session.user.email },
      orderBy: [{ esPrincipal: 'desc' }, { createdAt: 'desc' }],
    })

    // Si aún no tiene direcciones en DireccionEntrega, verificar si tiene alguna en Cliente para migrarla/crearla automáticamente
    if (direcciones.length === 0) {
      const cliente = await prisma.cliente.findFirst({
        where: {
          email: session.user.email,
          direccion: { not: null },
        },
      })

      if (cliente && cliente.direccion && cliente.direccion.trim() !== '') {
        const autoMigrated = await prisma.direccionEntrega.create({
          data: {
            userEmail: session.user.email,
            apodo: 'Casa',
            direccion: cliente.direccion.trim(),
            distrito: (cliente.distrito && cliente.distrito.trim()) || 'Miraflores, Lima',
            referencia: cliente.notas ? cliente.notas.trim() : null,
            esPrincipal: true,
          },
        })
        direcciones = [autoMigrated]
      }
    }

    return NextResponse.json({ direcciones })
  } catch (error) {
    console.error('Error GET /api/direcciones:', error)
    return NextResponse.json({ error: 'Error al obtener direcciones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { apodo, direccion, distrito, referencia, esPrincipal } = body

    if (!direccion || !direccion.trim()) {
      return NextResponse.json({ error: 'La dirección exacta es obligatoria' }, { status: 400 })
    }

    if (!distrito || !distrito.trim()) {
      return NextResponse.json({ error: 'El distrito / ciudad es obligatorio' }, { status: 400 })
    }

    const cleanApodo = apodo && apodo.trim() ? apodo.trim() : 'Casa'
    const cleanDireccion = direccion.trim()
    const cleanDistrito = distrito.trim()
    const cleanReferencia = referencia && referencia.trim() ? referencia.trim() : null

    // Contar cuántas direcciones ya tiene
    const count = await prisma.direccionEntrega.count({
      where: { userEmail: session.user.email },
    })

    // Si es la primera dirección o se marcó como principal:
    const shouldBePrincipal = count === 0 || Boolean(esPrincipal)

    if (shouldBePrincipal) {
      // Quitar principal de las anteriores
      await prisma.direccionEntrega.updateMany({
        where: { userEmail: session.user.email },
        data: { esPrincipal: false },
      })

      // Sincronizar con el Cliente en BG para compatibilidad
      const cliente = await prisma.cliente.findFirst({
        where: { email: session.user.email, negocio: 'BG' },
      })
      if (cliente) {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            direccion: cleanDireccion,
            distrito: cleanDistrito,
            notas: cleanReferencia,
          },
        })
      }
    }

    const nuevaDireccion = await prisma.direccionEntrega.create({
      data: {
        userEmail: session.user.email,
        apodo: cleanApodo,
        direccion: cleanDireccion,
        distrito: cleanDistrito,
        referencia: cleanReferencia,
        esPrincipal: shouldBePrincipal,
      },
    })

    return NextResponse.json({ success: true, direccion: nuevaDireccion })
  } catch (error) {
    console.error('Error POST /api/direcciones:', error)
    return NextResponse.json({ error: 'Error al guardar dirección' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, esPrincipal, apodo, direccion, distrito, referencia } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de dirección requerido' }, { status: 400 })
    }

    // Verificar pertenencia
    const existente = await prisma.direccionEntrega.findFirst({
      where: { id, userEmail: session.user.email },
    })

    if (!existente) {
      return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 404 })
    }

    if (esPrincipal) {
      // Quitar esPrincipal a las demás
      await prisma.direccionEntrega.updateMany({
        where: { userEmail: session.user.email },
        data: { esPrincipal: false },
      })

      // Sincronizar con Cliente
      const cliente = await prisma.cliente.findFirst({
        where: { email: session.user.email, negocio: 'BG' },
      })
      if (cliente) {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            direccion: direccion !== undefined ? direccion.trim() : existente.direccion,
            distrito: distrito !== undefined ? distrito.trim() : existente.distrito,
            notas: referencia !== undefined ? referencia?.trim() : existente.referencia,
          },
        })
      }
    }

    const actualizada = await prisma.direccionEntrega.update({
      where: { id },
      data: {
        ...(apodo !== undefined ? { apodo: apodo.trim() } : {}),
        ...(direccion !== undefined ? { direccion: direccion.trim() } : {}),
        ...(distrito !== undefined ? { distrito: distrito.trim() } : {}),
        ...(referencia !== undefined ? { referencia: referencia ? referencia.trim() : null } : {}),
        ...(esPrincipal !== undefined ? { esPrincipal: Boolean(esPrincipal) } : {}),
      },
    })

    return NextResponse.json({ success: true, direccion: actualizada })
  } catch (error) {
    console.error('Error PATCH /api/direcciones:', error)
    return NextResponse.json({ error: 'Error al actualizar dirección' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de dirección requerido' }, { status: 400 })
    }

    const existente = await prisma.direccionEntrega.findFirst({
      where: { id, userEmail: session.user.email },
    })

    if (!existente) {
      return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 404 })
    }

    await prisma.direccionEntrega.delete({
      where: { id },
    })

    // Si la eliminada era principal, asignar principal a la más reciente que quede
    if (existente.esPrincipal) {
      const siguiente = await prisma.direccionEntrega.findFirst({
        where: { userEmail: session.user.email },
        orderBy: { createdAt: 'desc' },
      })

      if (siguiente) {
        await prisma.direccionEntrega.update({
          where: { id: siguiente.id },
          data: { esPrincipal: true },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error DELETE /api/direcciones:', error)
    return NextResponse.json({ error: 'Error al eliminar dirección' }, { status: 500 })
  }
}
