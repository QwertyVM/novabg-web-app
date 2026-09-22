import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amazon.pe: Juegos de Mesa, Insertos 3D y Accesorios',
  description: 'Descubre los mejores juegos de mesa, insertos organizadores 3D, torres de dados y accesorios con envío rápido.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <StoreLayout>{children}</StoreLayout>
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
