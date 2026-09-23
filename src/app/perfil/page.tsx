'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  MapPin, 
  Save, 
  AlertCircle, 
  Phone, 
  IdCard, 
  Building, 
  Star, 
  Package, 
  Compass, 
  LogOut,
  ShoppingBag,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [isLoading, setIsLoading] = useState(true)
  const [isSavingCustomer, setIsSavingCustomer] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [puntos, setPuntos] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)

  // Datos del Cliente State
  const [customerData, setCustomerData] = useState({
    nombre: '',
    dni: '',
    telefono: '',
  })

  // Dirección State
  const [addressData, setAddressData] = useState({
    direccion: '',
    distrito: '',
    referencia: '',
  })

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/perfil')
      if (res.ok) {
        const data = await res.json()
        if (data.cliente) {
          setCustomerData({
            nombre: data.cliente.nombre || session?.user?.name || '',
            dni: data.cliente.dni || '',
            telefono: data.cliente.telefono || '',
          })
          setAddressData({
            direccion: data.cliente.direccion || '',
            distrito: data.cliente.distrito || '',
            referencia: data.cliente.notas || '',
          })
          if (data.puntosAcumulados !== undefined) setPuntos(data.puntosAcumulados)
          if (data.totalPedidos !== undefined) setTotalPedidos(data.totalPedidos)
        } else {
          setCustomerData(prev => ({
            ...prev,
            nombre: session?.user?.name || ''
          }))
        }
      }
    } catch (err) {
      console.error('Error loading profile', err)
      toast.error('Error cargando los datos del perfil')
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.name])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      loadProfile()
    }
  }, [status, router, loadProfile])

  // Guardar Datos del Cliente
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSavingCustomer(true)

    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: customerData.nombre,
          dni: customerData.dni,
          telefono: customerData.telefono,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al guardar.')
        toast.error(data.error || 'No se pudo guardar los datos del cliente')
      } else {
        toast.success('Datos personales actualizados exitosamente')
        if (customerData.nombre !== session?.user?.name) {
          await update({ name: customerData.nombre })
        }
      }
    } catch (err) {
      console.error(err)
      setError('Error de red al intentar guardar los datos.')
    } finally {
      setIsSavingCustomer(false)
    }
  }

  // Guardar Dirección
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSavingAddress(true)

    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direccion: addressData.direccion,
          distrito: addressData.distrito,
          referencia: addressData.referencia,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al guardar.')
        toast.error(data.error || 'No se pudo guardar la dirección')
      } else {
        toast.success('Dirección de entrega actualizada exitosamente')
      }
    } catch (err) {
      console.error(err)
      setError('Error de red al intentar guardar los datos de dirección.')
    } finally {
      setIsSavingAddress(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center min-h-[50vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#C85A32] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-[#6E655F]">Cargando tu perfil...</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null
  }

  const { user } = session
  const hasSavedAddress = Boolean(addressData.direccion.trim())

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header Bar: Identity & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#EBE5DF] shadow-xs">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || 'Usuario'}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#FDFBF7] shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F4EDE5] flex items-center justify-center border-2 border-[#FDFBF7] shadow-sm text-[#C85A32]">
              <UserCircle className="w-9 h-9" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#2B231F] tracking-tight">
                {customerData.nombre || user.name || 'Mi Perfil'}
              </h1>
              <span className="bg-[#FDF4EE] text-[#C85A32] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#C85A32]/20">
                Cliente NOVA
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6E655F] mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[#A89F91]" />
              <span>{user.email}</span>
              <span className="text-[#EBE5DF]">·</span>
              <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Cuenta Verificada
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#2B231F] bg-[#FDFBF7] hover:bg-[#F4EDE5] border border-[#EBE5DF] transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
            <span>Mis Compras</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#6E655F] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* 1. SECCIÓN DE PUNTOS: ARRIBA DE TODO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B231F] via-[#382E28] to-[#1F1916] p-6 sm:p-8 text-white shadow-lg border border-[#3E342D]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C85A32]/25 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-[#FBBF24]">
                <Star className="w-5 h-5 fill-[#FBBF24]" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#D9B89C]">
                  Club de Fidelidad
                </p>
                <h2 className="text-lg font-black tracking-tight text-white">
                  Mis Puntos NOVA
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>1 Sol = 1 Punto</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 items-center">
            {/* Main Points Counter */}
            <div className="sm:col-span-1 border-b sm:border-b-0 sm:border-r border-white/10 pb-5 sm:pb-0 pr-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/60 block mb-1">
                Puntos Disponibles
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">
                  {puntos.toLocaleString()}
                </span>
                <span className="text-base font-bold text-[#D9B89C]">pts</span>
              </div>
            </div>

            {/* Metrics & Info */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-[#D9B89C] mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-semibold text-white/70">Pedidos Realizados</span>
                </div>
                <p className="text-2xl font-black text-white">
                  {totalPedidos} <span className="text-xs font-normal text-white/60">{totalPedidos === 1 ? 'orden' : 'órdenes'}</span>
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-[#10B981] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-semibold text-white/70">Beneficios</span>
                </div>
                <p className="text-xs text-white/90 font-medium leading-relaxed">
                  Tus puntos se acumulan en cada pedido y se canjean por descuentos y regalos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DESPUÉS: SECCIÓN DATOS DEL CLIENTE */}
      <div className="bg-white rounded-3xl border border-[#EBE5DF] p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[#EBE5DF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF4EE] text-[#C85A32] flex items-center justify-center">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B231F]">Datos del Cliente</h3>
              <p className="text-xs text-[#6E655F] mt-0.5">
                Información personal para tus comprobantes y contacto directo.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerData.nombre}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-xs font-semibold text-[#2B231F]"
                  required
                />
                <UserCircle className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                Correo Electrónico (Cuenta Google)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#F5F2EC]/60 text-xs font-semibold text-[#6E655F] cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                WhatsApp / Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={customerData.telefono}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="Ej: 987654321"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-xs font-semibold text-[#2B231F]"
                />
                <Phone className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                DNI / RUC / CE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerData.dni}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, dni: e.target.value }))}
                  placeholder="Documento de identidad"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-xs font-semibold text-[#2B231F]"
                />
                <IdCard className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingCustomer}
              className="btn-nova-primary py-2.5 px-6 text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isSavingCustomer ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Datos del Cliente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. DESPUÉS: OTRA SECCIÓN DE DIRECCIÓN */}
      <div className="bg-white rounded-3xl border border-[#EBE5DF] p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[#EBE5DF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF4EE] text-[#C85A32] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B231F]">Dirección de Entrega</h3>
              <p className="text-xs text-[#6E655F] mt-0.5">
                Tu dirección registrada para envíos a domicilio y autocompletado en el checkout.
              </p>
            </div>
          </div>

          {hasSavedAddress && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#10B981]/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dirección Activa
            </span>
          )}
        </div>

        {/* Tarjeta Visual de Dirección Guardada */}
        {hasSavedAddress && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FDFBF7] border border-[#EBE5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2B231F] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                  {addressData.direccion}
                </span>
                {addressData.distrito && (
                  <span className="text-[11px] font-semibold text-[#6E655F] bg-[#EBE5DF]/60 px-2 py-0.5 rounded-md">
                    {addressData.distrito}
                  </span>
                )}
              </div>
              {addressData.referencia && (
                <p className="text-xs text-[#6E655F] pl-5">
                  <span className="font-semibold text-[#2B231F]">Ref:</span> {addressData.referencia}
                </p>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase text-[#A89F91] tracking-wider self-start sm:self-center">
              Predeterminada
            </span>
          </div>
        )}

        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
              Dirección Exacta (Calle, Número, Dpto, Interior) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={addressData.direccion}
                onChange={(e) => setAddressData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Ej: Av. Benavides 1230, Dpto 402"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-xs font-semibold text-[#2B231F]"
                required
              />
              <MapPin className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                Distrito / Ciudad *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={addressData.distrito}
                  onChange={(e) => setAddressData(prev => ({ ...prev, distrito: e.target.value }))}
                  placeholder="Ej: Miraflores, Lima"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-xs font-semibold text-[#2B231F]"
                  required
                />
                <Building className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                Referencia o Instrucciones de Entrega
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={addressData.referencia}
                  onChange={(e) => setAddressData(prev => ({ ...prev, referencia: e.target.value }))}
                  placeholder="Ej: Frente al parque, dejar en conserjería"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-xs font-semibold text-[#2B231F]"
                />
                <Compass className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingAddress}
              className="btn-nova-primary py-2.5 px-6 text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isSavingAddress ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Dirección</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
