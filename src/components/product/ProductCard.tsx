'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, Zap, Star, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/lib/utils'
import { toast } from 'sonner'

export interface ProductItem {
  id: string
  nombreModelo: string
  lineaCategoria: string
  precioMercado: number
  precioAmigos?: number
  costoBase?: number
  pesoGramos?: number
  activo?: boolean
  imagen?: string
  rating?: number
  reviewsCount?: number
  isBestSeller?: boolean
  isAmazonChoice?: boolean
}

interface ProductCardProps {
  product: ProductItem
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [added, setAdded] = useState(false)

  const priceParts = formatPriceParts(product.precioMercado)
  const imageSrc = product.imagen || getProductImage(product.nombreModelo, product.lineaCategoria)
  const rating = product.rating || 4.8
  const reviewsCount = product.reviewsCount || Math.floor((product.nombreModelo.length * 7) % 150) + 12
  const deliveryDate = getEstimatedDeliveryDate()

  // Fake discount for Mercado Libre style price drop
  const originalPrice = (Number(product.precioMercado) * 1.2).toFixed(2)
  const installment12x = (Number(product.precioMercado) / 12).toFixed(2)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      nombre: product.nombreModelo,
      precio: Number(product.precioMercado),
      imagen: imageSrc,
      categoria: product.lineaCategoria,
    })
    setAdded(true)
    toast.success(`${product.nombreModelo} agregado al carrito`)
    setTimeout(() => setAdded(false), 1800)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    toast(isFavorite ? 'Eliminado de tus favoritos' : 'Guardado en tus favoritos', {
      icon: isFavorite ? '💔' : '❤️',
    })
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg hover:border-gray-300 transition-all duration-200 relative group h-full select-none">
      {/* Top action: Favorite button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-xs border border-gray-100 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
        aria-label="Agregar a favoritos"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        />
      </button>

      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="bg-[#0f172a] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            MÁS VENDIDO
          </span>
        )}
      </div>

      <div>
        {/* Product Image */}
        <Link
          href={`/producto/${product.id}`}
          className="block relative w-full aspect-square mb-3 overflow-hidden bg-[#fafafa] rounded-lg flex items-center justify-center p-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={product.nombreModelo}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Category Tag */}
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
          {product.lineaCategoria || 'Juegos de Mesa'}
        </span>

        {/* Title */}
        <Link
          href={`/producto/${product.id}`}
          className="text-xs sm:text-sm font-semibold text-[#191919] hover:text-[#0066ff] line-clamp-2 leading-snug mb-2 block min-h-[36px]"
          title={product.nombreModelo}
        >
          {product.nombreModelo}
        </Link>

        {/* Price Section (Mercado Libre Style) */}
        <div className="space-y-0.5 mb-2">
          {/* Original price with discount */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 line-through">
              S/ {originalPrice}
            </span>
            <span className="text-xs font-bold text-[#00a650]">
              20% OFF
            </span>
          </div>

          {/* Current Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-[#191919]">S/</span>
            <span className="text-2xl font-black text-[#191919] tracking-tight">
              {priceParts.integer}
            </span>
            <span className="text-xs font-bold text-[#191919] relative top-[-6px]">
              {priceParts.decimal}
            </span>
          </div>

          {/* Installment note */}
          <p className="text-[11px] text-gray-600 font-medium">
            en <span className="text-[#00a650] font-bold">12x S/ {installment12x}</span> sin interés
          </p>
        </div>

        {/* Mercado Libre FULL & Free Shipping Badges */}
        <div className="space-y-1 mb-3 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00a650]">
            <Zap className="w-3.5 h-3.5 fill-[#00a650]" />
            <span>Envío gratis</span>
            <span className="bg-[#00a650] text-white text-[9px] px-1 py-0.2 rounded-xs font-black italic tracking-tighter">
              FULL
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Llega gratis <span className="font-semibold text-gray-700">mañana</span>
          </p>
        </div>

        {/* Reviews */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <div className="flex items-center text-[#ff9900]">
            <Star className="w-3.5 h-3.5 fill-current text-[#ff9900]" />
          </div>
          <span className="font-bold text-gray-800 text-[11px]">{rating.toFixed(1)}</span>
          <span className="text-[11px] text-gray-400">({reviewsCount})</span>
        </div>
      </div>

      {/* Quick Add to Cart Button */}
      <div className="pt-2">
        <button
          onClick={handleAddToCart}
          className={`w-full text-xs py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-50 hover:bg-[#0066ff] text-[#0066ff] hover:text-white border border-blue-100 hover:border-[#0066ff]'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
