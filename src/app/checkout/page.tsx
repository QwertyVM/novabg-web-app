'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Lock, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import { useCart } from '@/features/cart'
import { createOrder } from '@/features/orders'
import { formatPrice, getEstimatedDeliveryDate } from '@/shared/utils'
import { NovaLogo } from '@/shared/components/branding'
import { toast } from 'sonner'

export default function CheckoutPage() {
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
  const formattedSubtotal = formatPrice(subtotal)

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
        canalVenta: 'Web Oficial NOVA BG',
        destinoEnvio: `${direccion}, ${distrito}`,
        notas: `Método de pago: ${metodoPago}. ${notas}`,
        items: items.map((i) => ({
          productoId: i.id,
          nombreProductoSnapshot: i.nombreModelo,
          cantidad: i.cantidad,
          precioUnitario: i.precioMercado,
          subtotal: i.precioMercado * i.cantidad,
        })),
        metodoPago,
      })

      if (res.success && res.pedido) {
        clearCart()
        setOrderComplete({ codigo: res.pedido.codigo })
        toast.success('¡Pedido confirmado con éxito!')
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
      <div className="py-16 px-4 max-w-[700px] mx-auto">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE5DF] shadow-sm text-center space-y-5">
          <div className="w-16 h-16 bg-[#EBF7F0] text-[#10B981] border border-[#10B981]/30 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-[#2B231F]">¡Gracias por tu compra en NOVA!</h1>
          <div className="bg-[#FDFBF7] border border-[#EBE5DF] rounded-2xl p-5 max-w-md mx-auto text-xs text-[#6E655F] space-y-1">
            <p className="text-[#6E655F]">Código de confirmación:</p>
            <p className="text-2xl font-black text-[#C85A32] tracking-wider py-1">{orderComplete.codigo}</p>
            <p className="text-[#2B231F]">
              Fecha estimada de entrega: <strong className="text-[#C85A32]">{deliveryDate}</strong>
            </p>
          </div>
          <p className="text-xs text-[#6E655F] max-w-md mx-auto leading-relaxed">
            Hemos registrado tu orden exitosamente. Te contactaremos vía WhatsApp al número <strong>{telefono}</strong> para coordinar el despacho inmediato.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/pedidos" className="btn-nova-primary text-xs">
              Ver Mis Compras
            </Link>
            <Link href="/" className="btn-nova-outline text-xs">
              Seguir Explorando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 max-w-[600px] mx-auto text-center bg-white p-8 rounded-3xl border border-[#EBE5DF]">
        <ShoppingBag className="w-12 h-12 text-[#6E655F] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#2B231F] mb-2">No tienes productos en tu carrito</h2>
        <Link href="/" className="btn-nova-primary text-xs mt-3 inline-block">
          Explorar Catálogo NOVA
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 max-w-[1200px] mx-auto">
      {/* Checkout Top Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE5DF] shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NovaLogo size="sm" showBadge={false} />
          <span className="text-xs font-bold text-[#6E655F] hidden sm:inline">| Checkout Seguro</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold">
          <Lock className="w-4 h-4 text-[#10B981]" />
          <span>Pago 100% Protegido</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: User / Identity */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#2B231F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C85A32] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Datos del Comprador
              </h2>
              {!session && (
                <button
                  type="button"
                  onClick={() => signIn('google')}
                  className="text-xs text-[#C85A32] hover:underline font-bold flex items-center gap-1 cursor-pointer"
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
                  Identificarse con Google
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#2B231F] font-bold mb-1.5">Nombre Completo *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Víctor Manzanilla"
                  className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#2B231F] font-bold mb-1.5">WhatsApp / Celular *</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 987654321"
                  className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#2B231F] font-bold mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                />
              </div>
              <div>
                <label className="block text-[#2B231F] font-bold mb-1.5">DNI / RUC</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ej: 72819283"
                  className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm">
            <h2 className="text-base font-bold text-[#2B231F] flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#C85A32] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              Dirección de Entrega
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2B231F] font-bold mb-1.5">Dirección Exacta (Calle, Número, Depto) *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Benavides 1230, Dpto 402"
                  className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2B231F] font-bold mb-1.5">Distrito / Ciudad *</label>
                  <input
                    type="text"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    placeholder="Ej: Miraflores, Lima"
                    className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                  />
                </div>
                <div>
                  <label className="block text-[#2B231F] font-bold mb-1.5">Referencia o Instrucción</label>
                  <input
                    type="text"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej: Dejar en conserjería"
                    className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm">
            <h2 className="text-base font-bold text-[#2B231F] flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#C85A32] text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              Forma de Pago
            </h2>

            <div className="space-y-3 text-xs">
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodoPago === 'YAPE'
                    ? 'border-[#C85A32] bg-[#FDF4EE] ring-1 ring-[#C85A32]'
                    : 'border-[#EBE5DF] bg-[#FDFBF7] hover:border-[#C85A32]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pago"
                    value="YAPE"
                    checked={metodoPago === 'YAPE'}
                    onChange={() => setMetodoPago('YAPE')}
                    className="accent-[#C85A32]"
                  />
                  <div>
                    <span className="font-bold text-[#2B231F] text-sm">Yape / Plin</span>
                    <p className="text-[11px] text-[#6E655F]">Transferencia instantánea por código QR o número</p>
                  </div>
                </div>
                <span className="text-purple-700 font-black text-xs px-2.5 py-1 bg-purple-50 rounded-lg border border-purple-200">
                  YAPE / PLIN
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodoPago === 'TARJETA'
                    ? 'border-[#C85A32] bg-[#FDF4EE] ring-1 ring-[#C85A32]'
                    : 'border-[#EBE5DF] bg-[#FDFBF7] hover:border-[#C85A32]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pago"
                    value="TARJETA"
                    checked={metodoPago === 'TARJETA'}
                    onChange={() => setMetodoPago('TARJETA')}
                    className="accent-[#C85A32]"
                  />
                  <div>
                    <span className="font-bold text-[#2B231F] text-sm">Tarjeta de Débito o Crédito</span>
                  </div>
                </div>
                <span className="text-[#C85A32] font-bold text-xs px-2.5 py-1 bg-[#FDF4EE] border border-[#C85A32]/30 rounded-lg">
                  VISA / MASTERCARD
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodoPago === 'TRANSFERENCIA'
                    ? 'border-[#C85A32] bg-[#FDF4EE] ring-1 ring-[#C85A32]'
                    : 'border-[#EBE5DF] bg-[#FDFBF7] hover:border-[#C85A32]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pago"
                    value="TRANSFERENCIA"
                    checked={metodoPago === 'TRANSFERENCIA'}
                    onChange={() => setMetodoPago('TRANSFERENCIA')}
                    className="accent-[#C85A32]"
                  />
                  <div>
                    <span className="font-bold text-[#2B231F] text-sm">Transferencia BCP / Interbank</span>
                    <p className="text-[11px] text-[#6E655F]">Depósito bancario directo</p>
                  </div>
                </div>
                <span className="text-[#2B231F] font-bold text-xs px-2.5 py-1 bg-white border border-[#EBE5DF] rounded-lg">
                  BANCO DIRECTO
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm space-y-4 sticky top-20 text-xs">
            <h3 className="font-black text-base text-[#2B231F] pb-3 border-b border-[#EBE5DF]">
              Detalle del Pedido
            </h3>

            <div className="space-y-2 text-[#6E655F]">
              <div className="flex justify-between">
                <span>Productos ({totalCount}):</span>
                <span className="text-[#2B231F] font-bold">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#6E655F] font-medium">
                <span>Costo de Envío:</span>
                <span className="text-[#C85A32] font-bold">A coordinar por WhatsApp</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EBE5DF] flex justify-between items-baseline">
              <span className="text-base font-bold text-[#2B231F]">Total a Pagar:</span>
              <span className="text-2xl font-black text-[#2B231F]">{formattedSubtotal}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full btn-nova-primary py-3.5 text-sm font-bold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Procesando pedido...' : 'Confirmar Compra'}
            </button>

            <p className="text-[11px] text-[#6E655F] text-center leading-tight">
              Al confirmar aceptas los términos de garantía y entrega de NOVA.
            </p>

            <div className="border-t border-[#EBE5DF] pt-4 text-[11px] text-[#6E655F] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C85A32] shrink-0" />
              <span>Compra Protegida: Recibe el producto o te devolvemos el dinero.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
