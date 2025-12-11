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
const USE_MOCK = true

/**
 * Analyzes a scanned image and returns detected item details
 * Phase 4: Returns mock detected details
 * Phase 5: Will call real AI detection API
 */
export async function analyzeScan(_request: ScanRequest): Promise<ScanResponse> {
  if (!USE_MOCK) {
    throw new Error('Real API not implemented')
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    detectedDetails: generateMockDetectedDetails(),
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

  return result
}

