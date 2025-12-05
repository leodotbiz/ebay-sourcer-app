import React from 'react'

interface StatCardProps {
  title: string
  value: string
  subtext?: string
}

export default function StatCard({ title, value, subtext }: StatCardProps) {
  return (
    <div className="flex-1 bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-500">{subtext}</p>
      )}
    </div>
  )
}

