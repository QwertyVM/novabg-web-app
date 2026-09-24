import React from 'react'
import prisma from '@/core/database/prisma'
import { OrdersClient, SerializedOrder, StoreConfigData } from './OrdersClient'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  let serializedPedidos: SerializedOrder[] = []
  let storeConfigData: StoreConfigData = {
    telefonoContacto: '51945398747',
    yapeNumero: '945398747',
    yapeTitular: 'Víctor Monzon Anglas',
    bcpNumeroCuenta: '',
    bcpCci: '',
    bcpTitular: 'Víctor Monzon Anglas',
  }

  try {
    const [pedidosDb, storeConfig] = await Promise.all([
      prisma.pedido.findMany({
        where: {
          OR: [
            { negocio: 'BG' },
            { canalVenta: { contains: 'NOVA BG' } },
            { canalVenta: { contains: 'Web' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              producto: true,
            },
          },
        },
        take: 30,
      }),
      prisma.configuracionTienda.findUnique({
        where: { negocio: 'BG' },
      }),
    ])

    if (storeConfig) {
      storeConfigData = {
        telefonoContacto: storeConfig.telefonoContacto || '51945398747',
        yapeNumero: storeConfig.yapeNumero || '945398747',
        yapeTitular: storeConfig.yapeTitular || 'Víctor Monzon Anglas',
        bcpNumeroCuenta: storeConfig.bcpNumeroCuenta || '',
        bcpCci: storeConfig.bcpCci || '',
        bcpTitular: storeConfig.bcpTitular || 'Víctor Monzon Anglas',
      }
    }

    serializedPedidos = pedidosDb.map((p) => ({
      id: p.id,
      codigo: p.codigo,
      fecha: p.fecha.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      cliente: p.cliente,
      telefono: p.telefono,
      dni: p.dni,
      canalVenta: p.canalVenta,
      destinoEnvio: p.destinoEnvio,
      notas: p.notas,
      metodoPago: p.metodoPago,
      estado: p.estado,
      costoEnvio: Number(p.costoEnvio),
      subtotal: Number(p.subtotal),
      total: Number(p.total),
      montoPagado: Number(p.montoPagado),
      saldoPendiente: Number(p.saldoPendiente),
      items: p.items.map((it) => ({
        id: it.id,
        pedidoId: it.pedidoId,
        productoId: it.productoId,
        nombreProductoSnapshot: it.nombreProductoSnapshot || it.producto?.nombreModelo || 'Producto',
        cantidad: it.cantidad,
        precioUnitario: Number(it.precioUnitario),
        subtotal: Number(it.subtotal),
        producto: it.producto
          ? {
              id: it.producto.id,
              nombreModelo: it.producto.nombreModelo,
              lineaCategoria: it.producto.lineaCategoria,
              imagenUrl: it.producto.imagenUrl,
              precioMercado: Number(it.producto.precioMercado),
              descripcionWeb: it.producto.descripcionWeb,
              editorialMarca: it.producto.editorialMarca,
            }
          : null,
      })),
    }))
  } catch (e) {
    console.error('Error cargando pedidos en OrdersPage:', e)
  }

  return <OrdersClient pedidos={serializedPedidos} storeConfig={storeConfigData} />
}

