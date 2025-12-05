'use client'

import React from 'react'
import Link from 'next/link'

interface TopBarProps {
  title: string
  backHref?: string
  rightAction?: {
    label: string
    onClick: () => void
  }
}

export default function TopBar({ title, backHref, rightAction }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-primary text-white">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {backHref && (
              <Link href={backHref} className="text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          {rightAction && (
            <button
              onClick={rightAction.onClick}
              className="px-3 py-1 bg-primary-light rounded-full text-sm"
            >
              {rightAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

