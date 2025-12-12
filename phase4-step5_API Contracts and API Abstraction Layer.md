## Phase 4 — Step 5 Plan

## What I found in your repo (important)

You already have:

* `lib/apiTypes.ts`
* `lib/apiClient.ts`

They’re **close**, but they currently **don’t fully match** the “mirror internal types exactly” intent because:

* `DetectedDetails` is duplicated instead of being derived from your actual internal type (`ScannedItem['detectedDetails']`).
* `VerdictResponse` is defined as a **flat object**, while your internal result shape is already standardized as `ResultData` in `lib/mockData.ts`.
* `CompsRequest` is currently split into `brand/category/...` fields rather than just using `DetectedDetails` (which is what your flow actually uses everywhere).

This is good news: Phase 4 Step 5 becomes a **tight refactor** of these two files, not new file creation.

---

# Phase 4 — Step 5 Objectives (unchanged)

1. Make API contracts **type-safe and shape-parity** with internal data
2. Keep `USE_MOCK = true` and simulate latency
3. **Do not integrate into UI yet**

---

# Step-by-step plan

## 1) Refactor `lib/apiTypes.ts` to truly mirror internal types

### 1.1 Re-export internal “source of truth” types instead of duplicating

Update `apiTypes.ts` so these are derived directly from internal types:

* `DetectedDetails` should be:

  * `export type DetectedDetails = ScannedItem['detectedDetails']`
  * (import `ScannedItem` from `@/store/appStore`)

* `CompItem` should be re-exported from `@/store/appStore` (already consistent)

* `ResultData` should be re-exported from `@/lib/mockData`

  * because that’s the exact shape your app already computes and reads (includes `assumptionsSummary`, `comps`, etc.)

**Outcome:** your API “contract types” can’t drift from internal reality.

### 1.2 Simplify request/response contracts to match your real flow

Your current pages flow is:

* Scan page stores `selectedImage` (string URL)
* Confirm page stores `pendingItem` including `detectedDetails` + `purchasePrice` + optional note + imageUrl
* Result page calls `calculateMockResult(purchasePrice, feePercent, avgShippingCost, targetRoi, minimumProfit)`

So your API contracts should align to that:

**Scan**

* `ScanRequest`: `{ imageUrl: string }` (or `{ image: string }` but use what you actually store: `imageUrl`)
* `ScanResponse`: `{ detectedDetails: DetectedDetails }`

**Comps**

* `CompsRequest`: `{ detectedDetails: DetectedDetails }`
* `CompsResponse`: `{ comps: CompItem[] }`

**Verdict**

* Keep your existing `VerdictSettings` (it matches your store settings well):

  * `{ feePercent; avgShippingCost; targetRoi; minimumProfit }`
* `VerdictRequest`: `{ purchasePrice: number; detectedDetails: DetectedDetails; settings: VerdictSettings }`
* **Change `VerdictResponse` to use the internal result type:**

  * Either `VerdictResponse = { result: ResultData }` (recommended)
  * or `VerdictResponse = ResultData` (acceptable, but less “API-ish”)

**Recommendation:** use `{ result: ResultData }` so you have room later to add metadata without breaking the result payload.

✅ Stop point: `apiTypes.ts` compiles and exports:

* `DetectedDetails`, `CompItem`, `ResultData`
* `ScanRequest/Response`, `CompsRequest/Response`, `VerdictRequest/Response`, `VerdictSettings`

---

## 2) Refactor `lib/apiClient.ts` to match the updated contracts

### 2.1 Make `USE_MOCK` explicitly exported

Change:

* `const USE_MOCK = true`
  to:
* `export const USE_MOCK = true as const`

(So Phase 5 can toggle it via env/config later.)

### 2.2 Keep the three functions, but ensure their return shapes match the new response contracts

* `analyzeScan(req)`:

  * still returns `{ detectedDetails: generateMockDetectedDetails() }`
  * ignore `req.imageUrl` for now (mock)

* `fetchComps(req)`:

  * return `{ comps: generateMockComps(4) }`
  * (optionally: keep using a constant count; don’t overcomplicate)

* `getVerdict(req)`:

  * call `calculateMockResult(...)` exactly as you already do
  * **wrap it** if you choose `VerdictResponse = { result: ResultData }`:

    * `return { result }`

### 2.3 Keep latency simulation

You already have it; optionally centralize:

* `await sleep(300)` helper (small cleanup is fine)

✅ Stop point: `apiClient.ts` compiles with zero imports from UI, and still has the “IMPORTANT: UI should NOT use this yet in Phase 4” comment.

---

## 3) Verify nothing in the UI imports apiClient yet

Quick repo search:

* `analyzeScan(`, `fetchComps(`, `getVerdict(`, or `from '@/lib/apiClient'`

**Goal:** ensure Phase 4 remains mock-driven *in pages*.

✅ Stop point: confirmed no UI integration.

---

## 4) Build / typecheck

Run in terminal:

* `npm run build` (or your package manager equivalent)

✅ Stop point: build succeeds.

---

# Deliverables checklist

At the end of Step 5:

* ✅ `apiTypes.ts` contracts are derived from internal types (no drift)
* ✅ `apiClient.ts` matches those contracts
* ✅ `USE_MOCK` remains true
* ✅ latency simulated
* ✅ **no UI integration**
* ✅ build passes

---

# What to do in Cursor right now

1. Use **Sonnet 4.5 in Plan mode**
2. Ask it to:

   * refactor `lib/apiTypes.ts` to derive types from `store/appStore` and `lib/mockData`
   * update request/response shapes to align with the existing app flow
   * refactor `lib/apiClient.ts` to match the new types
   * verify no UI imports `apiClient`
