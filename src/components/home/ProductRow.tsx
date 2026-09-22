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
      const scrollAmount = direction === 'left' ? -600 : 600
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!products || products.length === 0) return null

  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200 mb-6 relative select-none">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
          >
            Ver más &rarr;
          </Link>
        )}
      </div>

      {/* Navigation Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-white/90 hover:bg-white text-gray-800 border border-gray-300 rounded shadow-md flex items-center justify-center transition-all cursor-pointer"
        aria-label="Desplazar a la izquierda"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Product List Container */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
      >
        {products.map((prod) => (
          <div key={prod.id} className="w-[230px] shrink-0">
            <ProductCard product={prod} />
          </div>
        ))}
      </div>

      {/* Navigation Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-white/90 hover:bg-white text-gray-800 border border-gray-300 rounded shadow-md flex items-center justify-center transition-all cursor-pointer"
        aria-label="Desplazar a la derecha"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
