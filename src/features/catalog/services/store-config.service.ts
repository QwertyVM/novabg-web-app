import prisma from '@/core/database/prisma'

export interface StorePublicConfig {
  id: string
  negocio: string
  nombreTienda: string
  ruc: string
  razonSocial: string
  telefonoContacto: string
  emailContacto: string
  direccionFisica: string
  horarioAtencion: string
  anuncioTopActivo: boolean
  anuncioTopTexto: string
  anuncioTopLink: string
  fraseHero: string
  subtituloHero: string
  habilitarSeccion3d: boolean
  habilitarSeccionBg: boolean
  instagramUrl: string
  tiktokUrl: string
  facebookUrl: string
  whatsappMensaje: string
  envioGratisMinimo: number
  diasGarantia: number
  politicaEnvios: string
}

export interface StoreBannerSlide {
  id: string
  negocio: string
  tag: string
  titulo: string
  resaltado: string
  subtitulo: string
  ctaTexto: string
  ctaLink: string
  imagenUrl: string
  previewBadge: string
  previewTitle: string
  previewRating: string
  colorAcento: string
  orden: number
  activo: boolean
}

export async function getStorePublicConfig(negocio: string = 'BG'): Promise<StorePublicConfig> {
  try {
    const config = await prisma?.configuracionTienda?.findUnique({
      where: { negocio },
    })

    if (config) {
      return {
        id: config.id,
        negocio: config.negocio,
        nombreTienda: config.nombreTienda || 'NOVA',
        ruc: config.ruc || '20608934512',
        razonSocial: config.razonSocial || 'NOVA JUEGOS Y ACCESORIOS S.A.C.',
        telefonoContacto: config.telefonoContacto || '+51 924 812 345',
        emailContacto: config.emailContacto || 'contacto@novabg.pe',
        direccionFisica: config.direccionFisica || 'Taller Central - Lima, Perú',
        horarioAtencion: config.horarioAtencion || 'Lun a Sáb: 9:00 AM - 8:00 PM',
        anuncioTopActivo: config.anuncioTopActivo ?? true,
        anuncioTopTexto:
          config.anuncioTopTexto ||
          '🔥 ¡Envíos seguros a todo el Perú! Despachos a Lima y Provincias vía Olva Courier y Shalom',
        anuncioTopLink: config.anuncioTopLink || '/categoria/ofertas',
        fraseHero: config.fraseHero || 'Tu Pasión por los Juegos de Mesa, Elevada al Máximo.',
        subtituloHero:
          config.subtituloHero ||
          'Descubre juegos de mesa, organizadores a medida y accesorios exclusivos diseñados para optimizar cada noche de juego.',
        habilitarSeccion3d: config.habilitarSeccion3d ?? true,
        habilitarSeccionBg: config.habilitarSeccionBg ?? true,
        instagramUrl: config.instagramUrl || 'https://instagram.com/novabg.pe',
        tiktokUrl: config.tiktokUrl || 'https://tiktok.com/@novabg.pe',
        facebookUrl: config.facebookUrl || '',
        whatsappMensaje:
          config.whatsappMensaje ||
          '¡Hola NOVA BG! Quisiera consultar por los productos de la tienda.',
        envioGratisMinimo: config.envioGratisMinimo ? Number(config.envioGratisMinimo) : 150,
        diasGarantia: config.diasGarantia ?? 30,
        politicaEnvios:
          config.politicaEnvios ||
          'Despacho seguro a Lima Metropolitana y envíos certificados a provincias vía Olva Courier o Shalom.',
      }
    }
  } catch (err) {
    console.error('Error al cargar configuración de tienda desde BD:', err)
  }

  // Fallback defaults
  const is3D = negocio === '3D'
  return {
    id: 'default',
    negocio,
    nombreTienda: is3D ? 'NOVA 3D' : 'NOVA BG',
    ruc: '20608934512',
    razonSocial: is3D ? 'NOVA 3D IMPRESIONES S.A.C.' : 'NOVA JUEGOS Y ACCESORIOS S.A.C.',
    telefonoContacto: '+51 924 812 345',
    emailContacto: is3D ? 'contacto@nova3d.pe' : 'contacto@novabg.pe',
    direccionFisica: 'Taller Central - Lima, Perú',
    horarioAtencion: 'Lun a Sáb: 9:00 AM - 8:00 PM',
    anuncioTopActivo: true,
    anuncioTopTexto: is3D
      ? '🚀 ¡Envíos a todo el Perú en piezas y accesorios de precisión 3D!'
      : '🔥 ¡Envíos seguros a todo el Perú en juegos de mesa y accesorios!',
    anuncioTopLink: '/categoria/ofertas',
    fraseHero: is3D
      ? 'Impresión 3D de Alta Precisión y Diseños Personalizados'
      : 'Tu Pasión por los Juegos de Mesa, Elevada al Máximo.',
    subtituloHero: is3D
      ? 'Fabricamos accesorios modulares, miniaturas y piezas técnicas de la más alta calidad.'
      : 'Descubre juegos de mesa, organizadores a medida y accesorios exclusivos.',
    habilitarSeccion3d: true,
    habilitarSeccionBg: true,
    instagramUrl: is3D ? 'https://instagram.com/nova3d.pe' : 'https://instagram.com/novabg.pe',
    tiktokUrl: is3D ? 'https://tiktok.com/@nova3d.pe' : 'https://tiktok.com/@novabg.pe',
    facebookUrl: '',
    whatsappMensaje: '¡Hola! Quisiera más información sobre los productos de la tienda.',
    envioGratisMinimo: 150,
    diasGarantia: 30,
    politicaEnvios: 'Despacho seguro a Lima Metropolitana y envíos a todo el Perú vía Olva Courier y Shalom.',
  }
}

