'use server'

import prisma from '@/core/database/prisma'
import { CreateOrderInput } from '../types/order.types'

export async function createOrder(data: CreateOrderInput) {
  try {
    const subtotal = data.items.reduce((acc, item) => acc + item.subtotal, 0)
    const costoEnvio = 0
    const total = subtotal + costoEnvio
    const codigo = `BG-${Date.now().toString().slice(-6)}`

    const pedido = await prisma.pedido.create({
      data: {
        negocio: 'BG',
        codigo,
        cliente: data.cliente.trim(),
        dni: data.dni?.trim(),
        telefono: data.telefono?.trim(),
        canalVenta: data.canalVenta || 'Web Oficial NOVA BG',
        destinoEnvio: data.destinoEnvio?.trim(),
        notas: data.notas?.trim(),
        subtotal,
        costoEnvio,
        total,
        montoPagado: 0,
        saldoPendiente: total,
        items: {
          create: data.items.map((it) => ({
            productoId: it.productoId,
            nombreProductoSnapshot: it.nombreProductoSnapshot,
            cantidad: it.cantidad,
            precioUnitario: it.precioUnitario,
            subtotal: it.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return { success: true, pedido }
  } catch (error: any) {
    console.error('Error creando pedido:', error)
    return { success: false, error: error?.message || 'Error al procesar pedido' }
  }
}

export async function getOrdersByUser(emailOrName?: string) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        OR: [
          { negocio: 'BG' },
          { canalVenta: { contains: 'NOVA BG' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
      take: 20,
    })

    return pedidos.map((p) => ({
      ...p,
      costoEnvio: Number(p.costoEnvio),
      subtotal: Number(p.subtotal),
      total: Number(p.total),
      montoPagado: Number(p.montoPagado),
      saldoPendiente: Number(p.saldoPendiente),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      items: p.items.map((i) => ({
        ...i,
        precioUnitario: Number(i.precioUnitario),
        subtotal: Number(i.subtotal),
      })),
    }))
  } catch (e) {
    console.error('Error obteniendo pedidos:', e)
    return []
  }
}
