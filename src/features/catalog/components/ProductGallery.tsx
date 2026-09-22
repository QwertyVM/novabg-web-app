'use client'

import React, { useState } from 'react'

interface ProductGalleryProps {
  mainImage: string
  title: string
}

export function ProductGallery({ mainImage, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage)

  const images = [
    mainImage,
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',
  ]

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 p-1 bg-white shrink-0 transition-all cursor-pointer ${
              selectedImage === img
                ? 'border-[#0066ff] shadow-sm'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${title} miniatura ${idx + 1}`}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </button>
        ))}
      </div>

      {/* Main Large Image */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200/80 p-6 flex items-center justify-center min-h-[320px] sm:min-h-[420px] max-h-[480px] shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedImage}
          alt={title}
          className="max-h-[380px] max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  )
}
