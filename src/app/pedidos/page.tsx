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
          <h1 className="text-2xl font-black text-[#2B231F]">Mis compras</h1>
          <p className="text-xs text-[#6E655F] mt-0.5">Seguimiento de pedidos y compras en NOVA BG</p>
        </div>
        <Link href="/" className="btn-nova-primary text-xs">
          Comprar más artículos
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EBE5DF] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF4EE] text-[#C85A32] border border-[#C85A32]/20 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-[#2B231F]">Aún no tienes compras realizadas</h2>
          <p className="text-xs text-[#6E655F] max-w-sm mx-auto">
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
                className="bg-white rounded-3xl border border-[#EBE5DF] shadow-sm overflow-hidden text-xs"
              >
                {/* Header */}
                <div className="bg-[#FAF6F0] p-4.5 border-b border-[#EBE5DF] grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#6E655F]">
                  <div>
                    <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                      Fecha de compra
                    </span>
                    <span className="text-[#2B231F] font-bold">{dateStr}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                      Total
                    </span>
                    <span className="text-[#2B231F] font-black">{formattedTotal}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                      Destinatario
                    </span>
                    <span className="text-[#2B231F] font-semibold truncate block" title={pedido.cliente}>
                      {pedido.cliente}
                    </span>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                      Orden NOVA
                    </span>
                    <span className="text-[#C85A32] font-black text-sm">
                      #{pedido.codigo}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center gap-2 text-sm font-bold text-[#10B981]">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span>
                      {pedido.estado === 'ENTREGADO' ? 'Entregado con éxito' : 'En preparación y despacho FULL'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#EBE5DF]">
                    {pedido.items.map((item: any) => {
                      const itemImg = getProductImage(item.nombreProductoSnapshot || '')
                      const itemPrice = formatPrice(item.precioUnitario)
                      return (
                        <div key={item.id} className="py-3.5 flex gap-4 items-center">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-[#FDFBF7] rounded-xl border border-[#EBE5DF] overflow-hidden shrink-0 p-1 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={itemImg}
                              alt={item.nombreProductoSnapshot}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h4 className="font-bold text-[#2B231F] leading-snug">
                              {item.nombreProductoSnapshot}
                            </h4>
                            <p className="text-[#6E655F] text-[11px] mt-0.5 font-medium">
                              Cantidad: {item.cantidad} • Precio: {itemPrice}
                            </p>
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="text-[#C85A32] hover:underline font-bold text-[11px] mt-1 inline-block"
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
