import { NextRequest, NextResponse } from 'next/server'
import type { ScanRequest, ScanResponse } from '@/lib/apiTypes'
import { generateMockDetectedDetails } from '@/lib/mockData'

/**
 * POST /api/scan
 * Phase 5 Step 1: Scan/analyze endpoint with mocked response
 * Accepts ScanRequest JSON and returns mocked DetectedDetails
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body (best-effort)
    const _body: ScanRequest = await request.json()
    void _body
    
    // Generate mocked response
    const response: ScanResponse = {
      detectedDetails: generateMockDetectedDetails(),
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  }
}

