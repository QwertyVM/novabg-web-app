'use client'

import React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'

interface AmazonSubNavProps {
  onOpenDrawer: () => void
}

export function AmazonSubNav({ onOpenDrawer }: AmazonSubNavProps) {
  return (
    <div className="bg-[#232f3e] text-white text-xs px-3 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-xs">
      <button
        onClick={onOpenDrawer}
        className="amazon-nav-item flex items-center gap-1 font-bold shrink-0 text-white"
      >
        <Menu className="w-4 h-4" />
        <span>Todo</span>
      </button>

      <Link
        href="/categoria/juegos-de-mesa"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100"
      >
        Juegos de Mesa
      </Link>
      <Link
        href="/categoria/insertos"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100"
      >
        Insertos y Organizadores
      </Link>
      <Link
        href="/categoria/rol"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100"
      >
        Torres de Dados & Rol
      </Link>
      <Link
        href="/categoria/ofertas"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100"
      >
        Ofertas del Día
      </Link>
      <Link
        href="/categoria/mas-vendidos"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100"
      >
        Los Más Vendidos
      </Link>
      <Link
        href="/pedidos"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100 hidden md:inline"
      >
        Mis Pedidos
      </Link>
      <Link
        href="/servicio-al-cliente"
        className="amazon-nav-item shrink-0 whitespace-nowrap text-gray-100 hidden lg:inline"
      >
        Servicio al Cliente
      </Link>

      <div className="ml-auto hidden xl:flex items-center gap-2 font-medium text-amber-300 pr-2">
        <span>⚡ Envíos rápidos a todo el Perú</span>
      </div>
    </div>
  )
}
