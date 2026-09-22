'use client'

import React from 'react'
import Link from 'next/link'
import { Dice5, ShieldCheck, Truck, CreditCard, RotateCcw, ChevronUp } from 'lucide-react'
import { NovaCategory } from '@/actions/categories'

interface AmazonFooterProps {
  categories?: NovaCategory[]
}

export function AmazonFooter({ categories = [] }: AmazonFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-20 bg-white border-t border-gray-200 text-xs select-none text-gray-600">
      {/* Back to top button */}
      <div className="border-b border-gray-100">
        <button
          onClick={scrollToTop}
          className="w-full py-3.5 text-center text-xs font-semibold text-[#0066ff] hover:text-[#0052cc] hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Volver arriba</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Mercado Libre Style Benefit Trust Grid */}
      <div className="bg-[#f8fafc] border-b border-gray-100 py-8 px-4">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Paga con total comodidad</h4>
              <p className="text-gray-500 text-xs mt-0.5">Yape, Plin, Tarjetas de crédito/débito y Transferencias.</p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Envío rápido FULL</h4>
              <p className="text-gray-500 text-xs mt-0.5">Despacho express a Lima y envíos certificados a todo el país.</p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Compra Protegida</h4>
              <p className="text-gray-500 text-xs mt-0.5">Garantía oficial NOVA BG en todos tus juegos y accesorios.</p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">30 días de garantía</h4>
              <p className="text-gray-500 text-xs mt-0.5">¿Algún problema con tu producto? Te devolvemos o reemplazamos el artículo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Columns */}
      <div className="max-w-[1200px] mx-auto py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Categorías NOVA BG</h3>
          <ul className="space-y-2 text-gray-600">
            {categories.length === 0 ? (
              <li className="text-gray-400">Próximamente nuevas categorías</li>
            ) : (
              categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categoria/${cat.slug}`} className="hover:text-[#0066ff] transition-colors">
                    {cat.nombre}
                  </Link>
                </li>
              ))
            )}
            <li>
              <Link href="/categoria/ofertas" className="hover:text-[#0066ff] transition-colors">
                Ofertas & Promociones
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Acerca de NOVA BG</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <span className="hover:text-[#0066ff] cursor-pointer">
                Nuestra Tienda
              </span>
            </li>
            <li>
              <span className="hover:text-[#0066ff] cursor-pointer">
                Control de Calidad
              </span>
            </li>
            <li>
              <span className="hover:text-[#0066ff] cursor-pointer">
                Comunidad de Juegos
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Métodos de Pago</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <span className="font-medium text-gray-800">Yape / Plin</span>
            </li>
            <li>
              <span className="font-medium text-gray-800">Tarjetas Visa / Mastercard</span>
            </li>
            <li>
              <span className="font-medium text-gray-800">Transferencia BCP / Interbank</span>
            </li>
            <li>
              <span className="font-medium text-gray-800">Pago Contra Entrega en Lima</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Ayuda & Soporte</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/pedidos" className="hover:text-[#0066ff] transition-colors">
                Rastrear mis Compras
              </Link>
            </li>
            <li>
              <span className="hover:text-[#0066ff] cursor-pointer">
                Tiempos y Costos de Envío
              </span>
            </li>
            <li>
              <span className="hover:text-[#0066ff] cursor-pointer">
                Términos y Condiciones
              </span>
            </li>
            <li>
              <span className="hover:text-[#0066ff] cursor-pointer">
                Atención al Cliente
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0f172a] py-6 px-4 text-center text-gray-400">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
              <Dice5 className="w-4 h-4 text-[#00d2ff]" />
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              NOVA <span className="text-[#00d2ff]">BG</span>
            </span>
            <span className="text-[11px] text-gray-500">| Tienda Oficial de Juegos de Mesa</span>
          </div>

          <p className="text-[11px] text-gray-400">
            © 2026 NOVA BG. Todos los derechos reservados. Tienda Oficial de Juegos de Mesa.
          </p>
        </div>
      </div>
    </footer>
  )
}
