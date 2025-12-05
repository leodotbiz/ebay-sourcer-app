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
        px-4 py-2 rounded-full text-sm font-medium transition-colors
        ${active 
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

