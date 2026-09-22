'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard, ProductItem } from '@/components/product/ProductCard'

interface ProductRowProps {
  title: string
  subtitle?: string
  viewAllLink?: string
  products: ProductItem[]
}

export function ProductRow({ title, subtitle, viewAllLink, products }: ProductRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -650 : 650
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!products || products.length === 0) return null

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-200/80 mb-6 relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-[#0066ff] hover:text-[#0052cc] hover:underline flex items-center gap-0.5"
          >
            <span>Ver más</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Navigation Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white text-gray-700 hover:text-[#0066ff] border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Desplazar a la izquierda"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Product List Container */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
      >
        {products.map((prod) => (
          <div key={prod.id} className="w-[220px] sm:w-[240px] shrink-0">
            <ProductCard product={prod} />
          </div>
        ))}
      </div>

      {/* Navigation Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white text-gray-700 hover:text-[#0066ff] border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Desplazar a la derecha"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
