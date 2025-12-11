'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppStore, ScannedItem } from '@/store/appStore'
import TopBar from '@/components/ui/TopBar'
import Button from '@/components/ui/Button'
import NumberField from '@/components/ui/NumberField'
import { formatDate, formatCurrency, formatMultiplier } from '@/lib/formatters'
import PageTransition from '@/components/ui/PageTransition'

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x500?text=Item+Photo'

export default function ItemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [item, setItem] = useState<ScannedItem | null>(null)
  const [showSoldModal, setShowSoldModal] = useState(false)
  const [soldPrice, setSoldPrice] = useState('')
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split('T')[0])

    // Lock background scroll and handle Escape key while the "Mark as Sold" modal is open
    useEffect(() => {
      if (!showSoldModal) return
  
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
  
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowSoldModal(false)
        }
      }
  
      document.addEventListener('keydown', handleEscape)
  
      return () => {
        document.body.style.overflow = originalOverflow
        document.removeEventListener('keydown', handleEscape)
      }
    }, [showSoldModal])  
  
  const items = useAppStore((state) => state.items)
  const updateItem = useAppStore((state) => state.updateItem)

  useEffect(() => {
    const foundItem = items.find((i) => i.id === id)
    if (foundItem) {
      setItem(foundItem)
      setSoldDate(
        foundItem.soldDate
          ? new Date(foundItem.soldDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      )
} else {
  router.push('/history')
}

  }, [id, items, router])

  const handleMarkAsSold = () => {
    if (!item || !soldPrice) return
  
    const price = parseFloat(soldPrice)
    if (Number.isNaN(price)) return
  
    updateItem(item.id, {
      status: 'Sold',
      soldPrice: price,
      soldDate,
    })
  
    setShowSoldModal(false)
    setItem({ ...item, status: 'Sold', soldPrice: price, soldDate })
    router.push('/history')
  }  

  const handleEditDetails = () => {
    if (!item) return
    
    // Store item data in sessionStorage for editing
    sessionStorage.setItem('pendingItem', JSON.stringify({
      detectedDetails: item.detectedDetails,
      purchasePrice: item.purchasePrice,
      note: item.note,
      imageUrl: item.imageUrl,
      editingItemId: item.id,
    }))
    
    router.push('/scan/confirm')
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const verdictColors = {
    BUY: 'bg-accent-green text-white',
    MAYBE: 'bg-accent-amber text-white',
    PASS: 'bg-accent-red text-white',
  }

  const statusColors = {
    Purchased: 'bg-blue-100 text-blue-800',
    Considering: 'bg-yellow-100 text-yellow-800',
    Sold: 'bg-green-100 text-green-800',
  }

  const formattedNetProfit = formatCurrency(item.result.netProfit)

  const isSaveSoldDisabled = !soldPrice || Number.isNaN(parseFloat(soldPrice)) || parseFloat(soldPrice) <= 0


  return (
    <PageTransition>
      <div className="relative min-h-screen bg-white pb-20">
        <TopBar
        title={`${item.detectedDetails.brand} ${item.detectedDetails.category}`}
        backHref="/history"
      />

      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <img
            src={item.imageUrl || PLACEHOLDER_IMAGE}
            alt={item.detectedDetails.brand}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${verdictColors[item.result.verdict]}`}>
              {item.result.verdict}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>
        </div>

        {/* Sold Summary */}
        {item.status === 'Sold' && item.soldPrice && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900">
              Sold on {formatDate(item.soldDate)} for {formatCurrency(item.soldPrice)}
            </p>
          </div>
        )}

        {/* Key details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-gray-900 mb-3">Key Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Purchase price:</span>
              <span className="font-medium text-gray-900">${item.purchasePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected resale:</span>
              <span className="font-medium text-gray-900">
                ${item.result.expectedResaleMin.toFixed(2)}–${item.result.expectedResaleMax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net profit:</span>
              <span className="font-medium text-gray-900">{formattedNetProfit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className="font-medium text-gray-900">{item.result.roi.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time to sell:</span>
              <span className="font-medium text-gray-900">{item.result.timeToSell}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Marketplace:</span>
              <span className="font-medium text-gray-900">eBay</span>
            </div>
            {item.soldPrice && (
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Sold price:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(item.soldPrice)}
                </span>
              </div>
            )}
            {item.soldDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Sold date:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(item.soldDate)}
                </span>
              </div>
            )}
          </div>

          {/* Realized Performance - Only for sold items */}
          {item.status === 'Sold' && item.soldPrice && item.purchasePrice && item.purchasePrice > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Realized Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Realized ROI:</span>
                  <span className="font-medium text-gray-900">
                    {formatMultiplier(item.soldPrice / item.purchasePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Realized Profit:</span>
                  <span className={`font-medium ${item.soldPrice - item.purchasePrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(item.soldPrice - item.purchasePrice)}
                  </span>
                </div>
                {/* Performance vs Predicted Range */}
                {item.result.expectedResaleMin && item.result.expectedResaleMax && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Performance:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.soldPrice > item.result.expectedResaleMax
                        ? 'bg-green-100 text-green-700'
                        : item.soldPrice < item.result.expectedResaleMin
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.soldPrice > item.result.expectedResaleMax
                        ? 'Above predicted range'
                        : item.soldPrice < item.result.expectedResaleMin
                        ? 'Below predicted range'
                        : 'Within predicted range'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {item.note && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
            <p className="text-sm text-gray-700">{item.note}</p>
          </div>
        )}

        {/* Comps used */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Comps Used</h2>
          <div className="space-y-3">
            {item.result.comps.map((comp) => (
              <div key={comp.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
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
                  <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-700">
                    {comp.similarity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {item.status !== 'Sold' && (
          <div className="space-y-3 pt-4">
            <Button
              fullWidth
              onClick={() => setShowSoldModal(true)}
            >
              Mark as Sold
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={handleEditDetails}
            >
              Edit details
            </Button>
          </div>
        )}
      </div>

      {/* Mark as Sold modal */}
      {showSoldModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="w-full max-w-md mx-4 bg-white rounded-3xl p-6">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">Mark as Sold</h3>
            <NumberField
              label="Sold Price ($)"
              prefix="$"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sold Date</label>
              <input
                type="date"
                value={soldDate}
                onChange={(e) => setSoldDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-3 pt-2">
              <Button
                fullWidth
                onClick={handleMarkAsSold}
                disabled={isSaveSoldDisabled}
              >
                Save as sold
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setShowSoldModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageTransition>
  )
}

