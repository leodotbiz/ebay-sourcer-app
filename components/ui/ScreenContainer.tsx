import React from 'react'

interface ScreenContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Phone frame */}
      <div className="w-full max-w-sm bg-white shadow-lg relative">
        {children}
      </div>
    </div>
  )
}
