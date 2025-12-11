/**
 * API Contract Type Definitions for Phase 5
 * These interfaces define the shape of requests/responses for future backend integration
 * They mirror existing internal types to maintain consistency
 */

import type { CompItem, Verdict, Confidence } from '@/store/appStore'

// ============================================================================
// Scan Detection Types
// ============================================================================

export interface DetectedDetails {
  brand: string
  category: string
  size: string
  condition: string
  color: string
}

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
  brand: string
  category: string
  size?: string
  condition?: string
  color?: string
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
  verdict: Verdict
  expectedResaleMin: number
  expectedResaleMax: number
  netProfit: number
  roi: number
  confidence: Confidence
  timeToSell: string
  comps: CompItem[]
  assumptionsSummary?: string
}

