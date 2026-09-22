'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Star,
  Flame,
  Printer,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import { StoreBannerSlide } from '@/features/catalog/services/store-config.service'

interface BannerSlide {
  id: string | number
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

const BG_SLIDES: BannerSlide[] = [
  {
    id: 1,
    tag: 'ORGANIZADORES & INSERTS 2026',
    tagIcon: Box,
    title: 'Tu Colección de Juegos de Mesa,',
    highlightText: 'Setup en 2 Minutos.',
    subtitle:
      'Inserts a medida, bandejas modulares y organizadores diseñados para proteger tus cartas y desplegar la partida de inmediato.',
    ctaPrimaryText: 'Ver Organizadores',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Explorar Catálogo',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'EDICIÓN OFICIAL',
    previewTitle: 'Organizadores & Bandejas con Tapa',
    previewCategory: 'Optimización de Espacio & Mesa',
    previewRating: '4.9 ★ Calidad NOVA BG',
    accentColor: '#00d2ff',
  },
  {
    id: 2,
    tag: 'D&D Y ACCESORIOS DE ROL',
    tagIcon: Dice5,
    title: 'Torres de Dados & Accesorios Roleros',
    highlightText: 'Para Campañas Épicas.',
    subtitle:
      'Diseños temáticos con rodado suave para dados poliédricos, contadores de vida, pantallas de máster y accesorios de ambientación.',
    ctaPrimaryText: 'Ver Accesorios de Rol',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Ver Todos',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'ROL & FANTASÍA',
    previewTitle: 'Torres de Dados & Bandejas de Tiradas',
    previewCategory: 'Acabado Suave & Precisión',
    previewRating: '5.0 ★ Recomendado',
    accentColor: '#38bdf8',
  },
  {
    id: 3,
    tag: 'NOVEDADES & ACCESORIOS DE MESA',
    tagIcon: Sparkles,
    title: 'Eleva tu Experiencia Lúdica',
    highlightText: 'Calidad Premium Certificada.',
    subtitle:
      'Portacartas modulares, dispensadores de recursos y componentes diseñados por y para jugadores de mesa apasionados.',
    ctaPrimaryText: 'Explorar Catálogo',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Ofertas Especiales',
    ctaSecondaryLink: '/categoria/ofertas',
    previewImage:
      'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'COLECCIÓN 2026',
    previewTitle: 'Accesorios & Sets de Mesa',
    previewCategory: 'Compatibles con Fundas (Sleeves)',
    previewRating: '4.9 ★ Comunidad Lúdica',
    accentColor: '#00e5ff',
  },
]

const THREE_D_SLIDES: BannerSlide[] = [
  {
    id: 1,
    tag: 'IMPRESIÓN 3D DE PRECISIÓN',
    tagIcon: Printer,
    title: 'Fabricación y Prototipado 3D',
    highlightText: 'Acabados Ultra Detallados.',
    subtitle:
      'Piezas técnicas, accesorios a medida y prototipos fabricados con tecnología FDM y Resina de alta resolución.',
    ctaPrimaryText: 'Ver Catálogo 3D',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Explorar Piezas',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'INGENIERÍA 3D',
    previewTitle: 'Piezas & Accesorios de Precisión',
    previewCategory: 'Filamentos & Resinas Premium',
    previewRating: '5.0 ★ Precisión Garantizada',
    accentColor: '#f59e0b',
  },
  {
    id: 2,
    tag: 'MINIATURAS & ESCENOGRAFÍA',
    tagIcon: Sparkles,
    title: 'Detalles Milimétricos para tu Mesa',
    highlightText: 'Listos para Pintar y Jugar.',
    subtitle:
      'Escenografía modular, props para wargames y miniaturas de colección con texturas de máxima fidelidad.',
    ctaPrimaryText: 'Ver Miniaturas',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Ver Todos',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'ALTA RESOLUCIÓN',
    previewTitle: 'Escenografía & Miniaturas',
    previewCategory: 'Resina 8K & Acabado Suave',
    previewRating: '4.9 ★ Satisfacción Total',
    accentColor: '#fb923c',
  },
  {
    id: 3,
    tag: 'DISEÑO A MEDIDA & PERSONALIZACIÓN',
    tagIcon: Compass,
    title: 'Tus Ideas Convertidas en Realidad',
    highlightText: 'Ajuste Perfecto Garantizado.',
    subtitle:
      'Modelado CAD y producción bajo demanda para proyectos personales, organizadores especiales y piezas exclusivas.',
    ctaPrimaryText: 'Consultar Proyectos',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Explorar Catálogo',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'PERSONALIZADO',
    previewTitle: 'Diseño CAD & Fabricación',
    previewCategory: 'Garantía y Asesoría Técnica',
    previewRating: '5.0 ★ Taller Oficial',
    accentColor: '#f59e0b',
  },
]

interface HeroBannerProps {
  dbBanners?: StoreBannerSlide[]
  section?: 'BG' | '3D'
}

export function HeroBanner({ dbBanners = [], section = 'BG' }: HeroBannerProps) {
  const is3D = section === '3D'
  const fallbackSlides = is3D ? THREE_D_SLIDES : BG_SLIDES

  const slides: BannerSlide[] =
    dbBanners.length > 0
      ? dbBanners.map((b, idx) => ({
          id: b.id || idx + 1,
          tag: b.tag || (is3D ? 'NOVEDAD 3D' : 'OFERTA DESTACADA'),
          tagIcon: is3D ? Printer : Sparkles,
          title: b.titulo,
          highlightText: b.resaltado || '',
          subtitle: b.subtitulo || '',
          ctaPrimaryText: b.ctaTexto || 'Explorar Catálogo',
          ctaPrimaryLink: b.ctaLink || '/categoria/todos',
          ctaSecondaryText: 'Ver Categorías',
          ctaSecondaryLink: '/categoria/todos',
          previewImage:
            b.imagenUrl ||
            (is3D
              ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80'
              : 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80'),
          previewBadge: b.previewBadge || (is3D ? 'DISEÑO 3D' : 'EDICIÓN OFICIAL'),
          previewTitle: b.previewTitle || (is3D ? 'Piezas & Accesorios' : 'Sets & Organizadores'),
          previewCategory: is3D ? 'Impresión de Precisión' : 'Optimización de Juego',
          previewRating: b.previewRating || '5.0 ★ Calidad Garantizada',
          accentColor: b.colorAcento || (is3D ? '#f59e0b' : '#00d2ff'),
        }))
      : fallbackSlides

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const timer = setInterval(() => {
      nextSlide()
    }, 6500)
    return () => clearInterval(timer)
  }, [isPaused, slides.length, nextSlide])

