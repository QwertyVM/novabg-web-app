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
  const isEnOferta = product.enOferta && (product.precioOferta != null || (product.porcentajeDescuento ?? 0) > 0)
  const finalPrice = isEnOferta
    ? (product.precioOferta != null && product.precioOferta > 0
        ? product.precioOferta
        : Number((product.precioMercado * (1 - (product.porcentajeDescuento || 15) / 100)).toFixed(2)))
    : product.precioMercado

  const { integer, cents } = formatPriceParts(finalPrice)
  const { integer: origInt, cents: origCents } = formatPriceParts(product.precioMercado)
  const isFreeShipping = finalPrice >= 35
  const installmentValue = (finalPrice / 3).toFixed(2)

  // Stock status
  const isControlledStock = product.controlarStock === true
  const isOutOfStock = isControlledStock && (product.stock ?? 0) <= 0
  const isLowStock = isControlledStock && (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 3

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-gray-300 transition-all duration-200 group relative select-none">
      {/* Top badges (Promo & Favorite) */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {isEnOferta && (
          <span className="bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1 uppercase tracking-wider">
            <Flame className="w-3 h-3 fill-white" />
            <span>{product.badgePromocion || `${product.porcentajeDescuento || 15}% OFF`}</span>
          </span>
        )}
        {product.isBestSeller && !isEnOferta && (
          <span className="bg-[#ff9900] text-[#191919] font-black text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
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
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white shadow-xs transition-colors cursor-pointer"
        title="Guardar en favoritos"
        aria-label="Favorito"
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'
          }`}
        />
      </button>

      {/* Product Image & Link */}
      <Link href={`/producto/${product.id}`} className="block overflow-hidden relative">
        <div className="w-full aspect-square bg-[#f8fafc] flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-102 transition-transform duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imagen}
            alt={product.nombreModelo}
            className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xs"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Agotado
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category Tag */}
          <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1 line-clamp-1">
            {product.lineaCategoria || 'Juegos de Mesa'}
          </div>

          {/* Title */}
          <Link href={`/producto/${product.id}`}>
            <h3 className="text-xs sm:text-sm font-normal text-gray-800 line-clamp-2 hover:text-[#0066ff] transition-colors leading-snug">
              {product.nombreModelo}
            </h3>
          </Link>
        </div>

        <div>
          {/* Pricing with Strike-through if on offer */}
          {isEnOferta && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 line-through -mb-0.5">
              <span>S/ {origInt}.{origCents}</span>
            </div>
          )}

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs text-gray-900 font-medium">S/</span>
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight leading-none ${
                isEnOferta ? 'text-amber-600' : 'text-gray-900'
              }`}
            >
              {integer}
            </span>
            <span
              className={`text-[10px] font-bold self-start leading-none -ml-0.5 ${
                isEnOferta ? 'text-amber-600' : 'text-gray-900'
              }`}
            >
              {cents}
            </span>
          </div>

          {/* Installment Info */}
          <p className="text-[11px] text-[#00a650] font-medium mt-1">
            en <span className="font-bold">3x S/ {installmentValue}</span> sin interés
          </p>

          {/* Stock Indicator */}
          {isControlledStock ? (
            <div className="mt-1.5">
              {isOutOfStock ? (
                <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Sin stock disponible</span>
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] text-amber-700 font-bold">
                  🔥 ¡Solo quedan {product.stock} unidades!
                </span>
              ) : (
                <span className="text-[10px] text-emerald-700 font-medium">
                  En stock ({product.stock} disponibles)
                </span>
              )}
            </div>
          ) : (
            /* Shipping & FULL Badge */
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs font-semibold text-gray-700">Envíos a todo el Perú</span>
              <div className="flex items-center gap-0.5 text-[#0066ff] font-black text-[10px] bg-blue-50 px-1.5 py-0.5 rounded">
                <Zap className="w-3 h-3 fill-[#0066ff]" />
                <span>FULL</span>
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-500">
            <div className="flex text-[#ff9900]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i <= Math.floor(product.rating || 5)
                      ? 'fill-current text-[#ff9900]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700 ml-0.5">
              {product.rating?.toFixed(1) || '4.8'}
            </span>
            <span className="text-gray-400">({product.reviewsCount || 24})</span>
          </div>
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
          className={`w-full text-xs py-2 mt-1 shadow-2xs font-semibold cursor-pointer rounded-lg border transition-all ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'btn-nova-outline hover:bg-blue-50'
          }`}
        >
          {isOutOfStock ? 'Agotado temporalmente' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}

