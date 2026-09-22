'use client'

import React from 'react'
import Link from 'next/link'

export function AmazonFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-16 bg-[#232f3e] text-white text-xs select-none">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-center py-3.5 font-medium transition-colors cursor-pointer"
      >
        Inicio de página
      </button>

      {/* Multi-column navigation */}
      <div className="max-w-[1000px] mx-auto py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm text-white mb-3">Conócenos</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/nosotros" className="hover:underline">
                Sobre Juegos de Mesa
              </Link>
            </li>
            <li>
              <Link href="/categoria/insertos" className="hover:underline">
                Diseño 3D e Insertos
              </Link>
            </li>
            <li>
              <Link href="/categoria/juegos-de-mesa" className="hover:underline">
                Comunidad de Juegos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Gana Dinero</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/afiliados" className="hover:underline">
                Programa de Creadores
              </Link>
            </li>
            <li>
              <Link href="/taller" className="hover:underline">
                Prototipado a Pedido
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:underline">
                Vende tus Juegos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Métodos de Pago</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <span className="hover:underline">Yape / Plin</span>
            </li>
            <li>
              <span className="hover:underline">Tarjetas de Crédito / Débito</span>
            </li>
            <li>
              <span className="hover:underline">Transferencia BCP / Interbank</span>
            </li>
            <li>
              <span className="hover:underline">Pago contra entrega en Lima</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Podemos Ayudarte</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/pedidos" className="hover:underline">
                Rastrear tu Pedido
              </Link>
            </li>
            <li>
              <Link href="/tarifas-envio" className="hover:underline">
                Tarifas y Políticas de Envío
              </Link>
            </li>
            <li>
              <Link href="/devoluciones" className="hover:underline">
                Devoluciones y Reemplazos
              </Link>
            </li>
            <li>
              <Link href="/servicio-al-cliente" className="hover:underline">
                Ayuda y Atención al Cliente
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-[#3a4553]" />

      {/* Bottom bar */}
      <div className="bg-[#131921] py-8 text-center text-gray-400">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-lg font-black text-white">
            amazon<span className="text-[#febd69]">.pe</span>
          </span>
          <span className="border border-gray-600 rounded px-2 py-0.5 text-xs text-gray-300">
            🇵🇪 Perú (Soles PEN)
          </span>
        </div>
        <p className="text-[11px] text-gray-400">
          © 2026 Catálogo de Juegos de Mesa & Accesorios 3D. Inspirado en el diseño de Amazon.com.
        </p>
      </div>
    </footer>
  )
}
