'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserCircle, Mail, ShieldCheck, MapPin, Save, AlertCircle, Phone, IdCard, Building, Star, Package } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [puntos, setPuntos] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    direccion: '',
    distrito: ''
  })

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/perfil')
      if (res.ok) {
        const data = await res.json()
        if (data.cliente) {
          setFormData({
            nombre: data.cliente.nombre || session?.user?.name || '',
            dni: data.cliente.dni || '',
            telefono: data.cliente.telefono || '',
            direccion: data.cliente.direccion || '',
            distrito: data.cliente.distrito || ''
          })
          if (data.puntosAcumulados !== undefined) setPuntos(data.puntosAcumulados)
          if (data.totalPedidos !== undefined) setTotalPedidos(data.totalPedidos)
        } else {
          // If no client exists yet, use the Google name as default
          setFormData(prev => ({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al guardar.')
        toast.error('No se pudo guardar el perfil')
      } else {
        toast.success('Perfil actualizado y sincronizado exitosamente')
        // Update session if name changed
        if (formData.nombre !== session?.user?.name) {
          await update({ name: formData.nombre })
        }
      }
    } catch (err) {
      console.error(err)
      setError('Error de red al intentar guardar los datos.')
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#C85A32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null
  }

  const { user } = session

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 min-h-[60vh]">
      <h1 className="text-2xl sm:text-3xl font-black text-[#2B231F] mb-8 tracking-tight">
        Mi Perfil
      </h1>

      <div className="bg-white border border-[#EBE5DF] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Avatar & Read-only Info */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start gap-6">
          <div className="shrink-0 flex flex-col items-center md:items-start gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || 'Usuario'}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#FDFBF7] shadow-md"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#F4EDE5] flex items-center justify-center border-4 border-[#FDFBF7] shadow-md text-[#C85A32]">
                <UserCircle className="w-16 h-16" />
              </div>
            )}
            <span className="bg-[#F3ECE2] text-[#C85A32] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#D9B89C]/50">
              Cliente Registrado
            </span>
          </div>

          <div className="text-center md:text-left w-full space-y-1">
            <h2 className="text-xl font-black text-[#2B231F] break-words">
              {user.name || 'Usuario'}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-[#6E655F]">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>

          <div className="w-full p-4 rounded-2xl bg-[#FDFBF7] border border-[#EBE5DF]/60 flex items-start gap-3 mt-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#2B231F]">Conexión Google</h4>
              <p className="text-xs text-[#6E655F] mt-0.5">Seguridad garantizada.</p>
            </div>
          </div>
          
          <div className="w-full mt-4 bg-gradient-to-br from-[#2B231F] to-[#4A3D36] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C85A32]/20 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/20 flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-[#FBBF24] fill-[#FBBF24]" />
              </div>
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-1">Mis Puntos NOVA</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-black">{puntos.toLocaleString()}</span>
                <span className="text-sm font-bold text-white/70 mb-1.5">pts</span>
              </div>
              
              <div className="w-full mt-5 pt-5 border-t border-white/10 flex justify-between items-center text-left">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#D9B89C]" />
                  <span className="text-xs font-semibold text-white/80">{totalPedidos} {totalPedidos === 1 ? 'Pedido' : 'Pedidos'}</span>
                </div>
                <div className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/90">
                  1 Sol = 1 Punto
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div className="md:w-2/3">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#2B231F]">Datos de Cliente / Envío</h3>
            <p className="text-xs text-[#6E655F] mt-1">
              Estos datos se sincronizan con nuestro sistema central para agilizar tus envíos y compras.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">Nombre Completo</label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-sm text-[#2B231F]"
                  required
                />
                <UserCircle className="w-4 h-4 text-[#D9B89C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">DNI / CE</label>
                <div className="relative">
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    placeholder="Documento de identidad"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-sm text-[#2B231F]"
                  />
                  <IdCard className="w-4 h-4 text-[#D9B89C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">Teléfono / WhatsApp</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="999 888 777"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-sm text-[#2B231F]"
                  />
                  <Phone className="w-4 h-4 text-[#D9B89C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">Dirección de Envío</label>
              <div className="relative">
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Av. Principal 123, Dpto 405"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-sm text-[#2B231F]"
                />
                <MapPin className="w-4 h-4 text-[#D9B89C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5 ml-1">Distrito / Ciudad</label>
              <div className="relative">
                <input
                  type="text"
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleInputChange}
                  placeholder="Ej. Miraflores, Lima"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE5DF] bg-[#FDFBF7] focus:bg-white focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors text-sm text-[#2B231F]"
                />
                <Building className="w-4 h-4 text-[#D9B89C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-nova-primary py-3 px-8 text-sm font-bold shadow-xs flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
