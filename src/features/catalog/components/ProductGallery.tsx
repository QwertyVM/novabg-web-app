'use client'

import React from 'react'

interface ProductGalleryProps {
  mainImage: string
  title: string
}

export function ProductGallery({ mainImage, title }: ProductGalleryProps) {
  return (
    <div className="flex items-center justify-center bg-white rounded-2xl border border-gray-200/80 p-6 min-h-[320px] sm:min-h-[420px] max-h-[480px] shadow-xs">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mainImage}
        alt={title}
        className="max-h-[380px] max-w-full object-contain transition-transform duration-300 hover:scale-105"
      />
    </div>
  )
}

