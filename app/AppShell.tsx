'use client'

import { usePathname } from 'next/navigation'
import ScreenContainer from '@/components/ui/ScreenContainer'
import BottomNav from '@/components/ui/BottomNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = pathname === '/onboarding'

  return (
    <ScreenContainer>
      {children}
      {!hideNav && <BottomNav />}
    </ScreenContainer>
  )
}