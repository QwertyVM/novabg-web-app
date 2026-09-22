'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen: string
  categoria?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: { id: string; nombre: string; precio: number; imagen?: string; categoria?: string }, cantidad?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  totalCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'amazon_bg_cart_items_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Error cargando carrito:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (e) {
        console.error('Error guardando carrito:', e)
      }
    }
  }, [items, isLoaded])

  const addToCart = (
    product: { id: string; nombre: string; precio: number; imagen?: string; categoria?: string },
    cantidad: number = 1
  ) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: cantidad,
          imagen: product.imagen || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
          categoria: product.categoria || 'Juegos de Mesa',
        },
      ]
    })
    toast.success(`"${product.nombre}" agregado al carrito`, {
      description: `Cantidad: ${cantidad}`,
      duration: 3000,
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    toast.info('Producto eliminado del carrito')
  }

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const totalCount = items.reduce((acc, item) => acc + item.cantidad, 0)
  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider')
  }
  return context
}
