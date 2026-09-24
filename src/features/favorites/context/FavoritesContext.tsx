'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface StockAlertInput {
  nombre?: string
  telefono?: string
  email?: string
}

interface FavoritesContextType {
  favorites: string[]
  totalFavorites: number
  isFavorite: (productId: string) => boolean
  toggleFavorite: (product: { id: string; nombreModelo?: string }) => Promise<void>
  requestStockAlert: (
    productId: string,
    productName: string,
    contact?: StockAlertInput
  ) => Promise<{ success: boolean; whatsappUrl: string }>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'novabg_favorites_v1'

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar favoritos guardados en localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch (e) {
      console.error('Error loading favorites from storage:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Guardar en localStorage ante cambios
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.error('Error persisting favorites to storage:', e)
    }
  }, [favorites, isLoaded])

  const isFavorite = (productId: string) => favorites.includes(productId)

  const toggleFavorite = async (product: { id: string; nombreModelo?: string }) => {
    const exists = favorites.includes(product.id)
    const nextFavorites = exists
      ? favorites.filter((id) => id !== product.id)
      : [...favorites, product.id]

    setFavorites(nextFavorites)

    if (exists) {
      toast.info(
        product.nombreModelo
          ? `"${product.nombreModelo}" eliminado de favoritos`
          : 'Eliminado de favoritos'
      )
    } else {
      toast.success(
        product.nombreModelo
          ? `"${product.nombreModelo}" guardado en favoritos`
          : 'Guardado en favoritos'
      )
    }

    // Sincronizar con base de datos en segundo plano
    try {
      fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: exists ? 'remove' : 'add',
          productoId: product.id,
          clienteEmail: session?.user?.email || null,
          clienteNombre: session?.user?.name || null,
        }),
      }).catch((err) => console.error('Error syncing favorite to API:', err))
    } catch (err) {
      console.error('Error calling /api/favoritos:', err)
    }
  }

  const requestStockAlert = async (
    productId: string,
    productName: string,
    contact?: StockAlertInput
  ) => {
    // Si no está en favoritos, agregarlo
    if (!favorites.includes(productId)) {
      setFavorites((prev) => [...prev, productId])
    }

    const email = contact?.email || session?.user?.email || undefined
    const nombre = contact?.nombre || session?.user?.name || undefined
    const telefono = contact?.telefono || undefined

    // Registrar en BD
    try {
      await fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'alert',
          productoId: productId,
          clienteEmail: email,
          clienteNombre: nombre,
          clienteTelefono: telefono,
          deseaAvisoStock: true,
        }),
      })
    } catch (e) {
      console.error('Error registering stock alert:', e)
    }

    // Generar mensaje de WhatsApp predeterminado
    const mensaje = [
      `🎲 ¡Hola, Nova BG! Me interesa el juego "${productName}" que actualmente figura sin stock en la web.`,
      ``,
      `¿Podrían avisarme cuando vuelva a estar disponible o indicarme si se puede traer a pedido?`,
    ].join('\n')

    const whatsappUrl = `https://wa.me/51945398747?text=${encodeURIComponent(mensaje)}`

    toast.success('¡Solicitud registrada! Abriendo WhatsApp con NOVA BG...')
    return { success: true, whatsappUrl }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        totalFavorites: favorites.length,
        isFavorite,
        toggleFavorite,
        requestStockAlert,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
