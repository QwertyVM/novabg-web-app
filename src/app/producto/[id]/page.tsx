import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/core/database/prisma'
import { ProductGallery, BuyBox, ProductItem, ExpandableDescription, ProductReviewsSection } from '@/features/catalog'
import { ProductRow } from '@/features/home'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/shared/utils'
import { BggStatsBadge } from '@/features/catalog/components/BggStatsBadge'
import { Star } from 'lucide-react'

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

  const reviewsCount = comentariosDb.length
  const avgRating = reviewsCount > 0
    ? comentariosDb.reduce((acc, c) => acc + c.calificacion, 0) / reviewsCount
    : 5.0

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

  // BGG Rating - leído directamente desde la base de datos local (0 llamadas a BGG)
  const bggRating: number | null = product.bggRating ? Number(product.bggRating) : null
  const bggRatingCount: number | null = product.bggRatingCount ?? null

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

            {/* 1. Rating de Clientes de la Tienda */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <div className="flex text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      reviewsCount > 0
                        ? i <= Math.floor(avgRating)
                          ? 'fill-current text-[#F59E0B]'
                          : 'text-[#EBE5DF]'
                        : 'fill-current text-[#F59E0B]'
                    }`}
                  />
                ))}
              </div>
              <span className="font-black text-[#2B231F]">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-[#6E655F]">
                ({reviewsCount} {reviewsCount === 1 ? 'opinión' : 'opiniones'})
              </span>
            </div>

            {/* 2. Ratings y Estadísticas BGG - Desde Base de Datos local */}
            {(product.bggRating || product.bggWeight || product.bggPlaytime) ? (
              <BggStatsBadge 
                bggId={product.bggId || undefined}
                rating={product.bggRating ? Number(product.bggRating) : undefined} 
                weight={product.bggWeight ? Number(product.bggWeight) : undefined} 
                minPlayers={product.bggMinPlayers || undefined}
                maxPlayers={product.bggMaxPlayers || undefined}
                playtime={product.bggPlaytime || undefined}
              />
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

            {/* Technical Specifications — BG specs from DB, fallback for 3D */}
            {[product.editorialMarca, product.numJugadores, product.edadMinima, product.duracionMinutos, product.idioma, product.mecanicas].some(Boolean) && (
              <div className="pt-4 border-t border-[#EBE5DF]">
                <h3 className="font-bold text-sm text-[#2B231F] mb-3">Características principales</h3>
                <div className="nova-table-container">
                  <table className="nova-table text-xs text-left border border-[#EBE5DF] rounded-2xl overflow-hidden w-full">
                    <tbody>
                      {product.editorialMarca && (
                        <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                          <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Editorial</td>
                          <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.editorialMarca}</td>
                        </tr>
                      )}
                      {product.numJugadores && (
                        <tr className="border-b border-[#EBE5DF]">
                          <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Jugadores</td>
                          <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.numJugadores}</td>
                        </tr>
                      )}
                      {product.edadMinima && (
                        <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                          <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Edad mínima</td>
                          <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.edadMinima}+ años</td>
                        </tr>
                      )}
                      {product.duracionMinutos && (
                        <tr className="border-b border-[#EBE5DF]">
                          <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Duración</td>
                          <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.duracionMinutos} min aprox.</td>
                        </tr>
                      )}
                      {product.idioma && (
                        <tr className="border-b border-[#EBE5DF] bg-[#FDFBF7]">
                          <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Idioma</td>
                          <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.idioma}</td>
                        </tr>
                      )}
                      {product.mecanicas && (
                        <tr className="border-b border-[#EBE5DF]">
                          <td className="p-2.5 font-bold text-[#6E655F] w-1/3">Mecánicas</td>
                          <td className="p-2.5 text-[#2B231F] font-medium w-2/3">{product.mecanicas}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Descripción Web con Ver más */}
            {product.descripcionWeb && (
              <ExpandableDescription description={product.descripcionWeb} className="pt-4" />
            )}
          </div>

          {/* Right Column: Buy Box (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <BuyBox product={currentProductItem} />
          </div>
        </div>

        {/* Reseñas y Calificaciones de Compradores */}
        <ProductReviewsSection
          productoId={id}
          productTitle={product.nombreModelo}
          initialComentarios={comentariosDb.map((c) => ({
            id: c.id,
            autor: c.autor,
            texto: c.texto,
            calificacion: c.calificacion,
            createdAt: c.createdAt.toISOString(),
          }))}
        />
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
