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
    accentColor: '#C85A32',
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
    ctaSecondaryText: 'Explorar Catálogo',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'ROL & FANTASÍA',
    previewTitle: 'Torres de Dados & Bandejas de Tiradas',
    previewCategory: 'Acabado Suave & Precisión',
    previewRating: '5.0 ★ Recomendado',
    accentColor: '#D9B89C',
  },
  {
    id: 3,
    tag: 'NOVEDADES & ACCESORIOS DE MESA',
    tagIcon: Sparkles,
    title: 'Eleva tu Experiencia Lúdica',
    highlightText: 'Calidad Premium Certificada.',
    subtitle:
      'Portacartas modulares, dispensadores de recursos y componentes diseñados por y para jugadores de mesa apasionados.',
    ctaPrimaryText: 'Ver Novedades',
    ctaPrimaryLink: '/categoria/todos',
    ctaSecondaryText: 'Explorar Catálogo',
    ctaSecondaryLink: '/categoria/ofertas',
    previewImage:
      'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'COLECCIÓN 2026',
    previewTitle: 'Accesorios & Sets de Mesa',
    previewCategory: 'Compatibles con Fundas (Sleeves)',
    previewRating: '4.9 ★ Comunidad Lúdica',
    accentColor: '#C85A32',
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
    ctaSecondaryText: 'Explorar Catálogo',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'INGENIERÍA 3D',
    previewTitle: 'Piezas & Accesorios de Precisión',
    previewCategory: 'Filamentos & Resinas Premium',
    previewRating: '5.0 ★ Precisión Garantizada',
    accentColor: '#C85A32',
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
    ctaSecondaryText: 'Explorar Catálogo',
    ctaSecondaryLink: '/categoria/todos',
    previewImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    previewBadge: 'ALTA RESOLUCIÓN',
    previewTitle: 'Escenografía & Miniaturas',
    previewCategory: 'Resina 8K & Acabado Suave',
    previewRating: '4.9 ★ Satisfacción Total',
    accentColor: '#D9B89C',
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
    accentColor: '#C85A32',
  },
]

interface HeroBannerProps {
  dbBanners?: StoreBannerSlide[]
  section?: 'BG' | '3D'
}

export function HeroBanner({ dbBanners = [], section = 'BG' }: HeroBannerProps) {
  const is3D = section === '3D'
  const fallbackSlides = is3D ? THREE_D_SLIDES : BG_SLIDES

  if (!dbBanners || dbBanners.length === 0) {
    return null
  }

  const slides: BannerSlide[] = dbBanners.map((b, idx) => ({
          id: b.id || idx + 1,
          tag: b.tag || (is3D ? 'NOVEDAD 3D' : 'OFERTA DESTACADA'),
          tagIcon: is3D ? Printer : Sparkles,
          title: b.titulo,
          highlightText: b.resaltado || '',
          subtitle: b.subtitulo || '',
          ctaPrimaryText: b.ctaTexto || 'Ver Organizadores',
          ctaPrimaryLink: b.ctaLink || '/categoria/todos',
          ctaSecondaryText: 'Explorar Catálogo',
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
          accentColor: b.colorAcento || '#C85A32',
        }))

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
      {/* Light Warm Hero Container (Clean Ivory & Sand Radial Background) */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs transition-all duration-700 min-h-[440px] sm:min-h-[470px] md:min-h-[490px] flex items-center bg-gradient-to-br from-[#FDFBF7] via-[#F8F2EB] to-[#F1E8DC] border border-[#EBE5DF]">
        {/* Subtle Decorative Ambient Warm Glows */}
        <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-[#D9B89C]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full bg-[#C85A32]/10 blur-3xl pointer-events-none" />

        {/* Content Grid */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Badges, CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Tag Pill in Secondary / Arena */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-[#F3ECE2] text-[#C85A32] border border-[#D9B89C]/60 shadow-2xs">
                <TagIcon className="w-3.5 h-3.5 shrink-0 text-[#C85A32]" />
                <span>{activeSlide.tag}</span>
              </span>
            </div>

            {/* Main Headline in text-main */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black tracking-tight leading-[1.14] text-[#2B231F]">
                {activeSlide.title}{' '}
                <span className="block sm:inline text-[#C85A32]">
                  {activeSlide.highlightText}
                </span>
              </h1>
            </div>

            {/* Subtitle in text-muted */}
            <p className="text-xs sm:text-sm md:text-base text-[#6E655F] max-w-xl leading-relaxed font-normal">
              {activeSlide.subtitle}
            </p>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              {/* Primary Button: solid primary #C85A32 with white text */}
              <Link
                href={activeSlide.ctaPrimaryLink}
                className="btn-nova-primary w-full sm:w-auto text-center justify-center text-xs sm:text-sm font-bold px-6 sm:px-7 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>{activeSlide.ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary Button: outline with primary/text-main border */}
              <Link
                href={activeSlide.ctaSecondaryLink}
                className="bg-white hover:bg-[#F8F2EB] w-full sm:w-auto text-center justify-center text-[#2B231F] hover:text-[#C85A32] text-xs sm:text-sm font-bold px-5 sm:px-6 py-3.5 flex items-center rounded-xl border border-[#EBE5DF] hover:border-[#D9B89C] transition-all shadow-2xs cursor-pointer"
              >
                {activeSlide.ctaSecondaryText}
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card in Surface Clean White (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-5 border border-[#EBE5DF] shadow-md transition-all duration-500 hover:scale-[1.01] group">
              {/* Top Card Badge Bar */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-[#F3ECE2] text-[#C85A32] border border-[#D9B89C]/50 shadow-2xs">
                  {activeSlide.previewBadge}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-[#2B231F] font-bold bg-[#FDFBF7] px-2.5 py-1 rounded-lg border border-[#EBE5DF]">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>

              {/* Showcase Image with Clean Off-White Background */}
              <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#EBE5DF] flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSlide.previewImage}
                  alt={activeSlide.previewTitle}
                  className="w-full h-full object-cover rounded-xl shadow-xs transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Showcase Bottom Details */}
              <div className="mt-3.5 px-1 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32]">
                  {activeSlide.previewCategory}
                </p>
                <h4 className="text-sm sm:text-base font-black text-[#2B231F] leading-tight">
                  {activeSlide.previewTitle}
                </h4>
                <p className="text-[11px] text-[#6E655F] font-medium">
                  {activeSlide.previewRating}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows in Clean White */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white hover:bg-[#C85A32] text-[#2B231F] hover:text-white rounded-full transition-all cursor-pointer border border-[#EBE5DF] shadow-md active:scale-95"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white hover:bg-[#C85A32] text-[#2B231F] hover:text-white rounded-full transition-all cursor-pointer border border-[#EBE5DF] shadow-md active:scale-95"
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
                  ? 'w-9 bg-[#C85A32] shadow-xs'
                  : 'w-2.5 bg-[#D9B89C] hover:bg-[#C85A32]/60'
              }`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
