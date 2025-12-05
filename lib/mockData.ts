import { CompItem, ResultData, Verdict, Confidence } from '@/store/appStore'

const brands = ['J.Crew', 'Nike', 'Adidas', 'Patagonia', 'The North Face', 'Levi\'s', 'Carhartt', 'Ralph Lauren']
const categories = ['Men\'s Shirt', 'Women\'s Dress', 'Jeans', 'Jacket', 'Sneakers', 'Hat', 'Backpack']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair']
const colors = ['Blue', 'Black', 'White', 'Gray', 'Navy', 'Red', 'Green', 'Brown', 'Blue Plaid', 'Black Striped']

export function generateMockDetectedDetails() {
  return {
    brand: brands[Math.floor(Math.random() * brands.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
  }
}

export function generateMockComps(count: number = 4): CompItem[] {
  const similarities: CompItem['similarity'][] = ['Very similar', 'Similar', 'Loose match']
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `comp-${i + 1}`,
    thumbnail: `https://via.placeholder.com/80x80?text=Item+${i + 1}`,
    title: `${brands[Math.floor(Math.random() * brands.length)]} ${categories[Math.floor(Math.random() * categories.length)]} - Example Listing Title ${i + 1}`,
    soldPrice: Math.round((Math.random() * 50 + 15) * 100) / 100,
    soldDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    similarity: similarities[Math.floor(Math.random() * similarities.length)],
  }))
}

export function calculateMockResult(
  purchasePrice: number,
  feePercent: number,
  avgShippingCost: number,
  targetRoi: number,
  minimumProfit: number
): ResultData {
  // Helper to round to the nearest $0.50 for nicer numbers
  const roundToHalfDollar = (value: number) => Math.round(value * 2) / 2

  // Generate a realistic expected resale range based on purchase price
  const baseMultiplier = 2.5 + Math.random() * 2.5 // 2.5x to 5x
  const rawMin = purchasePrice * (baseMultiplier - 0.3)
  const rawMax = purchasePrice * (baseMultiplier + 0.3)

  // Floor so we don't go below "purchase + fees + shipping" (approx)
  const minFloor =
    purchasePrice * (1 + feePercent / 100) + avgShippingCost

  let expectedResaleMin = Math.max(rawMin, minFloor * 1.05) // small margin on top
  let expectedResaleMax = Math.max(rawMax, expectedResaleMin * 1.1)

  // Round to human-friendly prices
  expectedResaleMin = roundToHalfDollar(expectedResaleMin)
  expectedResaleMax = roundToHalfDollar(expectedResaleMax)

  // Calculate average expected resale
  const avgResale = (expectedResaleMin + expectedResaleMax) / 2
  
  // Calculate fees and shipping
  const fees = avgResale * (feePercent / 100)
  const netProfit = avgResale - purchasePrice - fees - avgShippingCost
  const roi = avgResale / purchasePrice
  
  // Determine verdict based on ROI and profit
  let verdict: Verdict
  if (roi >= targetRoi && netProfit >= minimumProfit) {
    verdict = 'BUY'
  } else if (roi >= targetRoi * 0.8 && netProfit >= minimumProfit * 0.7) {
    verdict = 'MAYBE'
  } else {
    verdict = 'PASS'
  }
  
  // Determine confidence based on comp quality (simplified)
  const confidence: Confidence = Math.random() > 0.5 
    ? (Math.random() > 0.5 ? 'High' : 'Medium')
    : 'Low'
  
  // Time to sell estimate
  const timeToSellOptions = [
    '7-14 days',
    '15-30 days',
    '30-60 days',
    '60-90 days',
    '90+ days',
  ]
  const timeToSell = timeToSellOptions[Math.floor(Math.random() * timeToSellOptions.length)]
  
  // Generate comps
  const comps = generateMockComps(3 + Math.floor(Math.random() * 3))
  
  // Assumptions summary
  const assumptionsSummary = `Using: eBay · Fees ${feePercent}% · Shipping $${avgShippingCost.toFixed(2)} · Min ROI ${targetRoi}x`
  
  return {
    verdict,
    expectedResaleMin,
    expectedResaleMax,
    netProfit: Math.round(netProfit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    confidence,
    timeToSell,
    comps,
    assumptionsSummary,
  }
}

