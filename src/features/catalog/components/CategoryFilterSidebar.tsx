'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronRight, Star, ArrowUpDown, X } from 'lucide-react'

export interface CategoryOption {
  id: string
  nombre: string
  slug: string | null
}

interface CategoryFilterSidebarProps {
  categories: CategoryOption[]
  activeSlug: string
  targetNegocio: string
  hasRatings: boolean
  currentMinPrice?: number
  currentMaxPrice?: number
  currentOrden?: string
  currentStars?: number
}

export function CategoryFilterSidebar({
  categories,
  activeSlug,
  targetNegocio,
  hasRatings,
  currentMinPrice,
  currentMaxPrice,
  currentOrden = 'relevantes',
  currentStars,
}: CategoryFilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minInput, setMinInput] = useState<string>(
    currentMinPrice !== undefined ? String(currentMinPrice) : ''
  )
  const [maxInput, setMaxInput] = useState<string>(
    currentMaxPrice !== undefined ? String(currentMaxPrice) : ''
  )

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value.trim() !== '') {
      params.set(key, value.trim())
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (minInput && !isNaN(Number(minInput))) {
      params.set('min', minInput.trim())
    } else {
      params.delete('min')
    }

    if (maxInput && !isNaN(Number(maxInput))) {
      params.set('max', maxInput.trim())
    } else {
      params.delete('max')
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearPrice = () => {
    setMinInput('')
    setMaxInput('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('min')
    params.delete('max')
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasActivePriceFilter =
    currentMinPrice !== undefined || currentMaxPrice !== undefined

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EBE5DF] space-y-6 text-xs text-[#2B231F] h-fit shadow-sm">
      {/* 1. Categorías Dinámicas */}
      <div>
        <h3 className="font-black text-sm mb-3 text-[#2B231F]">
          Categorías NOVA {targetNegocio}
        </h3>
        {categories.length === 0 ? (
          <p className="text-[#6E655F] text-xs">Sin categorías registradas</p>
        ) : (
          <ul className="space-y-2 text-[#6E655F]">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className={`flex items-center justify-between hover:text-[#C85A32] font-semibold transition-colors ${
                    activeSlug === cat.slug ? 'text-[#C85A32] font-bold' : ''
                  }`}
                >
                  <span>{cat.nombre}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/categoria/todos"
                className={`flex items-center justify-between hover:text-[#C85A32] font-semibold transition-colors ${
                  activeSlug === 'todos' ? 'text-[#C85A32] font-bold' : ''
                }`}
              >
                <span>Ver Todos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        )}
      </div>

      <hr className="border-[#EBE5DF]" />

      {/* 2. Ordenar por (Ubicado en el bloque izquierdo) */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C85A32]" />
          <h3 className="font-bold text-sm text-[#2B231F]">Ordenar por</h3>
        </div>
        <select
          value={currentOrden}
          onChange={(e) => updateParam('orden', e.target.value)}
          className="w-full border border-[#EBE5DF] rounded-xl bg-[#FDFBF7] px-3 py-2 text-xs outline-none cursor-pointer font-semibold text-[#2B231F] focus:border-[#C85A32]"
        >
          <option value="relevantes">Más relevantes</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
          <option value="mas-vendidos">Más vendidos</option>
          {hasRatings && <option value="calificados">Mejor calificados</option>}
        </select>
      </div>

      <hr className="border-[#EBE5DF]" />

      {/* 3. Filtro de Precio Editable por el Cliente */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-[#2B231F]">Rango de Precio</h3>
          {hasActivePriceFilter && (
            <button
              type="button"
              onClick={handleClearPrice}
              className="text-[11px] font-bold text-[#C85A32] hover:text-[#A04320] flex items-center gap-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A89F91] text-[11px] font-bold">
                S/
              </span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Mínimo"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] text-xs font-semibold text-[#2B231F]"
              />
            </div>
            <span className="text-[#A89F91] font-bold">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A89F91] text-[11px] font-bold">
                S/
              </span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Máximo"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] text-xs font-semibold text-[#2B231F]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 rounded-xl bg-[#C85A32] hover:bg-[#A04320] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            Aplicar Precio
          </button>
        </form>
      </div>

      {/* 4. Calificación (Solo aparece si algún producto tiene calificación) */}
      {hasRatings && (
        <>
          <hr className="border-[#EBE5DF]" />
          <div>
            <h3 className="font-bold text-sm mb-3 text-[#2B231F]">Calificación</h3>
            <div className="space-y-2">
              <div
                onClick={() =>
                  updateParam('stars', currentStars === 4 ? null : '4')
                }
                className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded-lg transition-colors ${
                  currentStars === 4
                    ? 'bg-[#FDF4EE] text-[#C85A32] font-bold'
                    : 'hover:text-[#C85A32]'
                }`}
              >
                <div className="flex text-[#F59E0B]">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-[#EBE5DF]" />
                </div>
                <span className="text-xs font-semibold">(4 estrellas o más)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
