'use client'

import React, { useState } from 'react'
import { AmazonHeader } from './AmazonHeader'
import { AmazonSubNav } from './AmazonSubNav'
import { AmazonFooter } from './AmazonFooter'
import { SideDrawer } from './SideDrawer'

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#e3e6e6]">
      <AmazonHeader onOpenDrawer={() => setDrawerOpen(true)} />
      <AmazonSubNav onOpenDrawer={() => setDrawerOpen(true)} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1 max-w-[1500px] w-full mx-auto">{children}</main>
      <AmazonFooter />
    </div>
  )
}
