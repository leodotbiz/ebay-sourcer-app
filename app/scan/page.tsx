'use client'

import { useRouter } from 'next/navigation'
import CameraFrame from '@/components/ui/CameraFrame'
import Button from '@/components/ui/Button'

export default function ScanPage() {
  const router = useRouter()

  const handleShutter = () => {
    router.push('/scan/confirm')
  }

  return (
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

      {/* Camera frame */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <CameraFrame />
        <div className="mt-4 px-4 py-2 bg-primary-light rounded-full">
          <span className="text-white text-sm">Frame item & price tag</span>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex justify-center items-center gap-6 px-6 pb-6">
        <button className="text-white opacity-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={handleShutter}
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400"></div>
        </button>
        <div className="w-8 h-8"></div>
      </div>
    </div>
  )
}

