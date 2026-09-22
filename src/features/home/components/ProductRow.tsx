'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ChevronRight as ArrowIcon } from 'lucide-react'
import { ProductCard } from '@/features/catalog/components/ProductCard'
import { ProductItem } from '@/features/catalog/types/catalog.types'

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
      const scrollAmount = direction === 'left' ? -380 : 380
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (products.length === 0) return null

  return (
    <div className="bg-white rounded-3xl border border-[#EBE5DF] p-5 sm:p-6 shadow-sm relative group select-none">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#2B231F] tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs text-[#6E655F] mt-0.5">{subtitle}</p>}
        </div>

        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-[#C85A32] hover:text-[#A64724] hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>Ver todo</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Scroll Controls (Desktop) */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white hover:bg-[#FDFBF7] text-[#2B231F] hover:text-[#C85A32] rounded-full shadow-md border border-[#EBE5DF] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white hover:bg-[#FDFBF7] text-[#2B231F] hover:text-[#C85A32] rounded-full shadow-md border border-[#EBE5DF] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Product List Horizontal Container */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
