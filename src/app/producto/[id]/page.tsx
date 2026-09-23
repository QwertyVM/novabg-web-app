import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Zap, MessageSquare } from 'lucide-react'
import prisma from '@/core/database/prisma'
import { ProductGallery, BuyBox, ProductItem } from '@/features/catalog'
import { ProductRow } from '@/features/home'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/shared/utils'
import { searchBggGame, fetchBggRating, needsBggRefresh } from '@/shared/utils/bgg'
import { BggStatsClient } from '@/features/catalog/components/BggStatsClient'

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
  const [relatedDb, comentariosDb] = await Promise.all([
    prisma.producto.findMany({
      where: {
        negocio: product.negocio,
        activo: true,
        id: { not: id },
      },
      take: 6,
    }),
    prisma.comentarioProducto.findMany({
      where: { productoId: id, activo: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

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

            {/* Ratings y Estadísticas BGG - Desde el Cliente para evadir Vercel */}
            {product.bggId ? (
              <BggStatsClient bggId={Number(product.bggId)} />
            ) : bggRating !== null ? (
              <div className="flex items-center gap-2 text-xs mt-2 mb-4">
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
            ) : null}

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
              <p className="font-bold text-[#C85A32]">Enviamos a todo el país</p>
            </div>

            {/* Highlights bullet points - from DB */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-sm text-[#2B231F]">Lo que tienes que saber de este producto</h3>
              <ul className="text-xs text-[#6E655F] space-y-2 list-disc pl-4">
                {[product.bulletPoint1, product.bulletPoint2, product.bulletPoint3, product.bulletPoint4]
                  .filter(Boolean)
                  .map((bp, i) => (
                    <li key={i}><span className="text-[#2B231F]">{bp}</span></li>
                  ))}
                {![product.bulletPoint1, product.bulletPoint2, product.bulletPoint3, product.bulletPoint4].some(Boolean) && (
                  <>
                    <li><strong className="text-[#2B231F]">Compatibilidad:</strong> Diseñado a medida para {product.nombreModelo}.</li>
                    <li><strong className="text-[#2B231F]">Material de calidad:</strong> Componentes de alta densidad y durabilidad para proteger tus cartas y fichas.</li>
                    <li><strong className="text-[#2B231F]">Setup optimizado:</strong> Acomoda las piezas rápidamente sobre la mesa para empezar a jugar de inmediato.</li>
                    <li><strong className="text-[#2B231F]">Acabado suave:</strong> Cuida tus cartas y las cajas de tus juegos de mesa.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Technical Specifications — BG specs from DB, fallback for 3D */}
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
                    {product.editorialMarca && (
                      <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Editorial</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">{product.editorialMarca}</td>
                      </tr>
                    )}
                    {product.numJugadores && (
                      <tr className="border-b border-[#EBE5DF]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Jugadores</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">{product.numJugadores}</td>
                      </tr>
                    )}
                    {product.edadMinima && (
                      <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Edad mínima</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">{product.edadMinima}+ años</td>
                      </tr>
                    )}
                    {product.duracionMinutos && (
                      <tr className="border-b border-[#EBE5DF]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Duración</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">{product.duracionMinutos} min aprox.</td>
                      </tr>
                    )}
                    {product.idioma && (
                      <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Idioma</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">{product.idioma}</td>
                      </tr>
                    )}
                    {product.mecanicas && (
                      <tr className="border-b border-[#EBE5DF]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Mecánicas</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">{product.mecanicas}</td>
                      </tr>
                    )}
                    {!product.numJugadores && !product.editorialMarca && (
                      <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                        <td className="p-2.5 font-bold text-[#6E655F]">Peso aproximado</td>
                        <td className="p-2.5 text-[#2B231F] font-medium">
                          {product.pesoGramos ? `${Number(product.pesoGramos)} g` : 'Optimizado'}
                        </td>
                      </tr>
                    )}
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

        {/* Reñas / Comentarios de Compradores */}
        <div className="mt-12 pt-8 border-t border-[#EBE5DF]">
          <h3 className="font-bold text-base text-[#2B231F] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C85A32]" />
            <span>Reseñas de compradores</span>
            {comentariosDb.length > 0 && (
              <span className="text-xs font-normal text-[#6E655F]">({comentariosDb.length})</span>
            )}
          </h3>

          {comentariosDb.length === 0 ? (
            <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] text-center text-xs text-[#6E655F]">
              <MessageSquare className="w-8 h-8 mx-auto text-[#EBE5DF] mb-2" />
              <p className="font-medium">Aún no hay reseñas para este producto.</p>
              <p className="mt-1">Sé el primero en compartir tu experiencia.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Promedio de calificación */}
              {comentariosDb.length > 0 && (() => {
                const avg = comentariosDb.reduce((s, c) => s + c.calificacion, 0) / comentariosDb.length
                return (
                  <div className="flex items-center gap-3 p-4 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF]">
                    <div className="text-center">
                      <div className="text-3xl font-black text-[#2B231F]">{avg.toFixed(1)}</div>
                      <div className="flex text-[#F59E0B] justify-center mt-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= Math.round(avg) ? 'fill-current' : 'text-[#EBE5DF]'}`} />
                        ))}
                      </div>
                      <div className="text-[10px] text-[#6E655F] mt-0.5">{comentariosDb.length} reseña{comentariosDb.length !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5,4,3,2,1].map(star => {
                        const count = comentariosDb.filter(c => c.calificacion === star).length
                        const pct = comentariosDb.length > 0 ? (count / comentariosDb.length) * 100 : 0
                        return (
                          <div key={star} className="flex items-center gap-2 text-[10px]">
                            <span className="w-3 text-right text-[#6E655F]">{star}</span>
                            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                            <div className="flex-1 bg-[#EBE5DF] rounded-full h-2">
                              <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-4 text-[#6E655F]">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Lista de comentarios */}
              {comentariosDb.map((c) => (
                <div key={c.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center font-black text-xs">
                        {c.autor.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-xs text-[#2B231F]">{c.autor}</span>
                    </div>
                    <div className="flex text-[#F59E0B]">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= c.calificacion ? 'fill-current' : 'text-[#EBE5DF]'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#6E655F] leading-relaxed">{c.texto}</p>
                  <p className="text-[10px] text-[#9E8F87]">{new Date(c.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
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
