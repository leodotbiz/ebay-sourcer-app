import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Marketplace = 'eBay' | 'Poshmark' | 'Other'
export type Verdict = 'BUY' | 'MAYBE' | 'PASS'
export type Confidence = 'High' | 'Medium' | 'Low'
export type ItemStatus = 'Purchased' | 'Considering' | 'Sold'

export interface CompItem {
  id: string
  thumbnail: string
  title: string
  soldPrice: number
  soldDate: string
  similarity: 'Very similar' | 'Similar' | 'Loose match'
}

export interface ScannedItem {
  id: string
  imageUrl: string
  detectedDetails: {
    brand: string
    category: string
    size: string
    condition: string
    color: string
  }
  purchasePrice: number
  note?: string
  result: {
    verdict: Verdict
    expectedResaleMin: number
    expectedResaleMax: number
    netProfit: number
    roi: number
    confidence: Confidence
    timeToSell: string
    comps: CompItem[]
  }
  status: ItemStatus
  createdAt: string
  soldPrice?: number
  soldDate?: string
}

interface AppState {
  // Onboarding state
  onboardingCompleted: boolean
  
  // Settings
  primaryMarketplace: Marketplace
  feePercent: number
  avgShippingCost: number
  targetRoi: number
  minimumProfit: number
  
  // Items
  items: ScannedItem[]
  
  // Actions
  setOnboardingCompleted: (completed: boolean) => void
  setPrimaryMarketplace: (marketplace: Marketplace) => void
  setFeePercent: (percent: number) => void
  setAvgShippingCost: (cost: number) => void
  setTargetRoi: (roi: number) => void
  setMinimumProfit: (profit: number) => void
addItem: (item: ScannedItem) => void
updateItem: (id: string, updates: Partial<ScannedItem>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      primaryMarketplace: 'eBay',
      feePercent: 15,
      avgShippingCost: 5.5,
      targetRoi: 2.5,
      minimumProfit: 10,
      items: [],
      
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      setPrimaryMarketplace: (marketplace) => set({ primaryMarketplace: marketplace }),
      setFeePercent: (percent) => set({ feePercent: percent }),
      setAvgShippingCost: (cost) => set({ avgShippingCost: cost }),
      setTargetRoi: (roi) => set({ targetRoi: roi }),
      setMinimumProfit: (profit) => set({ minimumProfit: profit }),
      addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
      updateItem: (id: string, updates: Partial<ScannedItem>) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
    }),
    {
      name: 'ebay-sourcer-storage',
    }
  )
)

