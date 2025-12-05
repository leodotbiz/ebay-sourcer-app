'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/scan') {
      return pathname === '/' || pathname === '/scan' || pathname.startsWith('/scan/') || pathname === '/result'
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const navItems = [
    { path: '/history', label: 'History', icon: '🕐' },
    { path: '/scan', label: 'Scan', icon: '📷' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const isScan = item.path === '/scan'
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex flex-col items-center justify-center
                  ${isScan ? 'flex-1' : 'flex-1'}
                  ${active && !isScan ? 'text-primary' : active && isScan ? 'text-white' : 'text-gray-400'}
                `}
              >
                {isScan ? (
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-1">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className={`text-xs ${active ? 'font-semibold' : ''}`}>{item.label}</span>
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

