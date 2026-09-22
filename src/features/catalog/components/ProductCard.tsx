'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, Zap, Heart } from 'lucide-react'
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

  const { integer, cents } = formatPriceParts(product.precioMercado)
  const isFreeShipping = product.precioMercado >= 35
  const installmentValue = (product.precioMercado / 3).toFixed(2)

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-gray-300 transition-all duration-200 group relative select-none">
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
          {/* Mercado Libre Style Pricing */}
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-gray-900 font-medium">S/</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none">
              {integer}
            </span>
            <span className="text-[10px] font-bold text-gray-900 self-start leading-none -ml-0.5">
              {cents}
            </span>
          </div>

          {/* Installment Info */}
          <p className="text-[11px] text-[#00a650] font-medium mt-1">
            en <span className="font-bold">3x S/ {installmentValue}</span> sin interés
          </p>

          {/* Shipping & FULL Badge */}
          <div className="flex items-center gap-1.5 mt-2">
            {isFreeShipping ? (
              <span className="text-xs font-bold text-[#00a650]">Envío gratis</span>
            ) : (
              <span className="text-xs text-gray-500">Envío regular</span>
            )}
            <div className="flex items-center gap-0.5 text-[#00a650] font-black text-[10px] bg-emerald-50 px-1 py-0.5 rounded">
              <Zap className="w-3 h-3 fill-[#00a650]" />
              <span>FULL</span>
            </div>
          </div>

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
          onClick={() =>
            addItem({
              id: product.id,
              nombreModelo: product.nombreModelo,
              lineaCategoria: product.lineaCategoria,
              precioMercado: product.precioMercado,
              imagen: product.imagen,
            })
          }
          className="w-full btn-nova-outline text-xs py-2 mt-1 shadow-2xs font-semibold cursor-pointer"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}
