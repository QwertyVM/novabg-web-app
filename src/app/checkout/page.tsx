'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle2, ShieldCheck, MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/actions/order'
import { formatPriceParts, getEstimatedDeliveryDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, totalCount, subtotal, clearCart } = useCart()

  const [nombre, setNombre] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [telefono, setTelefono] = useState('')
  const [dni, setDni] = useState('')
  const [direccion, setDireccion] = useState('')
  const [distrito, setDistrito] = useState('Miraflores, Lima')
  const [metodoPago, setMetodoPago] = useState('YAPE')
  const [notas, setNotas] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState<{ codigo: string } | null>(null)

  const deliveryDate = getEstimatedDeliveryDate()
  const subtotalParts = formatPriceParts(subtotal)

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      toast.error('Por favor ingresa tu nombre completo')
      return
    }
    if (!telefono.trim()) {
      toast.error('Por favor ingresa tu número de WhatsApp / Teléfono')
      return
    }
    if (!direccion.trim()) {
      toast.error('Por favor ingresa tu dirección de entrega')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createOrder({
        cliente: nombre,
        dni,
        telefono,
        canalVenta: 'Web Amazon Store',
        destinoEnvio: `${direccion}, ${distrito}`,
        notas: `Método de pago: ${metodoPago}. ${notas}`,
        items: items.map((i) => ({
          productoId: i.id,
          nombreProductoSnapshot: i.nombre,
          cantidad: i.cantidad,
          precioUnitario: i.precio,
          subtotal: i.precio * i.cantidad,
        })),
        metodoPago,
      })

      if (res.success && res.pedido) {
        clearCart()
        setOrderComplete({ codigo: res.pedido.codigo })
        toast.success('¡Pedido realizado con éxito!')
      } else {
        toast.error(res.error || 'Error al procesar el pedido')
      }
    } catch (err: any) {
      toast.error('Error inesperado al crear pedido')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="py-12 px-4 max-w-[800px] mx-auto">
        <div className="bg-white p-8 rounded border border-gray-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">¡Gracias, tu pedido ha sido confirmado!</h1>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 max-w-md mx-auto text-xs text-gray-700">
            <p className="text-gray-500 mb-1">Código de Pedido de Amazon:</p>
            <p className="text-lg font-black text-amber-900 tracking-wider mb-2">{orderComplete.codigo}</p>
            <p>
              Fecha estimada de entrega: <strong>{deliveryDate}</strong>
            </p>
          </div>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Hemos recibido los detalles de tu orden. Te contactaremos por WhatsApp ({telefono}) para coordinar el envío de inmediato.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/pedidos" className="btn-amazon-primary text-xs">
              Ver Mis Pedidos
            </Link>
            <Link href="/" className="btn-amazon-white text-xs">
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-12 px-4 max-w-[600px] mx-auto text-center bg-white p-8 rounded border border-gray-200">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes productos en tu carrito</h2>
        <Link href="/" className="btn-amazon-primary text-xs mt-3 inline-block">
          Explorar Juegos de Mesa
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6 px-4 max-w-[1200px] mx-auto">
      {/* Checkout Top Bar */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs mb-6 flex items-center justify-between">
        <span className="text-xl font-black text-gray-900">
          amazon<span className="text-[#febd69]">.pe</span>{' '}
          <span className="text-sm font-normal text-gray-500">| Pago Seguro</span>
        </span>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <Lock className="w-4 h-4" />
          <span>Encriptación SSL 256-bit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: User / Google Session */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#131921] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Identificación de Cliente
              </h2>
              {!session && (
                <button
                  type="button"
                  onClick={() => signIn('google')}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Conectar con Google
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Víctor Manzanilla"
                  className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">WhatsApp / Teléfono *</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 987654321"
                  className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">DNI / RUC</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ej: 72819283"
                  className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-2xs">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#131921] text-white flex items-center justify-center text-xs">
                2
              </span>
              Dirección de Envío
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Dirección Exacta (Calle, Número, Dpto) *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Larco 450, Dpto 302"
                  className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Distrito / Ciudad *</label>
                  <input
                    type="text"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    placeholder="Ej: San Isidro, Lima"
                    className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Referencia o Instrucción</label>
                  <input
                    type="text"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej: Dejar en recepción"
                    className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-5 rounded border border-gray-200 shadow-2xs">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#131921] text-white flex items-center justify-center text-xs">
                3
              </span>
              Método de Pago
            </h2>

            <div className="space-y-2 text-xs">
              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${
                  metodoPago === 'YAPE'
                    ? 'border-purple-600 bg-purple-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pago"
                    value="YAPE"
                    checked={metodoPago === 'YAPE'}
                    onChange={() => setMetodoPago('YAPE')}
                  />
                  <div>
                    <span className="font-bold text-gray-900">Yape / Plin</span>
                    <p className="text-[11px] text-gray-500">Pago instantáneo por código QR o número</p>
                  </div>
                </div>
                <span className="text-purple-700 font-black text-xs">YAPE / PLIN</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${
                  metodoPago === 'TRANSFERENCIA'
                    ? 'border-amber-600 bg-amber-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pago"
                    value="TRANSFERENCIA"
                    checked={metodoPago === 'TRANSFERENCIA'}
                    onChange={() => setMetodoPago('TRANSFERENCIA')}
                  />
                  <div>
                    <span className="font-bold text-gray-900">Transferencia Bancaria</span>
                    <p className="text-[11px] text-gray-500">BCP / BBVA / Interbank</p>
                  </div>
                </div>
                <span className="text-blue-700 font-bold text-xs">BCP / INTERBANK</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${
                  metodoPago === 'TARJETA'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pago"
                    value="TARJETA"
                    checked={metodoPago === 'TARJETA'}
                    onChange={() => setMetodoPago('TARJETA')}
                  />
                  <div>
                    <span className="font-bold text-gray-900">Tarjeta de Crédito o Débito</span>
                    <p className="text-[11px] text-gray-500">Visa / Mastercard</p>
                  </div>
                </div>
                <span className="text-gray-700 font-medium text-xs">VISA / MC</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded border border-gray-200 shadow-xs space-y-4 sticky top-20 text-xs">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-200">
              Resumen del Pedido
            </h3>

            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Productos ({totalCount}):</span>
                <span className="text-gray-900 font-medium">{subtotalParts.full}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Envío y manipulación:</span>
                <span>GRATIS</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total del Pedido:</span>
              <span className="text-xl font-black text-amber-900">{subtotalParts.full}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full btn-amazon-primary py-3 text-sm font-bold shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar y Finalizar Pedido'}
            </button>

            <p className="text-[11px] text-gray-500 leading-tight">
              Al confirmar tu pedido, aceptas las condiciones de uso y venta de Amazon Juegos de Mesa.
            </p>

            <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Garantía de compra segura y entrega garantizada.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
