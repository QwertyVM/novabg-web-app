'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Lock, ShieldCheck } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = () => {
    const width = 450
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    
    window.open(
      '/auth/google-redirect',
      'GoogleLoginPopup',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'popup-login-success') {
        window.removeEventListener('message', handleMessage)
        window.location.href = '/' // or window.location.reload()
      }
    }
    window.addEventListener('message', handleMessage)
  }

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await signIn('google-demo', {
      email,
      name: nombre || email.split('@')[0],
      callbackUrl: '/',
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-16 px-4 select-none">
      {/* NOVA BG Logo */}
      <Link href="/" className="mb-6 flex flex-col items-center">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-black tracking-tight text-[#0f172a]">
            NOVA
          </span>
          <span className="text-sm font-black px-2 py-0.5 rounded-sm bg-[#0066ff] text-white tracking-wider uppercase shadow-2xs">
            BG
          </span>
        </div>
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
          Tienda Oficial de Juegos de Mesa
        </span>
      </Link>

      {/* Main Box */}
      <div className="w-full max-w-[360px] border border-gray-300 rounded-lg p-6 shadow-xs bg-white">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Iniciar sesión</h1>

        {/* 1. Official Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 rounded-md py-2.5 px-4 flex items-center justify-center gap-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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

        <div className="relative my-4 flex items-center justify-center">
          <hr className="w-full border-gray-200" />
          <span className="bg-white px-2 text-[11px] text-gray-500 absolute">o ingresa tus datos</span>
        </div>

        {/* 2. Direct email connection */}
        <form onSubmit={handleDemoSignIn} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@gmail.com"
              className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-nova-primary py-2.5 text-xs font-semibold shadow-xs mt-2"
          >
            {loading ? 'Iniciando sesión...' : 'Acceder'}
          </button>
        </form>

        <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
          Al continuar, aceptas las Condiciones de uso y el Aviso de privacidad de la tienda de Juegos de Mesa.
        </p>
      </div>

      {/* Security note */}
      <div className="mt-8 text-xs text-gray-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Conexión segura protegida por Google Auth & SSL</span>
      </div>
    </div>
  )
}
