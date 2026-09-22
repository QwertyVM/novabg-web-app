'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, Zap, Flame } from 'lucide-react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'

interface StoreSubNavProps {
  onOpenDrawer: () => void
  categories?: NovaCategory[]
}

export function StoreSubNav({ onOpenDrawer, categories = [] }: StoreSubNavProps) {
  return (
    <div className="bg-[#FAF6F0] text-[#2B231F] text-xs px-4 py-2.5 flex items-center justify-between overflow-x-auto no-scrollbar md:hidden border-b border-[#EBE5DF]">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1 font-bold text-[#2B231F] hover:text-[#C85A32] shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Menú</span>
        </button>

        <div className="h-4 w-px bg-[#EBE5DF] shrink-0"></div>

        {categories.slice(0, 3).map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="text-[#6E655F] hover:text-[#2B231F] font-semibold shrink-0"
          >
            {cat.nombre}
          </Link>
        ))}


      </div>

      <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-bold shrink-0 ml-2 bg-[#ECFDF5] border border-[#10B981]/20 px-2 py-0.5 rounded-full">
        <Zap className="w-3 h-3 fill-[#10B981]" />
        <span>Despacho Seguro</span>
      </div>
    </div>
  )
}
