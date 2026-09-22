'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ShieldCheck, RotateCcw, Zap, ShoppingCart, Award } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPriceParts, getEstimatedDeliveryDate } from '@/lib/utils'
import { toast } from 'sonner'

interface BuyBoxProps {
  product: {
    id: string
    nombreModelo: string
    precioMercado: number
    lineaCategoria: string
    imagen?: string
  }
}

export function BuyBox({ product }: BuyBoxProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [cantidad, setCantidad] = useState(1)

  const priceParts = formatPriceParts(product.precioMercado)
  const deliveryDate = getEstimatedDeliveryDate()
  const installment12x = (Number(product.precioMercado) / 12).toFixed(2)

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        nombre: product.nombreModelo,
        precio: Number(product.precioMercado),
        imagen: product.imagen,
        categoria: product.lineaCategoria,
      },
      cantidad
    )
    toast.success(`Se agregaron ${cantidad} unidad(es) al carrito`)
  }

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        nombre: product.nombreModelo,
        precio: Number(product.precioMercado),
        imagen: product.imagen,
        categoria: product.lineaCategoria,
      },
      cantidad
    )
    router.push('/checkout')
  }

  return (
    <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex flex-col gap-4 text-xs text-[#191919] select-none sticky top-20">
      {/* Shipping details (Mercado Libre Style) */}
      <div className="space-y-1.5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-sm font-bold text-[#00a650]">
          <Zap className="w-4 h-4 fill-[#00a650]" />
          <span>Llega gratis mañana</span>
          <span className="bg-[#00a650] text-white text-[9px] px-1 rounded-xs font-black italic">
            FULL
          </span>
        </div>
        <p className="text-gray-500 text-[11px]">
          Comprando dentro de las próximas 4 h 30 min
        </p>
        <div className="flex items-center gap-1 text-[#0066ff] hover:underline cursor-pointer pt-0.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[11px]">Enviar a Lima, Perú</span>
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <span className="text-sm font-bold text-gray-900 block mb-0.5">
          ¡Stock disponible!
        </span>
        <span className="text-[11px] text-gray-500">
          Almacenado en el centro de distribución NOVA BG
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="font-bold text-gray-700">
          Cantidad:
        </label>
        <select
          id="quantity"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="border border-gray-300 rounded-lg bg-gray-50/70 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#0066ff]/20 font-bold text-gray-900 cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'unidad' : 'unidades'}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-gray-400">(+50 disponibles)</span>
      </div>

      {/* CTAs (Mercado Libre Style) */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={handleBuyNow}
          className="w-full btn-nova-primary py-3 font-bold text-sm shadow-xs flex items-center justify-center gap-2"
        >
          Comprar ahora
        </button>

        <button
          onClick={handleAddToCart}
          className="w-full btn-nova-secondary py-3 font-bold text-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Agregar al carrito
        </button>
      </div>

      {/* Official Store Badge & Guarantees */}
      <div className="border-t border-gray-100 pt-4 space-y-3 text-[11px] text-gray-600">
        {/* Seller Info */}
        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/60 flex items-start gap-2.5">
          <Award className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900">
              Vendido por <span className="text-[#0066ff]">NOVA BG</span>
            </p>
            <p className="text-gray-500 text-[10px]">
              Tienda Oficial • MercadoLíder Platinum • 100% de opiniones positivas
            </p>
          </div>
        </div>

        {/* Compra Protegida */}
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-800">Compra Protegida</span>
            <p className="text-gray-500">Recibe el producto que esperabas o te devolvemos tu dinero.</p>
          </div>
        </div>

        {/* Devolución */}
        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-800">Devolución gratis</span>
            <p className="text-gray-500">Tienes 30 días desde que lo recibes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
