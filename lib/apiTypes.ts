/**
 * API Contract Type Definitions for Phase 5
 * These interfaces define the shape of requests/responses for future backend integration
 * They mirror existing internal types to maintain consistency
 */

import type { ScannedItem, CompItem } from '@/store/appStore'
import type { ResultData } from '@/lib/mockData'

// Re-export types from internal sources to prevent drift
export type { CompItem, ResultData }

// ============================================================================
// Scan Detection Types
// ============================================================================

// Derive DetectedDetails from the source of truth
export type DetectedDetails = ScannedItem['detectedDetails']

export interface ScanRequest {
  imageId?: string
  imageUrl?: string
}

export interface ScanResponse {
  detectedDetails: DetectedDetails
}

// ============================================================================
// Comps Fetching Types
// ============================================================================

export interface CompsRequest {
  detectedDetails: DetectedDetails
}

export interface CompsResponse {
  comps: CompItem[]
}

// ============================================================================
// Verdict Calculation Types
// ============================================================================

export interface VerdictSettings {
  feePercent: number
  avgShippingCost: number
  targetRoi: number
  minimumProfit: number
}

export interface VerdictRequest {
  purchasePrice: number
  detectedDetails: DetectedDetails
  settings: VerdictSettings
}

export interface VerdictResponse {
  result: ResultData
}

