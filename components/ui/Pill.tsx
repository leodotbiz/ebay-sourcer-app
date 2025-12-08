import React from 'react'

interface PillProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export default function Pill({ label, active = false, onClick, className = '' }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        px-3 sm:px-4 py-1.5 sm:py-2
        rounded-full
        text-xs sm:text-sm font-medium
        whitespace-nowrap
        transition-colors
        ${
          active
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
        ${className}
      `}
    >
      {label}
    </button>
  )
}

