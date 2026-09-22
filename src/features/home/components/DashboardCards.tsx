'use client'

import React from 'react'
import Link from 'next/link'
import {
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Truck,
  Dice5,
  Layers,
} from 'lucide-react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { StorePublicConfig } from '@/features/catalog/services/store-config.service'

interface DashboardCardsProps {
  categories?: NovaCategory[]
  storeConfig?: StorePublicConfig
  section?: 'BG' | '3D'
}

export function DashboardCards({
  categories = [],
  storeConfig,
  section = 'BG',
}: DashboardCardsProps) {
  const storeName = storeConfig?.nombreTienda || (section === '3D' ? 'NOVA 3D' : 'NOVA BG')
  const warrantyDays = storeConfig?.diasGarantia || 30

  return (
    <div className="px-4 max-w-[1400px] mx-auto relative z-20 space-y-6 mb-12 select-none pt-4">
      {/* 2. Category Quick-Access in Surface Clean White */}
      {categories.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-[#EBE5DF] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#2B231F] uppercase tracking-wider text-xs">
              Categorías de {storeName}
            </h2>
            <Link
              href="/categoria/todos"
              className="text-xs text-[#C85A32] hover:text-[#A64724] hover:underline font-bold flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group p-3.5 rounded-2xl border border-[#EBE5DF] hover:border-[#C85A32]/40 bg-[#FDFBF7] hover:bg-[#FDF4EE] transition-all flex items-center gap-3 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#C85A32] border border-[#EBE5DF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-[#2B231F] group-hover:text-[#C85A32] leading-tight truncate">
                      {cat.nombre}
                    </p>
                    {cat.badgeWeb && (
                      <span className="text-[9px] font-black bg-[#F3ECE2] text-[#2B231F] border border-[#D9B89C]/50 px-1 rounded">
                        {cat.badgeWeb}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#6E655F]">Ver artículos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
