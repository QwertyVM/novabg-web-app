'use client'

import React, { useState } from 'react'
import { StoreHeader } from './StoreHeader'
import { StoreSubNav } from './StoreSubNav'
import { StoreFooter } from './StoreFooter'
import { SideDrawer } from './SideDrawer'
import { NovaCategory } from '@/features/catalog/types/catalog.types'

interface StoreLayoutProps {
  children: React.ReactNode
  categories?: NovaCategory[]
}

export function StoreLayout({ children, categories = [] }: StoreLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <StoreHeader categories={categories} onOpenDrawer={() => setDrawerOpen(true)} />
      <StoreSubNav categories={categories} onOpenDrawer={() => setDrawerOpen(true)} />
      <SideDrawer categories={categories} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1 max-w-[1400px] w-full mx-auto">{children}</main>
      <StoreFooter categories={categories} />
    </div>
  )
}
