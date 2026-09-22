'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BANNERS = [
  {
    id: 1,
    title: 'Insertos & Organizadores de Juegos',
    subtitle: 'Mantén tus cajas impecables con piezas de alta precisión',
    tag: 'ORGANIZACIÓN PREMIUM',
    cta: 'Ver insertos disponibles',
    link: '/categoria/insertos',
    bgGradient: 'from-amber-950 via-slate-900 to-stone-900',
    accentColor: 'text-amber-400',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 2,
    title: 'Torres de Dados & Accesorios de Rol',
    subtitle: 'Lleva tus sesiones de D&D y rol al siguiente nivel',
    tag: 'ROL & FANTASÍA',
    cta: 'Explorar colección de rol',
    link: '/categoria/rol',
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    accentColor: 'text-indigo-400',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 3,
    title: 'Kits y Tableros para Mansiones de la Locura',
    subtitle: 'Sets para 1 a 4 jugadores con marcadores de alta calidad',
    tag: 'DESTACADO DE LA SEMANA',
    cta: 'Comprar sets de juego',
    link: '/categoria/juegos-de-mesa',
    bgGradient: 'from-stone-950 via-red-950 to-neutral-900',
    accentColor: 'text-orange-400',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1400&q=80',
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length)
    }, 6000)
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
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden select-none">
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
            <div className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#e3e6e6] via-transparent to-black/30" />
          </div>

          {/* Banner Content */}
          <div className="relative max-w-[1500px] mx-auto h-full flex flex-col justify-center px-6 md:px-12 text-white pb-20 md:pb-32">
            <span className={`text-xs md:text-sm font-extrabold tracking-widest uppercase ${item.accentColor} mb-1 drop-shadow`}>
              {item.tag}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black max-w-2xl leading-tight mb-2 drop-shadow-md">
              {item.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-xl mb-5 drop-shadow">
              {item.subtitle}
            </p>
            <div>
              <Link
                href={item.link}
                className="btn-amazon-primary text-xs md:text-sm font-bold px-6 py-2.5 shadow-lg inline-flex items-center gap-2"
              >
                {item.cta} &rarr;
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/3 -translate-y-1/2 z-20 w-10 h-20 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white border border-transparent hover:border-white/40 rounded transition-all cursor-pointer"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/3 -translate-y-1/2 z-20 w-10 h-20 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white border border-transparent hover:border-white/40 rounded transition-all cursor-pointer"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Bottom Gradient Overlay for Seamless Card Intersect */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#e3e6e6] to-transparent z-20 pointer-events-none" />
    </div>
  )
}
