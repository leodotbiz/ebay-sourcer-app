'use client'

import React from 'react'

interface SliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  label?: string
  valueDisplay?: string
}

export default function Slider({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  label,
  valueDisplay,
}: SliderProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {valueDisplay && (
            <span className="text-lg font-bold text-gray-900">{valueDisplay}</span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 min-w-[3rem]">{min}x</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-sm text-gray-500 min-w-[3rem] text-right">{max}x</span>
      </div>
    </div>
  )
}

