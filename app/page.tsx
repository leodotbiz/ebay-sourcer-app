'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Client-side only: check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    
    if (hasSeenOnboarding === 'true') {
      router.replace('/scan')
    } else {
      router.replace('/onboarding')
    }
    
    setIsChecking(false)
  }, [router])

  // Show nothing during hydration to avoid flash
  if (isChecking) {
    return null
  }

  return null
}