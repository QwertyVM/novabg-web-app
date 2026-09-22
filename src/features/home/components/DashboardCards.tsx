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
    <div className="px-4 max-w-[1400px] mx-auto -mt-6 sm:-mt-10 relative z-20 space-y-6 mb-8">
      {/* 1. Benefits Bar Strip */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4 sm:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Benefit 1 */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Paga a tu manera
              </p>
              <p className="text-[11px] text-gray-500">Yape, Plin o Tarjetas</p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <Truck className="w-5 h-5 text-[#0066ff]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Envíos a todo el Perú
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Lima y Provincias (Olva / Shalom)</p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                {warrantyDays} días de garantía
              </p>
              <p className="text-[11px] text-gray-500">Garantía oficial {storeName}</p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-full bg-cyan-50 text-[#0084ff] flex items-center justify-center shrink-0 border border-cyan-100">
              <Dice5 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Catálogo Certificado
              </p>
              <p className="text-[11px] text-gray-500">Calidad garantizada {storeName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Quick-Access (Rendered Dynamically) */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
              Categorías de {storeName}
            </h2>
            <Link
              href="/categoria/todos"
              className="text-xs text-[#0066ff] hover:underline font-semibold flex items-center gap-1"
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
                className="group p-3 rounded-lg border border-gray-100 hover:border-[#0066ff]/40 bg-gray-50/50 hover:bg-blue-50/30 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#0066ff] leading-tight truncate">
                      {cat.nombre}
                    </p>
                    {cat.badgeWeb && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1 rounded">
                        {cat.badgeWeb}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500">Ver artículos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

