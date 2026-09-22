import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import prisma from '@/core/database/prisma'
import { formatPrice, getProductImage } from '@/shared/utils'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  let pedidos: any[] = []
  try {
    pedidos = await prisma.pedido.findMany({
      where: {
        OR: [
          { negocio: 'BG' },
          { canalVenta: { contains: 'NOVA BG' } },
          { canalVenta: { contains: 'Web' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
      take: 15,
    })
  } catch (e) {
    console.error('Error cargando pedidos:', e)
  }

  return (
    <div className="py-8 px-4 max-w-[1100px] mx-auto">
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis compras</h1>
          <p className="text-xs text-gray-500 mt-0.5">Seguimiento de pedidos y compras en NOVA BG</p>
        </div>
        <Link href="/" className="btn-nova-primary text-xs">
          Comprar más artículos
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Aún no tienes compras realizadas</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explora nuestro catálogo de juegos de mesa, organizadores y accesorios para hacer tu primer pedido.
          </p>
          <Link href="/" className="btn-nova-primary text-xs inline-block mt-2">
            Ver catálogo oficial
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {pedidos.map((pedido) => {
            const formattedTotal = formatPrice(pedido.total)
            const dateStr = new Date(pedido.createdAt).toLocaleDateString('es-PE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            return (
              <div
                key={pedido.id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden text-xs"
              >
                {/* Header */}
                <div className="bg-gray-50/80 p-4 border-b border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-600">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      Fecha de compra
                    </span>
                    <span className="text-gray-900 font-semibold">{dateStr}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      Total
                    </span>
                    <span className="text-gray-900 font-black">{formattedTotal}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      Destinatario
                    </span>
                    <span className="text-gray-900 font-medium truncate block" title={pedido.cliente}>
                      {pedido.cliente}
                    </span>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      Orden NOVA BG
                    </span>
                    <span className="text-[#0066ff] font-bold">
                      #{pedido.codigo}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00a650]">
                    <CheckCircle2 className="w-5 h-5 text-[#00a650]" />
                    <span>
                      {pedido.estado === 'ENTREGADO' ? 'Entregado con éxito' : 'En preparación y despacho FULL'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    {pedido.items.map((item: any) => {
                      const itemImg = getProductImage(item.nombreProductoSnapshot || '')
                      const itemPrice = formatPrice(item.precioUnitario)
                      return (
                        <div key={item.id} className="py-3.5 flex gap-4 items-center">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-[#fafafa] rounded-xl border border-gray-100 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={itemImg}
                              alt={item.nombreProductoSnapshot}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 leading-snug">
                              {item.nombreProductoSnapshot}
                            </h4>
                            <p className="text-gray-500 text-[11px] mt-0.5">
                              Cantidad: {item.cantidad} • Precio: {itemPrice}
                            </p>
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="text-[#0066ff] hover:underline font-semibold text-[11px] mt-1 inline-block"
                            >
                              Ver publicación
                            </Link>
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0">
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="btn-nova-secondary text-[11px] py-1.5 px-3"
                            >
                              Volver a comprar
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
