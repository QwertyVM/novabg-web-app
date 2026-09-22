import React from 'react'
import prisma from '@/core/database/prisma'
import { HeroBanner, DashboardCards, ProductRow } from '@/features/home'
import { ProductItem, getNovaBgProductsWhere, getNovaBgCategories } from '@/features/catalog'
import { getProductImage } from '@/shared/utils'
import { Dice5, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Query active products strictly registered in NOVA BG (negocio: 'BG')
  let productosDb: any[] = []
  try {
    productosDb = await prisma.producto.findMany({
      where: getNovaBgProductsWhere(),
      orderBy: [{ nombreModelo: 'asc' }],
    })
  } catch (error) {
    console.error('Error cargando productos desde la base de datos:', error)
  }

  // Query categories registered in NOVA BG
  const categories = await getNovaBgCategories()

  // Format products for NOVA BG product cards
  const formattedProducts: ProductItem[] = productosDb.map((p, idx) => ({
    id: p.id,
    nombreModelo: p.nombreModelo,
    lineaCategoria: p.lineaCategoria,
    precioMercado: Number(p.precioMercado),
    precioAmigos: p.precioAmigos ? Number(p.precioAmigos) : undefined,
    costoBase: p.costoBase ? Number(p.costoBase) : undefined,
    pesoGramos: p.pesoGramos ? Number(p.pesoGramos) : 0,
    activo: p.activo ?? true,
    imagen: getProductImage(p.nombreModelo, p.lineaCategoria),
    rating: 4.8 + (idx % 3) * 0.1,
    reviewsCount: 24 + ((idx * 17) % 180),
    isBestSeller: idx === 0 || idx === 2,
    isAmazonChoice: idx === 1 || idx === 3,
  }))

  return (
    <div className="pb-16 space-y-6">
      {/* 1. Mercado Libre Style Hero Banner Carousel */}
      <HeroBanner />

      {/* 2. Benefits Strip & Category Fast Access (Dynamic from NOVA BG) */}
      <DashboardCards categories={categories} />

      {/* 3. Products Area */}
      <div className="px-4">
        {formattedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs space-y-4 my-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center mx-auto">
              <Dice5 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Catálogo Oficial NOVA BG en Preparación
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              Actualmente no hay productos registrados bajo la sección <strong>NOVA BG</strong>. En cuanto se registren en el sistema financiero de BG, aparecerán automáticamente en esta tienda.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 py-2 px-4 rounded-xl w-fit mx-auto border border-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Conexión directa y en tiempo real con la base de datos de NOVA BG</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Dynamic Product Rows for each registered NOVA BG Category */}
            {categories.map((cat) => {
              const catProducts = formattedProducts.filter(
                (p) =>
                  p.lineaCategoria.toLowerCase().includes(cat.nombre.toLowerCase()) ||
                  p.nombreModelo.toLowerCase().includes(cat.nombre.toLowerCase())
              )
              if (catProducts.length === 0) return null
              return (
                <ProductRow
                  key={cat.id}
                  title={cat.nombre}
                  subtitle={cat.descripcion || `Artículos y novedades de ${cat.nombre}`}
                  viewAllLink={`/categoria/${cat.slug}`}
                  products={catProducts}
                />
              )
            })}

            {/* Complete Catalog Row */}
            <ProductRow
              title="Catálogo Completo NOVA BG"
              subtitle="Todos los artículos listos con entrega inmediata"
              viewAllLink="/categoria/todos"
              products={formattedProducts}
            />
          </div>
        )}
      </div>
    </div>
  )
}
