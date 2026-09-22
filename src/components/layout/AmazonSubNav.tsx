'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, Zap, Flame } from 'lucide-react'
import { NovaCategory } from '@/actions/categories'

interface AmazonSubNavProps {
  onOpenDrawer: () => void
  categories?: NovaCategory[]
}

export function AmazonSubNav({ onOpenDrawer, categories = [] }: AmazonSubNavProps) {
  return (
    <div className="bg-[#0f172a] text-white text-xs px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar md:hidden">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1 font-semibold text-white/90 hover:text-white shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Menú</span>
        </button>

        <div className="h-4 w-px bg-white/20 shrink-0"></div>

        {categories.slice(0, 3).map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="text-white/80 hover:text-white shrink-0"
          >
            {cat.nombre}
          </Link>
        ))}

        <Link
          href="/categoria/ofertas"
          className="flex items-center gap-1 text-[#00d2ff] font-semibold shrink-0"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Ofertas</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-[#00d2ff] font-bold shrink-0 ml-2">
        <Zap className="w-3 h-3 fill-[#00d2ff]" />
        <span>FULL 24h</span>
      </div>
    </div>
  )
}
