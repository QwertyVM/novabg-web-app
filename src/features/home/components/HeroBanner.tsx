'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Dice5,
  Box,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  Star,
} from 'lucide-react'

interface BannerSlide {
  id: number
  tag: string
  tagIcon: React.ElementType
  title: string
  highlightText: string
  subtitle: string
  ctaPrimaryText: string
  ctaPrimaryLink: string
  ctaSecondaryText: string
  ctaSecondaryLink: string
  previewImage: string
  previewBadge: string
  previewTitle: string
  previewCategory: string
  previewRating: string
  accentColor: string
}

const SLIDES: BannerSlide[] = [
  {
    id: 1,
    tag: 'COLECCIÓN OFICIAL 2026',
    tagIcon: Sparkles,
    title: 'Tu Pasión por los Juegos de Mesa,',
    highlightText: 'Elevada al Máximo.',
    subtitle:
      'Descubre juegos de tablero, organizadores a medida y accesorios exclusivos diseñados para optimizar cada noche de juego.',
    ctaPrimaryText: 'Explorar Catálogo',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Ver Categorías',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    previewBadge: 'EDICIÓN OFICIAL',
    previewTitle: 'Organizadores & Sets Completos',
    previewCategory: 'Optimización de Espacio',
    previewRating: '4.9 / 5.0 (Comunidad)',
    accentColor: '#00d2ff',
  },
  {
    id: 2,
    tag: 'ORGANIZACIÓN DE PRECISIÓN',
    tagIcon: Box,
    title: 'Organizadores de Mesa & Inserts',
    highlightText: 'Setup en 2 Minutos.',
    subtitle:
      'Mantén tus cajas impecables, cartas protegidas y fichas ordenadas para comenzar a jugar de inmediato sin demoras.',
    ctaPrimaryText: 'Ver Organizadores',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Catálogo General',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',
    previewBadge: 'AJUSTE A MEDIDA',
    previewTitle: 'Bandejas Modulares con Tapa',
    previewCategory: 'Compatible con Fundas',
    previewRating: '100% Calidad NOVA BG',
    accentColor: '#38bdf8',
  },
  {
    id: 3,
    tag: 'D&D Y JUEGOS DE ROL',
    tagIcon: Dice5,
    title: 'Torres de Dados & Accesorios',
    highlightText: 'Para Campañas Épicas.',
    subtitle:
      'Diseños temáticos con caída suave para dados poliédricos, contadores de vida y complementos para tus sesiones de rol.',
    ctaPrimaryText: 'Ver Accesorios de Rol',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Explorar Todo',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    previewBadge: 'ROL & ACCESORIOS',
    previewTitle: 'Torres de Dados Temáticas',
    previewCategory: 'Resistencia & Acabado Premium',
    previewRating: '5.0 Recomendado',
    accentColor: '#00d2ff',
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isPaused])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }

  const activeSlide = SLIDES[currentSlide]
  const TagIcon = activeSlide.tagIcon

  return (
    <div
      className="relative w-full max-w-[1400px] mx-auto overflow-hidden select-none px-4 pt-4 sm:pt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Banner Shell */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#0047b3] via-[#0066ff] to-[#002f80] text-white shadow-xl min-h-[360px] sm:min-h-[420px] md:min-h-[460px] flex items-center">
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00d2ff]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#003899]/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/25 pointer-events-none" />

        {/* Content Grid */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text and CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 animate-in fade-in duration-300">
            {/* Tag Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#00d2ff] font-extrabold text-[11px] tracking-wider uppercase border border-white/20 shadow-xs">
                <TagIcon className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>{activeSlide.tag}</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] text-white">
                {activeSlide.title}{' '}
                <span className="text-[#00d2ff] block sm:inline">
                  {activeSlide.highlightText}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 max-w-xl leading-relaxed font-normal">
              {activeSlide.subtitle}
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-white/90">
              <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                <Truck className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span className="text-[11px] font-semibold">Envíos a todo el Perú</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span className="text-[11px] font-semibold">Garantía Oficial NOVA BG</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={activeSlide.ctaPrimaryLink}
                className="bg-white text-[#0066ff] hover:bg-gray-100 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-lg inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{activeSlide.ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4 text-[#0066ff]" />
              </Link>

              <Link
                href={activeSlide.ctaSecondaryLink}
                className="bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-white/25 backdrop-blur-md transition-all hover:scale-102 cursor-pointer"
              >
                {activeSlide.ctaSecondaryText}
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Showcase Card (5 cols - Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl transition-all duration-500 hover:scale-102">
              {/* Top Floating Badge */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#00d2ff] text-[#0f172a] shadow-xs">
                  {activeSlide.previewBadge}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold bg-black/20 px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Showcase Image */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-black/20 border border-white/15 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSlide.previewImage}
                  alt={activeSlide.previewTitle}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Showcase Bottom Details */}
              <div className="mt-3 px-1 space-y-1">
                <p className="text-[11px] text-blue-200 font-medium">{activeSlide.previewCategory}</p>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {activeSlide.previewTitle}
                </h4>
                <p className="text-[10px] text-white/70">{activeSlide.previewRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-white hover:text-[#0066ff] text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-md"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-white hover:text-[#0066ff] text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-md"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-[#00d2ff]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
