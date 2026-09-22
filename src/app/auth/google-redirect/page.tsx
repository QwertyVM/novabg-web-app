'use client'

import React, { useEffect } from 'react'
import { signIn } from 'next-auth/react'

export default function GoogleRedirectPage() {
  useEffect(() => {
    signIn('google', { callbackUrl: '/auth/popup-success' })
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-[#C85A32] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#2B231F] font-semibold">Conectando con Google...</p>
    </div>
  )
}
