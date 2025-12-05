'use client'

import { useAppStore } from '@/store/appStore'
import NumberField from '@/components/ui/NumberField'
import Slider from '@/components/ui/Slider'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const {
    feePercent,
    avgShippingCost,
    targetRoi,
    minimumProfit,
    setFeePercent,
    setAvgShippingCost,
    setTargetRoi,
    setMinimumProfit,
  } = useAppStore()

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Fees & Shipping */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Fees & Shipping</h2>
          <div className="space-y-4">
            <NumberField
              label="Default Fee (%)"
              prefix="%"
              value={feePercent}
              onChange={(e) => setFeePercent(parseFloat(e.target.value) || 0)}
              helperText="Marketplace + payment + other fees."
            />
            <NumberField
              label="Default Shipping Cost ($)"
              prefix="$"
              value={avgShippingCost}
              onChange={(e) => setAvgShippingCost(parseFloat(e.target.value) || 0)}
              helperText="Typical label cost for a shirt/soft good."
            />
          </div>
        </div>

        {/* ROI Targets */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">ROI Targets</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Minimum Target ROI</label>
              <span className="text-lg font-bold text-gray-900">{targetRoi.toFixed(1)}x</span>
            </div>
            <Slider
              min={1.5}
              max={5.0}
              step={0.1}
              value={targetRoi}
              onChange={setTargetRoi}
            />
            <NumberField
              label="Minimum Profit ($)"
              prefix="$"
              value={minimumProfit}
              onChange={(e) => setMinimumProfit(parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500">
              We'll lean toward PASS if expected profit is below this.
            </p>
          </div>
        </div>

        {/* Account */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <Button variant="secondary" fullWidth className="mb-4">
            <div className="flex items-center justify-between w-full">
              <span>Sign Out</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Button>
          <p className="text-xs text-gray-500 text-center">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

