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
  MessageCircle,
  X,
} from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/features/cart/context/CartContext'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { StorePublicConfig } from '@/features/catalog/services/store-config.service'
import { NovaLogo } from '@/shared/components/branding'

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

  // Auth Popup Logic
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'popup-signin-success') {
        window.location.reload()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleSignIn = () => {
    const width = 500
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2
    window.open(
      '/auth/google-redirect',
      'GoogleSignIn',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
    )
  }

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

  // WhatsApp Contact URL
  const phone = storeConfig?.telefonoContacto || '+51 924 812 345'
  const cleanPhone = phone.replace(/[^\d]/g, '')
  const whatsappMsg = storeConfig?.whatsappMensaje || '¡Hola! Quisiera consultar por los juegos y organizadores de NOVA.'
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`

  const is3DEnabled = storeConfig?.habilitarSeccion3d !== false
  const isBgEnabled = storeConfig?.habilitarSeccionBg !== false
  const is3D = is3DEnabled && activeSection === '3D'

  return (
    <header className="bg-[#FDFBF7] text-[#2B231F] select-none sticky top-0 z-40 border-b border-[#EBE5DF] shadow-xs">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {storeConfig?.anuncioTopActivo && !topBannerDismissed && (
        <div className="bg-[#F8F2EB] text-[#2B231F] text-xs py-1.5 px-4 border-b border-[#EBE5DF] flex items-center justify-between">
          <div className="max-w-[1400px] mx-auto flex-1 flex items-center justify-center text-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-[#2B231F]">
              {storeConfig.anuncioTopTexto}
            </span>
            {storeConfig.anuncioTopLink && (
              <Link
                href={storeConfig.anuncioTopLink}
                className="text-[#C85A32] hover:text-[#A64724] hover:underline font-bold text-[11px] shrink-0"
              >
                Ver más →
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTopBannerDismissed(true)}
            className="text-[#6E655F] hover:text-[#2B231F] p-0.5 rounded cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Top Main Bar (Light Marfil #FDFBF7) */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 sm:gap-4 px-4 py-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenDrawer}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[#F8F2EB] text-[#2B231F] cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo: NOVA (BG / 3D) */}
        <Link
          href={is3D ? '/?sec=3D' : '/'}
          className="flex items-center gap-2 py-0.5 px-1 rounded-xl hover:opacity-90 transition-opacity shrink-0 group"
          title="NOVA Board Games"
        >
          <NovaLogo size="md" section={is3D ? '3D' : 'BG'} showBadge={true} />
        </Link>

        {/* Section Switcher (Only visible if 3D section is enabled in ERP) */}
        {is3DEnabled && isBgEnabled && (
          <div className="hidden sm:flex items-center bg-[#F4EDE5] p-1 rounded-xl border border-[#EBE5DF] text-xs shrink-0">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                !is3D ? 'bg-white text-[#C85A32] shadow-xs' : 'text-[#6E655F] hover:text-[#2B231F]'
              }`}
            >
              Juegos BG
            </Link>
            <Link
              href="/?sec=3D"
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                is3D ? 'bg-white text-amber-800 shadow-xs' : 'text-[#6E655F] hover:text-[#2B231F]'
              }`}
            >
              Impresión 3D
            </Link>
          </div>
        )}

        {/* Clean White Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl flex items-center h-10.5 rounded-xl overflow-hidden bg-white shadow-xs border border-[#EBE5DF] focus-within:border-[#C85A32] focus-within:ring-2 focus-within:ring-[#C85A32]/20 transition-all"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar juegos de mesa, organizadores, cartas, accesorios..."
            className="flex-1 px-4 text-sm text-[#2B231F] outline-none h-full placeholder:text-[#6E655F] bg-transparent font-medium"
          />

          {/* Department Filter (Desktop) with Dynamic Categories */}
          <div className="hidden sm:flex items-center border-l border-[#EBE5DF] h-6 px-2 text-xs text-[#6E655F] bg-[#FDFBF7]">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-transparent text-xs text-[#2B231F] outline-none cursor-pointer pr-1 font-semibold"
            >
              <option value="todos">Todo</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button in Primary #C85A32 */}
          <button
            type="submit"
            className="h-full px-5 bg-[#C85A32] hover:bg-[#A64724] text-white transition-colors flex items-center justify-center cursor-pointer"
            title="Buscar"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-1 sm:gap-2.5 text-xs text-[#2B231F]">
          {/* User Account / Login */}
          <div
            className="relative"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <button
              onClick={() => {
                if (!session) handleSignIn()
                else router.push('/pedidos')
              }}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-[#F4EDE5] text-[#2B231F] transition-colors cursor-pointer"
            >
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-6 h-6 rounded-full border border-[#D9B89C]"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-[#6E655F]" />
              )}
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[11px] text-[#6E655F] font-medium">
                  {session?.user?.name ? `Hola, ${session.user.name.split(' ')[0]}` : 'Ingresa'}
                </span>
                <span className="text-xs font-bold text-[#2B231F] flex items-center gap-0.5">
                  Mi Cuenta <ChevronDown className="w-3 h-3 text-[#6E655F]" />
                </span>
              </div>
            </button>

            {/* Account Popover */}
            {showAccountMenu && (
              <div className="absolute right-0 top-full pt-2 w-64 z-50">
                <div className="bg-white text-[#2B231F] rounded-2xl shadow-xl border border-[#EBE5DF] py-3 px-4 animate-in fade-in duration-150">
                  <div className="text-center pb-3 border-b border-[#EBE5DF]">
                    {session ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#FDF4EE] text-[#C85A32] font-black flex items-center justify-center text-sm mb-1.5 border border-[#C85A32]/25">
                          {session.user?.name?.charAt(0) || 'U'}
                        </div>
                        <p className="font-bold text-xs text-[#2B231F]">{session.user?.name}</p>
                        <p className="text-[11px] text-[#6E655F] truncate max-w-full">
                          {session.user?.email}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-[#6E655F] mb-2 font-medium">
                          Ingresa a tu cuenta oficial de NOVA
                        </p>
                        <button
                          onClick={handleSignIn}
                          className="w-full btn-nova-primary text-xs py-2 shadow-xs mb-1.5 flex items-center justify-center gap-2 cursor-pointer"
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
                    {session && (
                      <>
                        <Link
                          href="/perfil"
                          className="flex items-center gap-2.5 p-2 rounded-xl text-[#2B231F] hover:bg-[#FDFBF7] hover:text-[#C85A32] transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#6E655F]" />
                          <span className="font-semibold">Mi Perfil</span>
                        </Link>
                        <Link
                          href="/pedidos"
                          className="flex items-center gap-2.5 p-2 rounded-xl text-[#2B231F] hover:bg-[#FDFBF7] hover:text-[#C85A32] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#6E655F]" />
                          <span className="font-semibold">Mis Compras</span>
                        </Link>
                      </>
                    )}
                    <Link
                      href="/carrito"
                      className="flex items-center gap-2.5 p-2 rounded-xl text-[#2B231F] hover:bg-[#FDFBF7] hover:text-[#C85A32] transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 text-[#6E655F]" />
                      <span className="font-semibold">Mi Carrito</span>
                    </Link>


                    {session && (
                      <div className="pt-2 border-t border-[#EBE5DF] mt-1">
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-red-600 hover:bg-red-50 w-full text-left transition-colors cursor-pointer font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Button (Success #10B981) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold transition-all shadow-2xs shrink-0"
            title="Atención por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#10B981]" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>

          {/* Mis Compras Link */}
          {session && (
            <Link
              href="/pedidos"
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-[#F4EDE5] text-[#2B231F] transition-colors font-bold"
            >
              <Package className="w-4 h-4 text-[#6E655F]" />
              <span className="hidden md:inline">Mis compras</span>
            </Link>
          )}

          {/* Cart with Badge in Primary #C85A32 */}
          <Link
            href="/carrito"
            className="flex items-center justify-center sm:justify-start gap-1.5 w-11 h-11 sm:w-auto sm:h-auto sm:py-1.5 sm:px-2.5 rounded-xl hover:bg-[#F4EDE5] text-[#2B231F] transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-[#2B231F]" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C85A32] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="font-bold hidden lg:inline text-[#2B231F]">Carrito</span>
          </Link>
        </div>
      </div>

      {/* Second Row: Navigation & Location */}
      <div className="border-t border-[#EBE5DF] bg-[#FAF6F0] text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Location deliver-to */}
          <div className="flex items-center gap-1.5 text-[#2B231F] hover:text-[#C85A32] cursor-pointer py-1 px-2 rounded-lg hover:bg-white transition-colors">
            <MapPin className="w-4 h-4 text-[#C85A32]" />
            <div className="flex items-center gap-1">
              <span className="text-[#6E655F] font-medium">Enviar a</span>
              <span className="font-bold text-[#2B231F]">Lima, Perú</span>
            </div>
          </div>

          {/* Categories & Main Navigation in text-main */}
          <nav className="flex items-center gap-1">
            {/* Categorías Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowCategoriesMenu(true)}
              onMouseLeave={() => setShowCategoriesMenu(false)}
            >
              <button className="nova-nav-link flex items-center gap-1 cursor-pointer font-bold text-[#2B231F]">
                <span>Categorías</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E655F]" />
              </button>

              {showCategoriesMenu && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white text-[#2B231F] rounded-2xl shadow-xl border border-[#EBE5DF] py-2 animate-in fade-in duration-100">
                    {categories.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-[#6E655F]">
                        <p className="font-bold text-[#2B231F] mb-1">Sin categorías registradas</p>
                        <p className="text-[11px] text-[#6E655F]">
                          Registra categorías en NOVA BG para verlas aquí.
                        </p>
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categoria/${cat.slug}`}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#FDFBF7] hover:text-[#C85A32] font-semibold transition-colors"
                        >
                          <Layers className="w-4 h-4 text-[#C85A32]" />
                          <span>{cat.nombre}</span>
                        </Link>
                      ))
                    )}
                    <div className="border-t border-[#EBE5DF] my-1"></div>
                    <Link
                      href="/categoria/todos"
                      className="flex items-center justify-between px-4 py-2 text-xs font-bold text-[#C85A32] hover:bg-[#FDFBF7]"
                    >
                      <span>Ver catálogo completo</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Navbar Links for registered NOVA BG categories */}
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`} className="nova-nav-link font-semibold text-[#2B231F]">
                {cat.nombre}
              </Link>
            ))}


            {session && (
              <Link href="/pedidos" className="nova-nav-link font-semibold text-[#2B231F]">
                Mis Compras
              </Link>
            )}
          </nav>

          {/* NOVA Despacho Seguro Badge */}
          <div className="flex items-center gap-1.5 text-[#10B981] font-bold text-xs bg-[#ECFDF5] border border-[#10B981]/20 px-2.5 py-0.5 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-[#10B981]" />
            <span>Despacho Seguro a todo el Perú</span>
          </div>
        </div>
      </div>
    </header>
  )
}
