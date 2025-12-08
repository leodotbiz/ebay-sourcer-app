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
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex flex-col items-center gap-1 text-xs
                  ${active ? 'text-slate-900' : 'text-gray-400'}
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className={active ? 'font-semibold' : ''}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

