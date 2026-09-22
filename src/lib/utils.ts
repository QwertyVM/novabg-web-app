import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceParts(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return { symbol: 'S/', integer: '0', decimal: '00', full: 'S/ 0.00' }
  
  const fixed = num.toFixed(2)
  const [integer, decimal] = fixed.split('.')
  return {
    symbol: 'S/',
    integer,
    decimal,
    full: `S/ ${fixed}`
  }
}

// Map product models to high quality board game photography
export function getProductImage(productName: string, category: string = ''): string {
  const lower = (productName + ' ' + category).toLowerCase()
  
  if (lower.includes('zombicide')) {
    return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
  }
  if (lower.includes('gloomhaven') || lower.includes('jaws')) {
    return 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80'
  }
  if (lower.includes('mansion') || lower.includes('locura') || lower.includes('tablero')) {
    return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
  }
  if (lower.includes('torre') || lower.includes('dragón') || lower.includes('castillo') || lower.includes('dado')) {
    return 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
  }
  if (lower.includes('seti') || lower.includes('organizador') || lower.includes('inserto')) {
    return 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=800&q=80'
  }
  if (lower.includes('catan') || lower.includes('carcassonne')) {
    return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
  }
  if (lower.includes('vela') || lower.includes('decoracion') || lower.includes('miniatura')) {
    return 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
  }

  // Generic premium board game accessory image
  return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
}

export function getEstimatedDeliveryDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 2)
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }
  const formatted = date.toLocaleDateString('es-PE', options)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
