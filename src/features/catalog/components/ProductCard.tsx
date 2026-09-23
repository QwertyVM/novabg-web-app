'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, Zap, Heart, Flame, AlertCircle } from 'lucide-react'
import { useCart } from '@/features/cart/context/CartContext'
import { formatPriceParts } from '@/shared/utils/utils'
import { ProductItem } from '../types/catalog.types'

export type { ProductItem }

interface ProductCardProps {
  product: ProductItem
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)

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
  const isOutOfStock = isControlledStock && (product.stock ?? 0) <= 0
  const isLowStock = isControlledStock && (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 3

  return (
    <div className="bg-white rounded-3xl border border-[#EBE5DF] overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#C85A32]/40 transition-all duration-200 group relative select-none">
      {/* Top badges (Promo & Favorite) */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1">
        {isEnOferta && (
          <span className="bg-[#C85A32] text-white font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1 uppercase tracking-wider">
            <Flame className="w-3 h-3 fill-white" />
            <span>{displayDiscount}</span>
          </span>
        )}
        {product.isBestSeller && !isEnOferta && (
          <span className="bg-[#F3ECE2] text-[#2B231F] border border-[#D9B89C]/60 font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-2xs uppercase tracking-wider">
            MÁS VENDIDO
          </span>
        )}
      </div>

      {/* Favorite heart button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsFavorite(!isFavorite)
        }}
        className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-[#6E655F] hover:text-[#C85A32] hover:bg-white shadow-2xs border border-[#EBE5DF] transition-colors cursor-pointer"
        title="Guardar en favoritos"
        aria-label="Favorito"
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite ? 'fill-[#C85A32] text-[#C85A32]' : 'fill-none text-[#6E655F]'
          }`}
        />
      </button>

      {/* Product Image with Generous Padding */}
      <Link href={`/producto/${product.id}`} className="block overflow-hidden relative">
        <div className="w-full aspect-square bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden group-hover:scale-102 transition-transform duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imagen}
            alt={product.nombreModelo}
            className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xs"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center">
              <span className="bg-[#2B231F] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Agotado
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category Tag */}
          <div className="text-[11px] text-[#6E655F] font-bold uppercase tracking-wider mb-1 line-clamp-1">
            {product.lineaCategoria || 'Juegos de Mesa'}
          </div>

          {/* Title in text-main */}
          <Link href={`/producto/${product.id}`}>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B231F] line-clamp-2 hover:text-[#C85A32] transition-colors leading-snug">
              {product.nombreModelo}
            </h3>
          </Link>
        </div>

        <div>
          {/* Pricing with Strike-through if on offer */}
          {isEnOferta && (
            <div className="flex items-center gap-1.5 text-xs text-[#6E655F] line-through -mb-0.5">
              <span>S/ {origInt}.{origCents}</span>
            </div>
          )}

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs text-[#2B231F] font-bold">S/</span>
            <span
              className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${
                isEnOferta ? 'text-[#C85A32]' : 'text-[#2B231F]'
              }`}
            >
              {integer}
            </span>
            <span
              className={`text-[10px] font-black self-start leading-none -ml-0.5 ${
                isEnOferta ? 'text-[#C85A32]' : 'text-[#2B231F]'
              }`}
            >
              {cents}
            </span>
          </div>



          {/* Stock Indicator */}
          {isControlledStock ? (
            <div className="mt-1.5">
              {isOutOfStock ? (
                <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Sin stock disponible</span>
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] text-[#C85A32] font-bold">
                  🔥 ¡Solo quedan {product.stock} unidades!
                </span>
              ) : (
                <span className="text-[10px] text-[#10B981] font-bold">
                  En stock ({product.stock} disponibles)
                </span>
              )}
            </div>
          ) : (
            /* Shipping & FULL Badge */
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs font-semibold text-[#6E655F]">Envíos a todo el Perú</span>
              <div className="flex items-center gap-0.5 text-[#C85A32] font-black text-[10px] bg-[#FDF4EE] border border-[#C85A32]/20 px-1.5 py-0.5 rounded">
                <Zap className="w-3 h-3 fill-[#C85A32]" />
                <span>FULL</span>
              </div>
            </div>
          )}

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-[11px] text-[#6E655F]">
              <div className="flex text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i <= Math.floor(product.rating || 5)
                        ? 'fill-current text-[#F59E0B]'
                        : 'text-[#EBE5DF]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#2B231F] ml-0.5">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[#6E655F]">({product.reviewsCount || 0})</span>
            </div>
          )}
        </div>

        {/* Quick Add To Cart Button */}
        <button
          disabled={isOutOfStock}
          onClick={() =>
            addItem({
              id: product.id,
              nombreModelo: product.nombreModelo,
              lineaCategoria: product.lineaCategoria,
              precioMercado: finalPrice,
              imagen: product.imagen,
            })
          }
          className={`w-full text-xs py-2.5 mt-1 shadow-2xs font-bold cursor-pointer rounded-xl border transition-all ${
            isOutOfStock
              ? 'bg-[#FDFBF7] text-[#6E655F] border-[#EBE5DF] cursor-not-allowed'
              : 'btn-nova-outline hover:bg-[#FDF4EE]'
          }`}
        >
          {isOutOfStock ? 'Agotado temporalmente' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
