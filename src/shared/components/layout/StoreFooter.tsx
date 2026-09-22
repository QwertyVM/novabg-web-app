'use client'

import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  CreditCard,
  RotateCcw,
  ChevronUp,
  Phone,
  Mail,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { StorePublicConfig } from '@/features/catalog/services/store-config.service'
import { NovaLogo } from '@/shared/components/branding'

interface StoreFooterProps {
  categories?: NovaCategory[]
  storeConfig?: StorePublicConfig
}

export function StoreFooter({ categories = [], storeConfig }: StoreFooterProps) {
  const { data: session } = useSession()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const phone = storeConfig?.telefonoContacto || '+51 924 812 345'
  const cleanPhone = phone.replace(/[^\d]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    storeConfig?.whatsappMensaje || '¡Hola! Quisiera más información sobre los juegos de mesa.'
  )}`

  return (
    <footer className="mt-20 bg-[#F8F4EE] border-t border-[#EBE5DF] text-xs select-none text-[#6E655F]">
      {/* Back to top button */}
      <div className="border-b border-[#EBE5DF]">
        <button
          onClick={scrollToTop}
          className="w-full py-3.5 text-center text-xs font-bold text-[#C85A32] hover:text-[#A64724] hover:bg-[#F2EAE0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Volver arriba</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Trust Grid in Clean Surface */}
      <div className="bg-[#FAF6F0] border-b border-[#EBE5DF] py-10 px-4">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center gap-3 justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF4EE] text-[#C85A32] flex items-center justify-center shrink-0 border border-[#C85A32]/20 shadow-2xs">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2B231F] text-sm">Paga con total comodidad</h4>
              <p className="text-[#6E655F] text-xs mt-1.5 max-w-[200px] mx-auto">
                Yape, Plin, Tarjetas y Transferencias bancarias.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 border border-[#10B981]/25 shadow-2xs">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2B231F] text-sm">
                Envíos a todo el Perú
              </h4>
              <p className="text-[#6E655F] text-xs mt-1.5 max-w-[200px] mx-auto">
                {storeConfig?.politicaEnvios ||
                  'Despachos seguros a Lima y envíos certificados a provincias.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF4EE] text-[#C85A32] flex items-center justify-center shrink-0 border border-[#C85A32]/20 shadow-2xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2B231F] text-sm">Compra 100% Protegida</h4>
              <p className="text-[#6E655F] text-xs mt-1.5 max-w-[200px] mx-auto">
                Garantía oficial {storeConfig?.nombreTienda || 'NOVA'} en todos los productos.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F2EB] text-[#C85A32] flex items-center justify-center shrink-0 border border-[#D9B89C]/50 shadow-2xs">
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2B231F] text-sm">
                {storeConfig?.diasGarantia || 30} días de garantía
              </h4>
              <p className="text-[#6E655F] text-xs mt-1.5 max-w-[200px] mx-auto">
                Satisfacción lúdica garantizada o reemplazamos el artículo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Columns & Contact Details */}
      <div className="max-w-[1200px] mx-auto py-12 px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm text-[#2B231F] mb-3">Categorías de la Tienda</h3>
          <ul className="space-y-2 text-[#6E655F]">
            {categories.length === 0 ? (
              <li className="text-[#6E655F]">Catálogo oficial en actualización</li>
            ) : (
              categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="hover:text-[#C85A32] transition-colors"
                  >
                    {cat.nombre}
                  </Link>
                </li>
              ))
            )}

          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-[#2B231F] mb-3">Información Legal</h3>
          <ul className="space-y-2 text-[#6E655F]">
            {storeConfig?.ruc && (
              <li>
                <span className="text-[#6E655F] block">RUC:</span>
                <span className="font-mono font-bold text-[#2B231F]">{storeConfig.ruc}</span>
              </li>
            )}
            {storeConfig?.razonSocial && (
              <li>
                <span className="text-[#6E655F] block">Razón Social:</span>
                <span className="font-medium text-[#2B231F] leading-tight">
                  {storeConfig.razonSocial}
                </span>
              </li>
            )}
            {storeConfig?.direccionFisica && (
              <li>
                <span className="text-[#6E655F] block">Ubicación:</span>
                <span className="text-[#2B231F]">{storeConfig.direccionFisica}</span>
              </li>
            )}
            {storeConfig?.horarioAtencion && (
              <li>
                <span className="text-[#6E655F] block">Horario:</span>
                <span className="text-[#2B231F]">{storeConfig.horarioAtencion}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-[#2B231F] mb-3">Atención & Contacto</h3>
          <ul className="space-y-2.5 text-[#6E655F]">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#10B981] font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: {storeConfig?.telefonoContacto || '+51 924 812 345'}</span>
              </a>
            </li>
            {storeConfig?.emailContacto && (
              <li>
                <a
                  href={`mailto:${storeConfig.emailContacto}`}
                  className="flex items-center gap-2 hover:text-[#C85A32] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6E655F]" />
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
                  className="flex items-center gap-2 hover:text-[#C85A32] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-[#C85A32] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram Oficial</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-[#2B231F] mb-3">Ayuda & Soporte</h3>
          <ul className="space-y-2 text-[#6E6157]">
            {session && (
              <li>
                <Link href="/pedidos" className="hover:text-[#C85A32] transition-colors">
                  Rastrear mis Compras
                </Link>
              </li>
            )}
            <li>
              <Link href="/carrito" className="hover:text-[#C85A32] transition-colors">
                Mi Carrito de Compras
              </Link>
            </li>
            <li>
              <span className="text-[#6E655F]">Términos y Condiciones</span>
            </li>
            <li>
              <span className="text-[#6E655F]">Libro de Reclamaciones</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar in Clean Warm Light Scheme (NO dark elements) */}
      <div className="bg-[#F2EAE0] py-6 px-4 text-center text-[#6E655F] border-t border-[#EBE5DF]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NovaLogo size="sm" showBadge={false} />
            <span className="text-[11px] text-[#6E655F]">
              | RUC {storeConfig?.ruc || '20608934512'}
            </span>
          </div>

          <p className="text-[11px] text-[#6E655F]">
            © 2026 {storeConfig?.razonSocial || 'NOVA'}. Pasión por los juegos de mesa.
          </p>
        </div>
      </div>
    </footer>
  )
}
