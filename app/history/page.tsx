'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore, ItemStatus } from '@/store/appStore'
import Pill from '@/components/ui/Pill'
import Button from '@/components/ui/Button'

const verdictBg: Record<'BUY' | 'MAYBE' | 'PASS', string> = {
  BUY: 'bg-emerald-100 text-emerald-800',
  MAYBE: 'bg-amber-100 text-amber-800',
  PASS: 'bg-rose-100 text-rose-800',
}

const statusLabel: Record<'Purchased' | 'Considering' | 'Sold', string> = {
  Purchased: 'Purchased',
  Considering: 'Saved / considering',
  Sold: 'Sold',
}

export default function HistoryPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<ItemStatus | 'All'>('All')
  const items = useAppStore((state) => state.items)
  const sortedItems = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
  
    return filter === 'All'
      ? sorted
      : sorted.filter((item) => item.status === filter)
  }, [items, filter])
  
  const verdictColors = {
    BUY: 'bg-accent-green text-white',
    MAYBE: 'bg-accent-amber text-white',
    PASS: 'bg-accent-red text-white',
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">History</h1>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['All', 'Purchased', 'Considering', 'Sold'] as const).map((status) => (
            <Pill
              key={status}
              label={status}
              active={filter === status}
              onClick={() => setFilter(status)}
            />
          ))}
        </div>

        {/* Empty state */}
        {sortedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No scans yet</h2>
            <p className="text-gray-600 text-center mb-6">
              Your saved items will appear here.
            </p>
            <Button onClick={() => router.push('/scan')}>
              Scan your first item
            </Button>
          </div>
        )}

        {/* Item cards */}
        {sortedItems.length > 0 && (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/history/${item.id}`)}
                className="w-full flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <img
                  src={item.imageUrl}
                  alt={item.detectedDetails.brand}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 mb-1">
                    {item.detectedDetails.brand} {item.detectedDetails.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    Buy price: ${item.purchasePrice.toFixed(2)} · Saved: {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${verdictColors[item.result.verdict]}`}>
                    {item.result.verdict}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

