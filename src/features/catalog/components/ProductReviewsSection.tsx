'use client'

import React, { useState } from 'react'
import { Star, MessageSquare, Plus, CheckCircle2, Loader2, Sparkles, LogIn } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { submitProductReview } from '../actions/review.actions'

export interface ComentarioItem {
  id: string
  autor: string
  texto: string
  calificacion: number
  createdAt: string | Date
}

interface ProductReviewsSectionProps {
  productoId: string
  productTitle: string
  initialComentarios: ComentarioItem[]
}

const RATING_LABELS: Record<number, string> = {
  5: 'Excelente - ¡Totalmente recomendado!',
  4: 'Muy bueno - Me gustó bastante',
  3: 'Bueno - Cumple con lo esperado',
  2: 'Regular - Podría mejorar',
  1: 'Malo - No me gustó',
}

export function ProductReviewsSection({
  productoId,
  productTitle,
  initialComentarios,
}: ProductReviewsSectionProps) {
  const { data: session } = useSession()
  const [comentarios, setComentarios] = useState<ComentarioItem[]>(initialComentarios)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [reviewText, setReviewText] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculations
  const totalReviews = comentarios.length
  const averageRating =
    totalReviews > 0
      ? comentarios.reduce((sum, c) => sum + c.calificacion, 0) / totalReviews
      : 0

  const handleOpenForm = () => {
    if (!session) {
      toast.info('Inicia sesión para dejar tu reseña y puntaje')
      signIn()
      return
    }
    if (!authorName && session.user?.name) {
      setAuthorName(session.user.name)
    }
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error('Debes iniciar sesión para publicar una reseña')
      signIn()
      return
    }

    if (!reviewText.trim()) {
      toast.error('Por favor escribe tu opinión en la reseña')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitProductReview({
        productoId,
        calificacion: rating,
        texto: reviewText.trim(),
        autor: authorName.trim() || session.user?.name || 'Comprador verificado',
      })

      if (res.success && res.review) {
        toast.success('¡Gracias por tu reseña! Se publicó con éxito')
        setComentarios((prev) => [res.review as ComentarioItem, ...prev])
        setReviewText('')
        setIsFormOpen(false)
      } else {
        toast.error(res.error || 'No se pudo publicar la reseña')
      }
    } catch {
      toast.error('Ocurrió un error al enviar tu reseña')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeRating = hoverRating || rating

  return (
    <div className="mt-12 pt-8 border-t border-[#EBE5DF]">
      {/* Encabezado */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg text-[#2B231F] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C85A32]" />
            <span>Reseñas de compradores</span>
            {totalReviews > 0 && (
              <span className="text-sm font-normal text-[#6E655F]">({totalReviews})</span>
            )}
          </h3>
          <p className="text-xs text-[#6E655F] mt-0.5">
            Opiniones y calificaciones reales de la comunidad
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={handleOpenForm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B231F] text-white hover:bg-[#433934] transition-all font-semibold text-xs shadow-xs cursor-pointer"
          >
            {session ? (
              <>
                <Plus className="w-4 h-4 text-[#C85A32]" />
                <span>Escribir reseña</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#C85A32]" />
                <span>Inicia sesión para opinar</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Formulario de Reseña (Desplegable) */}
      {isFormOpen && (
        <div className="mb-8 p-6 bg-[#FAF7F2] border-2 border-[#C85A32]/30 rounded-2xl shadow-sm transition-all animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-[#EBE5DF] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C85A32]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B231F]">
                Calificar: {productTitle}
              </span>
            </div>
            <span className="text-[11px] text-[#6E655F]">
              Publicando como <strong className="text-[#2B231F]">{authorName || session?.user?.name || 'Usuario'}</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Estrellas interactivo */}
            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1.5">
                Tu Calificación General *
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                      aria-label={`Calificar con ${star} estrellas`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= activeRating
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-[#D8D0C7]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#6E655F]">
                  {RATING_LABELS[activeRating] || `${activeRating} de 5 estrellas`}
                </span>
              </div>
            </div>

            {/* Nombre a mostrar */}
            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1">
                Tu Nombre o Apodo
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ej: Victor M."
                className="w-full sm:w-80 px-3.5 py-2 text-xs rounded-xl bg-white border border-[#EBE5DF] focus:border-[#C85A32] focus:outline-hidden text-[#2B231F]"
              />
            </div>

            {/* Comentario / Reseña */}
            <div>
              <label className="block text-xs font-bold text-[#2B231F] mb-1">
                Tu Reseña *
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="¿Qué te pareció el juego? ¿La calidad de los componentes, la dificultad, la temática o la diversión en grupo? ¡Cuéntanos tu experiencia!"
                required
                className="w-full p-3.5 text-xs rounded-xl bg-white border border-[#EBE5DF] focus:border-[#C85A32] focus:outline-hidden text-[#2B231F] leading-relaxed resize-y"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-[#6E655F] hover:text-[#2B231F] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C85A32] hover:bg-[#A84B29] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Publicar Reseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sin reseñas */}
      {totalReviews === 0 ? (
        <div className="p-8 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] text-center text-xs text-[#6E655F] space-y-3">
          <MessageSquare className="w-10 h-10 mx-auto text-[#D8D0C7]" />
          <div>
            <p className="font-bold text-sm text-[#2B231F]">Aún no hay reseñas para este producto.</p>
            <p className="mt-1 text-[#6E655F]">Sé el primero en compartir tu experiencia y calificarlo.</p>
          </div>
          {!isFormOpen && (
            <button
              type="button"
              onClick={handleOpenForm}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C85A32] text-white hover:bg-[#A84B29] font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Dejar la primera reseña</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Promedio y desglose de estrellas */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF]">
            <div className="text-center sm:border-r sm:border-[#EBE5DF] sm:pr-6 shrink-0">
              <div className="text-4xl font-black text-[#2B231F] tracking-tight">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex text-[#F59E0B] justify-center mt-1.5 gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(averageRating) ? 'fill-current' : 'text-[#D8D0C7]'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[11px] text-[#6E655F] mt-1 font-medium">
                {totalReviews} reseña{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Barras de porcentaje */}
            <div className="flex-1 w-full space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = comentarios.filter((c) => c.calificacion === star).length
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2.5 text-[11px]">
                    <span className="w-3 text-right font-bold text-[#6E655F]">{star}</span>
                    <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    <div className="flex-1 bg-[#EBE5DF] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#F59E0B] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-medium text-[#6E655F]">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Listado de comentarios */}
          <div className="space-y-3">
            {comentarios.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#EBE5DF] space-y-2 hover:border-[#D8D0C7] transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center font-black text-xs shrink-0">
                      {c.autor.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#2B231F]">{c.autor}</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1E5E3A] bg-[#E8F5E9] px-1.5 py-0.2 rounded-md">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Comprador
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9E8F87]">
                        {new Date(c.createdAt).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-[#F59E0B] gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= c.calificacion ? 'fill-current' : 'text-[#D8D0C7]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#433934] leading-relaxed pt-1">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