export async function getStoreActiveBanners(negocio: string = 'BG'): Promise<StoreBannerSlide[]> {
  try {
    const banners = (await prisma?.bannerTienda?.findMany({
      where: {
        negocio,
        activo: true,
      },
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
    })) || []

    return banners.map((b) => ({
      id: b.id,
      negocio: b.negocio,
      tag: b.tag || 'OFERTA DESTACADA',
      titulo: b.titulo,
      resaltado: b.resaltado || '',
      subtitulo: b.subtitulo || '',
      ctaTexto: b.ctaTexto || 'Explorar Catálogo',
      ctaLink: b.ctaLink || '/categoria/todos',
      imagenUrl: b.imagenUrl || '',
      previewBadge: b.previewBadge || 'EDICIÓN OFICIAL',
      previewTitle: b.previewTitle || 'Catálogo Oficial',
      previewRating: b.previewRating || '5.0 Calidad Garantizada',
      colorAcento: b.colorAcento || (negocio === '3D' ? '#f59e0b' : '#00d2ff'),
      orden: b.orden,
      activo: b.activo,
    }))
  } catch (err) {
    console.error('Error al cargar banners desde BD:', err)
    return []
  }
}

export async function validateStoreCoupon(code: string, subtotal: number, negocio: string = 'BG') {
  const cleanCode = code.trim().toUpperCase()
  if (!cleanCode) {
    return { valid: false, message: 'Ingresa un código de cupón' }
  }

  try {
    const coupon = await prisma?.cuponDescuento?.findFirst({
      where: {
        codigo: cleanCode,
        negocio,
        activo: true,
      },
    })

    if (!coupon) {
      return { valid: false, message: 'El cupón no existe o no es válido para esta sección' }
    }

    if (coupon.fechaFin && new Date() > coupon.fechaFin) {
      return { valid: false, message: 'El cupón ha expirado' }
    }

    if (coupon.usosMaximos && coupon.usosActuales >= coupon.usosMaximos) {
      return { valid: false, message: 'El cupón ha alcanzado el límite máximo de usos' }
    }

    const minAmount = coupon.montoMinimo ? Number(coupon.montoMinimo) : 0
    if (subtotal < minAmount) {
      return {
        valid: false,
        message: `El monto mínimo de compra para este cupón es de S/ ${minAmount.toFixed(2)}`,
      }
    }

    let discountAmount = 0
    const val = Number(coupon.valor)
    if (coupon.tipo === 'PORCENTAJE') {
      discountAmount = Number(((subtotal * val) / 100).toFixed(2))
    } else {
      discountAmount = Math.min(val, subtotal)
    }

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        codigo: coupon.codigo,
        tipo: coupon.tipo,
        valor: val,
        discountAmount,
        descripcion: coupon.descripcion,
      },
    }
  } catch (err) {
    console.error('Error validando cupón:', err)
    return { valid: false, message: 'Error interno al validar cupón' }
  }
}
