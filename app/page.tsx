'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'

export default function Home() {
  const router = useRouter()
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted)

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace('/scan')
    } else {
      router.replace('/onboarding')
    }
  }, [onboardingCompleted, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Loading…</p>
    </div>
  )
}

