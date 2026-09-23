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
    // Buscar primero cliente específico de BG
    let cliente = await prisma.cliente.findFirst({
      where: { 
        email: session.user.email,
        negocio: 'BG'
      }
    })

    // Si no tiene cliente en BG pero sí en 3D, traer datos como fallback
    if (!cliente) {
      cliente = await prisma.cliente.findFirst({
        where: { 
          email: session.user.email
        }
      })
    }
    
    let puntosAcumulados = 0
    let totalPedidos = 0
    
    if (cliente) {
      // Calcular puntos basados en Pedidos completados
      const pedidosCompletados = await prisma.pedido.findMany({
        where: { 
          cliente: cliente.nombre,
          negocio: 'BG',
          estado: 'ENTREGADO' 
        }
      })
      
      // Calcular puntos basados en Ventas completadas
      const ventasCompletadas = await prisma.venta.findMany({
        where: {
          cliente: cliente.nombre,
          negocio: 'BG',
          estado: 'ENTREGADO'
        }
      })
      
      totalPedidos = pedidosCompletados.length + ventasCompletadas.length
      
      // Sumar los totales (1 Sol = 1 Punto)
      const puntosPedidos = pedidosCompletados.reduce((sum, p) => sum + Number(p.total), 0)
      const puntosVentas = ventasCompletadas.reduce((sum, v) => sum + Number(v.total), 0)
      
      puntosAcumulados = Math.floor(puntosPedidos + puntosVentas)
    }

    // Obtener direcciones guardadas del usuario
    const direcciones = await prisma.direccionEntrega.findMany({
      where: { userEmail: session.user.email },
      orderBy: [{ esPrincipal: 'desc' }, { createdAt: 'desc' }],
    })
    
    return NextResponse.json({ 
      cliente,
      puntosAcumulados,
      totalPedidos,
      direcciones
    })
  } catch (error) {
    console.error('Error GET perfil:', error)
    return NextResponse.json({ error: 'Error obteniendo perfil' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { nombre, dni, telefono, direccion, distrito, referencia, notas } = body
    
    // Buscar cliente existente para el email en BG
    const existingClienteByEmail = await prisma.cliente.findFirst({
      where: { 
        email: session.user.email,
        negocio: 'BG'
      }
    })

    const targetNombre = nombre !== undefined && nombre.trim() !== '' 
      ? nombre.trim() 
      : (existingClienteByEmail?.nombre || session.user.name || 'Cliente Nova')

    // Validar colisión de nombre único por negocio sólo si cambia de nombre
    if (!existingClienteByEmail || existingClienteByEmail.nombre !== targetNombre) {
      const nameCollision = await prisma.cliente.findUnique({
        where: {
          nombre_negocio: {
            nombre: targetNombre,
            negocio: 'BG'
          }
        }
      })
      
      if (nameCollision && nameCollision.id !== existingClienteByEmail?.id) {
         return NextResponse.json({ 
           error: 'Ya existe un cliente con este nombre exacto. Por favor añade tu apellido o una inicial.' 
         }, { status: 400 })
      }
    }

    const refFinal = referencia !== undefined ? referencia : notas

    let cliente
    
    if (existingClienteByEmail) {
      cliente = await prisma.cliente.update({
        where: { id: existingClienteByEmail.id },
        data: {
          ...(nombre !== undefined ? { nombre: targetNombre } : {}),
          ...(dni !== undefined ? { dni: dni.trim() } : {}),
          ...(telefono !== undefined ? { telefono: telefono.trim() } : {}),
          ...(direccion !== undefined ? { direccion: direccion.trim() } : {}),
          ...(distrito !== undefined ? { distrito: distrito.trim() } : {}),
          ...(refFinal !== undefined ? { notas: refFinal.trim() } : {}),
          canalOrigen: existingClienteByEmail.canalOrigen || 'Tienda Web'
        }
      })
    } else {
      cliente = await prisma.cliente.create({
        data: {
          nombre: targetNombre,
          dni: dni ? dni.trim() : null,
          telefono: telefono ? telefono.trim() : null,
          email: session.user.email,
          direccion: direccion ? direccion.trim() : null,
          distrito: distrito ? distrito.trim() : null,
          notas: refFinal ? refFinal.trim() : null,
          negocio: 'BG',
          canalOrigen: 'Tienda Web'
        }
      })
    }
    
    // Actualizar nombre en NextAuth user si cambió
    if (nombre && session.user.name !== targetNombre) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { name: targetNombre }
      })
    }
    
    return NextResponse.json({ success: true, cliente })
  } catch (error) {
    console.error('Error POST perfil:', error)
    return NextResponse.json({ error: 'Error interno al guardar perfil' }, { status: 500 })
  }
}
