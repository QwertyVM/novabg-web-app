import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ProductCard, ProductItem } from '@/components/product/ProductCard'
import { getProductImage } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sParams = await searchParams
  const query = typeof sParams.q === 'string' ? sParams.q.trim() : ''
  const dept = typeof sParams.dept === 'string' ? sParams.dept : 'todos'

  // Fetch all active products
  let productsDb: any[] = []
  try {
    productsDb = await prisma.producto.findMany({
      where: {
        activo: true,
      },
      orderBy: { nombreModelo: 'asc' },
    })
  } catch (e) {
    console.error('Error en búsqueda:', e)
  }

  // Filter products by query and department
  const filtered = productsDb.filter((p) => {
    const textMatch =
      !query ||
      p.nombreModelo.toLowerCase().includes(query.toLowerCase()) ||
      p.lineaCategoria.toLowerCase().includes(query.toLowerCase())

    if (!textMatch) return false

    if (dept === 'insertos') {
      return (
        p.lineaCategoria.toLowerCase().includes('inserto') ||
        p.nombreModelo.toLowerCase().includes('organizador') ||
        p.nombreModelo.toLowerCase().includes('inserto') ||
        p.nombreModelo.toLowerCase().includes('seti')
      )
    }
    if (dept === 'rol') {
      return (
        p.lineaCategoria.toLowerCase().includes('rol') ||
        p.nombreModelo.toLowerCase().includes('torre') ||
        p.nombreModelo.toLowerCase().includes('dado')
      )
    }
    if (dept === 'juegos-de-mesa') {
      return (
        p.lineaCategoria.toLowerCase().includes('juegos') ||
        p.nombreModelo.toLowerCase().includes('mansiones') ||
        p.nombreModelo.toLowerCase().includes('locura')
      )
    }
    return true
  })

  const formattedProducts: ProductItem[] = filtered.map((p, idx) => ({
    id: p.id,
    nombreModelo: p.nombreModelo,
    lineaCategoria: p.lineaCategoria,
    precioMercado: Number(p.precioMercado),
    imagen: getProductImage(p.nombreModelo, p.lineaCategoria),
    rating: 4.8 + (idx % 3) * 0.1,
    reviewsCount: 15 + idx * 8,
    isBestSeller: idx === 0,
    isAmazonChoice: idx === 1,
  }))

  return (
    <div className="py-4 px-4 max-w-[1500px] mx-auto">
      {/* Search Header Banner */}
      <div className="bg-white p-3 rounded-sm border border-gray-200 shadow-2xs mb-4 flex items-center justify-between text-xs text-gray-700">
        <div>
          <span>
            {formattedProducts.length} resultados para{' '}
          </span>
          <strong className="text-[#c7511f] font-bold">&quot;{query || 'Todos los juegos'}&quot;</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Ordenar por:</span>
          <select className="border border-gray-300 rounded bg-gray-50 px-2 py-1 text-xs outline-none cursor-pointer">
            <option>Relevancia</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Mejor valorados</option>
          </select>
        </div>
      </div>

      {formattedProducts.length === 0 ? (
        <div className="bg-white p-12 rounded border border-gray-200 text-center max-w-xl mx-auto my-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            No se encontraron resultados para &quot;{query}&quot;
          </h2>
          <p className="text-xs text-gray-600 mb-6">
            Revisa la ortografía o intenta buscar con términos más generales como &quot;inserto&quot;, &quot;torre&quot; o &quot;tablero&quot;.
          </p>
          <Link href="/categoria/todos" className="btn-amazon-primary text-xs">
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
