'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Check, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/lib/utils'

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

  const priceParts = formatPriceParts(product.precioMercado)
  const imageSrc = product.imagen || getProductImage(product.nombreModelo, product.lineaCategoria)
  const rating = product.rating || 4.8
  const reviewsCount = product.reviewsCount || Math.floor((product.nombreModelo.length * 7) % 150) + 12
  const deliveryDate = getEstimatedDeliveryDate()

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
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="bg-[#e67a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-r-sm shadow-xs uppercase tracking-wider">
            Más Vendido
          </span>
        )}
        {product.isAmazonChoice && !product.isBestSeller && (
          <span className="bg-[#0f1111] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs">
            <span className="text-[#febd69]">Opción</span> Amazon
          </span>
        )}
      </div>

      <div>
        {/* Product Image */}
        <Link
          href={`/producto/${product.id}`}
          className="block relative w-full aspect-square mb-3 overflow-hidden bg-gray-50 flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={product.nombreModelo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Category Tag */}
        <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">
          {product.lineaCategoria}
        </span>

        {/* Title */}
        <Link
          href={`/producto/${product.id}`}
          className="text-sm font-medium text-[#0f1111] hover:text-[#c7511f] line-clamp-2 leading-snug mb-1.5"
          title={product.nombreModelo}
        >
          {product.nombreModelo}
        </Link>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center text-[#de7921]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-current text-[#de7921]"
              />
            ))}
          </div>
          <span className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium">
            {reviewsCount}
          </span>
        </div>

        {/* Amazon Price Display */}
        <div className="flex items-baseline gap-1 mb-1.5">
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

        {/* Prime Fast Delivery Tag */}
        <div className="text-[11px] text-gray-600 mb-3 space-y-0.5">
          <div className="flex items-center gap-1 text-[#007185] font-bold">
            <Check className="w-3.5 h-3.5 text-[#e47911] stroke-[3]" />
            <span>Envío Rápido</span>
          </div>
          <div>
            Llega gratis el <span className="font-bold text-gray-800">{deliveryDate}</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-2 border-t border-gray-100 mt-2">
        <button
          onClick={handleAddToCart}
          className="w-full btn-amazon-primary text-xs py-1.5 flex items-center justify-center gap-1.5 font-medium shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Agregar al Carrito
        </button>
      </div>
    </div>
  )
}
