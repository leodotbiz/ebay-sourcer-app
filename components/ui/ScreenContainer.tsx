import React from 'react'

interface ScreenContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ScreenContainer({ children, className = '' }: ScreenContainerProps) {
  return (
    <div className={`max-w-md mx-auto w-full ${className}`}>
      {children}
    </div>
  )
}

