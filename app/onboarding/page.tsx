'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore, Marketplace } from '@/store/appStore'
import ProgressDots from '@/components/ui/ProgressDots'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import NumberField from '@/components/ui/NumberField'
import Slider from '@/components/ui/Slider'
import Pill from '@/components/ui/Pill'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  const {
    primaryMarketplace,
    feePercent,
    avgShippingCost,
    targetRoi,
    setPrimaryMarketplace,
    setFeePercent,
    setAvgShippingCost,
    setTargetRoi,
    setOnboardingCompleted,
  } = useAppStore()

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setOnboardingCompleted(true)
      router.replace('/scan')
    }
  }

  const handleSkip = () => {
    setOnboardingCompleted(true)
    router.replace('/scan')
  }

  const handleMarketplaceSelect = (marketplace: Marketplace) => {
    setPrimaryMarketplace(marketplace)
  }

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <ProgressDots totalSteps={4} currentStep={1} />
        <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
          <div className="w-20 h-20 bg-primary-light rounded-xl flex items-center justify-center mb-6">
            <span className="text-4xl">📷</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Snap. Scan. Decide.
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Faster sourcing decisions for professional resellers.
          </p>
          <div className="w-full space-y-3">
            <Button fullWidth onClick={handleNext}>
              Set up in 60 seconds
            </Button>
            <Button variant="ghost" fullWidth onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Marketplace
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col px-6 py-8">
        <ProgressDots totalSteps={4} currentStep={2} />
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Where do you sell?
          </h1>
          <p className="text-gray-600 mb-8">
            {"We'll use this to find relevant comps."}
          </p>
          <div className="space-y-3 mb-8">
            {(['eBay', 'Poshmark', 'Other'] as Marketplace[]).map((marketplace) => (
              <button
                key={marketplace}
                onClick={() => handleMarketplaceSelect(marketplace)}
                className={`
                  w-full p-4 rounded-lg border-2 text-left flex items-center justify-between
                  ${primaryMarketplace === marketplace
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                  }
                `}
              >
                <span className="font-medium">{marketplace}</span>
                {primaryMarketplace === marketplace && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <Button fullWidth onClick={handleNext} disabled={!primaryMarketplace}>
            Next
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Fees & Shipping
  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col px-6 py-8">
        <ProgressDots totalSteps={4} currentStep={3} />
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Fees & Shipping
          </h1>
          <p className="text-gray-600 mb-8">
            Your defaults for profit calculation.
          </p>
          <div className="space-y-6 mb-8">
            <NumberField
              label="Average total fees (%)"
              prefix="%"
              value={feePercent}
              onChange={(e) => setFeePercent(parseFloat(e.target.value) || 0)}
              helperText="Marketplace + payment + other fees."
            />
            <NumberField
              label="Average shipping cost ($)"
              prefix="$"
              value={avgShippingCost}
              onChange={(e) => setAvgShippingCost(parseFloat(e.target.value) || 0)}
              helperText="Typical label cost for a shirt/soft good."
            />
          </div>
          <Button fullWidth onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    )
  }

  // Step 4: Target ROI
  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <ProgressDots totalSteps={4} currentStep={4} />
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Target ROI
        </h1>
        <p className="text-gray-600 mb-8">
          Minimum return you look for.
        </p>
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {targetRoi.toFixed(1)}x
          </div>
          <p className="text-sm text-gray-500">
            Sale Price ÷ Buy Cost
          </p>
        </div>
        <div className="mb-8">
          <Slider
            min={1.5}
            max={5.0}
            step={0.1}
            value={targetRoi}
            onChange={setTargetRoi}
            valueDisplay={`${targetRoi.toFixed(1)}x`}
          />
        </div>
        <p className="text-sm text-gray-500 mb-8 text-center">
          {"We'll lean toward PASS when expected ROI is below this."}
        </p>
        <Button fullWidth onClick={handleNext}>
          Finish & Start Scanning
        </Button>
      </div>
    </div>
  )
}

