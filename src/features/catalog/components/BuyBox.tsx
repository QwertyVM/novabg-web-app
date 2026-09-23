'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  Check,
  CreditCard,
  Truck,
} from 'lucide-react'
import { useCart } from '@/features/cart/context/CartContext'
import { formatPriceParts, getEstimatedDeliveryDate } from '@/shared/utils/utils'
import { ProductItem } from '../types/catalog.types'

interface BuyBoxProps {
  product: ProductItem
}

export function BuyBox({ product }: BuyBoxProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Calculate effective price
  let tempPrice = product.precioMercado
  let calculatedDiscount = product.porcentajeDescuento

  if (product.enOferta) {
    if (product.precioOferta != null && product.precioOferta > 0) {
      tempPrice = product.precioOferta
      if (!calculatedDiscount && tempPrice < product.precioMercado) {
        calculatedDiscount = Math.round((1 - tempPrice / product.precioMercado) * 100)
      }
    } else {
      calculatedDiscount = calculatedDiscount || 15
      tempPrice = Number((product.precioMercado * (1 - calculatedDiscount / 100)).toFixed(2))
    }
  }

  const isEnOferta = product.enOferta && tempPrice < product.precioMercado
  const finalPrice = isEnOferta ? tempPrice : product.precioMercado
  const displayDiscount = product.badgePromocion || `${calculatedDiscount || 15}% OFF`

  const { integer, cents } = formatPriceParts(finalPrice)
  const { integer: origInt, cents: origCents } = formatPriceParts(product.precioMercado)

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
    <div className="bg-white rounded-3xl border border-[#EBE5DF] p-5 sm:p-6 shadow-sm space-y-4 text-[#2B231F] select-none">
      {/* Price Header */}
      <div>
        {isEnOferta && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#6E655F] line-through">
              S/ {origInt}.{origCents}
            </span>
            <span className="text-[10px] font-black bg-[#FDF4EE] text-[#C85A32] border border-[#C85A32]/30 px-2 py-0.5 rounded-md">
              {displayDiscount}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-[#2B231F]">S/</span>
          <span
            className={`text-3xl font-black tracking-tight leading-none ${
              isEnOferta ? 'text-[#C85A32]' : 'text-[#2B231F]'
            }`}
          >
            {integer}
          </span>
          <span
            className={`text-xs font-black self-start leading-none -ml-0.5 ${
              isEnOferta ? 'text-[#C85A32]' : 'text-[#2B231F]'
            }`}
          >
            {cents}
          </span>
        </div>
      </div>

      {/* Shipping Box */}
      <div className="p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#C85A32]">
          <Truck className="w-4 h-4 text-[#C85A32]" />
          <span>Enviamos a todo el país</span>
        </div>
      </div>

      {/* Stock Availability */}
      <div>
        {isOutOfStock ? (
          <p className="text-xs font-bold text-red-600 flex items-center gap-1">
            <span>Agotado temporalmente</span>
          </p>
        ) : isControlledStock ? (
          <p className="text-xs font-bold text-[#10B981] flex items-center gap-1">
            <Check className="w-4 h-4 text-[#10B981]" />
            <span>Stock disponible ({maxStock} unidades)</span>
          </p>
        ) : (
          <p className="text-xs font-bold text-[#10B981] flex items-center gap-1">
            <Check className="w-4 h-4 text-[#10B981]" />
            <span>Stock disponible</span>
          </p>
        )}
        <p className="text-[11px] text-[#6E655F] mt-0.5">
          Garantía y despacho directo desde el almacén oficial de NOVA
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3 pt-1">
        <label className="text-xs font-bold text-[#2B231F]">Cantidad:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="bg-[#FDFBF7] border border-[#EBE5DF] text-[#2B231F] text-xs rounded-xl px-3 py-1.5 outline-none font-bold cursor-pointer focus:ring-2 focus:ring-[#C85A32]/30"
        >
          {Array.from({ length: Math.min(maxStock > 0 ? maxStock : 10, 10) }, (_, i) => i + 1).map((num) => (
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
          className="w-full btn-nova-secondary text-xs py-3 shadow-2xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-[#C85A32]" />
              <span>¡Agregado al Carrito!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 text-[#C85A32]" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>

      <hr className="border-[#EBE5DF]" />

      {/* Trust & Guarantee points */}
      <div className="space-y-2.5 text-[11px] text-[#6E655F] pt-1">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#2B231F]">Compra Protegida:</strong> Recibe el producto que esperabas o te devolvemos tu dinero.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#2B231F]">Garantía oficial:</strong> Cobertura de 30 días de satisfacción NOVA.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <CreditCard className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#231C18]">Medios de pago:</strong> Yape, Plin y Transferencias bancarias.
          </p>
        </div>
      </div>
    </div>
  )
}
