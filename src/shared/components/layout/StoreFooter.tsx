'use client'

import React from 'react'
import Link from 'next/link'
import {
  Dice5,
  ShieldCheck,
  Truck,
  CreditCard,
  RotateCcw,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
} from 'lucide-react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { StorePublicConfig } from '@/features/catalog/services/store-config.service'

interface StoreFooterProps {
  categories?: NovaCategory[]
  storeConfig?: StorePublicConfig
}

export function StoreFooter({ categories = [], storeConfig }: StoreFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const phone = storeConfig?.telefonoContacto || '+51 924 812 345'
  const cleanPhone = phone.replace(/[^\d]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    storeConfig?.whatsappMensaje || '¡Hola! Quisiera más información.'
  )}`

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

      {/* Trust Grid */}
      <div className="bg-[#f8fafc] border-b border-gray-100 py-8 px-4">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Paga con total comodidad</h4>
              <p className="text-gray-500 text-xs mt-0.5">
                Yape, Plin, Tarjetas de crédito/débito y Transferencias.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Envíos a todo el Perú
              </h4>
              <p className="text-gray-500 text-xs mt-0.5">
                {storeConfig?.politicaEnvios ||
                  'Despachos seguros a Lima Metropolitana y envíos certificados a provincias vía Olva Courier o Shalom.'}
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Compra 100% Protegida</h4>
              <p className="text-gray-500 text-xs mt-0.5">
                Garantía oficial {storeConfig?.nombreTienda || 'NOVA'} en todos tus productos.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                {storeConfig?.diasGarantia || 30} días de garantía
              </h4>
              <p className="text-gray-500 text-xs mt-0.5">
                ¿Algún problema con tu producto? Te devolvemos o reemplazamos el artículo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Columns & Contact Details */}
      <div className="max-w-[1200px] mx-auto py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Categorías de la Tienda</h3>
          <ul className="space-y-2 text-gray-600">
            {categories.length === 0 ? (
              <li className="text-gray-400">Catálogo oficial en actualización</li>
            ) : (
              categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="hover:text-[#0066ff] transition-colors"
                  >
                    {cat.nombre}
                  </Link>
                </li>
              ))
            )}
            <li>
              <Link href="/categoria/ofertas" className="hover:text-[#0066ff] font-semibold transition-colors">
                🔥 Ofertas Especiales
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Información Legal</h3>
          <ul className="space-y-2 text-gray-600">
            {storeConfig?.ruc && (
              <li>
                <span className="text-gray-500 block">RUC:</span>
                <span className="font-mono font-bold text-gray-800">{storeConfig.ruc}</span>
              </li>
            )}
            {storeConfig?.razonSocial && (
              <li>
                <span className="text-gray-500 block">Razón Social:</span>
                <span className="font-medium text-gray-800 leading-tight">
                  {storeConfig.razonSocial}
                </span>
              </li>
            )}
            {storeConfig?.direccionFisica && (
              <li>
                <span className="text-gray-500 block">Ubicación:</span>
                <span className="text-gray-700">{storeConfig.direccionFisica}</span>
              </li>
            )}
            {storeConfig?.horarioAtencion && (
              <li>
                <span className="text-gray-500 block">Horario:</span>
                <span className="text-gray-700">{storeConfig.horarioAtencion}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-3">Atención & Contacto</h3>
          <ul className="space-y-2.5 text-gray-600">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: {storeConfig?.telefonoContacto || '+51 924 812 345'}</span>
              </a>
            </li>
            {storeConfig?.emailContacto && (
              <li>
                <a
                  href={`mailto:${storeConfig.emailContacto}`}
                  className="flex items-center gap-2 hover:text-[#0066ff] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{storeConfig.emailContacto}</span>
                </a>
              </li>
            )}
            {storeConfig?.instagramUrl && (
              <li>
                <a
                  href={storeConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#0066ff] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-pink-600 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram Oficial</span>
                </a>
              </li>
            )}
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
              <Link href="/carrito" className="hover:text-[#0066ff] transition-colors">
                Mi Carrito de Compras
              </Link>
            </li>
            <li>
              <span className="text-gray-400">Términos y Condiciones</span>
            </li>
            <li>
              <span className="text-gray-400">Libro de Reclamaciones</span>
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
              {storeConfig?.nombreTienda || 'NOVA BG'}
            </span>
            <span className="text-[11px] text-gray-400">
              | RUC {storeConfig?.ruc || '20608934512'}
            </span>
          </div>

          <p className="text-[11px] text-gray-400">
            © 2026 {storeConfig?.razonSocial || 'NOVA'}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

