'use client'

import React, { useState } from 'react'
import { StoreHeader } from './StoreHeader'
import { StoreSubNav } from './StoreSubNav'
import { StoreFooter } from './StoreFooter'
import { SideDrawer } from './SideDrawer'
import { NovaCategory } from '@/features/catalog/types/catalog.types'
import { StorePublicConfig } from '@/features/catalog/services/store-config.service'

interface StoreLayoutProps {
  children: React.ReactNode
  categories?: NovaCategory[]
  storeConfig?: StorePublicConfig
  activeSection?: 'BG' | '3D'
}

export function StoreLayout({
  children,
  categories = [],
  storeConfig,
  activeSection = 'BG',
}: StoreLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <StoreHeader
        categories={categories}
        storeConfig={storeConfig}
        activeSection={activeSection}
        onOpenDrawer={() => setDrawerOpen(true)}
      />
      <StoreSubNav categories={categories} onOpenDrawer={() => setDrawerOpen(true)} />
      <SideDrawer
        categories={categories}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <main className="flex-1 max-w-[1400px] w-full mx-auto">{children}</main>
      <StoreFooter categories={categories} storeConfig={storeConfig} />
    </div>
  )
}
