import React from 'react'
import prisma from '@/core/database/prisma'
import { HeroBanner, DashboardCards, ProductRow } from '@/features/home'
import { ProductItem } from '@/features/catalog'
import { getNovaStoreCategories } from '@/features/catalog/actions/category.actions'
import {
  getStorePublicConfig,
  getStoreActiveBanners,
} from '@/features/catalog/services/store-config.service'
import { getProductImage } from '@/shared/utils'
import { Dice5, Sparkles, Printer, Flame } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  searchParams?: Promise<{ sec?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = searchParams ? await searchParams : {}
  const targetNegocio = resolvedParams.sec === '3D' ? '3D' : 'BG'
  const is3D = targetNegocio === '3D'

  // Fetch store config, banners, and categories in parallel
  const [storeConfig, dbBanners, categories] = await Promise.all([
    getStorePublicConfig(targetNegocio),
    getStoreActiveBanners(targetNegocio),
    getNovaStoreCategories(targetNegocio),
  ])

  // Query active products strictly registered in targetNegocio
  let productosDb: any[] = []
  try {
    productosDb = await prisma.producto.findMany({
      where: {
        negocio: targetNegocio,
        activo: true,
      },
      orderBy: [
        { enOferta: 'desc' },
        { destacadoWeb: 'desc' },
        { nombreModelo: 'asc' },
      ],
    })
  } catch (error) {
    console.error('Error cargando productos desde la base de datos:', error)
  }

  // Format products for product cards
  const formattedProducts: ProductItem[] = productosDb.map((p, idx) => ({
    id: p.id,
    negocio: p.negocio,
    nombreModelo: p.nombreModelo,
    lineaCategoria: p.lineaCategoria,
    precioMercado: Number(p.precioMercado),
    precioAmigos: p.precioAmigos ? Number(p.precioAmigos) : undefined,
    costoBase: p.costoBase ? Number(p.costoBase) : undefined,
    pesoGramos: p.pesoGramos ? Number(p.pesoGramos) : 0,
    stock: p.stock ?? 0,
    controlarStock: p.controlarStock ?? false,
    enOferta: p.enOferta ?? false,
    precioOferta: p.precioOferta ? Number(p.precioOferta) : null,
    porcentajeDescuento: p.porcentajeDescuento ?? 0,
    badgePromocion: p.badgePromocion || (p.enOferta ? `${p.porcentajeDescuento || 15}% OFF` : undefined),
    destacadoWeb: p.destacadoWeb ?? false,
    descripcionWeb: p.descripcionWeb || undefined,
    activo: p.activo ?? true,
    imagen: p.imagenUrl || getProductImage(p.nombreModelo, p.lineaCategoria),
    rating: 4.8 + (idx % 3) * 0.1,
    reviewsCount: 24 + ((idx * 17) % 180),
    isBestSeller: idx === 0 || idx === 2,
    isAmazonChoice: idx === 1 || idx === 3,
  }))

  // Products on offer
  const offerProducts = formattedProducts.filter((p) => p.enOferta)

  return (
    <div className="pb-16 space-y-6">
      {/* 1. Hero Banner Carousel (Dynamically loaded from ERP) */}
      <HeroBanner dbBanners={dbBanners} section={targetNegocio as 'BG' | '3D'} />

      {/* 2. Benefits Strip & Category Fast Access */}
      <DashboardCards
        categories={categories}
        storeConfig={storeConfig}
        section={targetNegocio as 'BG' | '3D'}
      />

      {/* 3. Products Area */}
      <div className="px-4">
        {formattedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs space-y-4 my-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center mx-auto">
              {is3D ? <Printer className="w-8 h-8 text-amber-600" /> : <Dice5 className="w-8 h-8" />}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Catálogo Oficial {storeConfig.nombreTienda} en Preparación
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              Actualmente no hay productos registrados bajo la sección <strong>{targetNegocio}</strong>.
              En cuanto los registres o actives en el módulo de gestión web del ERP, aparecerán automáticamente en esta tienda.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 py-2 px-4 rounded-xl w-fit mx-auto border border-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Conexión directa y en tiempo real con la base de datos de NOVA ({targetNegocio})</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Special Offers Row if there are products with active discounts */}
            {offerProducts.length > 0 && (
              <ProductRow
                title="🔥 Ofertas Especiales & Descuentos"
                subtitle="Aprovecha los precios rebajados por tiempo limitado"
                viewAllLink="/categoria/ofertas"
                products={offerProducts}
              />
            )}

            {/* Dynamic Product Rows for each registered Category */}
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
              title={`Catálogo Completo ${storeConfig.nombreTienda}`}
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

