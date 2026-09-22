import React from 'react'
import Link from 'next/link'
import { Star, Zap, ChevronRight } from 'lucide-react'
import prisma from '@/core/database/prisma'
import { ProductCard, ProductItem, getNovaBgProductsWhere, getNovaBgCategories } from '@/features/catalog'
import { getProductImage } from '@/shared/utils'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const sParams = await searchParams

  // Fetch dynamic categories from NOVA BG
  const categories = await getNovaBgCategories()
  const matchedCat = categories.find((c) => c.slug === slug)

  const categoryName =
    slug === 'todos'
      ? 'Todos los Artículos de NOVA BG'
      : slug === 'ofertas'
      ? 'Ofertas y Descuentos'
      : matchedCat
      ? matchedCat.nombre
      : 'Catálogo de NOVA BG'

  // Fetch active products strictly for NOVA BG
  let productsDb: any[] = []
  try {
    productsDb = await prisma.producto.findMany({
      where: getNovaBgProductsWhere(),
      orderBy: { nombreModelo: 'asc' },
    })
  } catch (e) {
    console.error('Error cargando categoría:', e)
  }

  // Filter based on category slug if matched
  let filtered = productsDb
  if (matchedCat) {
    filtered = productsDb.filter(
      (p) =>
        p.lineaCategoria.toLowerCase().includes(matchedCat.nombre.toLowerCase()) ||
        p.nombreModelo.toLowerCase().includes(matchedCat.nombre.toLowerCase())
    )
  }

  const formattedProducts: ProductItem[] = filtered.map((p, idx) => ({
    id: p.id,
    nombreModelo: p.nombreModelo,
    lineaCategoria: p.lineaCategoria,
    precioMercado: Number(p.precioMercado),
    imagen: getProductImage(p.nombreModelo, p.lineaCategoria),
    rating: 4.8 + (idx % 3) * 0.1,
    reviewsCount: 20 + idx * 12,
    isBestSeller: idx === 0,
    isAmazonChoice: idx === 1,
  }))

  return (
    <div className="py-6 px-4 max-w-[1400px] mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-[#0066ff]">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{categoryName}</span>
      </div>

      {/* Top Banner with result count & sort */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-700">
        <div>
          <span className="text-gray-500">{formattedProducts.length} productos en </span>
          <strong className="text-gray-900 font-bold">&quot;{categoryName}&quot;</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Más relevantes:</span>
          <select className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-1.5 text-xs outline-none cursor-pointer font-medium">
            <option>Más relevantes</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>Mejor calificados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Filters Sidebar */}
        <div className="md:col-span-3 bg-white p-5 rounded-xl border border-gray-200/80 space-y-6 text-xs text-[#191919] h-fit shadow-xs">
          {/* Categorías Dinámicas */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-900">Categorías NOVA BG</h3>
            {categories.length === 0 ? (
              <p className="text-gray-400 text-xs">Sin categorías registradas en BG</p>
            ) : (
              <ul className="space-y-2 text-gray-600">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categoria/${cat.slug}`}
                      className={`flex items-center justify-between hover:text-[#0066ff] ${
                        slug === cat.slug ? 'font-bold text-[#0066ff]' : ''
                      }`}
                    >
                      <span>{cat.nombre}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/categoria/todos"
                    className={`flex items-center justify-between hover:text-[#0066ff] ${
                      slug === 'todos' ? 'font-bold text-[#0066ff]' : ''
                    }`}
                  >
                    <span>Ver Todos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Envíos FULL toggle */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-900">Envíos</h3>
            <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0066ff]">
                <Zap className="w-4 h-4 fill-[#0066ff]" />
                <span>FULL</span>
              </div>
              <span className="text-[11px] text-[#0066ff] font-semibold">Lima y Provincias</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Price Filters */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-900">Precio</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <span className="hover:text-[#0066ff] cursor-pointer">Hasta S/ 35</span>
              </li>
              <li>
                <span className="hover:text-[#0066ff] cursor-pointer">S/ 35 a S/ 70</span>
              </li>
              <li>
                <span className="hover:text-[#0066ff] cursor-pointer">S/ 70 a S/ 120</span>
              </li>
              <li>
                <span className="hover:text-[#0066ff] cursor-pointer">Más de S/ 120</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Customer Reviews */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-900">Calificación</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#0066ff]">
                <div className="flex text-[#ff9900]">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <span className="text-gray-600 font-medium">(4 estrellas o más)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-9">
          {formattedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-xs space-y-3">
              <p className="text-gray-700 font-bold text-base">No hay productos en esta categoría</p>
              <p className="text-gray-500 text-xs max-w-md mx-auto">
                Los productos registrados bajo NOVA BG aparecerán automáticamente aquí al ser ingresados en el sistema financiero.
              </p>
              <Link href="/" className="btn-nova-primary text-xs inline-block mt-2">
                Volver a la portada
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
