'use client'

import React, { useState } from 'react'
import { AmazonHeader } from './AmazonHeader'
import { AmazonSubNav } from './AmazonSubNav'
import { AmazonFooter } from './AmazonFooter'
import { SideDrawer } from './SideDrawer'
import { NovaCategory } from '@/actions/categories'

interface StoreLayoutProps {
  children: React.ReactNode
  categories?: NovaCategory[]
}

export function StoreLayout({ children, categories = [] }: StoreLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <AmazonHeader categories={categories} onOpenDrawer={() => setDrawerOpen(true)} />
      <AmazonSubNav categories={categories} onOpenDrawer={() => setDrawerOpen(true)} />
      <SideDrawer categories={categories} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1 max-w-[1400px] w-full mx-auto">{children}</main>
      <AmazonFooter categories={categories} />
    </div>
  )
}
