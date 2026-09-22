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
  Heart,
  Sparkles,
} from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'

interface AmazonHeaderProps {
  onOpenDrawer: () => void
}

export function AmazonHeader({ onOpenDrawer }: AmazonHeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { totalCount } = useCart()

  const [department, setDepartment] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      router.push('/categoria/juegos-de-mesa')
      return
    }
    const params = new URLSearchParams()
    params.set('q', searchTerm.trim())
    if (department !== 'todos') {
      params.set('dept', department)
    }
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <header className="bg-[#131921] text-white select-none sticky top-0 z-40 shadow-md">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-2 px-3 py-1.5 text-xs">
        {/* Amazon Logo */}
        <Link
          href="/"
          className="amazon-nav-item flex items-center gap-1 py-1 px-2 shrink-0 group"
        >
          <div className="flex flex-col items-start leading-none">
            <span className="text-xl font-black tracking-tighter text-white">
              amazon<span className="text-[#febd69]">.pe</span>
            </span>
            <span className="text-[10px] text-[#febd69] font-semibold -mt-1 tracking-wider uppercase">
              Juegos de Mesa
            </span>
          </div>
        </Link>

        {/* Deliver to Location */}
        <div className="amazon-nav-item hidden md:flex items-center gap-1 px-2 py-1 shrink-0 text-gray-300">
          <MapPin className="w-4 h-4 text-white" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-gray-300">Entregar en</span>
            <span className="text-xs font-bold text-white">Lima, Perú</span>
          </div>
        </div>

        {/* Amazon Multi-tier Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-3xl flex items-center h-10 rounded-md overflow-hidden bg-white mx-2 focus-within:ring-2 focus-within:ring-[#f90] shadow-xs"
        >
          {/* Department dropdown */}
          <div className="relative h-full bg-gray-100 border-r border-gray-300 text-gray-700 hover:bg-gray-200 shrink-0">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-full bg-transparent text-xs pl-3 pr-6 py-0 appearance-none outline-none cursor-pointer font-medium"
            >
              <option value="todos">Todos los departamentos</option>
              <option value="juegos-de-mesa">Juegos de Mesa</option>
              <option value="insertos">Insertos & Organizadores</option>
              <option value="rol">Torres de Dados & Rol</option>
              <option value="accesorios">Accesorios & Miniaturas</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar juegos de mesa, insertos, dados, organizadores..."
            className="flex-1 px-3 text-sm text-[#0f1111] outline-none h-full placeholder:text-gray-500"
          />

          {/* Search Submit Button */}
          <button
            type="submit"
            className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] flex items-center justify-center transition-colors cursor-pointer"
            title="Buscar"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </form>

        {/* Language / Country */}
        <div className="amazon-nav-item hidden lg:flex items-center gap-1 px-2 py-2 shrink-0">
          <span className="text-base">🇵🇪</span>
          <span className="font-bold text-xs">ES (PEN)</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>

        {/* Account & Lists */}
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
            className="amazon-nav-item flex flex-col items-start leading-tight px-2 py-1 text-left"
          >
            <span className="text-[11px] text-gray-200">
              Hola, {session?.user?.name ? session.user.name.split(' ')[0] : 'identifícate'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">Cuenta y Listas</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </button>

          {/* Account Dropdown */}
          {showAccountMenu && (
            <div className="absolute right-0 top-full mt-0.5 w-64 bg-white text-[#0f1111] rounded shadow-xl border border-gray-200 py-3 px-4 z-50 animate-in fade-in duration-150">
              <div className="text-center pb-3 border-b border-gray-200">
                {session ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm mb-1">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                    <p className="font-bold text-xs text-gray-900">{session.user?.name}</p>
                    <p className="text-[11px] text-gray-500 truncate max-w-full">{session.user?.email}</p>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => signIn('google')}
                      className="w-full btn-amazon-primary text-xs py-2 shadow-xs mb-2 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                      Identificarse con Google
                    </button>
                    <p className="text-[11px] text-gray-500">
                      ¿Cliente nuevo? Conéctate con Google
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 text-xs space-y-2">
                <div className="font-bold text-gray-900 mb-1">Mi Cuenta</div>
                <Link
                  href="/pedidos"
                  className="flex items-center gap-2 text-gray-700 hover:text-[#c7511f] hover:underline"
                >
                  <Package className="w-3.5 h-3.5" />
                  Mis Pedidos & Devoluciones
                </Link>
                <Link
                  href="/carrito"
                  className="flex items-center gap-2 text-gray-700 hover:text-[#c7511f] hover:underline"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Mi Carrito de Juegos
                </Link>
                <Link
                  href="/categoria/ofertas"
                  className="flex items-center gap-2 text-gray-700 hover:text-[#c7511f] hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Ofertas y Promociones
                </Link>

                {session && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-red-600 hover:underline w-full text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          href="/pedidos"
          className="amazon-nav-item hidden sm:flex flex-col items-start leading-tight px-2 py-1 shrink-0"
        >
          <span className="text-[11px] text-gray-200">Devoluciones</span>
          <span className="text-xs font-bold text-white">y Pedidos</span>
        </Link>

        {/* Shopping Cart */}
        <Link
          href="/carrito"
          className="amazon-nav-item flex items-end gap-1 px-2 py-1 relative shrink-0"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7 text-white" />
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#f08804] font-bold text-xs bg-transparent">
              {totalCount}
            </span>
          </div>
          <span className="font-bold text-xs text-white hidden sm:inline pb-0.5">Carrito</span>
        </Link>
      </div>
    </header>
  )
}
