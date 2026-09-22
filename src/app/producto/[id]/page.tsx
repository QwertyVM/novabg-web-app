import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Zap, MessageSquare } from 'lucide-react'
import prisma from '@/core/database/prisma'
import { ProductGallery, BuyBox, ProductItem, getNovaBgProductsWhere } from '@/features/catalog'
import { ProductRow } from '@/features/home'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/shared/utils'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params

  // Find product (active in either BG or 3D)
  const product = await prisma.producto.findFirst({
    where: {
      id,
      activo: true,
    },
  })

  if (!product) {
    notFound()
  }

  // Related products from the same business
  const relatedDb = await prisma.producto.findMany({
    where: {
      negocio: product.negocio,
      activo: true,
      id: { not: id },
    },
    take: 6,
  })

  const isEnOferta = product.enOferta && (product.precioOferta != null || (product.porcentajeDescuento ?? 0) > 0)
  const finalPrice = isEnOferta
    ? (product.precioOferta != null && Number(product.precioOferta) > 0
        ? Number(product.precioOferta)
        : Number((Number(product.precioMercado) * (1 - (product.porcentajeDescuento || 15) / 100)).toFixed(2)))
    : Number(product.precioMercado)

  const imageSrc = product.imagenUrl || getProductImage(product.nombreModelo, product.lineaCategoria)
  const priceParts = formatPriceParts(finalPrice)
  const origPriceParts = formatPriceParts(Number(product.precioMercado))
  const deliveryDate = getEstimatedDeliveryDate()
  const installment12x = (finalPrice / 12).toFixed(2)

  const currentProductItem: ProductItem = {
    id: product.id,
    negocio: product.negocio,
    nombreModelo: product.nombreModelo,
    lineaCategoria: product.lineaCategoria,
    precioMercado: Number(product.precioMercado),
    precioAmigos: product.precioAmigos ? Number(product.precioAmigos) : undefined,
    costoBase: product.costoBase ? Number(product.costoBase) : undefined,
    pesoGramos: product.pesoGramos ? Number(product.pesoGramos) : 0,
    stock: product.stock ?? 0,
    controlarStock: product.controlarStock ?? false,
    enOferta: product.enOferta ?? false,
    precioOferta: product.precioOferta ? Number(product.precioOferta) : null,
    porcentajeDescuento: product.porcentajeDescuento ?? 0,
    badgePromocion: product.badgePromocion || (product.enOferta ? `${product.porcentajeDescuento || 15}% OFF` : undefined),
    destacadoWeb: product.destacadoWeb ?? false,
    descripcionWeb: product.descripcionWeb || undefined,
    activo: product.activo ?? true,
    imagen: imageSrc,
  }

  const formattedRelated: ProductItem[] = relatedDb.map((p, idx) => ({
    id: p.id,
    negocio: p.negocio,
    nombreModelo: p.nombreModelo,
    lineaCategoria: p.lineaCategoria,
    precioMercado: Number(p.precioMercado),
    stock: p.stock ?? 0,
    controlarStock: p.controlarStock ?? false,
    enOferta: p.enOferta ?? false,
    precioOferta: p.precioOferta ? Number(p.precioOferta) : null,
    porcentajeDescuento: p.porcentajeDescuento ?? 0,
    badgePromocion: p.badgePromocion || undefined,
    imagen: p.imagenUrl || getProductImage(p.nombreModelo, p.lineaCategoria),
    rating: 4.8 + (idx % 2) * 0.1,
    reviewsCount: 32 + idx * 14,
  }))

  return (
    <div className="py-6 px-4 max-w-[1400px] mx-auto">
      {/* Breadcrumbs (Mercado Libre Style) */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#0066ff] transition-colors">
          Inicio
        </Link>
        <span className="text-gray-300">/</span>
        <Link href="/categoria/juegos-de-mesa" className="hover:text-[#0066ff] transition-colors">
          {product.lineaCategoria || 'Juegos de Mesa'}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.nombreModelo}</span>
      </nav>

      {/* Main Product Container */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-8 shadow-xs mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5">
            <ProductGallery mainImage={imageSrc} title={product.nombreModelo} />
          </div>

          {/* Center Column: Product Details (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Condition & Sales */}
            <div className="text-xs text-gray-400 font-medium">
              <span>Nuevo</span> • <span>+500 vendidos</span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {product.nombreModelo}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-[#ff9900]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-800">4.9</span>
              <span className="text-gray-400">(86 opiniones)</span>
            </div>

            {/* Price Section */}
            <div className="py-3 border-y border-gray-100 space-y-1">
              {isEnOferta && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    S/ {origPriceParts.integer},{origPriceParts.cents}
                  </span>
                  <span className="text-xs font-bold text-[#00a650] bg-emerald-50 px-2 py-0.5 rounded">
                    {product.badgePromocion || `${product.porcentajeDescuento || Math.round((1 - finalPrice / Number(product.precioMercado)) * 100)}% OFF`}
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-gray-900">S/</span>
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  {priceParts.integer}
                </span>
                <span className="text-sm font-bold text-gray-900 relative top-[-10px]">
                  {priceParts.cents}
                </span>
              </div>

              <p className="text-xs text-gray-600">
                en <strong className="text-[#00a650]">12x S/ {installment12x} sin interés</strong>
              </p>
            </div>

            {/* Delivery Callout */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
              <Zap className="w-5 h-5 fill-[#0066ff] text-[#0066ff] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#0066ff]">
                  Envíos a todo el país con despacho rápido
                </p>
                <p className="text-gray-600 text-[11px]">
                  Llega estimado el <strong>{deliveryDate}</strong> (Lima y Provincias)
                </p>
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-sm text-gray-900">Lo que tienes que saber de este producto</h3>
              <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                <li>
                  <strong className="text-gray-800">Compatibilidad:</strong> Diseñado a medida para {product.nombreModelo}.
                </li>
                <li>
                  <strong className="text-gray-800">Material de calidad:</strong> Componentes de alta densidad y durabilidad para proteger tus cartas y fichas.
                </li>
                <li>
                  <strong className="text-gray-800">Setup optimizado:</strong> Acomoda las piezas rápidamente sobre la mesa para empezar a jugar de inmediato.
                </li>
                <li>
                  <strong className="text-gray-800">Acabado suave:</strong> Cuida tus cartas y las cajas de tus juegos de mesa.
                </li>
              </ul>
            </div>

            {/* Technical Specifications (Strictly NO horizontal scroll per rules/tabla.md) */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Características principales</h3>
              <div className="nova-table-container">
                <table className="nova-table text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
                  <tbody>
                    <tr className="border-b border-gray-200 bg-gray-50/70">
                      <td className="p-2.5 font-bold text-gray-700 w-1/3">Categoría</td>
                      <td className="p-2.5 text-gray-900 w-2/3">{product.lineaCategoria}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold text-gray-700">Modelo</td>
                      <td className="p-2.5 text-gray-900">{product.nombreModelo}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50/70">
                      <td className="p-2.5 font-bold text-gray-700">Peso aproximado</td>
                      <td className="p-2.5 text-gray-900">
                        {product.pesoGramos ? `${Number(product.pesoGramos)} g` : 'Optimizado'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2.5 font-bold text-gray-700">Disponibilidad</td>
                      <td className="p-2.5 text-emerald-700 font-bold">En Stock Inmediato</td>
                    </tr>
                    <tr className="bg-gray-50/70">
                      <td className="p-2.5 font-bold text-gray-700">Garantía</td>
                      <td className="p-2.5 text-gray-900 font-semibold">NOVA BG (Tienda Oficial)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Buy Box (3 cols) */}
          <div className="lg:col-span-3">
            <BuyBox product={currentProductItem} />
          </div>
        </div>

        {/* Questions and Answers Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0066ff]" />
            <span>Preguntas y respuestas frecuentes</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-1">
              <p className="font-bold text-gray-900">¿Entran las cartas con fundas (sleeves/micas)?</p>
              <p className="text-gray-600">
                ¡Hola! Sí, consideramos el grosor extra de cartas enfundadas (Premium y estándar).
              </p>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-1">
              <p className="font-bold text-gray-900">¿Hacen envíos a provincias de todo el Perú?</p>
              <p className="text-gray-600">
                ¡Correcto! Despachamos a nivel nacional mediante Olva Courier y Shalom con código de seguimiento en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {formattedRelated.length > 0 && (
        <ProductRow
          title="Quienes vieron este producto también compraron"
          subtitle="Accesorios y complementos recomendados para tu colección"
          products={formattedRelated}
        />
      )}
    </div>
  )
}
