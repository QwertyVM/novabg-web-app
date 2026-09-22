'use client'

import React from 'react'
import Link from 'next/link'
import {
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Zap,
  Dice5,
  Layers,
} from 'lucide-react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'

interface DashboardCardsProps {
  categories?: NovaCategory[]
}

export function DashboardCards({ categories = [] }: DashboardCardsProps) {
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
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#00a650] flex items-center justify-center shrink-0 border border-emerald-100">
              <Zap className="w-5 h-5 fill-[#00a650]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Envío Gratis FULL
              </p>
              <p className="text-[11px] text-[#00a650] font-semibold">Despacho en 24h</p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Compra Protegida
              </p>
              <p className="text-[11px] text-gray-500">Garantía oficial NOVA BG</p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="w-10 h-10 rounded-full bg-cyan-50 text-[#0084ff] flex items-center justify-center shrink-0 border border-cyan-100">
              <Dice5 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Juegos Oficiales
              </p>
              <p className="text-[11px] text-gray-500">Catálogo certificado NOVA BG</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Quick-Access (Rendered Dynamically from NOVA BG) */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
              Categorías de NOVA BG
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
                <div>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-[#0066ff] leading-tight">
                    {cat.nombre}
                  </p>
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
