'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore, ScannedItem, ItemStatus } from '@/store/appStore'
import { calculateMockResult, ResultData } from '@/lib/mockData'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'

// Shape of what Confirm page stores in sessionStorage as "pendingItem"
type PendingItem = {
  imageUrl: string
  detectedDetails: ScannedItem['detectedDetails']
  purchasePrice: number
  note?: string
  editingItemId?: string
}

export default function ResultPage() {
  const router = useRouter()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null)
  const [result, setResult] = useState<ResultData | null>(null)

  const {
    feePercent,
    avgShippingCost,
    targetRoi,
    minimumProfit,
    primaryMarketplace, // reserved for future use (e.g. per-marketplace fee logic)
    addItem,
    updateItem,
    items,
  } = useAppStore()

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingItem')
    if (stored) {
      const item: PendingItem = JSON.parse(stored)
      setPendingItem(item)

      const calculatedResult = calculateMockResult(
        item.purchasePrice,
        feePercent,
        avgShippingCost,
        targetRoi,
        minimumProfit
      )
      setResult(calculatedResult)
    } else {
      router.push('/scan')
    }
  }, [feePercent, avgShippingCost, targetRoi, minimumProfit, router])

  const handleSave = (status: ItemStatus) => {
    if (!pendingItem || !result) return

    if (pendingItem.editingItemId) {
      // Update existing item
      const existingItem = items.find((i) => i.id === pendingItem.editingItemId)
      if (existingItem) {
        updateItem(pendingItem.editingItemId, {
          detectedDetails: pendingItem.detectedDetails,
          purchasePrice: pendingItem.purchasePrice,
          note: pendingItem.note,
          result: {
            verdict: result.verdict,
            expectedResaleMin: result.expectedResaleMin,
            expectedResaleMax: result.expectedResaleMax,
            netProfit: result.netProfit,
            roi: result.roi,
            confidence: result.confidence,
            timeToSell: result.timeToSell,
            comps: result.comps,
          },
          status,
        })
      }
    } else {
      // Create new item
      const newItem: ScannedItem = {
        id: Date.now().toString(),
        imageUrl: pendingItem.imageUrl,
        detectedDetails: pendingItem.detectedDetails,
        purchasePrice: pendingItem.purchasePrice,
        note: pendingItem.note,
        result: {
          verdict: result.verdict,
          expectedResaleMin: result.expectedResaleMin,
          expectedResaleMax: result.expectedResaleMax,
          netProfit: result.netProfit,
          roi: result.roi,
          confidence: result.confidence,
          timeToSell: result.timeToSell,
          comps: result.comps,
        },
        status,
        createdAt: new Date().toISOString(),
      }
      addItem(newItem)
    }

    sessionStorage.removeItem('pendingItem')
    setShowSaveModal(false)
    router.push('/history')
  }

  const handleRescan = () => {
    router.push('/scan/confirm')
  }

  if (!result || !pendingItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const verdictColors = {
    BUY: 'bg-accent-green',
    MAYBE: 'bg-accent-amber',
    PASS: 'bg-accent-red',
  }

  const verdictTexts = {
    BUY: 'Strong margin, even with conservative comps.',
    MAYBE: 'Borderline — worth a closer look.',
    PASS: 'Low margin or weak comps. Probably not worth it.',
  }

  const confidenceColors = {
    High: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="px-6 py-8 space-y-6">
        {/* Verdict card */}
        <div
          className={`${verdictColors[result.verdict]} rounded-2xl p-8 text-center text-white`}
        >
          <h1 className="text-4xl font-bold mb-2">{result.verdict}</h1>
          <p className="text-white/90">{verdictTexts[result.verdict]}</p>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            title="Expected resale price"
            value={`$${result.expectedResaleMin}–$${result.expectedResaleMax}`}
            subtext="Based on similar sold listings."
          />
          <StatCard
            title="Estimated net profit"
            value={`+$${result.netProfit.toFixed(2)}`}
            subtext="After your fees & shipping."
          />
          <StatCard
            title="ROI"
            value={`${result.roi.toFixed(1)}x`}
            subtext={`Target: ${targetRoi.toFixed(1)}x`}
          />
        </div>

        {/* Time to sell */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-900 mb-1">
            Likely to sell in <strong>{result.timeToSell}</strong>.
          </p>
          <p className="text-sm text-gray-600">
            Based on sell-through of similar items.
          </p>
        </div>

        {/* Assumptions */}
        <button
          onClick={() => router.push('/settings')}
          className="w-full text-left text-sm text-gray-600 hover:text-primary"
        >
          {result.assumptionsSummary}
        </button>

        {/* Confidence */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${confidenceColors[result.confidence]}`}
            >
              {result.confidence} confidence
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {result.confidence === 'High' &&
              'Strong comp data supports this recommendation.'}
            {result.confidence === 'Medium' &&
              'Moderate comp data available.'}
            {result.confidence === 'Low' &&
              'Limited comp data — use caution.'}
          </p>
        </div>

        {/* Comps list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Similar Sold Items
          </h2>
          <div className="space-y-3">
            {result.comps.map((comp) => (
              <div
                key={comp.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={comp.thumbnail}
                  alt={comp.title}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {comp.title}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Sold: ${comp.soldPrice} · {comp.soldDate}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-700">
                      {comp.similarity}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      👍
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      👎
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer actions */}
      <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-white border-t border-gray-200 z-30 space-y-2">
        <Button fullWidth onClick={() => setShowSaveModal(true)}>
          Save item
        </Button>
        <Button variant="ghost" fullWidth onClick={handleRescan}>
          Rescan / adjust details
        </Button>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Save item as:
            </h3>
            <Button fullWidth onClick={() => handleSave('Purchased')}>
              Purchased
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => handleSave('Considering')}
            >
              Considering
            </Button>
            <Button
              fullWidth
              variant="ghost"
              onClick={() => setShowSaveModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
