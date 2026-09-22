'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Package,
  Sparkles,
  Zap,
  Layers,
  Dice5,
  Phone,
  MessageCircle,
  X,
  Printer,
} from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/features/cart/context/CartContext'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { StorePublicConfig } from '@/features/catalog/services/store-config.service'

interface StoreHeaderProps {
  onOpenDrawer: () => void
  categories?: NovaCategory[]
  storeConfig?: StorePublicConfig
  activeSection?: 'BG' | '3D'
}

export function StoreHeader({
  onOpenDrawer,
  categories = [],
  storeConfig,
  activeSection = 'BG',
}: StoreHeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { totalCount } = useCart()

  const [topBannerDismissed, setTopBannerDismissed] = useState(false)
  const [department, setDepartment] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      if (department !== 'todos') {
        router.push(`/categoria/${department}`)
      } else {
        router.push('/categoria/todos')
      }
      return
    }
    const params = new URLSearchParams()
    params.set('q', searchTerm.trim())
    if (department !== 'todos') {
      params.set('dept', department)
    }
    if (activeSection) {
      params.set('sec', activeSection)
    }
    router.push(`/buscar?${params.toString()}`)
  }

  // Clean WhatsApp URL
  const phone = storeConfig?.telefonoContacto || '+51 924 812 345'
  const cleanPhone = phone.replace(/[^\d]/g, '')
  const whatsappMsg = storeConfig?.whatsappMensaje || '¡Hola! Quisiera información sobre los productos.'
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`

  const is3D = activeSection === '3D'

  return (
    <header className="text-white select-none sticky top-0 z-40 shadow-sm transition-colors" style={{ backgroundColor: is3D ? '#b45309' : '#0066ff' }}>
      {/* 1. TOP ANNOUNCEMENT BANNER (Configured in ERP) */}
      {storeConfig?.anuncioTopActivo && !topBannerDismissed && (
        <div className="bg-[#0f172a] text-white text-xs py-1.5 px-4 border-b border-white/10 flex items-center justify-between">
          <div className="max-w-[1400px] mx-auto flex-1 flex items-center justify-center text-center gap-2">
            <span className="text-xs font-medium tracking-wide">
              {storeConfig.anuncioTopTexto}
            </span>
            {storeConfig.anuncioTopLink && (
              <Link
                href={storeConfig.anuncioTopLink}
                className="text-[#00d2ff] hover:underline font-bold text-[11px] shrink-0"
              >
                Ver más →
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTopBannerDismissed(true)}
            className="text-white/60 hover:text-white p-0.5 rounded cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Top Main Bar */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 px-4 py-2.5">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenDrawer}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/15 text-white cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo: NOVA (BG / 3D) */}
        <Link
          href={is3D ? '/?sec=3D' : '/'}
          className="flex items-center gap-2 py-0.5 px-1 rounded-lg hover:opacity-95 transition-opacity shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/25 shadow-xs group-hover:scale-105 transition-transform">
            {is3D ? <Printer className="w-5 h-5 text-amber-300" /> : <Dice5 className="w-5 h-5 text-[#00d2ff]" />}
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-white drop-shadow-xs">
                NOVA
              </span>
              <span
                className={`text-xs font-black px-1.5 py-0.5 rounded-sm tracking-wider uppercase shadow-2xs ${
                  is3D ? 'bg-amber-300 text-[#0f172a]' : 'bg-[#00d2ff] text-[#0f172a]'
                }`}
              >
                {is3D ? '3D' : 'BG'}
              </span>
            </div>
            <span className="text-[10px] text-white/80 font-medium tracking-wide">
              {is3D ? '3D Printing & Design' : 'Board Games'}
            </span>
          </div>
        </Link>

        {/* Section Switcher (BG / 3D) */}
        <div className="hidden sm:flex items-center bg-black/20 p-0.5 rounded-lg border border-white/20 text-xs shrink-0">
          <Link
            href="/"
            className={`px-2.5 py-1 rounded-md font-bold transition-all ${
              !is3D ? 'bg-white text-[#0066ff] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Juegos BG
          </Link>
          <Link
            href="/?sec=3D"
            className={`px-2.5 py-1 rounded-md font-bold transition-all ${
              is3D ? 'bg-white text-amber-800 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Impresión 3D
          </Link>
        </div>

        {/* Mercado Libre Style Minimalist Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl flex items-center h-10 rounded-md overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#00d2ff] transition-all"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar juegos de mesa, organizadores, cartas, accesorios..."
            className="flex-1 px-4 text-sm text-[#191919] outline-none h-full placeholder:text-gray-400 bg-transparent font-normal"
          />

          {/* Department Filter (Desktop) with Dynamic Categories */}
          <div className="hidden sm:flex items-center border-l border-gray-200 h-6 px-2 text-xs text-gray-500 bg-gray-50/80">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-transparent text-xs text-gray-700 outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="todos">Todo</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="h-full px-4 text-gray-500 hover:text-[#0066ff] hover:bg-blue-50 transition-colors flex items-center justify-center cursor-pointer border-l border-gray-100"
            title="Buscar"
          >
            <Search className="w-4 h-4 text-gray-600" />
          </button>
        </form>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-1 sm:gap-3 text-xs">
          {/* User Account / Login */}
          <div
            className="relative"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <button
              onClick={() => {
                if (!session) signIn('google')
                else router.push('/pedidos')
              }}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-md hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-6 h-6 rounded-full border border-white/40"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-white/90" />
              )}
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[11px] text-white/80 font-normal">
                  {session?.user?.name ? `Hola, ${session.user.name.split(' ')[0]}` : 'Ingresa'}
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-0.5">
                  Mi Cuenta <ChevronDown className="w-3 h-3 text-white/70" />
                </span>
              </div>
            </button>

            {/* Account Popover */}
            {showAccountMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white text-[#191919] rounded-lg shadow-xl border border-gray-100 py-3 px-4 z-50 animate-in fade-in duration-150">
                <div className="text-center pb-3 border-b border-gray-100">
                  {session ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0066ff] font-bold flex items-center justify-center text-sm mb-1.5">
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                      <p className="font-bold text-xs text-gray-900">{session.user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-full">
                        {session.user?.email}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-600 mb-2 font-medium">
                        Ingresa a tu cuenta de NOVA BG
                      </p>
                      <button
                        onClick={() => signIn('google')}
                        className="w-full btn-nova-primary text-xs py-2 shadow-xs mb-1.5 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        Continuar con Google
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-xs space-y-1">
                  <Link
                    href="/pedidos"
                    className="flex items-center gap-2.5 p-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-[#0066ff] transition-colors"
                  >
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>Mis Compras</span>
                  </Link>
                  <Link
                    href="/carrito"
                    className="flex items-center gap-2.5 p-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-[#0066ff] transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    <span>Mi Carrito</span>
                  </Link>
                  <Link
                    href="/categoria/ofertas"
                    className="flex items-center gap-2.5 p-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-[#0066ff] transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#0066ff]" />
                    <span>Ofertas Especiales</span>
                  </Link>

                  {session && (
                    <div className="pt-2 border-t border-gray-100 mt-1">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2.5 p-2 rounded-md text-red-600 hover:bg-red-50 w-full text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Contact Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-md bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold transition-colors shadow-2xs shrink-0"
            title="Atención por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>

          {/* Mis Compras Link */}
          <Link
            href="/pedidos"
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-2.5 rounded-md hover:bg-white/15 text-white transition-colors"
          >
            <Package className="w-4 h-4 text-white/90" />
            <span className="font-medium hidden md:inline">Mis compras</span>
          </Link>

          {/* Cart with Badge */}
          <Link
            href="/carrito"
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-md hover:bg-white/15 text-white transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00d2ff] text-[#0f172a] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="font-semibold hidden lg:inline">Carrito</span>
          </Link>
        </div>
      </div>

      {/* Second Row: Navigation & Location */}
      <div className="border-t border-white/15 bg-[#0055d4] text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Location deliver-to */}
          <div className="flex items-center gap-1.5 text-white/90 hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-white/10 transition-colors">
            <MapPin className="w-4 h-4 text-[#00d2ff]" />
            <div className="flex items-center gap-1">
              <span className="text-white/70">Enviar a</span>
              <span className="font-bold text-white">Lima, Perú</span>
            </div>
          </div>

          {/* Categories & Main Navigation */}
          <nav className="flex items-center gap-1 text-white">
            {/* Categorías Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowCategoriesMenu(true)}
              onMouseLeave={() => setShowCategoriesMenu(false)}
            >
              <button className="nova-nav-link flex items-center gap-1 cursor-pointer font-semibold">
                <span>Categorías</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {showCategoriesMenu && (
                <div className="absolute left-0 top-full mt-1 w-60 bg-white text-[#191919] rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-100">
                  {categories.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-gray-500">
                      <p className="font-medium text-gray-700 mb-1">Sin categorías registradas</p>
                      <p className="text-[11px] text-gray-400">
                        Registra categorías en NOVA BG para verlas aquí.
                      </p>
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categoria/${cat.slug}`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#0066ff] transition-colors"
                      >
                        <Layers className="w-4 h-4 text-[#0066ff]" />
                        <span>{cat.nombre}</span>
                      </Link>
                    ))
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    href="/categoria/todos"
                    className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#0066ff] hover:bg-blue-50"
                  >
                    <span>Ver catálogo completo</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Dynamic Navbar Links for registered NOVA BG categories */}
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`} className="nova-nav-link">
                {cat.nombre}
              </Link>
            ))}

            <Link href="/categoria/ofertas" className="nova-nav-link">
              Ofertas
            </Link>
            <Link href="/pedidos" className="nova-nav-link">
              Mis Compras
            </Link>
            <Link href="/servicio-al-cliente" className="nova-nav-link hidden lg:inline-flex">
              Ayuda
            </Link>
          </nav>

          {/* NOVA FULL Badge */}
          <div className="flex items-center gap-1 text-[#00d2ff] font-bold text-xs">
            <Zap className="w-3.5 h-3.5 fill-[#00d2ff]" />
            <span>NOVA FULL • Envíos a todo el Perú</span>
          </div>
        </div>
      </div>
    </header>
  )
}
