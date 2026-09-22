import React from 'react'
import prisma from '@/lib/prisma'
import { HeroBanner } from '@/components/home/HeroBanner'
import { DashboardCards } from '@/components/home/DashboardCards'
import { ProductRow } from '@/components/home/ProductRow'
import { ProductItem } from '@/components/product/ProductCard'
import { getProductImage } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Query all active products from PostgreSQL database
  let productosDb: any[] = []
  try {
    productosDb = await prisma.producto.findMany({
      where: { activo: true },
      orderBy: [{ nombreModelo: 'asc' }],
    })
  } catch (error) {
    console.error('Error cargando productos desde la base de datos:', error)
  }

  // Format products for Amazon product cards
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

  // Categorized product rows
  const insertosProducts = formattedProducts.filter(
    (p) =>
      p.lineaCategoria.toLowerCase().includes('inserto') ||
      p.nombreModelo.toLowerCase().includes('organizador') ||
      p.nombreModelo.toLowerCase().includes('inserto') ||
      p.nombreModelo.toLowerCase().includes('seti')
  )

  const juegosMesaProducts = formattedProducts.filter(
    (p) =>
      p.lineaCategoria.toLowerCase().includes('juegos') ||
      p.nombreModelo.toLowerCase().includes('mansiones') ||
      p.nombreModelo.toLowerCase().includes('locura') ||
      p.nombreModelo.toLowerCase().includes('zombicide') ||
      p.nombreModelo.toLowerCase().includes('gloomhaven')
  )

  const rolProducts = formattedProducts.filter(
    (p) =>
      p.lineaCategoria.toLowerCase().includes('rol') ||
      p.nombreModelo.toLowerCase().includes('torre') ||
      p.nombreModelo.toLowerCase().includes('dado') ||
      p.nombreModelo.toLowerCase().includes('dragón')
  )

  return (
    <div className="pb-12">
      {/* 1. Amazon Hero Banner Carousel */}
      <HeroBanner />

      {/* 2. Amazon Multi-Quadrant Dashboard Cards (overlapping hero) */}
      <DashboardCards />

      {/* 3. Product Shelves / Rows */}
      <div className="px-4 space-y-4">
        {/* Row 1: Best Sellers in Board Games */}
        <ProductRow
          title="Los más vendidos en Juegos de Mesa & Sets"
          subtitle="Los productos preferidos por la comunidad de juegos"
          viewAllLink="/categoria/juegos-de-mesa"
          products={juegosMesaProducts.length > 0 ? juegosMesaProducts : formattedProducts}
        />

        {/* Row 2: Inserts & Organizers */}
        <ProductRow
          title="Insertos y Organizadores de Máxima Precisión"
          subtitle="Diseñados a medida para optimizar el espacio de tus cajas y agilizar el setup"
          viewAllLink="/categoria/insertos"
          products={insertosProducts.length > 0 ? insertosProducts : formattedProducts}
        />

        {/* Row 3: RPG / Rol & Dice Towers */}
        {rolProducts.length > 0 && (
          <ProductRow
            title="Torres de Dados & Accesorios de Rol"
            subtitle="Accesorios y escenografía para Dungeons & Dragons y rol"
            viewAllLink="/categoria/rol"
            products={rolProducts}
          />
        )}

        {/* Row 4: Complete Catalog Shelf */}
        <ProductRow
          title="Catálogo Completo Disponible"
          subtitle="Todos los artículos listos para entrega inmediata o pedido personalizado"
          viewAllLink="/categoria/todos"
          products={formattedProducts}
        />
      </div>
    </div>
  )
}
