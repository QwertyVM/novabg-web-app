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
    const cliente = await prisma.cliente.findFirst({
      where: { 
        email: session.user.email,
        negocio: 'BG'
      }
    })
    
    let puntosAcumulados = 0
    let totalPedidos = 0
    
    if (cliente) {
      // Calculate points based on completed Pedidos
      const pedidosCompletados = await prisma.pedido.findMany({
        where: { 
          cliente: cliente.nombre,
          negocio: 'BG',
          estado: 'ENTREGADO' 
        }
      })
      
      // Calculate points based on completed Ventas
      const ventasCompletadas = await prisma.venta.findMany({
        where: {
          cliente: cliente.nombre,
          negocio: 'BG',
          estado: 'ENTREGADO'
        }
      })
      
      totalPedidos = pedidosCompletados.length + ventasCompletadas.length
      
      // Sum the totals (1 Sol = 1 Punto)
      const puntosPedidos = pedidosCompletados.reduce((sum, p) => sum + Number(p.total), 0)
      const puntosVentas = ventasCompletadas.reduce((sum, v) => sum + Number(v.total), 0)
      
      puntosAcumulados = Math.floor(puntosPedidos + puntosVentas)
    }
    
    return NextResponse.json({ 
      cliente,
      puntosAcumulados,
      totalPedidos
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
    const { nombre, dni, telefono, direccion, distrito } = body
    
    if (!nombre || nombre.trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }
    
    const formattedNombre = nombre.trim()
    
    // Check if client exists by email
    const existingClienteByEmail = await prisma.cliente.findFirst({
      where: { 
        email: session.user.email,
        negocio: 'BG'
      }
    })
    
    // Check for name collision
    if (!existingClienteByEmail || existingClienteByEmail.nombre !== formattedNombre) {
      const nameCollision = await prisma.cliente.findUnique({
        where: {
          nombre_negocio: {
            nombre: formattedNombre,
            negocio: 'BG'
          }
        }
      })
      
      if (nameCollision) {
         return NextResponse.json({ 
           error: 'Ya existe un cliente con este nombre exacto. Por favor, incluye tu apellido o una inicial extra.' 
         }, { status: 400 })
      }
    }
    
    let cliente;
    
    if (existingClienteByEmail) {
      cliente = await prisma.cliente.update({
        where: { id: existingClienteByEmail.id },
        data: {
          nombre: formattedNombre,
          dni,
          telefono,
          direccion,
          distrito,
          canalOrigen: existingClienteByEmail.canalOrigen || 'Tienda Web'
        }
      })
    } else {
      cliente = await prisma.cliente.create({
        data: {
          nombre: formattedNombre,
          dni,
          telefono,
          email: session.user.email,
          direccion,
          distrito,
          negocio: 'BG',
          canalOrigen: 'Tienda Web'
        }
      })
    }
    
    // Update the NextAuth user name if it changed
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name: formattedNombre }
    })
    
    return NextResponse.json({ success: true, cliente })
  } catch (error) {
    console.error('Error POST perfil:', error)
    return NextResponse.json({ error: 'Error interno al guardar perfil' }, { status: 500 })
  }
}
