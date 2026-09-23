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
  Building2,
  Home,
  Briefcase,
  Star, 
  Package, 
  Compass, 
  LogOut,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'

interface Direccion {
  id: string
  apodo: string
  direccion: string
  distrito: string
  referencia?: string | null
  esPrincipal: boolean
}

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

  // Lista de Direcciones Guardadas
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  // Formulario para Nueva Dirección
  const [newAddress, setNewAddress] = useState({
    apodo: 'Casa',
    direccion: '',
    distrito: 'Miraflores, Lima',
    referencia: '',
    esPrincipal: false,
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
          if (data.puntosAcumulados !== undefined) setPuntos(data.puntosAcumulados)
          if (data.totalPedidos !== undefined) setTotalPedidos(data.totalPedidos)
        } else {
          setCustomerData(prev => ({
            ...prev,
            nombre: session?.user?.name || ''
          }))
        }

        if (Array.isArray(data.direcciones)) {
          setDirecciones(data.direcciones)
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

  // Registrar Nueva Dirección
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.direccion.trim()) {
      toast.error('Por favor ingresa la dirección exacta')
      return
    }
    if (!newAddress.distrito.trim()) {
      toast.error('Por favor ingresa el distrito o ciudad')
      return
    }

    setIsSavingAddress(true)
    setError(null)

    try {
      const res = await fetch('/api/direcciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Error al guardar la dirección')
      } else {
        toast.success(`Dirección "${newAddress.apodo}" agregada con éxito`)
        // Actualizar lista
        if (newAddress.esPrincipal || direcciones.length === 0) {
          setDirecciones(prev => [
            { ...data.direccion, esPrincipal: true },
            ...prev.map(d => ({ ...d, esPrincipal: false }))
          ])
        } else {
          setDirecciones(prev => [...prev, data.direccion])
        }

        // Reset form
        setNewAddress({
          apodo: 'Casa',
          direccion: '',
          distrito: 'Miraflores, Lima',
          referencia: '',
          esPrincipal: false,
        })
        setShowAddForm(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar la dirección')
    } finally {
      setIsSavingAddress(false)
    }
  }

  // Marcar Dirección como Principal
  const handleSetPrincipal = async (id: string) => {
    try {
      const res = await fetch('/api/direcciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, esPrincipal: true })
      })

      if (res.ok) {
        setDirecciones(prev =>
          prev.map(d => ({
            ...d,
            esPrincipal: d.id === id
          }))
        )
        toast.success('Dirección marcada como predeterminada')
      } else {
        toast.error('No se pudo establecer como principal')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al actualizar dirección')
    }
  }

  // Eliminar Dirección
  const handleDeleteAddress = async (id: string, apodo: string) => {
    if (!confirm(`¿Eliminar la dirección "${apodo}"?`)) return

    try {
      const res = await fetch(`/api/direcciones?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setDirecciones(prev => {
          const filtered = prev.filter(d => d.id !== id)
          if (filtered.length > 0 && !filtered.some(d => d.esPrincipal)) {
            filtered[0].esPrincipal = true
          }
          return filtered
        })
        toast.success(`Dirección "${apodo}" eliminada`)
      } else {
        toast.error('No se pudo eliminar la dirección')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al eliminar dirección')
    }
  }

  const getApodoIcon = (apodo: string) => {
    const lower = apodo.toLowerCase()
    if (lower.includes('casa') || lower.includes('hogar')) {
      return <Home className="w-4 h-4 text-[#C85A32]" />
    }
    if (lower.includes('ofi') || lower.includes('trabajo') || lower.includes('chamba')) {
      return <Briefcase className="w-4 h-4 text-[#C85A32]" />
    }
    if (lower.includes('depa') || lower.includes('departamento') || lower.includes('edificio')) {
      return <Building2 className="w-4 h-4 text-[#C85A32]" />
    }
    return <MapPin className="w-4 h-4 text-[#C85A32]" />
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

      {/* 3. DESPUÉS: SECCIÓN DE DIRECCIONES (+ DE UNA CON APODO) */}
      <div className="bg-white rounded-3xl border border-[#EBE5DF] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EBE5DF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF4EE] text-[#C85A32] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#2B231F]">Mis Direcciones de Entrega</h3>
                <span className="text-xs bg-[#F4EDE5] text-[#C85A32] font-black px-2 py-0.5 rounded-full">
                  {direcciones.length}
                </span>
              </div>
              <p className="text-xs text-[#6E655F] mt-0.5">
                Guarda tus direcciones (Casa, Oficina, etc.) para seleccionarlas fácilmente en el checkout.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C85A32] hover:bg-[#A04320] transition-colors shadow-xs cursor-pointer self-start sm:self-center"
          >
            {showAddForm ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Cerrar Formulario</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Dirección</span>
              </>
            )}
          </button>
        </div>

        {/* Formulario Desplegable para Agregar Nueva Dirección */}
        {showAddForm && (
          <div className="mb-8 p-5 sm:p-6 bg-[#FDFBF7] border border-[#EBE5DF] rounded-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE5DF]/60 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#2B231F] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#C85A32]" />
                Nueva Dirección con Apodo
              </h4>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              {/* Selector Rápido de Apodo */}
              <div>
                <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                  Apodo de la Dirección (Ej: Casa, Oficina, Depa) *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Casa', 'Oficina', 'Depa', 'Taller'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewAddress(prev => ({ ...prev, apodo: tag }))}
                      className={`text-xs px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                        newAddress.apodo === tag
                          ? 'bg-[#C85A32] text-white border-[#C85A32]'
                          : 'bg-white text-[#6E655F] border-[#EBE5DF] hover:border-[#C85A32]/40'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newAddress.apodo}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, apodo: e.target.value }))}
                  placeholder="O escribe un apodo personalizado..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE5DF] bg-white focus:outline-none focus:border-[#C85A32] text-xs font-semibold text-[#2B231F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                  Dirección Exacta (Calle, Número, Dpto, Interior) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newAddress.direccion}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Ej: Av. Benavides 1230, Dpto 402"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-white focus:outline-none focus:border-[#C85A32] text-xs font-semibold text-[#2B231F]"
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
                      value={newAddress.distrito}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, distrito: e.target.value }))}
                      placeholder="Ej: Miraflores, Lima"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-white focus:outline-none focus:border-[#C85A32] text-xs font-semibold text-[#2B231F]"
                      required
                    />
                    <Building className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">
                    Referencia o Instrucción de Entrega
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newAddress.referencia}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, referencia: e.target.value }))}
                      placeholder="Ej: Frente al parque, dejar en conserjería"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-white focus:outline-none focus:border-[#C85A32] text-xs font-semibold text-[#2B231F]"
                    />
                    <Compass className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="esPrincipalCheck"
                  checked={newAddress.esPrincipal}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, esPrincipal: e.target.checked }))}
                  className="rounded border-[#EBE5DF] text-[#C85A32] focus:ring-[#C85A32] cursor-pointer"
                />
                <label htmlFor="esPrincipalCheck" className="text-xs font-semibold text-[#2B231F] cursor-pointer">
                  Establecer como dirección predeterminada
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E655F] hover:bg-[#EBE5DF]/40 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="btn-nova-primary py-2 px-5 text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {isSavingAddress ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar en mis Direcciones</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listado de Direcciones Guardadas */}
        {direcciones.length === 0 ? (
          <div className="text-center py-10 px-4 bg-[#FDFBF7] rounded-2xl border border-dashed border-[#EBE5DF]">
            <MapPin className="w-8 h-8 text-[#D9B89C] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#2B231F]">Aún no tienes direcciones guardadas con apodo</p>
            <p className="text-[11px] text-[#6E655F] mt-1 max-w-sm mx-auto">
              Haz clic en &quot;Agregar Dirección&quot; arriba para registrar tu Casa, Oficina o cualquier dirección de entrega frecuente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {direcciones.map((dir) => (
              <div
                key={dir.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  dir.esPrincipal
                    ? 'border-[#C85A32] bg-[#FDFBF7] shadow-xs'
                    : 'border-[#EBE5DF] bg-white hover:border-[#C85A32]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#FDF4EE] flex items-center justify-center">
                        {getApodoIcon(dir.apodo)}
                      </div>
                      <span className="text-xs font-black text-[#2B231F] tracking-wide">
                        {dir.apodo}
                      </span>
                    </div>

                    {dir.esPrincipal ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#C85A32] bg-[#FDF4EE] px-2.5 py-0.5 rounded-full border border-[#C85A32]/30">
                        <Check className="w-3 h-3" /> Predeterminada
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrincipal(dir.id)}
                        className="text-[11px] font-bold text-[#6E655F] hover:text-[#C85A32] transition-colors cursor-pointer underline"
                      >
                        Hacer predeterminada
                      </button>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-[#2B231F] leading-snug">
                    {dir.direccion}
                  </p>
                  <p className="text-[11px] text-[#6E655F] mt-0.5">
                    {dir.distrito}
                  </p>

                  {dir.referencia && (
                    <p className="text-[11px] text-[#8C827A] mt-1.5 italic bg-white/70 p-1.5 rounded-lg border border-[#EBE5DF]/60">
                      <span className="font-bold text-[#6E655F] not-italic">Ref:</span> {dir.referencia}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#EBE5DF]/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#A89F91]">
                    {dir.esPrincipal ? 'Usada por defecto' : 'Opción guardada'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(dir.id, dir.apodo)}
                    className="p-1.5 text-[#A89F91] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar dirección"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
