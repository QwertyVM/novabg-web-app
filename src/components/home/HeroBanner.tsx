'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Zap, Sparkles, ArrowRight } from 'lucide-react'

const BANNERS = [
  {
    id: 1,
    title: 'Organizadores de Juegos de Mesa',
    subtitle: 'Mantén tus cajas impecables, tus cartas protegidas y agiliza tus partidas.',
    tag: 'ORGANIZACIÓN PREMIUM',
    highlight: 'HASTA 30% OFF',
    cta: 'Ver Organizadores',
    link: '/categoria/insertos',
    bgGradient: 'from-[#0047b3] via-[#0066ff] to-[#0f172a]',
    badgeBg: 'bg-[#00d2ff] text-[#0f172a]',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Torres de Dados & Rol Épico',
    subtitle: 'Diseños temáticos para tus campañas de D&D, dados poliédricos y accesorios.',
    tag: 'FULL 24H DELIVERY',
    highlight: 'ENVÍO GRATIS FULL',
    cta: 'Explorar Colección',
    link: '/categoria/rol',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0052cc]',
    badgeBg: 'bg-emerald-400 text-[#0f172a]',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Mansiones de la Locura & Sets',
    subtitle: 'Tableros y organizadores de mesa para 1 a 4 jugadores listos para jugar.',
    tag: 'TENDENCIA EN JUEGOS',
    highlight: 'EDICIÓN ESPECIAL',
    cta: 'Comprar Sets',
    link: '/categoria/juegos-de-mesa',
    bgGradient: 'from-[#1e1b4b] via-[#312e81] to-[#0066ff]',
    badgeBg: 'bg-amber-300 text-gray-900',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80',
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length)
  }

  const banner = BANNERS[currentSlide]

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden select-none bg-gray-900 rounded-none md:rounded-b-2xl shadow-xs">
      {/* Background Slides */}
      {BANNERS.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} opacity-92`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Banner Content */}
          <div className="relative max-w-[1400px] mx-auto h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${item.badgeBg}`}>
                {item.tag}
              </span>
              <span className="text-[11px] sm:text-xs text-white/90 font-bold tracking-wide uppercase">
                {item.highlight}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black max-w-2xl leading-tight mb-2 tracking-tight">
              {item.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-lg mb-6 leading-relaxed hidden sm:block">
              {item.subtitle}
            </p>

            <div>
              <Link
                href={item.link}
                className="bg-white text-[#0066ff] hover:bg-gray-100 text-xs sm:text-sm font-bold px-6 py-3 rounded-lg shadow-md inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>{item.cta}</span>
                <ArrowRight className="w-4 h-4 text-[#0066ff]" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-black/25 hover:bg-white hover:text-[#0066ff] text-white rounded-full transition-all cursor-pointer backdrop-blur-xs"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-black/25 hover:bg-white hover:text-[#0066ff] text-white rounded-full transition-all cursor-pointer backdrop-blur-xs"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'w-6 bg-[#00d2ff]' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
