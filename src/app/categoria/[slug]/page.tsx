import React from 'react'
import Link from 'next/link'
import prisma from '@/core/database/prisma'
import { ProductCard, ProductItem, getNovaStoreCategories, CategoryFilterSidebar } from '@/features/catalog'
import { getProductImage } from '@/shared/utils'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const sParams = await searchParams
  
  const targetNegocio = sParams.sec === '3D' ? '3D' : 'BG'
  const minPrice = typeof sParams.min === 'string' && !isNaN(Number(sParams.min)) ? Number(sParams.min) : undefined
  const maxPrice = typeof sParams.max === 'string' && !isNaN(Number(sParams.max)) ? Number(sParams.max) : undefined
  const currentOrden = typeof sParams.orden === 'string' ? sParams.orden : 'relevantes'
  const starsMin = typeof sParams.stars === 'string' && !isNaN(Number(sParams.stars)) ? Number(sParams.stars) : undefined

  // Fetch dynamic categories based on active section
  const categories = await getNovaStoreCategories(targetNegocio)
  const matchedCat = categories.find((c) => c.slug === slug)

  const categoryName =
    slug === 'todos'
      ? 'Todos los Artículos de NOVA'
      : slug === 'ofertas'
      ? 'Ofertas y Descuentos'
      : matchedCat
      ? matchedCat.nombre
      : 'Catálogo de NOVA'

  // Fetch active products, actual reviews, and actual sales from DB
  let productsDb: any[] = []
  let reviewMap = new Map<string, { rating: number; count: number }>()
  let top5ProductIds = new Set<string>()
  let salesMap = new Map<string, number>()

  try {
    const [products, comentarios, salesSummary] = await Promise.all([
      prisma.producto.findMany({
        where: { activo: true, negocio: targetNegocio },
        orderBy: [{ enOferta: 'desc' }, { nombreModelo: 'asc' }],
      }),
      prisma.comentarioProducto.groupBy({
        by: ['productoId'],
        _avg: { calificacion: true },
        _count: { id: true },
        where: { activo: true },
      }),
      prisma.itemPedido.groupBy({
        by: ['productoId'],
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: 'desc' } },
      }),
    ])

    productsDb = products

    reviewMap = new Map(
      comentarios.map((c) => [
        c.productoId,
        {
          rating: c._avg.calificacion ? Math.round(c._avg.calificacion * 10) / 10 : 0,
          count: c._count.id || 0,
        },
      ])
    )

    const top5WithSales = salesSummary
      .filter((s) => (s._sum.cantidad || 0) > 0)
      .slice(0, 5)
    top5ProductIds = new Set(top5WithSales.map((s) => s.productoId))
    salesMap = new Map(salesSummary.map((s) => [s.productoId, s._sum.cantidad || 0]))
  } catch (e) {
    console.error(`Error cargando categoría (${targetNegocio}):`, e)
  }

  // Filter based on category slug or ofertas
  let filtered = productsDb
  if (slug === 'ofertas') {
    filtered = productsDb.filter((p) => p.enOferta)
  } else if (matchedCat) {
    filtered = productsDb.filter(
      (p) =>
        p.lineaCategoria.toLowerCase().includes(matchedCat.nombre.toLowerCase()) ||
        p.nombreModelo.toLowerCase().includes(matchedCat.nombre.toLowerCase())
    )
  }

  // Filter by user-edited Price range
  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => {
      const effectivePrice = p.enOferta && p.precioOferta ? Number(p.precioOferta) : Number(p.precioMercado)
      return effectivePrice >= minPrice
    })
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => {
      const effectivePrice = p.enOferta && p.precioOferta ? Number(p.precioOferta) : Number(p.precioMercado)
      return effectivePrice <= maxPrice
    })
  }

  // Filter by stars if selected
  if (starsMin !== undefined) {
    filtered = filtered.filter((p) => {
      const rev = reviewMap.get(p.id)
      return rev && rev.rating >= starsMin
    })
  }

  // Apply sorting
  if (currentOrden === 'precio-asc') {
    filtered.sort((a, b) => {
      const priceA = a.enOferta && a.precioOferta ? Number(a.precioOferta) : Number(a.precioMercado)
      const priceB = b.enOferta && b.precioOferta ? Number(b.precioOferta) : Number(b.precioMercado)
      return priceA - priceB
    })
  } else if (currentOrden === 'precio-desc') {
    filtered.sort((a, b) => {
      const priceA = a.enOferta && a.precioOferta ? Number(a.precioOferta) : Number(a.precioMercado)
      const priceB = b.enOferta && b.precioOferta ? Number(b.precioOferta) : Number(b.precioMercado)
      return priceB - priceA
    })
  } else if (currentOrden === 'mas-vendidos') {
    filtered.sort((a, b) => {
      const salesA = salesMap.get(a.id) || 0
      const salesB = salesMap.get(b.id) || 0
      return salesB - salesA
    })
  } else if (currentOrden === 'calificados') {
    filtered.sort((a, b) => {
      const ratingA = reviewMap.get(a.id)?.rating || 0
      const ratingB = reviewMap.get(b.id)?.rating || 0
      return ratingB - ratingA
    })
  }

  // Formatted products (ONLY real rating and ONLY real top 5 best sellers)
  const formattedProducts: ProductItem[] = filtered.map((p) => {
    const rev = reviewMap.get(p.id)
    const hasRealReview = Boolean(rev && rev.count > 0)

    return {
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
      badgePromocion: p.badgePromocion || (p.enOferta ? `${p.porcentajeDescuento || 15}% OFF` : undefined),
      destacadoWeb: p.destacadoWeb ?? false,
      descripcionWeb: p.descripcionWeb || undefined,
      imagen: p.imagenUrl || getProductImage(p.nombreModelo, p.lineaCategoria),
      // Solo mostrar calificación si realmente tiene reseñas registradas
      rating: hasRealReview ? rev!.rating : undefined,
      reviewsCount: hasRealReview ? rev!.count : 0,
      // Solo los top 5 más vendidos con ventas reales reciben la etiqueta
      isBestSeller: top5ProductIds.has(p.id),
      isAmazonChoice: false,
    }
  })

  // Verificar si alguno de los productos tiene calificación real para mostrar el filtro en el bloque izquierdo
  const hasRatings = formattedProducts.some((p) => p.rating !== undefined && (p.reviewsCount ?? 0) > 0)

  return (
    <div className="py-6 px-4 max-w-[1400px] mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-[#6E655F] mb-4">
        <Link href="/" className="hover:text-[#C85A32] font-semibold transition-colors">
          Inicio
        </Link>
        <span className="text-[#EBE5DF]">/</span>
        <span className="text-[#2B231F] font-bold">{categoryName}</span>
      </div>

      {/* Top Banner (Sin dropdown de ordenar - solo conteo de resultados) */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE5DF] shadow-sm mb-6 flex items-center justify-between text-xs text-[#2B231F]">
        <div>
          <span className="text-[#6E655F]">{formattedProducts.length} productos en </span>
          <strong className="text-[#2B231F] font-bold">&quot;{categoryName}&quot;</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Filters Sidebar */}
        <div className="md:col-span-3">
          <CategoryFilterSidebar
            categories={categories}
            activeSlug={slug}
            targetNegocio={targetNegocio}
            hasRatings={hasRatings}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentOrden={currentOrden}
            currentStars={starsMin}
          />
        </div>

        {/* Product Grid */}
        <div className="md:col-span-9">
          {formattedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#EBE5DF] text-center shadow-sm space-y-3">
              <p className="text-[#2B231F] font-bold text-base">No hay productos que coincidan con los filtros</p>
              <p className="text-[#6E655F] text-xs max-w-md mx-auto">
                Prueba ajustando el rango de precio o seleccionando otra categoría.
              </p>
              <Link href={`/categoria/${slug}`} className="btn-nova-primary text-xs inline-block mt-2">
                Restablecer filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formattedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
