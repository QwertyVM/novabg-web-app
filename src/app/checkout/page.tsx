'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles,
  MapPin,
  Home,
  Briefcase,
  Building2,
  Plus,
  Check
} from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import { useCart } from '@/features/cart'
import { createOrder } from '@/features/orders'
import { formatPrice } from '@/shared/utils'
import { NovaLogo } from '@/shared/components/branding'
import { toast } from 'sonner'

interface DireccionOption {
  id: string
  apodo: string
  direccion: string
  distrito: string
  referencia?: string | null
  esPrincipal: boolean
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const { items, totalCount, subtotal, clearCart } = useCart()

  const [nombre, setNombre] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [telefono, setTelefono] = useState('')
  const [dni, setDni] = useState('')
  
  // Direcciones
  const [savedAddresses, setSavedAddresses] = useState<DireccionOption[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new')
  const [newAddressApodo, setNewAddressApodo] = useState('Casa')
  const [direccion, setDireccion] = useState('')
  const [distrito, setDistrito] = useState('Miraflores, Lima')
  const [notas, setNotas] = useState('')
  const [saveNewAddress, setSaveNewAddress] = useState(true)

  const [metodoPago, setMetodoPago] = useState('YAPE')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState<{ codigo: string; whatsappUrl: string } | null>(null)
  const [storeWhatsapp, setStoreWhatsapp] = useState('51999999999')
  const [hasAutofilled, setHasAutofilled] = useState(false)

  // Autocompletar datos del comprador y direcciones desde el perfil del usuario autenticado
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      if (session.user.name && !nombre) {
        setNombre(session.user.name)
      }
      if (session.user.email && !email) {
        setEmail(session.user.email)
      }

      fetch('/api/perfil')
        .then((res) => res.json())
        .then((data) => {
          if (data.cliente) {
            const c = data.cliente
            if (c.nombre) setNombre(c.nombre)
            if (c.email) setEmail(c.email)
            if (c.telefono) setTelefono(c.telefono)
            if (c.dni) setDni(c.dni)
          }

          if (Array.isArray(data.direcciones) && data.direcciones.length > 0) {
            setSavedAddresses(data.direcciones)
            const principal = data.direcciones.find((d: DireccionOption) => d.esPrincipal) || data.direcciones[0]
            setSelectedAddressId(principal.id)
            setDireccion(principal.direccion)
            setDistrito(principal.distrito)
            setNotas(principal.referencia || '')
            setHasAutofilled(true)
          } else if (data.cliente?.direccion) {
            setDireccion(data.cliente.direccion)
            setDistrito(data.cliente.distrito || 'Miraflores, Lima')
            setNotas(data.cliente.notas || '')
            setHasAutofilled(true)
          } else if (session.user?.name || session.user?.email) {
            setHasAutofilled(true)
          }
        })
        .catch((err) => console.error('Error fetching profile for checkout autofill:', err))
    }
  }, [status, session])

  useEffect(() => {
    fetch('/api/config?negocio=BG')
      .then((res) => res.json())
      .then((data) => {
        if (data.telefonoContacto) {
          const cleanNumber = data.telefonoContacto.replace(/\D/g, '')
          setStoreWhatsapp(cleanNumber)
        }
      })
      .catch((err) => console.error('Error fetching store config:', err))
  }, [])

  const getApodoIcon = (apodo: string) => {
    const lower = apodo.toLowerCase()
    if (lower.includes('casa') || lower.includes('hogar')) {
      return <Home className="w-3.5 h-3.5 text-[#C85A32]" />
    }
    if (lower.includes('ofi') || lower.includes('trabajo') || lower.includes('chamba')) {
      return <Briefcase className="w-3.5 h-3.5 text-[#C85A32]" />
    }
    if (lower.includes('depa') || lower.includes('departamento') || lower.includes('edificio')) {
      return <Building2 className="w-3.5 h-3.5 text-[#C85A32]" />
    }
    return <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
  }

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
        // Build WhatsApp message with all order details
        const lineasProductos = items
          .map((i) => `  • ${i.nombreModelo} x${i.cantidad} — S/ ${(i.precioMercado * i.cantidad).toFixed(2)}`)
          .join('\n')

        const mensaje = [
          `🎉 *¡NUEVO PEDIDO DESDE LA WEB!* 🎉`,
          `Hola equipo de Nova BG, acabo de realizar un pedido. Aquí están los detalles:`,
          ``,
          `🏷️ *Código de Orden:* ${res.pedido.codigo}`,
          ``,
          `👤 *Mis Datos:*`,
          `• *Nombre:* ${nombre}${dni ? ` (DNI: ${dni})` : ''}`,
          `• *Celular:* ${telefono}`,
          ``,
          `📍 *Detalles de Entrega:*`,
          `• *Dirección:* ${direccion}, ${distrito}`,
          notas ? `• *Referencia:* ${notas}` : '',
          `• *Pago preferido:* ${metodoPago}`,
          ``,
          `🛍️ *Mi Pedido:*`,
          lineasProductos,
          ``,
          `💳 *TOTAL A PAGAR: S/ ${subtotal.toFixed(2)}*`,
          ``,
          `¡Quedo atento(a) para coordinar la entrega! 🚀`,
        ]
          .filter((l) => l !== '')
          .join('\n')

        const whatsappUrl = `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(mensaje)}`

        // Si el usuario registró una dirección nueva y desea guardarla en su lista
        if (session?.user?.email && (selectedAddressId === 'new' || savedAddresses.length === 0) && saveNewAddress) {
          fetch('/api/direcciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apodo: newAddressApodo || 'Casa',
              direccion,
              distrito,
              referencia: notas,
              esPrincipal: savedAddresses.length === 0,
            }),
          }).catch((err) => console.error('Error auto-saving new address:', err))
        }

        // Sincronizar datos de comprador al perfil del usuario
        if (session?.user?.email) {
          fetch('/api/perfil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre,
              telefono,
              dni,
            }),
          }).catch((err) => console.error('Error syncing profile from checkout:', err))
        }

        clearCart()
        setOrderComplete({ codigo: res.pedido.codigo, whatsappUrl })
        // Auto-redirect to WhatsApp
        window.open(whatsappUrl, '_blank')
        toast.success('¡Pedido confirmado! Abriendo WhatsApp...')
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
          <h1 className="text-2xl font-black text-[#2B231F]">¡Pedido registrado en NOVA!</h1>
          <div className="bg-[#FDFBF7] border border-[#EBE5DF] rounded-2xl p-5 max-w-md mx-auto text-xs text-[#6E655F] space-y-1">
            <p className="text-[#6E655F]">Código de confirmación:</p>
            <p className="text-2xl font-black text-[#C85A32] tracking-wider py-1">{orderComplete.codigo}</p>
          </div>
          <p className="text-xs text-[#6E655F] max-w-md mx-auto leading-relaxed">
            Tu pedido fue registrado. Si no se abrió WhatsApp automáticamente, haz clic en el botón de abajo para enviarnos los detalles.
          </p>
          <div className="pt-2 flex flex-col items-center gap-3">
            <a
              href={orderComplete.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-sm transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar pedido por WhatsApp
            </a>
            <Link
              href="/"
              className="text-xs font-bold text-[#6E655F] hover:text-[#2B231F] transition-colors mt-2"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-[#FDF4EE] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C85A32]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#2B231F] mb-2">Tu carrito está vacío</h2>
        <p className="text-[#6E655F] text-xs mb-6">Agrega juegos de mesa o accesorios para completar tu compra.</p>
        <Link href="/" className="btn-nova-primary inline-flex text-xs font-bold px-6 py-3">
          Ver Catálogo
        </Link>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#C85A32] border-t-transparent"></div>
        <p className="mt-4 text-[#6E655F] font-bold text-sm">Cargando...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="py-16 px-4 max-w-[500px] mx-auto text-center bg-white p-10 rounded-3xl border border-[#EBE5DF] shadow-sm">
        <div className="w-16 h-16 bg-[#FDF4EE] rounded-full flex items-center justify-center mx-auto mb-5">
          <Lock className="w-8 h-8 text-[#C85A32]" />
        </div>
        <h2 className="text-2xl font-black text-[#2B231F] mb-3">Inicia sesión para comprar</h2>
        <p className="text-[#6E655F] text-sm mb-8 leading-relaxed">
          Para garantizar la seguridad de tu compra y hacerle seguimiento a tu pedido, necesitamos que ingreses con tu cuenta.
        </p>
        <button
          onClick={() => signIn('google')}
          className="w-full bg-white border border-[#EBE5DF] hover:bg-[#FDFBF7] text-[#2B231F] font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          Continuar con Google
        </button>
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

      {hasAutofilled && (
        <div className="bg-[#FDF4EE] border border-[#C85A32]/25 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#C85A32]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C85A32] shrink-0" />
            <span>
              Tus datos se autocompletaron desde tu cuenta de <strong>{nombre || session?.user?.name || session?.user?.email}</strong>.
            </span>
          </div>
          <Link href="/perfil" className="font-bold underline hover:text-[#A04320] shrink-0 self-start sm:self-center">
            Gestionar direcciones en perfil
          </Link>
        </div>
      )}

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

          {/* Step 2: Delivery Address (Saved selection or new registration) */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-bold text-[#2B231F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C85A32] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Dirección de Entrega
              </h2>

              {savedAddresses.length > 0 && selectedAddressId !== 'new' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAddressId('new')
                    setDireccion('')
                    setDistrito('Miraflores, Lima')
                    setNotas('')
                    setNewAddressApodo('Casa')
                  }}
                  className="text-xs font-bold text-[#C85A32] hover:text-[#A04320] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Usar otra dirección</span>
                </button>
              )}
            </div>

            {/* Selector de Direcciones Guardadas */}
            {savedAddresses.length > 0 && (
              <div className="mb-5 space-y-3">
                <label className="block text-xs font-bold text-[#6E655F]">
                  Selecciona una de tus direcciones guardadas:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id)
                          setDireccion(addr.direccion)
                          setDistrito(addr.distrito)
                          setNotas(addr.referencia || '')
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-[#C85A32] bg-[#FDF4EE]/70 ring-2 ring-[#C85A32]/20'
                            : 'border-[#EBE5DF] bg-[#FDFBF7] hover:border-[#C85A32]/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#2B231F]">
                              {getApodoIcon(addr.apodo)}
                              {addr.apodo}
                            </span>
                            {addr.esPrincipal && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-[#C85A32] bg-white px-2 py-0.5 rounded-full border border-[#C85A32]/20">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#2B231F] leading-snug">
                            {addr.direccion}
                          </p>
                          <p className="text-[11px] text-[#6E655F]">
                            {addr.distrito}
                          </p>
                          {addr.referencia && (
                            <p className="text-[10px] text-[#8C827A] italic mt-1 line-clamp-1">
                              Ref: {addr.referencia}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-[#C85A32]' : 'text-[#A89F91]'}`}>
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Seleccionada para entrega</span>
                              </>
                            ) : (
                              'Click para seleccionar'
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  })}

                  {/* Card para registrar nueva dirección */}
                  <div
                    onClick={() => {
                      setSelectedAddressId('new')
                      setDireccion('')
                      setDistrito('Miraflores, Lima')
                      setNotas('')
                      setNewAddressApodo('Casa')
                    }}
                    className={`p-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-1 text-center min-h-[90px] ${
                      selectedAddressId === 'new'
                        ? 'border-[#C85A32] bg-[#FDF4EE]/40 text-[#C85A32]'
                        : 'border-[#EBE5DF] bg-white hover:border-[#C85A32]/40 text-[#6E655F]'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-[#C85A32]" />
                    <span className="text-xs font-bold">Registrar nueva dirección</span>
                    <span className="text-[10px] text-[#A89F91]">Se guardará con apodo en tu cuenta</span>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de Dirección (cuando se selecciona nueva dirección o el usuario no tiene ninguna) */}
            {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
              <div className="space-y-4 pt-2 border-t border-[#EBE5DF]/60 animate-fadeIn text-xs">
                {savedAddresses.length > 0 && (
                  <p className="text-xs font-black uppercase tracking-wider text-[#C85A32]">
                    Nueva Dirección de Entrega
                  </p>
                )}

                {/* Apodo para la nueva dirección */}
                <div>
                  <label className="block text-[#2B231F] font-bold mb-1.5">
                    Apodo de esta dirección (Ej: Casa, Oficina, Depa) *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Casa', 'Oficina', 'Depa', 'Taller'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewAddressApodo(tag)}
                        className={`text-xs px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                          newAddressApodo === tag
                            ? 'bg-[#C85A32] text-white border-[#C85A32]'
                            : 'bg-[#FDFBF7] text-[#6E655F] border-[#EBE5DF]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newAddressApodo}
                    onChange={(e) => setNewAddressApodo(e.target.value)}
                    placeholder="Ej: Casa de mis padres, Oficina..."
                    className="w-full border border-[#EBE5DF] bg-[#FDFBF7] rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] font-semibold text-[#2B231F]"
                  />
                </div>

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
                      required
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

                {session?.user && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="saveNewAddressCheck"
                      checked={saveNewAddress}
                      onChange={(e) => setSaveNewAddress(e.target.checked)}
                      className="rounded border-[#EBE5DF] text-[#C85A32] focus:ring-[#C85A32] cursor-pointer"
                    />
                    <label htmlFor="saveNewAddressCheck" className="text-xs font-semibold text-[#2B231F] cursor-pointer">
                      Guardar esta dirección con apodo &quot;{newAddressApodo}&quot; en mi cuenta
                    </label>
                  </div>
                )}
              </div>
            )}
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
                    : 'border-[#EBE5DF] hover:border-[#D9B89C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="YAPE"
                    checked={metodoPago === 'YAPE'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="accent-[#C85A32] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#2B231F] text-sm">Yape / Plin</span>
                    <p className="text-[#6E655F] text-[11px]">Paga rápido y sin comisiones desde tu celular</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#742284] flex items-center justify-center text-white font-bold text-xs">
                  Y
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodoPago === 'TRANSFERENCIA'
                    ? 'border-[#C85A32] bg-[#FDF4EE] ring-1 ring-[#C85A32]'
                    : 'border-[#EBE5DF] hover:border-[#D9B89C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="TRANSFERENCIA"
                    checked={metodoPago === 'TRANSFERENCIA'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="accent-[#C85A32] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#2B231F] text-sm">Transferencia Bancaria</span>
                    <p className="text-[#6E655F] text-[11px]">BCP, BBVA, Interbank o Scotiabank</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#002A61] flex items-center justify-center text-white font-bold text-xs">
                  B
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5DF] shadow-sm sticky top-24 space-y-6">
            <h3 className="font-black text-base text-[#2B231F] border-b border-[#EBE5DF] pb-3">
              Detalle del Pedido
            </h3>

            {/* Product List Snippet */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-[#F4EDE5] text-[#C85A32] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {item.cantidad}
                    </span>
                    <span className="font-bold text-[#2B231F] truncate">{item.nombreModelo}</span>
                  </div>
                  <span className="font-bold text-[#2B231F] shrink-0">
                    S/ {(item.precioMercado * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EBE5DF] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6E655F]">
                <span>Productos ({totalCount}):</span>
                <span className="font-bold text-[#2B231F]">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#6E655F]">
                <span>Costo de Envío:</span>
                <span className="font-bold text-[#C85A32]">A coordinar por WhatsApp</span>
              </div>
            </div>

            <div className="border-t border-[#EBE5DF] pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#2B231F]">Total a Pagar:</span>
              <span className="text-2xl font-black text-[#2B231F] tracking-tight">{formattedSubtotal}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-[#C85A32] hover:bg-[#A04320] text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando pedido...</span>
                </>
              ) : (
                <span>Confirmar Compra</span>
              )}
            </button>

            <p className="text-[10px] text-[#A89F91] text-center leading-relaxed">
              Al confirmar aceptas los términos de garantía y entrega de NOVA.
            </p>

            <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#EBE5DF] flex items-start gap-2.5 text-[11px] text-[#6E655F]">
              <ShieldCheck className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
              <span>
                <strong>Compra Protegida:</strong> Recibe el producto que esperabas o te devolvemos tu dinero.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
