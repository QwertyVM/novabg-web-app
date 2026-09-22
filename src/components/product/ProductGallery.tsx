'use client'

import React, { useState } from 'react'

interface ProductGalleryProps {
  mainImage: string
  title: string
}

export function ProductGallery({ mainImage, title }: ProductGalleryProps) {
  // Generate 4 image views
  const images = [
    mainImage,
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
  ]

  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-20">
      {/* Thumbnails (Vertical on desktop) */}
      <div className="flex md:flex-col gap-2 shrink-0 overflow-x-auto no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition-all bg-white p-1 cursor-pointer ${
              selectedImage === idx
                ? 'border-[#0066ff] shadow-xs ring-1 ring-[#0066ff]/20'
                : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${title} view ${idx + 1}`} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      {/* Main Image View */}
      <div className="flex-1 aspect-square bg-white rounded-xl border border-gray-200/90 overflow-hidden flex items-center justify-center p-6 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedImage]}
          alt={title}
          className="w-full h-full object-contain hover:scale-110 transition-transform duration-300 cursor-crosshair"
        />
      </div>
    </div>
  )
}
