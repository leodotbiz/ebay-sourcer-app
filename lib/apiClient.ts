/**
 * API Client Abstraction Layer
 * Phase 4: Mock-only implementation
 * Phase 5: Can be swapped to real backend by changing USE_MOCK flag
 * 
 * IMPORTANT: UI components should NOT use this yet in Phase 4
 * They will be migrated to use this in Phase 5
 */

import type {
  ScanRequest,
  ScanResponse,
  CompsRequest,
  CompsResponse,
  VerdictRequest,
  VerdictResponse,
} from './apiTypes'
import { generateMockDetectedDetails, generateMockComps, calculateMockResult } from './mockData'

// Phase 4: Always use mock data
// Phase 5: Can be controlled by environment variable or config
export const USE_MOCK = true as const

/**
 * Analyzes a scanned image and returns detected item details
 * Phase 4: Returns mock detected details
 * Phase 5: Calls /api/scan when USE_MOCK is false
 */
export async function analyzeScan(request: ScanRequest): Promise<ScanResponse> {
  if (USE_MOCK) {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      detectedDetails: generateMockDetectedDetails(),
    }
  }

  // Real API path (browser/client only)
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: request.imageUrl }),
    })

    // Prefer stable error text (statusText can be empty)
    if (!response.ok) {
      const message = await response.text().catch(() => '')
      throw new Error(message || `Scan failed (HTTP ${response.status})`)
    }

    const data = (await response.json()) as ScanResponse

    // Light validation
    if (!data?.detectedDetails) {
      throw new Error('Invalid response: missing detectedDetails')
    }

    return data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze scan')
  }
}

/**
 * Fetches comparable sold items from marketplace
 * Phase 4: Returns mock comps
 * Phase 5: Will call real comps search API
 */
export async function fetchComps(_request: CompsRequest): Promise<CompsResponse> {
  if (!USE_MOCK) {
    throw new Error('Real API not implemented')
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    comps: generateMockComps(4),
  }
}

/**
 * Calculates buy/pass verdict based on item details and user settings
 * Phase 4: Returns mock verdict calculation
 * Phase 5: Will call real AI verdict API
 */
export async function getVerdict(request: VerdictRequest): Promise<VerdictResponse> {
  if (!USE_MOCK) {
    throw new Error('Real API not implemented')
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))

  const result = calculateMockResult(
    request.purchasePrice,
    request.settings.feePercent,
    request.settings.avgShippingCost,
    request.settings.targetRoi,
    request.settings.minimumProfit
  )

  return { result }
}

