import React from 'react'
import Link from 'next/link'
import { Star, Zap, ChevronRight } from 'lucide-react'
import prisma from '@/core/database/prisma'
import { ProductCard, ProductItem, getNovaStoreCategories } from '@/features/catalog'
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

  // Fetch active products filtered by negocio
  let productsDb: any[] = []
  try {
    productsDb = await prisma.producto.findMany({
      where: { activo: true, negocio: targetNegocio },
      orderBy: [{ enOferta: 'desc' }, { nombreModelo: 'asc' }],
    })
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

  const formattedProducts: ProductItem[] = filtered.map((p, idx) => ({
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
    rating: 4.8 + (idx % 3) * 0.1,
    reviewsCount: 20 + idx * 12,
    isBestSeller: idx === 0,
    isAmazonChoice: idx === 1,
  }))

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

      {/* Top Banner with result count & sort */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE5DF] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#2B231F]">
        <div>
          <span className="text-[#6E655F]">{formattedProducts.length} productos en </span>
          <strong className="text-[#2B231F] font-bold">&quot;{categoryName}&quot;</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#6E655F] font-medium">Ordenar:</span>
          <select className="border border-[#EBE5DF] rounded-xl bg-[#FDFBF7] px-3 py-1.5 text-xs outline-none cursor-pointer font-semibold text-[#2B231F]">
            <option>Más relevantes</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>Mejor calificados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Filters Sidebar */}
        <div className="md:col-span-3 bg-white p-5 rounded-2xl border border-[#EBE5DF] space-y-6 text-xs text-[#2B231F] h-fit shadow-sm">
          {/* Categorías Dinámicas */}
          <div>
            <h3 className="font-black text-sm mb-3 text-[#2B231F]">
              Categorías NOVA {targetNegocio}
            </h3>
            {categories.length === 0 ? (
              <p className="text-[#6E655F] text-xs">Sin categorías registradas en {targetNegocio}</p>
            ) : (
              <ul className="space-y-2 text-[#6E655F]">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categoria/${cat.slug}`}
                      className={`flex items-center justify-between hover:text-[#C85A32] font-semibold ${
                        slug === cat.slug ? 'text-[#C85A32] font-bold' : ''
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
                    className={`flex items-center justify-between hover:text-[#C85A32] font-semibold ${
                      slug === 'todos' ? 'text-[#C85A32] font-bold' : ''
                    }`}
                  >
                    <span>Ver Todos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <hr className="border-[#EBE5DF]" />

          {/* Envíos FULL toggle */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[#2B231F]">Envíos</h3>
            <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#EBE5DF] rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#C85A32]">
                <Zap className="w-4 h-4 fill-[#C85A32]" />
                <span>FULL</span>
              </div>
              <span className="text-[11px] text-[#10B981] font-bold">Lima y Provincias</span>
            </div>
          </div>

          <hr className="border-[#EBE5DF]" />

          {/* Price Filters */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[#2B231F]">Precio</h3>
            <ul className="space-y-2 text-[#6E655F]">
              <li>
                <span className="hover:text-[#C85A32] font-medium cursor-pointer">Hasta S/ 35</span>
              </li>
              <li>
                <span className="hover:text-[#C85A32] font-medium cursor-pointer">S/ 35 a S/ 70</span>
              </li>
              <li>
                <span className="hover:text-[#C85A32] font-medium cursor-pointer">S/ 70 a S/ 120</span>
              </li>
              <li>
                <span className="hover:text-[#C85A32] font-medium cursor-pointer">Más de S/ 120</span>
              </li>
            </ul>
          </div>

          <hr className="border-[#EBE5DF]" />

          {/* Customer Reviews */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[#2B231F]">Calificación</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#C85A32]">
                <div className="flex text-[#F59E0B]">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-[#EBE5DF]" />
                </div>
                <span className="text-[#6E655F] font-semibold">(4 estrellas o más)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-9">
          {formattedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#EBE5DF] text-center shadow-sm space-y-3">
              <p className="text-[#2B231F] font-bold text-base">No hay productos en esta categoría</p>
              <p className="text-[#6E655F] text-xs max-w-md mx-auto">
                Los productos registrados bajo NOVA aparecerán automáticamente aquí.
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
