'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'

export default function Home() {
  const router = useRouter()
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted)

  useEffect(() => {
    if (onboardingCompleted) {
      router.push('/scan')
    } else {
      router.push('/onboarding')
    }
  }, [onboardingCompleted, router])

  return null
}

