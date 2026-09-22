import React from 'react'
import Link from 'next/link'
import prisma from '@/core/database/prisma'
import { ProductCard, ProductItem, getNovaBgProductsWhere, getNovaBgCategories, NovaCategory } from '@/features/catalog'
import { getProductImage } from '@/shared/utils'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sParams = await searchParams
  const query = typeof sParams.q === 'string' ? sParams.q.trim() : ''
  const dept = typeof sParams.dept === 'string' ? sParams.dept : 'todos'

  const targetNegocio = typeof sParams.sec === 'string' && sParams.sec === '3D' ? '3D' : (typeof sParams.sec === 'string' && sParams.sec === 'BG' ? 'BG' : undefined)

  // Fetch active products
  let productsDb: any[] = []
  try {
    productsDb = await prisma.producto.findMany({
      where: {
        activo: true,
        ...(targetNegocio ? { negocio: targetNegocio } : {}),
      },
      orderBy: [{ enOferta: 'desc' }, { nombreModelo: 'asc' }],
    })
  } catch (e) {
    console.error('Error en búsqueda:', e)
  }

  // Fetch categories to match department dynamically
  const categories = await getNovaBgCategories()
  const matchedCat = dept !== 'todos' ? categories.find((c) => c.slug === dept) : null

  // Filter products by query and department
  const filtered = productsDb.filter((p) => {
    const textMatch =
      !query ||
      p.nombreModelo.toLowerCase().includes(query.toLowerCase()) ||
      p.lineaCategoria.toLowerCase().includes(query.toLowerCase())

    if (!textMatch) return false

    if (matchedCat) {
      return (
        p.lineaCategoria.toLowerCase().includes(matchedCat.nombre.toLowerCase()) ||
        p.nombreModelo.toLowerCase().includes(matchedCat.nombre.toLowerCase())
      )
    }

    return true
  })

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
    reviewsCount: 15 + idx * 8,
    isBestSeller: idx === 0,
    isAmazonChoice: idx === 1,
  }))

  return (
    <div className="py-6 px-4 max-w-[1400px] mx-auto">
      {/* Search Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-700">
        <div>
          <span className="text-gray-500">
            {formattedProducts.length} resultados para{' '}
          </span>
          <strong className="text-gray-900 font-bold">&quot;{query || 'Todos los artículos'}&quot;</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Ordenar:</span>
          <select className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-1.5 text-xs outline-none cursor-pointer font-medium">
            <option>Más relevantes</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Mejor calificados</option>
          </select>
        </div>
      </div>

      {formattedProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center max-w-lg mx-auto my-12 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            No encontramos publicaciones para &quot;{query}&quot;
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Revisa la ortografía o intenta buscar con términos como &quot;organizador&quot;, &quot;torre&quot;, &quot;dados&quot; o &quot;tablero&quot;.
          </p>
          <Link href="/categoria/todos" className="btn-nova-primary text-xs">
            Ver todo el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formattedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  )
}
