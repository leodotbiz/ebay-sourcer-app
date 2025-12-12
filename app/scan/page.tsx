'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CameraFrame from '@/components/ui/CameraFrame'
import PageTransition from '@/components/ui/PageTransition'
import { analyzeScan } from '@/lib/apiClient'

export default function ScanPage() {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Restore preview from sessionStorage on mount (e.g., navigating back from confirm)
  useEffect(() => {
    const stored = sessionStorage.getItem('selectedImage')
    if (stored) {
      setPreviewUrl(stored)
    }
  }, [])
  
  // Analyze image using API
  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      // Call API to analyze the scan
      const response = await analyzeScan({ imageUrl })

      // Create pendingItem with detectedDetails from response
      const pendingItem = {
        imageUrl,
        detectedDetails: response.detectedDetails,
        purchasePrice: 0, // default, user will fill in Confirm
        note: '',
      }

      // Store pendingItem in sessionStorage
      sessionStorage.setItem('pendingItem', JSON.stringify(pendingItem))
      sessionStorage.setItem('selectedImage', imageUrl)

      // Navigate to Confirm
      router.push('/scan/confirm')
    } catch (error) {
      setAnalysisError(
        error instanceof Error ? error.message : 'Failed to analyze image'
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // If there was a previous blob URL, revoke it to avoid memory leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    // Use a blob URL instead of a huge base64 string
    const objectUrl = URL.createObjectURL(file)

    setPreviewUrl(objectUrl)
    
    // Analyze the image (will navigate on success)
    analyzeImage(objectUrl)

    // Allow the user to pick the same file again later
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRetryAnalysis = () => {
    if (previewUrl) {
      analyzeImage(previewUrl)
    }
  }

  const handleCancelAnalysis = () => {
    setAnalysisError(null)
  
    // Revoke blob URL to avoid leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
  
    setPreviewUrl(null)
    sessionStorage.removeItem('selectedImage')
    sessionStorage.removeItem('pendingItem')
  }  

  const handleShutter = () => {
    fileInputRef.current?.click()
  }

  const handleImagePick = () => {
    fileInputRef.current?.click()
  }

  const handleThumbnailClick = () => {
    if (previewUrl) {
      // We already have a selected image – go back to Confirm for this draft
      router.push('/scan/confirm')
    } else {
      // No last image yet – open the picker (photo library / file explorer)
      handleImagePick()
    }
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-primary flex flex-col pb-20">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <div className="px-3 py-1 bg-primary-light rounded-full">
          <span className="text-white text-sm font-medium">SCANNER</span>
        </div>
        <button className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            <line x1="18" y1="6" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Select item photo from library"
      />

      {/* Camera frame */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <CameraFrame />
        
        {/* Loading state */}
        {isAnalyzing && (
          <div className="mt-4 px-4 py-2 bg-primary-light rounded-full flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white text-sm">Analyzing scan…</span>
          </div>
        )}
        
        {/* Error state */}
        {analysisError && (
          <div className="mt-4 px-4 py-3 bg-red-500/20 border border-red-500 rounded-lg max-w-sm">
            <p className="text-white text-sm mb-3">{analysisError}</p>
            <div className="flex gap-2">
              <button
                onClick={handleRetryAnalysis}
                className="px-4 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleCancelAnalysis}
                className="px-4 py-2 bg-transparent text-white border border-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Default hint (when not loading/error) */}
        {!isAnalyzing && !analysisError && (
          <div className="mt-4 px-4 py-2 bg-primary-light rounded-full">
            <span className="text-white text-sm">Frame item & price tag</span>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex justify-center items-center gap-6 px-6 pb-6">
      <button
          onClick={handleThumbnailClick}
          disabled={isAnalyzing}
          className="w-10 h-10 rounded-md overflow-hidden border border-white/60 bg-black/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={previewUrl ? "View last captured item" : "Select photo from library"}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Last captured item"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm3 8a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          )}
        </button>
        <button
          onClick={handleShutter}
          disabled={isAnalyzing}
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          aria-label="Capture item photo"
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400"></div>
        </button>
        <div className="w-8 h-8"></div>
      </div>
    </div>
    </PageTransition>
  )
}

