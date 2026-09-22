'use client'

import React, { useState } from 'react'

interface ProductGalleryProps {
  mainImage: string
  title: string
}

export function ProductGallery({ mainImage, title }: ProductGalleryProps) {
  // Generate 4 image views based on theme
  const images = [
    mainImage,
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
  ]

  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-20">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 shrink-0 overflow-x-auto no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-14 h-14 rounded border-2 overflow-hidden transition-all ${
              selectedImage === idx
                ? 'border-[#e77600] ring-1 ring-[#e77600]'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${title} view ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image View */}
      <div className="flex-1 aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center p-4">
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
