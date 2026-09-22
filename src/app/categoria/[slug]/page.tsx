import React from 'react'
import Link from 'next/link'
import { Star, Check, Filter } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductCard, ProductItem } from '@/components/product/ProductCard'
import { getProductImage } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const sParams = await searchParams

  const categoryTitles: Record<string, string> = {
    'juegos-de-mesa': 'Juegos de Mesa y Sets de Tablero',
    insertos: 'Insertos & Organizadores de Juegos de Mesa',
    rol: 'Torres de Dados & Accesorios de Rol',
    ofertas: 'Ofertas del Día & Descuentos',
    'mas-vendidos': 'Los Más Vendidos en Juegos de Mesa',
    todos: 'Todos los Artículos de Juegos de Mesa',
  }

  const categoryName = categoryTitles[slug] || 'Catálogo de Juegos de Mesa'

  // Fetch all active products
  let productsDb: any[] = []
  try {
    productsDb = await prisma.producto.findMany({
      where: { activo: true },
      orderBy: { nombreModelo: 'asc' },
    })
  } catch (e) {
    console.error('Error cargando categoría:', e)
  }

  // Filter based on category slug
  let filtered = productsDb
  if (slug === 'insertos') {
    filtered = productsDb.filter(
      (p) =>
        p.lineaCategoria.toLowerCase().includes('inserto') ||
        p.nombreModelo.toLowerCase().includes('organizador') ||
        p.nombreModelo.toLowerCase().includes('inserto') ||
        p.nombreModelo.toLowerCase().includes('seti')
    )
  } else if (slug === 'rol') {
    filtered = productsDb.filter(
      (p) =>
        p.lineaCategoria.toLowerCase().includes('rol') ||
        p.nombreModelo.toLowerCase().includes('torre') ||
        p.nombreModelo.toLowerCase().includes('dado') ||
        p.nombreModelo.toLowerCase().includes('dragón')
    )
  } else if (slug === 'juegos-de-mesa') {
    filtered = productsDb.filter(
      (p) =>
        p.lineaCategoria.toLowerCase().includes('juegos') ||
        p.nombreModelo.toLowerCase().includes('mansiones') ||
        p.nombreModelo.toLowerCase().includes('locura') ||
        p.nombreModelo.toLowerCase().includes('zombicide') ||
        p.nombreModelo.toLowerCase().includes('gloomhaven')
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
    <div className="py-4 px-4 max-w-[1500px] mx-auto">
      {/* Top Banner with result count */}
      <div className="bg-white p-3 rounded-sm border border-gray-200 shadow-2xs mb-4 flex items-center justify-between text-xs text-gray-700">
        <div>
          <span>1-{formattedProducts.length} de {formattedProducts.length} resultados para </span>
          <strong className="text-amber-800 font-bold">&quot;{categoryName}&quot;</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Ordenar por:</span>
          <select className="border border-gray-300 rounded bg-gray-50 px-2 py-1 text-xs outline-none cursor-pointer">
            <option>Destacados</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Calificación promedio</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Amazon Left Filters Sidebar */}
        <div className="md:col-span-3 bg-white p-4 rounded-sm border border-gray-200 space-y-5 text-xs text-[#0f1111] h-fit">
          {/* Department */}
          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-900">Departamento</h3>
            <ul className="space-y-1.5 text-gray-700 pl-1">
              <li>
                <Link
                  href="/categoria/juegos-de-mesa"
                  className={`hover:text-[#c7511f] ${
                    slug === 'juegos-de-mesa' ? 'font-bold text-amber-800' : ''
                  }`}
                >
                  Juegos de Mesa y Sets
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/insertos"
                  className={`hover:text-[#c7511f] ${
                    slug === 'insertos' ? 'font-bold text-amber-800' : ''
                  }`}
                >
                  Insertos & Organizadores
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/rol"
                  className={`hover:text-[#c7511f] ${
                    slug === 'rol' ? 'font-bold text-amber-800' : ''
                  }`}
                >
                  Torres de Dados & Rol
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/todos"
                  className={`hover:text-[#c7511f] ${
                    slug === 'todos' ? 'font-bold text-amber-800' : ''
                  }`}
                >
                  Ver Todos los Artículos
                </Link>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Customer Reviews */}
          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-900">Opiniones de Clientes</h3>
            <div className="space-y-1.5 pl-1">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#c7511f]">
                <div className="flex text-[#de7921]">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <span>y más (4★+)</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#c7511f]">
                <div className="flex text-[#de7921]">
                  {[1, 2, 3].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-gray-300" />
                  <Star className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <span>y más (3★+)</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Price Filters */}
          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-900">Precio</h3>
            <ul className="space-y-1.5 text-gray-700 pl-1">
              <li>
                <span className="hover:text-[#c7511f] cursor-pointer">Hasta S/ 30</span>
              </li>
              <li>
                <span className="hover:text-[#c7511f] cursor-pointer">S/ 30 a S/ 60</span>
              </li>
              <li>
                <span className="hover:text-[#c7511f] cursor-pointer">S/ 60 a S/ 100</span>
              </li>
              <li>
                <span className="hover:text-[#c7511f] cursor-pointer">Más de S/ 100</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Delivery & Prime */}
          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-900">Tipo de Envío</h3>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Envío Rápido a Lima & Provincias</span>
            </div>
          </div>
        </div>

        {/* Product Grid (9 cols on md) */}
        <div className="md:col-span-9">
          <h1 className="text-xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          {formattedProducts.length === 0 ? (
            <div className="bg-white p-8 rounded border border-gray-200 text-center">
              <p className="text-gray-500 text-sm">No se encontraron productos en esta categoría.</p>
              <Link href="/" className="btn-amazon-primary text-xs mt-4 inline-block">
                Volver al Inicio
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
