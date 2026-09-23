'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ExpandableDescriptionProps {
  description: string
  className?: string
}

export function ExpandableDescription({ description, className = '' }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!description) return null

  // Normalizar saltos de línea (\r\n -> \n)
  const normalized = description.trim().replace(/\r\n/g, '\n')

  // Identificar el fin del primer párrafo
  // Priorizar doble salto de línea (\n\n o \n\s*\n), y como respaldo un salto simple (\n)
  const doubleBreakMatch = normalized.search(/\n\s*\n/)
  
  let firstParagraph = normalized
  let remainingContent = ''

  if (doubleBreakMatch !== -1) {
    firstParagraph = normalized.slice(0, doubleBreakMatch).trim()
    remainingContent = normalized.slice(doubleBreakMatch).trim()
  } else {
    const singleBreakMatch = normalized.indexOf('\n')
    if (singleBreakMatch !== -1) {
      firstParagraph = normalized.slice(0, singleBreakMatch).trim()
      remainingContent = normalized.slice(singleBreakMatch).trim()
    }
  }

  // Si no hay más párrafos ni contenido posterior, mostrar solo el párrafo
  if (!remainingContent) {
    return (
      <div className={`text-sm text-[#4E443E] leading-relaxed whitespace-pre-wrap ${className}`}>
        {normalized}
      </div>
    )
  }

  return (
    <div className={`text-sm text-[#4E443E] leading-relaxed ${className}`}>
      <p className="whitespace-pre-wrap">{firstParagraph}</p>

      {isExpanded && (
        <div className="mt-3 whitespace-pre-wrap">
          {remainingContent}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#C85A32] hover:text-[#A04320] transition-colors group cursor-pointer focus:outline-none"
        >
          <span>{isExpanded ? 'Ver menos' : 'Ver más'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          )}
        </button>
      </div>
    </div>
  )
}
