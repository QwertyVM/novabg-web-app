import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Zap, MessageSquare } from 'lucide-react'
import prisma from '@/core/database/prisma'
import { ProductGallery, BuyBox, ProductItem } from '@/features/catalog'
import { ProductRow } from '@/features/home'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/shared/utils'
import { searchBggGame, fetchBggRating, needsBggRefresh } from '@/shared/utils/bgg'

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

  let tempPrice = Number(product.precioMercado)
  let calculatedDiscount = product.porcentajeDescuento

  if (product.enOferta) {
    if (product.precioOferta != null && Number(product.precioOferta) > 0) {
      tempPrice = Number(product.precioOferta)
      if (!calculatedDiscount && tempPrice < Number(product.precioMercado)) {
        calculatedDiscount = Math.round((1 - tempPrice / Number(product.precioMercado)) * 100)
      }
    } else {
      calculatedDiscount = calculatedDiscount || 15
      tempPrice = Number((Number(product.precioMercado) * (1 - calculatedDiscount / 100)).toFixed(2))
    }
  }

  const isEnOferta = product.enOferta && tempPrice < Number(product.precioMercado)
  const finalPrice = isEnOferta ? tempPrice : Number(product.precioMercado)
  const displayDiscount = product.badgePromocion || `${calculatedDiscount || 15}% OFF`

  // BGG Rating - fetch from BGG if not cached or stale
  let bggRating: number | null = product.bggRating ? Number(product.bggRating) : null
  let bggRatingCount: number | null = product.bggRatingCount ?? null

  if (needsBggRefresh(product.bggRatingUpdatedAt)) {
    try {
      // Find BGG ID if we don't have one yet
      let bggId = product.bggId ?? null
      if (!bggId) {
        bggId = await searchBggGame(product.nombreModelo)
      }
      if (bggId) {
        const bggData = await fetchBggRating(bggId)
        if (bggData) {
          bggRating = bggData.rating
          bggRatingCount = bggData.ratingCount
          // Cache in DB in background (don't await - let it run asynchronously)
          prisma.producto.update({
            where: { id: product.id },
            data: {
              bggId: bggData.bggId,
              bggRating: bggData.rating,
              bggRatingCount: bggData.ratingCount,
              bggRatingUpdatedAt: new Date(),
            },
          }).catch(() => {}) // silently ignore if fails
        }
      }
    } catch {
      // BGG unavailable - use cached value if any
    }
  }

  const imageSrc = product.imagenUrl || getProductImage(product.nombreModelo, product.lineaCategoria)
  const priceParts = formatPriceParts(finalPrice)
  const origPriceParts = formatPriceParts(Number(product.precioMercado))
  const deliveryDate = getEstimatedDeliveryDate()

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
  }))

  return (
    <div className="py-6 px-4 max-w-[1400px] mx-auto">
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#6E655F] mb-4 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#C85A32] font-semibold transition-colors">
          Inicio
        </Link>
        <span className="text-[#EBE5DF]">/</span>
        <Link href="/categoria/todos" className="hover:text-[#C85A32] font-semibold transition-colors">
          {product.lineaCategoria || 'Juegos de Mesa'}
        </Link>
        <span className="text-[#EBE5DF]">/</span>
        <span className="text-[#2B231F] font-bold truncate max-w-xs">{product.nombreModelo}</span>
      </nav>

      {/* Main Product Container in Surface Clean White */}
      <div className="bg-white rounded-3xl border border-[#EBE5DF] p-5 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5">
            <ProductGallery mainImage={imageSrc} title={product.nombreModelo} />
          </div>

          {/* Center Column: Product Details (4 cols) */}
          <div className="lg:col-span-4 space-y-4">


            {/* Title in text-main */}
            <h1 className="text-xl sm:text-2xl font-black text-[#2B231F] leading-tight">
              {product.nombreModelo}
            </h1>

            {/* Ratings - sourced from BoardGameGeek */}
            {bggRating !== null && (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-[#F59E0B]">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const filled = i <= Math.floor((bggRating! / 10) * 5)
                    return <Star key={i} className={`w-4 h-4 ${filled ? 'fill-current' : 'text-[#EBE5DF]'}`} />
                  })}
                </div>
                <span className="font-bold text-[#2B231F]">{bggRating.toFixed(1)}/10</span>
                {bggRatingCount ? (
                  <span className="text-[#6E655F]">({bggRatingCount.toLocaleString()} votos en BGG)</span>
                ) : null}
              </div>
            )}

            {/* Price Section */}
            <div className="py-3 border-y border-[#EBE5DF] space-y-1">
              {isEnOferta && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6E655F] line-through">
                    S/ {origPriceParts.integer},{origPriceParts.cents}
                  </span>
                  <span className="text-xs font-black text-[#C85A32] bg-[#FDF4EE] border border-[#C85A32]/30 px-2 py-0.5 rounded-md">
                    {displayDiscount}
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-[#2B231F]">S/</span>
                <span className="text-4xl font-black text-[#2B231F] tracking-tight">
                  {priceParts.integer}
                </span>
                <span className="text-sm font-bold text-[#2B231F] relative top-[-10px]">
                  {priceParts.cents}
                </span>
              </div>
            </div>

            {/* Delivery Callout */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EBE5DF] text-xs">
              <Zap className="w-5 h-5 fill-[#C85A32] text-[#C85A32] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#C85A32]">
                  Envíos a todo el país con despacho rápido
                </p>
                <p className="text-[#6E655F] text-[11px]">
                  Llega estimado el <strong className="text-[#2B231F]">{deliveryDate}</strong> (Lima y Provincias)
                </p>
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-sm text-[#2B231F]">Lo que tienes que saber de este producto</h3>
              <ul className="text-xs text-[#6E655F] space-y-2 list-disc pl-4">
                <li>
                  <strong className="text-[#2B231F]">Compatibilidad:</strong> Diseñado a medida para {product.nombreModelo}.
                </li>
                <li>
                  <strong className="text-[#2B231F]">Material de calidad:</strong> Componentes de alta densidad y durabilidad para proteger tus cartas y fichas.
                </li>
                <li>
                  <strong className="text-[#2B231F]">Setup optimizado:</strong> Acomoda las piezas rápidamente sobre la mesa para empezar a jugar de inmediato.
                </li>
                <li>
                  <strong className="text-[#2B231F]">Acabado suave:</strong> Cuida tus cartas y las cajas de tus juegos de mesa.
                </li>
              </ul>
            </div>

            {/* Technical Specifications (Strictly NO horizontal scroll per rules/tabla.md) */}
            <div className="pt-4 border-t border-[#EBE5DF]">
              <h3 className="font-bold text-sm text-[#2B231F] mb-3">Características principales</h3>
              <div className="nova-table-container">
                <table className="nova-table text-xs text-left border border-[#EBE5DF] rounded-2xl overflow-hidden">
                  <tbody>
                    <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                      <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Categoría</td>
                      <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.lineaCategoria}</td>
                    </tr>
                    <tr className="border-b border-[#EBE5DF]">
                      <td className="p-2.5 font-bold text-[#6E655F]">Modelo</td>
                      <td className="p-2.5 text-[#2B231F] font-medium">{product.nombreModelo}</td>
                    </tr>
                    <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                      <td className="p-2.5 font-bold text-[#6E655F]">Peso aproximado</td>
                      <td className="p-2.5 text-[#2B231F] font-medium">
                        {product.pesoGramos ? `${Number(product.pesoGramos)} g` : 'Optimizado'}
                      </td>
                    </tr>
                    <tr className="border-b border-[#EBE5DF]">
                      <td className="p-2.5 font-bold text-[#6E655F]">Disponibilidad</td>
                      <td className="p-2.5 text-[#10B981] font-bold">En Stock Inmediato</td>
                    </tr>
                    <tr className="bg-[#FDFBF7]">
                      <td className="p-2.5 font-bold text-[#6E655F]">Garantía</td>
                      <td className="p-2.5 text-[#2B231F] font-semibold">NOVA (Tienda Oficial)</td>
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
        <div className="mt-12 pt-8 border-t border-[#EBE5DF]">
          <h3 className="font-bold text-base text-[#2B231F] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C85A32]" />
            <span>Preguntas y respuestas frecuentes</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] space-y-1">
              <p className="font-bold text-[#2B231F]">¿Entran las cartas con fundas (sleeves/micas)?</p>
              <p className="text-[#6E655F]">
                ¡Hola! Sí, consideramos el grosor extra de cartas enfundadas (Premium y estándar).
              </p>
            </div>

            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] space-y-1">
              <p className="font-bold text-[#2B231F]">¿Hacen envíos a provincias de todo el Perú?</p>
              <p className="text-[#6E655F]">
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
