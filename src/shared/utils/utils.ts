import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return 'S/ 0.00'
  return `S/ ${num.toFixed(2)}`
}

export function formatPriceParts(price: number | string): { integer: string; cents: string } {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return { integer: '0', cents: '00' }
  const formatted = num.toFixed(2)
  const [integer, cents] = formatted.split('.')
  return { integer, cents }
}

export function getProductImage(name: string, category: string = ''): string {
  const lowerName = (name + ' ' + category).toLowerCase()

  if (lowerName.includes('inserto') || lowerName.includes('organizador')) {
    return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80'
  }
  if (lowerName.includes('torre') || lowerName.includes('dado') || lowerName.includes('rol')) {
    return 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80'
  }
  if (lowerName.includes('mansiones') || lowerName.includes('locura') || lowerName.includes('juego') || lowerName.includes('catan') || lowerName.includes('carcassonne')) {
    return 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80'
  }
  if (lowerName.includes('contador') || lowerName.includes('ficha') || lowerName.includes('token') || lowerName.includes('deck') || lowerName.includes('carta')) {
    return 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=600&q=80'
  }

  // Fallback high quality board game aesthetic
  return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80'
}

export function getEstimatedDeliveryDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 3)
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`
}
