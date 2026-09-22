'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, ShieldCheck, ShoppingCart, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/features/cart'
import { formatPrice, getEstimatedDeliveryDate } from '@/shared/utils'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, totalCount, subtotal } = useCart()

  const formattedSubtotal = formatPrice(subtotal)
  const deliveryDate = getEstimatedDeliveryDate()

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 max-w-[800px] mx-auto">
        <div className="bg-white p-10 rounded-2xl border border-gray-200/80 shadow-xs text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center mx-auto">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tu carrito de compras está vacío</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Descubre los mejores organizadores, juegos de mesa y accesorios para personalizar tus partidas.
          </p>
          <div className="pt-4 flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-nova-primary text-xs">
              Explorar Catálogo
            </Link>
            <Link href="/categoria/insertos" className="btn-nova-secondary text-xs">
              Ver Organizadores
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
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          {/* Header */}
          <div className="flex items-baseline justify-between pb-4 border-b border-gray-100 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Carrito de compras</h1>
            <span className="text-xs text-gray-400 font-medium">{totalCount} {totalCount === 1 ? 'producto' : 'productos'}</span>
          </div>

          {/* Shipping Alert */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 mb-6 flex items-center gap-2.5 text-xs text-blue-950">
            <Zap className="w-4 h-4 fill-[#0066ff] text-[#0066ff] shrink-0" />
            <span>
              <strong>Envíos a todo el Perú.</strong> Entrega estimada el <strong>{deliveryDate}</strong> (Lima y Provincias).
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const itemPrice = formatPrice(item.precioMercado)
              return (
                <div key={item.id} className="py-5 flex gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link
                    href={`/producto/${item.id}`}
                    className="w-20 h-20 sm:w-28 sm:h-28 bg-[#fafafa] rounded-xl border border-gray-100 shrink-0 overflow-hidden p-2 flex items-center justify-center"
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
                          className="text-sm font-bold text-gray-900 hover:text-[#0066ff] leading-snug line-clamp-2"
                        >
                          {item.nombreModelo}
                        </Link>
                        <div className="text-base font-black text-gray-900 shrink-0">
                          {itemPrice}
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disponible en stock</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {item.lineaCategoria || 'Juegos de Mesa'}
                      </div>
                    </div>

                    {/* Actions: Quantity & Remove */}
                    <div className="flex items-center gap-4 text-xs pt-3">
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                        <span className="text-gray-500 font-medium">Cant:</span>
                        <select
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="bg-transparent font-bold outline-none cursor-pointer text-gray-900"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-gray-200">|</span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer text-xs"
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
          <div className="text-right pt-6 border-t border-gray-100 text-sm">
            Subtotal de artículos:{' '}
            <strong className="text-xl text-gray-900 font-black">{formattedSubtotal}</strong>
          </div>
        </div>

        {/* Right: Checkout Summary Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4 sticky top-20">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Resumen de compra
            </h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Productos ({totalCount})</span>
                <span className="text-gray-900 font-semibold">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Envío</span>
                <span className="text-gray-500">A coordinar en checkout</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-gray-900">{formattedSubtotal}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-nova-primary py-3.5 text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar compra</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="border-t border-gray-100 pt-4 text-[11px] text-gray-500 space-y-2">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#0066ff]" />
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
