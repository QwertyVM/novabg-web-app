import { NextResponse } from 'next/server'
import prisma from '@/core/database/prisma'

// Returns public store config for a given negocio (defaults to BG)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const negocio = searchParams.get('negocio') || 'BG'

  try {
    const config = await prisma.configuracionTienda.findUnique({
      where: { negocio },
      select: {
        nombreTienda: true,
        telefonoContacto: true,
        emailContacto: true,
        whatsappMensaje: true,
        ruc: true,
        horarioAtencion: true,
      },
    })

    return NextResponse.json(config ?? {})
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
