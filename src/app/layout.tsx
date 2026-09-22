import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { getNovaBgCategories } from '@/actions/categories'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NOVA BG: Tienda de Juegos de Mesa y Accesorios',
  description: 'Descubre el catálogo oficial de NOVA BG: juegos de mesa, organizadores, torres de dados y accesorios exclusivos con envío rápido FULL.',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await getNovaBgCategories()

  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <StoreLayout categories={categories}>{children}</StoreLayout>
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
