'use client'

import React from 'react'

interface NovaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon'
  section?: 'BG' | '3D'
  showBadge?: boolean
  showTagline?: boolean
}

export function NovaLogo({
  className = '',
  size = 'md',
  variant = 'full',
  section = 'BG',
  showBadge = true,
  showTagline = false,
}: NovaLogoProps) {
  // Dimension scaling
  const dimensions = {
    sm: { height: 28, width: variant === 'icon' ? 28 : 110 },
    md: { height: 38, width: variant === 'icon' ? 38 : 148 },
    lg: { height: 50, width: variant === 'icon' ? 50 : 196 },
    xl: { height: 64, width: variant === 'icon' ? 64 : 256 },
  }[size]

  // Official Brand Tokens
  const terracotta = '#C85A32'
  const sand = '#D9B89C'
  const meepleColor = '#C8976C'

  const is3D = section === '3D'

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 100 110"
          width={dimensions.height}
          height={dimensions.height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
          aria-label="NOVA Meeple Token"
        >
          {/* Isometric 3D Hexagon Shadow / Bottom Facet */}
          <path
            d="M50 102 L14 81 L14 73 L50 94 L86 73 L86 81 Z"
            fill={is3D ? '#B45309' : sand}
            opacity="0.9"
          />
          {/* Main Isometric Hexagon Outer Ring */}
          <polygon
            points="50,8 86,28 86,74 50,94 14,74 14,28"
            stroke={is3D ? '#D97706' : sand}
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
          {/* Inner Hexagon Bevel */}
          <polygon
            points="50,18 78,34 78,68 50,84 22,68 22,34"
            stroke={is3D ? '#F59E0B' : sand}
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeOpacity="0.5"
            fill="none"
          />
          {/* Iconic Boardgame Meeple Outline */}
          <path
            d="M50 35
               C53.5 35 56.5 37.8 56.5 41.5
               C56.5 44 54.8 46.2 52.5 47
               C56 48.5 61 51 63 53.5
               C64.5 55.5 63 58.5 60.5 59
               C57.5 59.5 56 57 54.5 54.5
               L54.5 67
               L58.5 73.5
               C59.5 75 58 77 56 77
               L51.5 77
               L50 71
               L48.5 77
               L44 77
               C42 77 40.5 75 41.5 73.5
               L45.5 67
               L45.5 54.5
               C44 57 42.5 59.5 39.5 59
               C37 58.5 35.5 55.5 37 53.5
               C39 51 44 48.5 47.5 47
               C45.2 46.2 43.5 44 43.5 41.5
               C43.5 37.8 46.5 35 50 35 Z"
            stroke={is3D ? '#F59E0B' : meepleColor}
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 330 110"
        height={dimensions.height}
        style={{ width: 'auto', maxHeight: dimensions.height }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-[1.02]"
        aria-label="NOVA Board Games"
      >
        {/* ================= LETTER 'N' ================= */}
        <path
          d="M20 90 L20 20 C20 14 26 14 28 17 L56 68 L56 20 C56 14 62 14 64 17 C66 20 66 84 66 90 C66 96 60 96 58 93 L30 42 L30 90 C30 96 24 96 20 90 Z"
          stroke={terracotta}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ================= LETTER 'O' (3D Hexagon + Meeple) ================= */}
        {/* 3D Bottom Depth Shadow */}
        <path
          d="M130 98 L100 81 L100 74 L130 91 L160 74 L160 81 Z"
          fill={terracotta}
          opacity="0.2"
        />
        {/* Outer Isometric Hexagon */}
        <polygon
          points="130,12 160,29 160,75 130,92 100,75 100,29"
          stroke={terracotta}
          strokeWidth="8"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        {/* Inner Hexagon Bevel */}
        <polygon
          points="130,22 152,35 152,69 130,82 108,69 108,35"
          stroke={terracotta}
          strokeWidth="2.8"
          strokeLinejoin="round"
          strokeOpacity="0.5"
          fill="none"
        />
        {/* Iconic Board Game Meeple Silhouette */}
        <path
          d="M130 36
             C133 36 135.5 38.5 135.5 41.5
             C135.5 43.8 134 45.8 132 46.5
             C135 48 139.5 50 141.5 52.5
             C142.8 54.2 141.5 56.8 139.5 57.2
             C137 57.8 135.5 55.5 134 53.2
             L134 65
             L137.5 71
             C138.5 72.5 137.2 74.5 135.5 74.5
             L131.5 74.5
             L130 69
             L128.5 74.5
             L124.5 74.5
             C122.8 74.5 121.5 72.5 122.5 71
             L126 65
             L126 53.2
             C124.5 55.5 123 57.8 120.5 57.2
             C118.5 56.8 117.2 54.2 118.5 52.5
             C120.5 50 125 48 128 46.5
             C126 45.8 124.5 43.8 124.5 41.5
             C124.5 38.5 127 36 130 36 Z"
          stroke={terracotta}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ================= LETTER 'V' ================= */}
        <path
          d="M192 18
             C196 18 198 22 200 27
             L215 80
             C216.5 86 220.5 86 222 80
             L237 27
             C239 22 241 18 245 18"
          stroke={terracotta}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ================= LETTER 'A' ================= */}
        {/* Outer Rounded Legs */}
        <path
          d="M264 90
             L285 24
             C287.5 16 294.5 16 297 24
             L318 90"
          stroke={terracotta}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Horizontal Crossbar with Rounded Trait */}
        <path
          d="M276 60
             C284 56 298 56 306 60"
          stroke={terracotta}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Optional Business Tag & Badge */}
      <div className="flex flex-col justify-center leading-none">
        {showBadge && (
          <span
            className={`text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase shadow-2xs w-fit ${
              is3D
                ? 'bg-amber-400 text-amber-950 border border-amber-500/30'
                : 'bg-[#F3ECE2] text-[#2B231F] border border-[#D9B89C]/50'
            }`}
          >
            {is3D ? '3D' : 'BG'}
          </span>
        )}
        {showTagline && (
          <span className="text-[9px] text-[#6E655F] font-semibold tracking-wide mt-0.5">
            {is3D ? 'Taller de Precisión 3D' : 'Juegos de Mesa & Inserts'}
          </span>
        )}
      </div>
    </div>
  )
}
