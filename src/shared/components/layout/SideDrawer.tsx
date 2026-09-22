'use client'

import React from 'react'
import Link from 'next/link'
import { X, User, ChevronRight, HelpCircle, Layers, LogOut, Package, ShoppingCart, Sparkles } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { NovaLogo } from '@/shared/components/branding'

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
        className="fixed inset-0 bg-black/40 transition-opacity backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header in Light Warm Scheme */}
        <div className="bg-[#F8F2EB] text-[#2B231F] p-5 flex items-center justify-between border-b border-[#EBE5DF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF4EE] text-[#C85A32] flex items-center justify-center border border-[#C85A32]/25 shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2B231F]">
                {session?.user?.name ? `Hola, ${session.user.name.split(' ')[0]}` : 'Bienvenido'}
              </p>
              {!session ? (
                <button
                  onClick={() => {
                    onClose()
                    signIn('google')
                  }}
                  className="text-xs text-[#C85A32] hover:underline font-bold cursor-pointer"
                >
                  Ingresa con Google
                </button>
              ) : (
                <p className="text-[11px] text-[#6E655F] truncate max-w-[150px]">
                  {session.user?.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6E655F] hover:text-[#2B231F] p-1.5 rounded-xl hover:bg-[#F3ECE2] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content in Clean Surface */}
        <div className="flex-1 overflow-y-auto py-4 text-sm text-[#2B231F] bg-white">
          <div className="px-5 mb-3">
            <NovaLogo size="sm" />
          </div>

          <div className="px-5 py-2 text-[11px] font-bold text-[#6E655F] uppercase tracking-wider">
            Categorías NOVA
          </div>

          {categories.length === 0 ? (
            <div className="px-5 py-3 text-xs text-[#6E655F]">
              Sin categorías registradas en NOVA BG
            </div>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3 hover:bg-white hover:text-[#C85A32] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#C85A32]" />
                  <span className="font-semibold text-[#2B231F]">{cat.nombre}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D9B89C]" />
              </Link>
            ))
          )}

          <Link
            href="/categoria/ofertas"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-white hover:text-[#C85A32] transition-colors"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C85A32]" />
              <span className="font-bold text-[#C85A32]">Ofertas Especiales</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#D9B89C]" />
          </Link>

          <hr className="my-3 border-[#EBE5DF]" />

          <div className="px-5 py-2 text-[11px] font-bold text-[#6E655F] uppercase tracking-wider">
            Mi Cuenta
          </div>
          <Link
            href="/pedidos"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-white transition-colors"
          >
            <span className="font-semibold text-[#2B231F]">Mis Compras</span>
            <ChevronRight className="w-4 h-4 text-[#D9B89C]" />
          </Link>
          <Link
            href="/carrito"
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 hover:bg-white transition-colors"
          >
            <span className="font-semibold text-[#2B231F]">Mi Carrito</span>
            <ChevronRight className="w-4 h-4 text-[#D9B89C]" />
          </Link>

          {session && (
            <div className="pt-3 px-5 border-t border-[#EBE5DF] mt-3">
              <button
                onClick={() => {
                  onClose()
                  signOut()
                }}
                className="flex items-center gap-2 text-red-600 font-bold py-2 hover:underline cursor-pointer"
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
