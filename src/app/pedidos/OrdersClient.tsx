'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  ShoppingBag,
  Clock,
  X,
  MessageCircle,
  Eye,
  Copy,
  Check,
  MapPin,
  Phone,
  User,
  CreditCard,
  ExternalLink,
  Package,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { formatPrice, getProductImage } from '@/shared/utils'
import { toast } from 'sonner'

export interface SerializedItem {
  id: string
  pedidoId: string
  productoId: string
  nombreProductoSnapshot: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  producto?: {
    id: string
    nombreModelo: string
    lineaCategoria: string
    imagenUrl: string | null
    precioMercado: number
    descripcionWeb: string | null
    editorialMarca: string | null
  } | null
}

export interface SerializedOrder {
  id: string
  codigo: string
  fecha: string
  createdAt: string
  updatedAt: string
  cliente: string
  telefono: string | null
  dni: string | null
  canalVenta: string | null
  destinoEnvio: string | null
  notas: string | null
  metodoPago: string | null
  estado: string
  costoEnvio: number
  subtotal: number
  total: number
  montoPagado: number
  saldoPendiente: number
  items: SerializedItem[]
}

export interface StoreConfigData {
  telefonoContacto: string
  yapeNumero: string
  yapeTitular: string
  bcpNumeroCuenta: string
  bcpCci: string
  bcpTitular: string
}

interface OrdersClientProps {
  pedidos: SerializedOrder[]
  storeConfig: StoreConfigData
}

