'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  MapPin,
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  Check,
  CreditCard,
  Truck,
} from 'lucide-react'
import { useCart } from '@/features/cart/context/CartContext'
import { formatPrice, formatPriceParts, getEstimatedDeliveryDate } from '@/shared/utils/utils'
import { ProductItem } from '../types/catalog.types'

interface BuyBoxProps {
  product: ProductItem
}

export function BuyBox({ product }: BuyBoxProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Calculate effective price with discounts
  const isEnOferta = product.enOferta && (product.precioOferta != null || (product.porcentajeDescuento ?? 0) > 0)
  const finalPrice = isEnOferta
    ? (product.precioOferta != null && product.precioOferta > 0
        ? product.precioOferta
        : Number((product.precioMercado * (1 - (product.porcentajeDescuento || 15) / 100)).toFixed(2)))
    : product.precioMercado

  const { integer, cents } = formatPriceParts(finalPrice)
  const { integer: origInt, cents: origCents } = formatPriceParts(product.precioMercado)
  const isFreeShipping = finalPrice >= 35
  const estimatedDate = getEstimatedDeliveryDate()
  const installmentValue = (finalPrice / 3).toFixed(2)

  // Stock status
  const isControlledStock = product.controlarStock === true
  const maxStock = isControlledStock ? (product.stock ?? 0) : 99
  const isOutOfStock = isControlledStock && maxStock <= 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(
      {
        id: product.id,
        nombreModelo: product.nombreModelo,
        lineaCategoria: product.lineaCategoria,
        precioMercado: finalPrice,
        imagen: product.imagen,
      },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    addItem(
      {
        id: product.id,
        nombreModelo: product.nombreModelo,
        lineaCategoria: product.lineaCategoria,
        precioMercado: finalPrice,
        imagen: product.imagen,
      },
      quantity
    )
    router.push('/checkout')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4 text-[#191919] select-none">
      {/* Price Header */}
      <div>
        {isEnOferta && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 line-through">
              S/ {origInt}.{origCents}
            </span>
            <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
              {product.badgePromocion || `${product.porcentajeDescuento || 15}% OFF`}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-gray-800">S/</span>
          <span
            className={`text-3xl font-extrabold tracking-tight leading-none ${
              isEnOferta ? 'text-amber-600' : 'text-gray-900'
            }`}
          >
            {integer}
          </span>
          <span
            className={`text-xs font-bold self-start leading-none -ml-0.5 ${
              isEnOferta ? 'text-amber-600' : 'text-gray-900'
            }`}
          >
            {cents}
          </span>
        </div>
        <p className="text-xs text-[#00a650] font-medium mt-1">
          en <span className="font-bold">3 cuotas de S/ {installmentValue}</span> sin interés
        </p>
      </div>

      {/* Shipping & Delivery Box */}
      <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-[#0066ff]">
          <Truck className="w-4 h-4 text-[#0066ff]" />
          <span>Envíos a Nivel Nacional</span>
        </div>
        <p className="text-gray-700 text-[11px] leading-snug">
          Llega estimado el <strong className="text-gray-900">{estimatedDate}</strong> (Lima y Provincias)
        </p>
        <div className="flex items-center gap-1 text-[11px] text-[#0066ff] hover:underline cursor-pointer">
          <MapPin className="w-3 h-3 text-[#0066ff]" />
          <span>Enviar a Lima, Perú</span>
        </div>
      </div>

        {/* Stock Availability */}
        <div>
          {isOutOfStock ? (
            <p className="text-xs font-bold text-red-600 flex items-center gap-1">
              <span>Agotado temporalmente</span>
            </p>
          ) : isControlledStock ? (
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Stock disponible ({maxStock} unidades)</span>
            </p>
          ) : (
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Stock disponible</span>
            </p>
          )}
          <p className="text-[11px] text-gray-500 mt-0.5">
            Garantía y despacho directo desde el almacén oficial de NOVA
          </p>
        </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3 pt-1">
        <label className="text-xs font-semibold text-gray-700">Cantidad:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg px-2.5 py-1.5 outline-none font-semibold cursor-pointer focus:ring-2 focus:ring-[#0066ff]"
        >
          {[1, 2, 3, 4, 5, 10].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'unidad' : 'unidades'}
            </option>
          ))}
        </select>
      </div>

      {/* CTA Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleBuyNow}
          className="w-full btn-nova-primary text-xs py-3 shadow-xs font-bold cursor-pointer"
        >
          Comprar ahora
        </button>

        <button
          onClick={handleAddToCart}
          className="w-full btn-nova-secondary text-xs py-3 shadow-2xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-[#0066ff]" />
              <span>¡Agregado al Carrito!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 text-[#0066ff]" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Trust & Guarantee points */}
      <div className="space-y-2.5 text-[11px] text-gray-500 pt-1">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-800">Compra Protegida:</strong> Recibe el producto que esperabas o te devolvemos tu dinero.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-800">Garantía oficial:</strong> Cobertura de 30 días de satisfacción NOVA BG.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <CreditCard className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-800">Medios de pago:</strong> Yape, Plin, Tarjetas y Transferencias bancarias.
          </p>
        </div>
      </div>
    </div>
  )
}
