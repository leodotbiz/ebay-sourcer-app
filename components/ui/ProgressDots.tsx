import React from 'react'

interface ProgressDotsProps {
  totalSteps: number
  currentStep: number
}

export default function ProgressDots({ totalSteps, currentStep }: ProgressDotsProps) {
  return (
    <div className="flex justify-center items-center gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1
        const isActive = step === currentStep
        return (
          <div
            key={step}
            className={`
              ${isActive 
                ? 'w-8 h-2 bg-primary rounded-full' 
                : 'w-2 h-2 bg-gray-300 rounded-full'
              }
              transition-all duration-200
            `}
          />
        )
      })}
    </div>
  )
}