export function OrdersClient({ pedidos, storeConfig }: OrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<SerializedOrder | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Cerrar modal con tecla Escape y bloquear scroll de fondo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null)
      }
    }
    if (selectedOrder) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedOrder])

  const handleCopy = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    toast.success(`${label} copiado al portapapeles`)
    setTimeout(() => setCopiedField(null), 2500)
  }

  const getWhatsappUrl = (codigo: string) => {
    const cleanNumber = storeConfig.telefonoContacto.replace(/\D/g, '') || '51945398747'
    const mensaje = [
      `🎲 ¡Hola, Nova BG! Acabo de realizar un pedido en la web.`,
      ``,
      `Código de pedido: ${codigo}`,
      ``,
      `Quiero continuar con la coordinación para finalizar mi compra.`,
    ].join('\n')
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(mensaje)}`
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return {
          label: 'Pendiente de pago / validación',
          textClass: 'text-[#854D0E]',
          bgClass: 'bg-[#FEF9C3] border-[#FDE047]',
          icon: <Clock className="w-4 h-4 text-[#854D0E]" />,
        }
      case 'PAGO_VALIDADO':
        return {
          label: 'Pago validado — Preparando despacho',
          textClass: 'text-[#065F46]',
          bgClass: 'bg-[#D1FAE5] border-[#A7F3D0]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#065F46]" />,
        }
      case 'ENTREGADO':
        return {
          label: 'Entregado con éxito',
          textClass: 'text-[#10B981]',
          bgClass: 'bg-[#ECFDF5] border-[#A7F3D0]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#10B981]" />,
        }
      case 'CANCELADO':
        return {
          label: 'Pedido cancelado',
          textClass: 'text-red-600',
          bgClass: 'bg-red-50 border-red-200',
          icon: <X className="w-4 h-4 text-red-600" />,
        }
      default:
        return {
          label: 'En preparación y despacho FULL',
          textClass: 'text-[#2B6CB0]',
          bgClass: 'bg-blue-50 border-blue-200',
          icon: <CheckCircle2 className="w-4 h-4 text-[#2B6CB0]" />,
        }
    }
  }

  return (
    <div className="py-8 px-4 max-w-[1100px] mx-auto">
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#2B231F]">Mis compras</h1>
          <p className="text-xs text-[#6E655F] mt-0.5">Seguimiento de pedidos y compras en NOVA BG</p>
        </div>
        <Link href="/" className="btn-nova-primary text-xs">
          Comprar más artículos
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EBE5DF] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF4EE] text-[#C85A32] border border-[#C85A32]/20 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-[#2B231F]">Aún no tienes compras realizadas</h2>
          <p className="text-xs text-[#6E655F] max-w-sm mx-auto">
            Explora nuestro catálogo de juegos de mesa, organizadores y accesorios para hacer tu primer pedido.
          </p>
          <Link href="/" className="btn-nova-primary text-xs inline-block mt-2">
            Ver catálogo oficial
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {pedidos.map((pedido) => {
            const formattedTotal = formatPrice(pedido.total)
            const dateStr = new Date(pedido.createdAt).toLocaleDateString('es-PE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            const statusInfo = getStatusBadge(pedido.estado)
            const whatsappUrl = getWhatsappUrl(pedido.codigo)

            return (
              <div
                key={pedido.id}
                className="bg-white rounded-3xl border border-[#EBE5DF] shadow-sm overflow-hidden text-xs transition-shadow hover:shadow-md"
              >
                {/* Header */}
                <div className="bg-[#FAF6F0] p-4 sm:p-5 border-b border-[#EBE5DF] flex flex-wrap items-center justify-between gap-4 text-[#6E655F]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 flex-1">
                    <div>
                      <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                        Fecha de compra
                      </span>
                      <span className="text-[#2B231F] font-bold">{dateStr}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                        Total
                      </span>
                      <span className="text-[#2B231F] font-black">{formattedTotal}</span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                        Destinatario
                      </span>
                      <span className="text-[#2B231F] font-semibold truncate block" title={pedido.cliente}>
                        {pedido.cliente}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-black text-[#6E655F]">
                        Orden NOVA
                      </span>
                      <button
                        onClick={() => setSelectedOrder(pedido)}
                        className="text-[#C85A32] hover:text-[#A0401E] font-black text-sm tracking-tight hover:underline cursor-pointer"
                        title="Ver detalle del pedido"
                      >
                        #{pedido.codigo}
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(pedido)}
                      className="inline-flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-[#F0EAE1] text-[#2B231F] font-bold text-xs px-3 py-2 rounded-xl border border-[#EBE5DF] transition-all cursor-pointer shadow-2xs"
                      title="Abrir ventana con detalle completo"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C85A32]" />
                      <span className="hidden sm:inline">Ver detalle</span>
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Status Banner & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE5DF]">
                    <div className={`flex items-center gap-2 text-sm font-bold ${statusInfo.textClass}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(pedido)}
                        className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#FAF6F0] text-[#2B231F] font-bold text-xs px-3.5 py-2 rounded-xl border border-[#EBE5DF] transition-all cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-4 h-4 text-[#C85A32]" />
                        <span>Ver detalle</span>
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        <span>Avisar al vendedor</span>
                      </a>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#EBE5DF]">
                    {pedido.items.map((item) => {
                      // Imagen real del producto prioritaria, fallback a getProductImage
                      const itemImg =
                        item.producto?.imagenUrl ||
                        getProductImage(
                          item.producto?.nombreModelo || item.nombreProductoSnapshot || '',
                          item.producto?.lineaCategoria || ''
                        )
                      const itemPrice = formatPrice(item.precioUnitario)

                      return (
                        <div key={item.id} className="py-3.5 flex gap-4 items-center">
                          {/* Thumbnail con imagen real */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(pedido)}
                            className="w-18 h-18 sm:w-20 sm:h-20 bg-[#FAF6F0] rounded-2xl border border-[#EBE5DF] overflow-hidden shrink-0 p-1 flex items-center justify-center group cursor-pointer hover:border-[#C85A32]/40 transition-colors"
                            title="Ver detalle del producto en la orden"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={itemImg}
                              alt={item.nombreProductoSnapshot}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                // Fallback en caso de error de carga de URL remota
                                const target = e.currentTarget
                                const fallback = getProductImage(item.nombreProductoSnapshot)
                                if (target.src !== fallback) {
                                  target.src = fallback
                                }
                              }}
                            />
                          </button>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4
                              onClick={() => setSelectedOrder(pedido)}
                              className="font-bold text-[#2B231F] leading-snug hover:text-[#C85A32] cursor-pointer transition-colors line-clamp-2"
                            >
                              {item.nombreProductoSnapshot}
                            </h4>
                            <p className="text-[#6E655F] text-[11px] mt-0.5 font-medium">
                              Cantidad: <span className="font-bold text-[#2B231F]">{item.cantidad}</span> • Precio: {itemPrice}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <Link
                                href={`/producto/${item.productoId}`}
                                className="text-[#C85A32] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                              >
                                <span>Ver publicación</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <span className="text-[#EBE5DF]">•</span>
                              <button
                                onClick={() => setSelectedOrder(pedido)}
                                className="text-[#6E655F] hover:text-[#2B231F] font-semibold text-[11px] underline cursor-pointer"
                              >
                                Ver detalle de compra
                              </button>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 flex flex-col gap-2 items-end">
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="btn-nova-secondary text-[11px] py-1.5 px-3"
                            >
                              Volver a comprar
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL / POP-UP DE DETALLE DEL PEDIDO                      */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null)
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-[#EBE5DF] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#FAF6F0] border-b border-[#EBE5DF] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-[#6E655F] tracking-wider">
                    Detalle de compra
                  </span>
                  <span className="bg-[#C85A32]/10 text-[#C85A32] font-black px-2 py-0.5 rounded-md text-xs">
                    #{selectedOrder.codigo}
                  </span>
                </div>
                <h2 className="text-xl font-black text-[#2B231F] mt-1">
                  Orden de compra NOVA BG
                </h2>
                <p className="text-xs text-[#6E655F] mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(selectedOrder.createdAt).toLocaleDateString('es-PE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full text-[#6E655F] hover:text-[#2B231F] hover:bg-[#EBE5DF]/60 transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#2B231F]">
              {/* Estado Banner en Modal */}
              {(() => {
                const statusInfo = getStatusBadge(selectedOrder.estado)
                return (
                  <div className={`p-4 rounded-2xl border ${statusInfo.bgClass} flex items-start gap-3`}>
                    <div className="mt-0.5">{statusInfo.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-black text-sm ${statusInfo.textClass}`}>
                        {statusInfo.label}
                      </h4>
                      <p className="text-[11px] text-[#6E655F] mt-1 leading-relaxed">
                        {selectedOrder.estado === 'PENDIENTE'
                          ? 'Tu pedido se encuentra registrado y a la espera de validación de tu abono. Puedes yapear o transferir y notificarnos para despachar de inmediato tus artículos.'
                          : selectedOrder.estado === 'PAGO_VALIDADO'
                          ? '¡Tu pago ha sido validado exitosamente! El stock ha sido reservado y estamos alistando el paquete para su despacho.'
                          : selectedOrder.estado === 'ENTREGADO'
                          ? 'El pedido fue entregado satisfactoriamente al destinatario.'
                          : selectedOrder.estado === 'CANCELADO'
                          ? 'Este pedido ha sido cancelado.'
                          : 'Tu pedido está siendo procesado por el equipo de NOVA BG.'}
                      </p>
                    </div>
                  </div>
                )
              })()}

              {/* Lista de Productos con Imagen Real */}
              <div>
                <h3 className="font-black text-sm text-[#2B231F] mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C85A32]" />
                  <span>Artículos incluidos ({selectedOrder.items.length})</span>
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => {
                    const itemImg =
                      item.producto?.imagenUrl ||
                      getProductImage(
                        item.producto?.nombreModelo || item.nombreProductoSnapshot || '',
                        item.producto?.lineaCategoria || ''
                      )

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#FAF6F0]/60 rounded-2xl border border-[#EBE5DF] flex gap-4 items-center"
                      >
                        {/* Imagen Grande y Nítida */}
                        <div className="w-20 h-20 sm:w-22 sm:h-22 bg-white rounded-xl border border-[#EBE5DF] p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={itemImg}
                            alt={item.nombreProductoSnapshot}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.currentTarget
                              const fallback = getProductImage(item.nombreProductoSnapshot)
                              if (target.src !== fallback) {
                                target.src = fallback
                              }
                            }}
                          />
                        </div>

                        {/* Detalles */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#2B231F] text-sm leading-snug">
                            {item.nombreProductoSnapshot}
                          </h4>
                          {item.producto?.editorialMarca && (
                            <span className="text-[10px] text-[#6E655F] uppercase font-bold block mt-0.5">
                              Editorial: {item.producto.editorialMarca}
                            </span>
                          )}
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="text-[#6E655F]">
                              Cantidad:{' '}
                              <strong className="text-[#2B231F]">{item.cantidad}</strong> ×{' '}
                              {formatPrice(item.precioUnitario)}
                            </span>
                            <span className="font-black text-sm text-[#C85A32]">
                              {formatPrice(item.subtotal)}
                            </span>
                          </div>

                          <div className="mt-2">
                            <Link
                              href={`/producto/${item.productoId}`}
                              className="text-[#C85A32] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <span>Ver producto en catálogo</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Destinatario y Datos de Envío */}
              <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-2xl border border-[#EBE5DF] space-y-3">
                <h3 className="font-black text-xs text-[#6E655F] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C85A32]" />
                  <span>Destinatario y Envío</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#6E655F] block text-[10px] uppercase font-bold">
                      Nombre completo
                    </span>
                    <span className="font-bold text-[#2B231F]">{selectedOrder.cliente}</span>
                  </div>

                  <div>
                    <span className="text-[#6E655F] block text-[10px] uppercase font-bold">
                      Teléfono / WhatsApp
                    </span>
                    <span className="font-bold text-[#2B231F]">
                      {selectedOrder.telefono || 'No especificado'}
                    </span>
                  </div>

                  {selectedOrder.dni && (
                    <div>
                      <span className="text-[#6E655F] block text-[10px] uppercase font-bold">
                        DNI / Documento
                      </span>
                      <span className="font-bold text-[#2B231F]">{selectedOrder.dni}</span>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <span className="text-[#6E655F] block text-[10px] uppercase font-bold">
                      Dirección de entrega
                    </span>
                    <span className="font-semibold text-[#2B231F]">
                      {selectedOrder.destinoEnvio || 'Coordinación con vendedor'}
                    </span>
                  </div>

                  {selectedOrder.notas && (
                    <div className="sm:col-span-2 bg-white/70 p-2.5 rounded-xl border border-[#EBE5DF]">
                      <span className="text-[#6E655F] block text-[10px] uppercase font-bold">
                        Notas del comprador
                      </span>
                      <p className="text-xs text-[#2B231F] mt-0.5">{selectedOrder.notas}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cuentas de Pago (si el pedido está PENDIENTE) */}
              {selectedOrder.estado === 'PENDIENTE' && (
                <div className="bg-[#FFFBEB] p-4 sm:p-5 rounded-2xl border border-[#FDE68A] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs text-[#854D0E] uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#854D0E]" />
                      <span>Cuentas para realizar tu abono</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[#854D0E] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
                      Monto: {formatPrice(selectedOrder.total)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Yape */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#EBE5DF] space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#742284]">YAPE</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(storeConfig.yapeNumero || '945398747', 'Número Yape')
                          }
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C85A32] hover:underline cursor-pointer"
                        >
                          {copiedField === 'Número Yape' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-black text-sm text-[#2B231F] tracking-wide">
                        {storeConfig.yapeNumero || '945398747'}
                      </p>
                      <p className="text-[10px] text-[#6E655F]">
                        Titular: {storeConfig.yapeTitular || 'Víctor Monzon Anglas'}
                      </p>
                    </div>

                    {/* BCP */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#EBE5DF] space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#002A8F]">BCP / Transferencia</span>
                        {storeConfig.bcpNumeroCuenta && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(storeConfig.bcpNumeroCuenta, 'Cuenta BCP')
                            }
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C85A32] hover:underline cursor-pointer"
                          >
                            {copiedField === 'Cuenta BCP' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="font-black text-xs text-[#2B231F] font-mono">
                        {storeConfig.bcpNumeroCuenta || 'Consultar con vendedor'}
                      </p>
                      {storeConfig.bcpCci && (
                        <p className="text-[10px] text-[#6E655F] font-mono">
                          CCI: {storeConfig.bcpCci}
                        </p>
                      )}
                      <p className="text-[10px] text-[#6E655F]">
                        Titular: {storeConfig.bcpTitular || 'Víctor Monzon Anglas'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen Financiero */}
              <div className="border-t border-[#EBE5DF] pt-4 space-y-2">
                <div className="flex justify-between text-[#6E655F]">
                  <span>Subtotal productos</span>
                  <span className="font-semibold text-[#2B231F]">
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E655F]">
                  <span>Costo de envío</span>
                  <span className="font-semibold text-[#2B231F]">
                    {selectedOrder.costoEnvio > 0
                      ? formatPrice(selectedOrder.costoEnvio)
                      : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#2B231F] border-t border-[#EBE5DF] pt-2">
                  <span>Total de la compra</span>
                  <span className="text-[#C85A32] text-lg">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#FAF6F0] border-t border-[#EBE5DF] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn-nova-secondary w-full sm:w-auto text-xs py-2.5 px-5 cursor-pointer text-center"
              >
                Cerrar ventana
              </button>

              <a
                href={getWhatsappUrl(selectedOrder.codigo)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all w-full sm:w-auto cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Avisar al vendedor por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
