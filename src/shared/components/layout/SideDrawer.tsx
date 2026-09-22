'use client'

import React from 'react'
import Link from 'next/link'
import { X, User, ChevronRight, HelpCircle, Layers, LogOut, Package, ShoppingCart, Sparkles } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  categories?: NovaCategory[]
}

export function SideDrawer({ isOpen, onClose, categories = [] }: SideDrawerProps) {
  const { data: session } = useSession()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="bg-[#0066ff] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {session?.user?.name ? `Hola, ${session.user.name.split(' ')[0]}` : 'Bienvenido'}
              </p>
              {!session ? (
                <button
                  onClick={() => {
                    onClose()
                    signIn('google')
                  }}
                  className="text-xs text-[#00d2ff] hover:underline font-medium cursor-pointer"
                >
                  Ingresa con Google
                </button>
              ) : (
                <p className="text-[11px] text-white/80 truncate max-w-[150px]">
                  {session.user?.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/15 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 text-sm text-[#191919]">
          <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Categorías NOVA BG
          </div>

          {categories.length === 0 ? (
            <div className="px-5 py-3 text-xs text-gray-400">
              Sin categorías registradas en NOVA BG
            </div>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/70 hover:text-[#0066ff] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#0066ff]" />
                  <span className="font-medium">{cat.nombre}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))
          )}

          <Link
            href="/categoria/ofertas"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/70 hover:text-[#0066ff] transition-colors"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#0066ff]" />
              <span className="font-medium">Ofertas Especiales</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>

          <hr className="my-3 border-gray-100" />

          <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Mi Cuenta
          </div>
          <Link
            href="/pedidos"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">Mis Compras</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
          <Link
            href="/carrito"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">Mi Carrito</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
          <Link
            href="/servicio-al-cliente"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Ayuda y Contacto</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>

          {session && (
            <div className="pt-3 px-5 border-t border-gray-100 mt-3">
              <button
                onClick={() => {
                  onClose()
                  signOut()
                }}
                className="flex items-center gap-2 text-red-600 font-medium py-2 hover:underline cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
