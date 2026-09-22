'use client'

import React from 'react'
import Link from 'next/link'

export function DashboardCards() {
  return (
    <div className="relative z-30 -mt-20 sm:-mt-32 md:-mt-44 px-4 max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: 4-Quadrant Card for Insertos */}
      <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col justify-between border border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            Insertos & Organizadores de Juego
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/categoria/insertos" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=400&q=80"
                  alt="Insertos Zombicide"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Zombicide 2ª Ed.
              </p>
            </Link>

            <Link href="/categoria/insertos" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80"
                  alt="Gloomhaven Jaws"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Gloomhaven Jaws
              </p>
            </Link>

            <Link href="/categoria/insertos" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=400&q=80"
                  alt="SETI Organizador"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                SETI Organizador
              </p>
            </Link>

            <Link href="/categoria/insertos" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80"
                  alt="Bandejas de Fichas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Bandejas Token
              </p>
            </Link>
          </div>
        </div>
        <Link
          href="/categoria/insertos"
          className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
        >
          Ver todos los insertos &rarr;
        </Link>
      </div>

      {/* Card 2: 4-Quadrant Card for RPG / Rol */}
      <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col justify-between border border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            Accesorios de Rol & Fantasía
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/categoria/rol" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80"
                  alt="Torre de Dragón"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Torre de Dragón
              </p>
            </Link>

            <Link href="/categoria/rol" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=400&q=80"
                  alt="Castillo Escalera"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Castillo Escalera
              </p>
            </Link>

            <Link href="/categoria/rol" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80"
                  alt="Bandejas de Dados"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Bandejas de Tiradas
              </p>
            </Link>

            <Link href="/categoria/rol" className="group block">
              <div className="aspect-square bg-gray-100 rounded-xs overflow-hidden mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=400&q=80"
                  alt="Contadores de Vida"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] text-gray-700 font-medium line-clamp-1 group-hover:text-[#c7511f]">
                Contadores de Vida
              </p>
            </Link>
          </div>
        </div>
        <Link
          href="/categoria/rol"
          className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
        >
          Explorar accesorios de rol &rarr;
        </Link>
      </div>

      {/* Card 3: Single Feature Card for Board Games */}
      <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col justify-between border border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            Mansiones de la Locura & Sets
          </h2>
          <Link href="/categoria/juegos-de-mesa" className="group block mb-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-xs overflow-hidden mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80"
                alt="Mansiones de la Locura"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-xs text-gray-700 font-medium group-hover:text-[#c7511f]">
              Kits de 1 a 3 jugadores con tableros individuales y marcadores
            </p>
          </Link>
        </div>
        <Link
          href="/categoria/juegos-de-mesa"
          className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
        >
          Ver juegos y sets &rarr;
        </Link>
      </div>

      {/* Card 4: Deals & Promotions */}
      <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col justify-between border border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase">
              Oferta destacada
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            Descuentos de Temporada
          </h2>
          <Link href="/categoria/ofertas" className="group block mb-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-xs overflow-hidden mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80"
                alt="Ofertas en Juegos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-xs text-gray-700 font-medium group-hover:text-[#c7511f]">
              Hasta 20% de descuento en insertos y accesorios seleccionados
            </p>
          </Link>
        </div>
        <Link
          href="/categoria/ofertas"
          className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
        >
          Ver todas las ofertas &rarr;
        </Link>
      </div>
    </div>
  )
}
