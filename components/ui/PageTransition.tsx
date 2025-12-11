'use client'

import { useEffect, useState, ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Simple fade-in transition wrapper for pages
 * Provides a subtle 300ms fade on mount
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className="transition-opacity duration-300 ease-in-out"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {children}
    </div>
  )
}

