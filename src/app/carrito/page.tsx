'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, CheckCircle2, ShieldCheck, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPriceParts, getEstimatedDeliveryDate } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart, totalCount, subtotal } = useCart()

  const subtotalParts = formatPriceParts(subtotal)
  const deliveryDate = getEstimatedDeliveryDate()

  if (items.length === 0) {
    return (
      <div className="py-12 px-4 max-w-[1000px] mx-auto">
        <div className="bg-white p-8 rounded border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-16 h-16 text-[#febd69]" />
          </div>
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">Tu carrito de compras de Amazon está vacío</h1>
            <p className="text-xs text-gray-600">
              Explora nuestro catálogo de juegos de mesa, insertos organizadores 3D y accesorios para llenarlo.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/" className="btn-amazon-primary text-xs">
                Descubrir Juegos de Mesa
              </Link>
              <Link href="/categoria/insertos" className="btn-amazon-white text-xs">
                Ver Insertos 3D
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 px-4 max-w-[1500px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cart Items List (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
          {/* Header */}
          <div className="flex items-baseline justify-between pb-3 border-b border-gray-200 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Carrito de compras</h1>
            <span className="text-xs text-gray-500">Precio</span>
          </div>

          {/* Free Shipping Alert */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 mb-4 flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>¡Calificas para Envío RÁPIDO!</strong> Entrega programada para el{' '}
              <strong>{deliveryDate}</strong>.
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-200">
            {items.map((item) => {
              const itemPrice = formatPriceParts(item.precio)
              return (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <Link
                    href={`/producto/${item.id}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded border border-gray-200 shrink-0 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/producto/${item.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-[#c7511f] hover:underline leading-snug line-clamp-2"
                        >
                          {item.nombre}
                        </Link>
                        <div className="text-base font-bold text-gray-900 shrink-0">
                          {itemPrice.full}
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        En Stock
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Categoría: {item.categoria || 'Juegos de Mesa'}
                      </div>
                    </div>

                    {/* Actions: Quantity & Remove */}
                    <div className="flex items-center gap-4 text-xs pt-2">
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded px-2 py-0.5">
                        <span className="text-gray-600 font-medium">Cant:</span>
                        <select
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="bg-transparent font-bold outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-gray-300">|</span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Subtotal bottom */}
          <div className="text-right pt-4 border-t border-gray-200 text-sm">
            Subtotal ({totalCount} productos):{' '}
            <strong className="text-base text-gray-900 font-bold">{subtotalParts.full}</strong>
          </div>
        </div>

        {/* Right: Checkout Summary Box (4 cols on lg) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tu pedido califica para envío rápido a domicilio.</span>
            </div>

            <div className="text-base text-gray-900">
              Subtotal ({totalCount} {totalCount === 1 ? 'producto' : 'productos'}):{' '}
              <span className="text-xl font-black text-gray-900">{subtotalParts.full}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-amazon-primary py-3 text-sm font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <span>Proceder al pago</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-500 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantía de Satisfacción 100%</span>
              </div>
              <p>Aceptamos Yape, Plin, Transferencias y Tarjetas con total seguridad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
