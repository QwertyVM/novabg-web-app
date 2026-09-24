'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Heart,
  ShoppingCart,
  Trash2,
  ExternalLink,
  MessageCircle,
  Package,
  AlertCircle,
  Flame,
  Check,
} from 'lucide-react'
import { useFavorites } from '@/features/favorites'
import { useCart } from '@/features/cart/context/CartContext'
import { formatPrice } from '@/shared/utils'
import { toast } from 'sonner'

interface FavoriteProduct {
  id: string
  nombreModelo: string
  lineaCategoria: string
  precioMercado: number
  precioOferta: number | null
  enOferta: boolean
  porcentajeDescuento: number | null
  badgePromocion: string | null
  imagen: string
  stock: number
  controlarStock: boolean
  isOutOfStock: boolean
  maxStock: number
  editorialMarca: string | null
  bggRating: number | null
  favoritosCount: number
}

export default function FavoritosPage() {
  const { favorites, toggleFavorite, requestStockAlert } = useFavorites()
  const { addItem } = useCart()

  const [products, setProducts] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/favoritos?ids=${favorites.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      })
      .catch((err) => {
        console.error('Error cargando favoritos:', err)
        toast.error('No se pudieron cargar tus favoritos')
      })
      .finally(() => setLoading(false))
  }, [favorites])

  const handleAddToCart = (product: FavoriteProduct) => {
    if (product.isOutOfStock) return

    const effectivePrice =
      product.enOferta && product.precioOferta != null && product.precioOferta > 0
        ? product.precioOferta
        : product.precioMercado

    addItem(
      {
        id: product.id,
        nombreModelo: product.nombreModelo,
        lineaCategoria: product.lineaCategoria,
        precioMercado: effectivePrice,
        imagen: product.imagen,
      },
      1
    )

    setAddedMap((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }))
    }, 2000)
    toast.success(`"${product.nombreModelo}" agregado al carrito`)
  }

  const handleNotifyStock = async (product: FavoriteProduct) => {
    const res = await requestStockAlert(product.id, product.nombreModelo)
    if (res.whatsappUrl) {
      window.open(res.whatsappUrl, '_blank')
    }
  }

  return (
    <div className="py-8 px-4 max-w-[1200px] mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 pb-4 border-b border-[#EBE5DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#2B231F]">Mis Favoritos</h1>
            <span className="bg-[#FDF4EE] text-[#C85A32] font-black text-xs px-2.5 py-0.5 rounded-full border border-[#C85A32]/25">
              {favorites.length} {favorites.length === 1 ? 'juego' : 'juegos'}
            </span>
          </div>
          <p className="text-xs text-[#6E655F] mt-1">
            Tu lista de juegos de mesa y complementos favoritos guardados para seguir su disponibilidad y precio.
          </p>
        </div>

        <Link href="/" className="btn-nova-primary text-xs self-start sm:self-auto">
          Explorar catálogo
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: Math.min(favorites.length || 4, 8) }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#EBE5DF] p-4 space-y-4 animate-pulse"
            >
              <div className="w-full aspect-square bg-[#F4EDE5] rounded-2xl"></div>
              <div className="h-4 bg-[#F4EDE5] rounded w-3/4"></div>
              <div className="h-6 bg-[#F4EDE5] rounded w-1/2"></div>
              <div className="h-10 bg-[#F4EDE5] rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-[#EBE5DF] text-center space-y-4 shadow-sm max-w-lg mx-auto">
          <div className="w-18 h-18 rounded-3xl bg-[#FDF4EE] text-[#C85A32] border border-[#C85A32]/20 flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-9 h-9 fill-[#C85A32]/20 text-[#C85A32]" />
          </div>
          <h2 className="text-xl font-black text-[#2B231F]">Tu lista de favoritos está vacía</h2>
          <p className="text-xs text-[#6E655F] leading-relaxed">
            Guarda tus juegos favoritos tocando el corazón en las tarjetas del catálogo para hacer seguimiento de sus precios y solicitar aviso cuando vuelvan a estar disponibles.
          </p>
          <div className="pt-2">
            <Link href="/" className="btn-nova-primary text-xs inline-block">
              Ver catálogo oficial de NOVA
            </Link>
          </div>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => {
            const effectivePrice =
              product.enOferta && product.precioOferta != null && product.precioOferta > 0
                ? product.precioOferta
                : product.precioMercado
            const isDiscounted = product.enOferta && effectivePrice < product.precioMercado
            const isAdded = addedMap[product.id] === true

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#EBE5DF] overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#C85A32]/40 transition-all duration-200 group relative"
              >
                {/* Remove from favorites button */}
                <button
                  type="button"
                  onClick={() =>
                    toggleFavorite({ id: product.id, nombreModelo: product.nombreModelo })
                  }
                  className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#6E655F] hover:text-red-600 hover:bg-white shadow-2xs border border-[#EBE5DF] transition-colors cursor-pointer"
                  title="Quitar de favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1">
                  {isDiscounted && (
                    <span className="bg-[#C85A32] text-white font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1 uppercase tracking-wider">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>{product.badgePromocion || `${product.porcentajeDescuento || 15}% OFF`}</span>
                    </span>
                  )}
                  {product.isOutOfStock && (
                    <span className="bg-[#2B231F] text-white font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-xs uppercase tracking-wider">
                      Agotado
                    </span>
                  )}
                </div>

                {/* Image */}
                <Link
                  href={`/producto/${product.id}`}
                  className="block w-full aspect-square bg-[#FDFBF7] p-4 relative overflow-hidden group-hover:scale-102 transition-transform duration-300 flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imagen}
                    alt={product.nombreModelo}
                    className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xs"
                    loading="lazy"
                  />
                  {product.isOutOfStock && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
                      <span className="bg-[#2B231F] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Sin stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E655F] block mb-1">
                      {product.lineaCategoria || 'Juegos de mesa'}
                    </span>
                    <Link
                      href={`/producto/${product.id}`}
                      className="font-bold text-[#2B231F] hover:text-[#C85A32] transition-colors line-clamp-2 leading-snug"
                    >
                      {product.nombreModelo}
                    </Link>

                    {product.editorialMarca && (
                      <span className="text-[10px] text-[#6E655F] block mt-0.5 font-medium">
                        Editorial: {product.editorialMarca}
                      </span>
                    )}
                  </div>

                  {/* Price & Stock */}
                  <div className="space-y-2 pt-2 border-t border-[#EBE5DF]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#2B231F]">
                        {formatPrice(effectivePrice)}
                      </span>
                      {isDiscounted && (
                        <span className="text-xs text-[#6E655F] line-through">
                          {formatPrice(product.precioMercado)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.isOutOfStock ? (
                      <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Agotado temporalmente</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Disponible en almacén ({product.maxStock} un.)</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    {product.isOutOfStock ? (
                      <button
                        type="button"
                        onClick={() => handleNotifyStock(product)}
                        className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white text-xs py-2.5 px-3 rounded-2xl shadow-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Avisar cuando haya stock por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        <span>Avisarme disponibilidad</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="w-full btn-nova-primary text-xs py-2.5 rounded-2xl shadow-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>¡Agregado!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Agregar al carrito</span>
                          </>
                        )}
                      </button>
                    )}

                    <Link
                      href={`/producto/${product.id}`}
                      className="w-full text-center text-[#6E655F] hover:text-[#C85A32] font-semibold text-[11px] py-1 block transition-colors"
                    >
                      Ver publicación completa &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
