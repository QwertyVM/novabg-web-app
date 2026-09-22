'use client'

import React, { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function PopupSuccessPage() {
  useEffect(() => {
    // Notify the parent window that login was successful
    if (window.opener) {
      window.opener.postMessage('popup-login-success', '*')
      // Close the popup automatically
      setTimeout(() => {
        window.close()
      }, 500)
    } else {
      // Fallback if opened normally and not as a popup
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#10B981] flex flex-col items-center justify-center p-4 text-white">
      <CheckCircle2 className="w-16 h-16 mb-4 animate-bounce" />
      <h1 className="text-2xl font-black mb-2 tracking-tight">¡Sesión Iniciada!</h1>
      <p className="text-sm font-semibold opacity-90">Puedes cerrar esta ventana.</p>
    </div>
  )
}
