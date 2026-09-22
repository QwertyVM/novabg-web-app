import React from 'react'
import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatPriceParts, getProductImage } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  let pedidos: any[] = []
  try {
    pedidos = await prisma.pedido.findMany({
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
    <div className="py-6 px-4 max-w-[1100px] mx-auto">
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-xs text-gray-500">Revisa el estado de tus compras de Juegos de Mesa y accesorios</p>
        </div>
        <Link href="/" className="btn-amazon-primary text-xs">
          Comprar más artículos
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white p-8 rounded border border-gray-200 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-base font-bold text-gray-900">Aún no has realizado pedidos</h2>
          <p className="text-xs text-gray-500">
            Explora nuestro catálogo para encontrar insertos, juegos de mesa y accesorios.
          </p>
          <Link href="/" className="btn-amazon-primary text-xs inline-block mt-2">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {pedidos.map((pedido) => {
            const totalParts = formatPriceParts(pedido.total)
            const dateStr = new Date(pedido.createdAt).toLocaleDateString('es-PE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            return (
              <div
                key={pedido.id}
                className="bg-white rounded border border-gray-200 shadow-2xs overflow-hidden text-xs"
              >
                {/* Amazon Order Top Header */}
                <div className="bg-gray-100 p-4 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-600">
                  <div>
                    <span className="block text-[11px] uppercase font-semibold text-gray-500">
                      Pedido realizado
                    </span>
                    <span className="text-gray-900 font-medium">{dateStr}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase font-semibold text-gray-500">
                      Total
                    </span>
                    <span className="text-gray-900 font-bold">{totalParts.full}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase font-semibold text-gray-500">
                      Enviar a
                    </span>
                    <span className="text-gray-900 font-medium truncate block" title={pedido.cliente}>
                      {pedido.cliente}
                    </span>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="block text-[11px] uppercase font-semibold text-gray-500">
                      Pedido nº {pedido.codigo}
                    </span>
                    <span className="text-[#007185] hover:underline cursor-pointer">
                      Ver recibo
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>
                      Estado: {pedido.estado === 'ENTREGADO' ? 'Entregado con éxito' : 'En preparación y envío'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    {pedido.items.map((item: any) => {
                      const itemImg = getProductImage(item.nombreProductoSnapshot || '')
                      const itemPrice = formatPriceParts(item.precioUnitario)
                      return (
                        <div key={item.id} className="py-3 flex gap-4 items-center">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-gray-50 rounded border border-gray-200 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={itemImg}
                              alt={item.nombreProductoSnapshot}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 leading-snug">
                              {item.nombreProductoSnapshot}
                            </h4>
                            <p className="text-gray-500 text-[11px]">
                              Cantidad: {item.cantidad} | Precio: {itemPrice.full}
                            </p>
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="text-[#007185] hover:underline font-medium text-[11px] mt-1 inline-block"
                            >
                              Ver página del producto
                            </Link>
                          </div>

                          {/* Reorder Button */}
                          <div className="shrink-0">
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="btn-amazon-primary text-[11px] py-1 px-3"
                            >
                              Comprar de nuevo
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
