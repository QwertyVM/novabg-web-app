import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Check, ShieldCheck, Truck, RotateCcw, Share2 } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductGallery } from '@/components/product/ProductGallery'
import { BuyBox } from '@/components/product/BuyBox'
import { ProductRow } from '@/components/home/ProductRow'
import { ProductItem } from '@/components/product/ProductCard'
import { formatPriceParts, getProductImage, getEstimatedDeliveryDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await prisma.producto.findUnique({
    where: { id },
  })

  if (!product) {
    notFound()
  }

  // Related products
  const relatedDb = await prisma.producto.findMany({
    where: {
      activo: true,
      id: { not: id },
    },
    take: 6,
  })

  const imageSrc = getProductImage(product.nombreModelo, product.lineaCategoria)
  const priceParts = formatPriceParts(Number(product.precioMercado))
  const deliveryDate = getEstimatedDeliveryDate()

  const formattedRelated: ProductItem[] = relatedDb.map((p, idx) => ({
    id: p.id,
    nombreModelo: p.nombreModelo,
    lineaCategoria: p.lineaCategoria,
    precioMercado: Number(p.precioMercado),
    imagen: getProductImage(p.nombreModelo, p.lineaCategoria),
    rating: 4.8 + (idx % 2) * 0.1,
    reviewsCount: 32 + idx * 14,
  }))

  return (
    <div className="py-4 px-4 max-w-[1500px] mx-auto bg-white min-h-screen my-4 rounded-sm border border-gray-200 shadow-xs">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#c7511f] hover:underline">
          Inicio
        </Link>
        <span>&rsaquo;</span>
        <Link href="/categoria/juegos-de-mesa" className="hover:text-[#c7511f] hover:underline">
          {product.lineaCategoria || 'Juegos de Mesa'}
        </Link>
        <span>&rsaquo;</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.nombreModelo}</span>
      </nav>

      {/* Main 3-Column Product View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-5">
          <ProductGallery mainImage={imageSrc} title={product.nombreModelo} />
        </div>

        {/* Center Column: Product Information & Specs (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold block mb-1">
              Visita la tienda de Juegos de Mesa & 3D Studio
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {product.nombreModelo}
            </h1>
          </div>

          {/* Ratings & Amazon's Choice */}
          <div className="flex items-center gap-2 flex-wrap text-xs pb-3 border-b border-gray-200">
            <div className="flex items-center text-[#de7921]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current text-[#de7921]" />
              ))}
            </div>
            <span className="text-[#007185] hover:text-[#c7511f] font-semibold">4.9 de 5</span>
            <span className="text-gray-400">|</span>
            <span className="text-[#007185] hover:text-[#c7511f] hover:underline">
              86 calificaciones
            </span>
            <span className="ml-auto bg-[#0f1111] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
              <span className="text-[#febd69]">Opción</span> Amazon
            </span>
          </div>

          {/* Price Box */}
          <div className="py-2 border-b border-gray-200 space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-gray-800 relative top-[-8px]">
                {priceParts.symbol}
              </span>
              <span className="text-3xl font-extrabold text-gray-900 leading-none">
                {priceParts.integer}
              </span>
              <span className="text-sm font-semibold text-gray-800 relative top-[-8px]">
                {priceParts.decimal}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs">
                Precio Especial
              </span>
              <span>Incluye garantía y soporte oficial</span>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 text-center text-[11px] text-gray-700">
            <div className="p-2 bg-gray-50 rounded flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Envío Rápido</span>
              <span className="text-gray-500 text-[10px]">Todo el Perú</span>
            </div>
            <div className="p-2 bg-gray-50 rounded flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">100% Precisión</span>
              <span className="text-gray-500 text-[10px]">Garantía</span>
            </div>
            <div className="p-2 bg-gray-50 rounded flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Devoluciones</span>
              <span className="text-gray-500 text-[10px]">30 días</span>
            </div>
          </div>

          {/* About this item (Bullets) */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm text-gray-900">Sobre este artículo</h3>
            <ul className="text-xs text-gray-700 space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-gray-900">Compatibilidad y Diseño:</strong> Diseñado
                especialmente para {product.nombreModelo}, optimizando el espacio y facilitando la
                organización de componentes y cartas.
              </li>
              <li>
                <strong className="text-gray-900">Material de Fabricación:</strong> Fabricado en
                polímero termoplástico resistente, duradero y de alta densidad para máxima
                resistencia.
              </li>
              <li>
                <strong className="text-gray-900">Setup Inmediato:</strong> Reduce drásticamente el
                tiempo de preparación de la mesa para empezar a jugar de inmediato.
              </li>
              <li>
                <strong className="text-gray-900">Acabado Premium:</strong> Textura lisa de alta
                calidad y esquinas reforzadas para proteger las cajas de tus juegos.
              </li>
            </ul>
          </div>

          {/* Specifications Table (Strictly NO horizontal scroll per rules/tabla.md) */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-bold text-sm text-gray-900 mb-2">Especificaciones del Producto</h3>
            <div className="amazon-table-container">
              <table className="amazon-table text-xs text-left border border-gray-200">
                <tbody>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2.5 font-bold text-gray-700 w-1/3">Categoría</td>
                    <td className="p-2.5 text-gray-900 w-2/3">{product.lineaCategoria}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2.5 font-bold text-gray-700">Modelo</td>
                    <td className="p-2.5 text-gray-900">{product.nombreModelo}</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2.5 font-bold text-gray-700">Peso Estimado</td>
                    <td className="p-2.5 text-gray-900">
                      {product.pesoGramos ? `${Number(product.pesoGramos)} gramos` : 'N/A'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2.5 font-bold text-gray-700">Disponibilidad</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">En Stock</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2.5 font-bold text-gray-700">Garantía</td>
                    <td className="p-2.5 text-gray-900">30 días de satisfacción total</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Amazon Buy Box (3 cols on lg) */}
        <div className="lg:col-span-3">
          <BuyBox
            product={{
              id: product.id,
              nombreModelo: product.nombreModelo,
              precioMercado: Number(product.precioMercado),
              lineaCategoria: product.lineaCategoria,
              imagen: imageSrc,
            }}
          />
        </div>
      </div>

      {/* Related Products Shelf */}
      {formattedRelated.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <ProductRow
            title="Clientes que vieron este producto también compraron"
            subtitle="Basado en recomendaciones de la comunidad"
            products={formattedRelated}
          />
        </div>
      )}
    </div>
  )
}
