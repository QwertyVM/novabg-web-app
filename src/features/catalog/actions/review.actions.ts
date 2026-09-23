'use server'

import prisma from '@/core/database/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/core/auth/auth.config'

export interface ReviewSubmissionResult {
  success: boolean
  error?: string
  review?: {
    id: string
    autor: string
    texto: string
    calificacion: number
    createdAt: string
  }
}

export async function submitProductReview(data: {
  productoId: string
  calificacion: number
  texto: string
  autor?: string
}): Promise<ReviewSubmissionResult> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: 'Debes iniciar sesión para dejar una reseña y puntaje.' }
    }

    const { productoId, calificacion, texto, autor } = data

    if (!productoId) {
      return { success: false, error: 'Producto no válido.' }
    }

    const score = Math.max(1, Math.min(5, Math.round(Number(calificacion) || 5)))
    const trimmedText = texto?.trim() || ''

    if (!trimmedText) {
      return { success: false, error: 'Por favor escribe tu reseña sobre el producto.' }
    }

    // Name priority: custom autor -> session user name -> email prefix -> default
    const authorName = autor?.trim() || session.user.name || session.user.email?.split('@')[0] || 'Comprador verificado'

    const review = await prisma.comentarioProducto.create({
      data: {
        productoId,
        autor: authorName,
        texto: trimmedText,
        calificacion: score,
        activo: true,
      },
    })

    revalidatePath(`/producto/${productoId}`)
    revalidatePath(`/categoria`)
    revalidatePath(`/`)

    return {
      success: true,
      review: {
        id: review.id,
        autor: review.autor,
        texto: review.texto,
        calificacion: review.calificacion,
        createdAt: review.createdAt.toISOString(),
      },
    }
  } catch (error) {
    console.error('Error al guardar reseña:', error)
    return { success: false, error: 'Hubo un error al guardar la reseña. Inténtalo de nuevo.' }
  }
}