  const activeSlide = slides[currentSlide] || slides[0]
  const TagIcon = activeSlide.tagIcon

  return (
    <section
      className="relative w-full max-w-[1400px] mx-auto select-none px-4 pt-4 sm:pt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Destacados de la tienda"
    >
      {/* Main Banner Container */}
      <div
        className={`relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 min-h-[420px] sm:min-h-[480px] md:min-h-[500px] flex items-center ${
          is3D
            ? 'bg-gradient-to-br from-[#120b05] via-[#241306] to-[#090502] text-white border border-amber-900/30'
            : 'bg-gradient-to-br from-[#060d1f] via-[#0b1d47] to-[#040814] text-white border border-blue-900/40'
        }`}
      >
        {/* Background Mesh Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Glowing Orbs */}
        <div
          className={`absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
            is3D ? 'bg-amber-500/20' : 'bg-[#00d2ff]/20'
          }`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
            is3D ? 'bg-orange-600/15' : 'bg-[#0052cc]/30'
          }`}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />

        {/* Content Grid */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Badges, CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Tag Pill */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase backdrop-blur-md border shadow-sm transition-all duration-300 ${
                  is3D
                    ? 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                    : 'bg-cyan-500/15 text-[#00e5ff] border-cyan-400/30'
                }`}
              >
                <TagIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{activeSlide.tag}</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[44px] font-black tracking-tight leading-[1.12] text-white">
                {activeSlide.title}{' '}
                <span
                  className={`block sm:inline font-black ${
                    is3D
                      ? 'bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-[#00e5ff] via-sky-300 to-blue-300 bg-clip-text text-transparent'
                  }`}
                >
                  {activeSlide.highlightText}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              {activeSlide.subtitle}
            </p>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-200 pt-1">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <Truck className={`w-3.5 h-3.5 ${is3D ? 'text-amber-400' : 'text-[#00e5ff]'}`} />
                <span className="text-[11px] font-semibold">Envíos a todo el Perú</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <ShieldCheck
                  className={`w-3.5 h-3.5 ${is3D ? 'text-amber-400' : 'text-[#00e5ff]'}`}
                />
                <span className="text-[11px] font-semibold">
                  Garantía Oficial {is3D ? 'NOVA 3D' : 'NOVA BG'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${is3D ? 'text-amber-400' : 'text-[#00e5ff]'}`}
                />
                <span className="text-[11px] font-semibold">Calidad de Taller</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={activeSlide.ctaPrimaryLink}
                className={`text-xs sm:text-sm font-black px-6 sm:px-7 py-3.5 rounded-xl shadow-xl inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  is3D
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25'
                    : 'bg-white hover:bg-slate-100 text-[#0052cc] shadow-blue-500/20'
                }`}
              >
                <span>{activeSlide.ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={activeSlide.ctaSecondaryLink}
                className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all hover:scale-102 cursor-pointer"
              >
                {activeSlide.ctaSecondaryText}
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-md bg-white/[0.08] backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-102 group">
              {/* Top Card Badge Bar */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span
                  className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs ${
                    is3D
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-[#00e5ff] text-slate-950 font-black'
                  }`}
                >
                  {activeSlide.previewBadge}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>

              {/* Showcase Image with Dynamic Light */}
              <div className="relative w-full h-60 rounded-xl overflow-hidden bg-black/30 border border-white/15 flex items-center justify-center p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSlide.previewImage}
                  alt={activeSlide.previewTitle}
                  className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Showcase Bottom Details */}
              <div className="mt-3.5 px-1 space-y-1">
                <p
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    is3D ? 'text-amber-300' : 'text-[#00e5ff]'
                  }`}
                >
                  {activeSlide.previewCategory}
                </p>
                <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                  {activeSlide.previewTitle}
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  {activeSlide.previewRating}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-black/40 hover:bg-white hover:text-slate-900 text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-xl active:scale-95"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-black/40 hover:bg-white hover:text-slate-900 text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-xl active:scale-95"
          aria-label="Slide siguiente"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Interactive Slide Pagination Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? is3D
                    ? 'w-9 bg-amber-400 shadow-md shadow-amber-400/50'
                    : 'w-9 bg-[#00e5ff] shadow-md shadow-cyan-400/50'
                  : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
