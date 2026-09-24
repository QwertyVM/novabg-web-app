'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Trash2, ShieldCheck, ShoppingCart, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/features/cart'
import { formatPrice, getEstimatedDeliveryDate } from '@/shared/utils'

export default function CartPage() {
  const router = useRouter()
  const { status } = useSession()
  const { items, removeItem, updateQuantity, clearCart, totalCount, subtotal } = useCart()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#C85A32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Prevent rendering anything if unauthenticated (it will redirect anyway)
  if (status === 'unauthenticated') {
    return null
  }

  const formattedSubtotal = formatPrice(subtotal)
  const deliveryDate = getEstimatedDeliveryDate()

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 max-w-[800px] mx-auto">
        <div className="bg-white p-10 rounded-3xl border border-[#EBE5DF] shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-[#FDF4EE] text-[#C85A32] border border-[#C85A32]/20 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-[#2B231F]">Tu carrito de compras está vacío</h1>
          <p className="text-xs text-[#6E655F] max-w-md mx-auto">
            Descubre los mejores organizadores, juegos de mesa y accesorios para personalizar tus partidas.
          </p>
          <div className="pt-4 flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-nova-primary text-xs">
              Explorar Catálogo
            </Link>
            <Link href="/categoria/todos" className="btn-nova-secondary text-xs">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-[#EBE5DF] shadow-sm">
          {/* Header */}
          <div className="flex items-baseline justify-between pb-4 border-b border-[#EBE5DF] mb-4">
            <h1 className="text-xl sm:text-2xl font-black text-[#2B231F]">Carrito de compras</h1>
            <span className="text-xs text-[#6E655F] font-bold">{totalCount} {totalCount === 1 ? 'producto' : 'productos'}</span>
          </div>

          {/* Shipping Alert */}
          <div className="bg-[#FDFBF7] border border-[#EBE5DF] rounded-2xl p-3.5 mb-6 flex items-center gap-2.5 text-xs text-[#2B231F]">
            <Zap className="w-4 h-4 fill-[#C85A32] text-[#C85A32] shrink-0" />
            <span>
              <strong>Envíos a todo el Perú.</strong> Entrega estimada el <strong className="text-[#C85A32]">{deliveryDate}</strong> (Lima y Provincias).
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-[#EBE5DF]">
            {items.map((item) => {
              const itemPrice = formatPrice(item.precioMercado)
              return (
                <div key={item.id} className="py-5 flex gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link
                    href={`/producto/${item.id}`}
                    className="w-20 h-20 sm:w-28 sm:h-28 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] shrink-0 overflow-hidden p-2 flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imagen} alt={item.nombreModelo} className="w-full h-full object-contain" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <Link
                          href={`/producto/${item.id}`}
                          className="text-sm font-bold text-[#2B231F] hover:text-[#C85A32] leading-snug line-clamp-2"
                        >
                          {item.nombreModelo}
                        </Link>
                        <div className="text-base font-black text-[#2B231F] shrink-0">
                          {itemPrice}
                        </div>
                      </div>

                      <div className="text-[11px] text-[#10B981] font-bold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disponible en stock</span>
                      </div>
                      <div className="text-[11px] text-[#6E655F]">
                        {item.lineaCategoria || 'Juegos de Mesa'}
                      </div>
                    </div>

                    {/* Actions: Quantity & Remove */}
                    <div className="flex items-center gap-4 text-xs pt-3">
                      <div className="flex items-center gap-1.5 bg-[#FDFBF7] border border-[#EBE5DF] rounded-xl px-3 py-1">
                        <span className="text-[#6E655F] font-semibold">Cant:</span>
                        <select
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="bg-transparent font-bold outline-none cursor-pointer text-[#2B231F]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-[#EBE5DF]">|</span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#6E655F] hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer text-xs font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Subtotal bottom */}
          <div className="text-right pt-6 border-t border-[#EBE5DF] text-sm text-[#6E655F]">
            Subtotal de artículos:{' '}
            <strong className="text-xl text-[#2B231F] font-black">{formattedSubtotal}</strong>
          </div>
        </div>

        {/* Right: Checkout Summary Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm space-y-4 sticky top-20">
            <h2 className="text-base font-black text-[#2B231F] pb-3 border-b border-[#EBE5DF]">
              Resumen de compra
            </h2>

            <div className="space-y-2 text-xs text-[#6E655F]">
              <div className="flex justify-between">
                <span>Productos ({totalCount})</span>
                <span className="text-[#2B231F] font-bold">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between items-center text-[#6E655F] font-medium">
                <span>Delivery</span>
                <span className="text-[#C85A32] font-bold bg-[#FDF4EE] px-2 py-0.5 rounded-md border border-[#C85A32]/20 text-[11px]">
                  Lo paga el cliente
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EBE5DF] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#2B231F]">Total</span>
              <span className="text-2xl font-black text-[#2B231F]">{formattedSubtotal}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-nova-primary py-3.5 text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar compra</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="border-t border-[#EBE5DF] pt-4 text-[11px] text-[#6E655F] space-y-2">
              <div className="flex items-center gap-2 text-[#2B231F] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
                <span>Compra Protegida con NOVA BG</span>
              </div>
              <p>Aceptamos pagos instantáneos con Yape, Plin y tarjetas sin comisiones extra.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
