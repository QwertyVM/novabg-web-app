'use client'

import React from 'react'
import Link from 'next/link'
import { X, User, ChevronRight, Dice5, Box, Shield, Sparkles, Phone, HelpCircle } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { data: session } = useSession()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                Hola, {session?.user?.name ? session.user.name.split(' ')[0] : 'Identifícate'}
              </p>
              {!session && (
                <button
                  onClick={() => {
                    onClose()
                    signIn('google')
                  }}
                  className="text-xs text-amber-300 hover:underline"
                >
                  Conectar con Google
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-sm hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2 text-sm text-[#0f1111]">
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Tendencias y Destacados
          </div>
          <Link
            href="/categoria/juegos-de-mesa"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2.5">
              <Dice5 className="w-4 h-4 text-amber-600" />
              Los Más Vendidos
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/categoria/insertos"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2.5">
              <Box className="w-4 h-4 text-amber-600" />
              Insertos & Organizadores
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/categoria/rol"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-amber-600" />
              Torres de Dados & Rol
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/categoria/ofertas"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Ofertas Relámpago
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <hr className="my-2 border-gray-200" />

          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Departamentos de Juegos
          </div>
          <Link
            href="/categoria/juegos-de-mesa"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span>Juegos de Tablero & Estrategia</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/categoria/insertos"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span>Insertos 3D para Cajas de Juegos</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/categoria/rol"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span>Accesorios de Rol (D&D, Torres, Dados)</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <hr className="my-2 border-gray-200" />

          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Ayuda y Configuración
          </div>
          <Link
            href="/pedidos"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span>Mis Pedidos</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            href="/servicio-al-cliente"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-500" />
              Servicio al Cliente
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          {session ? (
            <button
              onClick={() => {
                onClose()
                signOut()
              }}
              className="w-full text-left px-4 py-2.5 text-red-600 font-medium hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={() => {
                onClose()
                signIn('google')
              }}
              className="w-full text-left px-4 py-2.5 text-blue-600 font-medium hover:bg-gray-100"
            >
              Identificarse con Google
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
