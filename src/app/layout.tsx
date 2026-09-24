import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/shared/providers'
import { CartProvider } from '@/features/cart'
import { FavoritesProvider } from '@/features/favorites'
import { StoreLayout } from '@/shared/components/layout'
import { getNovaBgCategories } from '@/features/catalog'
import { getStorePublicConfig } from '@/features/catalog/services/store-config.service'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NOVA: Tienda Oficial de Juegos de Mesa y Diseños 3D',
  description: 'Descubre el catálogo oficial de NOVA: juegos de mesa, organizadores a medida, torres de dados y piezas 3D con envío rápido FULL.',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [categories, storeConfig] = await Promise.all([
    getNovaBgCategories(),
    getStorePublicConfig('BG'),
  ])

  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <StoreLayout categories={categories} storeConfig={storeConfig}>
                {children}
              </StoreLayout>
              <Toaster position="top-right" richColors />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
