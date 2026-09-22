'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Lock, ShieldCheck, Check, ShoppingCart, Zap } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPriceParts, getEstimatedDeliveryDate } from '@/lib/utils'

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
    <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-xs flex flex-col gap-4 text-xs text-[#0f1111] select-none sticky top-20">
      {/* Price Header */}
      <div className="flex items-baseline gap-1">
        <span className="text-xs text-gray-900 font-semibold relative top-[-6px]">
          {priceParts.symbol}
        </span>
        <span className="text-2xl font-bold text-gray-900 leading-none">
          {priceParts.integer}
        </span>
        <span className="text-xs text-gray-900 font-semibold relative top-[-6px]">
          {priceParts.decimal}
        </span>
      </div>

      {/* Fast Delivery Info */}
      <div className="space-y-1 text-gray-700">
        <div className="flex items-center gap-1.5 text-[#007185] font-bold text-xs">
          <Check className="w-4 h-4 text-[#e47911] stroke-[3]" />
          <span>Entrega RÁPIDA con Seguimiento</span>
        </div>
        <p>
          Entrega estimada: <span className="font-bold text-gray-900">{deliveryDate}</span>
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-[#007185] hover:text-[#c7511f] cursor-pointer">
        <MapPin className="w-4 h-4 text-gray-700" />
        <span className="font-medium">Enviar a Lima, Perú</span>
      </div>

      {/* In Stock Badge */}
      <div className="text-emerald-700 font-bold text-sm">
        Disponible en Stock
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
          className="border border-gray-300 rounded-md bg-gray-50 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs font-medium cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Amazon Yellow & Orange Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={handleAddToCart}
          className="w-full btn-amazon-primary py-2.5 shadow-xs font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Agregar al Carrito
        </button>

        <button
          onClick={handleBuyNow}
          className="w-full btn-amazon-secondary py-2.5 shadow-xs font-semibold flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Comprar Ahora
        </button>
      </div>

      {/* Security & Seller Details */}
      <div className="border-t border-gray-200 pt-3 space-y-2 text-[11px] text-gray-600">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Lock className="w-3.5 h-3.5 text-gray-500" />
          <span>Transacción 100% Segura</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-gray-500">
          <span>Enviado por:</span>
          <span className="text-gray-900 font-medium">Juegos de Mesa Express</span>
          <span>Vendido por:</span>
          <span className="text-gray-900 font-medium">NOVA Board Games</span>
          <span>Devolución:</span>
          <span className="text-gray-900 font-medium">30 días de garantía</span>
        </div>
      </div>
    </div>
  )
}
