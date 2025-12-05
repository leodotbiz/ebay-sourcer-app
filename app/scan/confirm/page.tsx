'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateMockDetectedDetails } from '@/lib/mockData'
import TopBar from '@/components/ui/TopBar'
import TextField from '@/components/ui/TextField'
import NumberField from '@/components/ui/NumberField'
import Button from '@/components/ui/Button'

export default function ConfirmDetailsPage() {
  const router = useRouter()
  const [detectedDetails, setDetectedDetails] = useState(generateMockDetectedDetails())
  const [purchasePrice, setPurchasePrice] = useState('')
  const [note, setNote] = useState('')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're editing an existing item
    const stored = sessionStorage.getItem('pendingItem')
    if (stored) {
      const item = JSON.parse(stored)
      if (item.editingItemId) {
        setEditingItemId(item.editingItemId)
        setDetectedDetails(item.detectedDetails)
        setPurchasePrice(item.purchasePrice.toString())
        setNote(item.note || '')
      }
    }
  }, [])

  const handleGetBuyPass = () => {
    // Store form data in sessionStorage to pass to result page
    sessionStorage.setItem('pendingItem', JSON.stringify({
      detectedDetails,
      purchasePrice: parseFloat(purchasePrice) || 0,
      note: note || undefined,
      imageUrl: 'https://via.placeholder.com/400x500?text=Item+Photo',
      editingItemId,
    }))
    router.push('/result')
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      <TopBar title="Confirm Details" backHref="/scan" />
      
      {/* Image preview */}
      <div className="relative w-full h-64 bg-gray-200">
        <img
          src="https://via.placeholder.com/400x500?text=Item+Photo"
          alt="Item preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4">
          <button className="px-3 py-1.5 bg-gray-800 rounded-full text-white text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reshoot
          </button>
        </div>
      </div>

      {/* Form panel */}
      <div className="bg-white rounded-t-3xl -mt-6 pt-6 px-6 pb-32 min-h-[calc(100vh-16rem)]">
        <p className="text-xs text-gray-500 mb-4">
          Edit anything that looks off before we search comps.
        </p>

        {/* Detected details section */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">Detected Details</h2>
          <div className="space-y-4">
            <TextField
              label="Brand"
              value={detectedDetails.brand}
              onChange={(e) => setDetectedDetails({ ...detectedDetails, brand: e.target.value })}
            />
            <TextField
              label="Category"
              value={detectedDetails.category}
              onChange={(e) => setDetectedDetails({ ...detectedDetails, category: e.target.value })}
            />
            <TextField
              label="Size"
              value={detectedDetails.size}
              onChange={(e) => setDetectedDetails({ ...detectedDetails, size: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={detectedDetails.condition}
                onChange={(e) => setDetectedDetails({ ...detectedDetails, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>New</option>
                <option>Like New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>
            <TextField
              label="Color"
              value={detectedDetails.color}
              onChange={(e) => setDetectedDetails({ ...detectedDetails, color: e.target.value })}
            />
          </div>
        </div>

        {/* Price & notes section */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">Price & Notes</h2>
          <div className="space-y-4">
            <NumberField
              label="Purchase Price"
              prefix="$"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
            <TextField
              label="Quick Note (Optional)"
              placeholder="e.g. Small stain on cuff"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sticky button */}
      <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-white border-t border-gray-200 z-30">
        <Button
          fullWidth
          onClick={handleGetBuyPass}
          disabled={!purchasePrice || parseFloat(purchasePrice) <= 0}
        >
          Get Buy/Pass
        </Button>
      </div>
    </div>
  )
}

