---
title: "Phase 5 — Step 1: API plumbing for scan/analyze + async UI integration"
model_recommendation:
  plan_mode: "Sonnet 4.5"
  build_mode: "Sonnet 4.5 (Opus 4.5 only if debugging complex async/state issues)"
todos:
  - id: phase5-overview-guardrails
    content: Confirm Phase 5 scope + guardrails (no real AI yet; HTTP plumbing only)
    status: pending
  - id: create-scan-endpoint
    content: Add /api/scan route handler that returns mocked detectedDetails (contract-aligned)
    status: pending
  - id: update-api-client-analyzeScan
    content: Update apiClient.analyzeScan to call /api/scan when USE_MOCK is false (keep default mock path)
    status: pending
  - id: wire-scan-ui-to-api-client
    content: Update Scan flow to call analyzeScan asynchronously (loading + error states), store pendingItem, then route to Confirm
    status: pending
  - id: verify-no-comps-verdict-migration
    content: Verify Confirm/Result still use existing mock logic for comps/verdict (do not migrate yet)
    status: pending
  - id: build-and-smoke-test
    content: Run build + smoke test scan -> confirm -> result flow
    status: pending
---

# Phase 5 overview (for alignment only — do not implement all in this step)
Phase 5 will migrate the app from in-page mock logic to real API-driven flows in controlled slices:
1) Step 1 (this step): HTTP plumbing for scan/analyze + async UI integration at Scan only
2) Step 2: comps endpoint + migrate Confirm to fetch comps async
3) Step 3: verdict endpoint + migrate Result to compute verdict async
4) Step 4: resilience (retry, error UI, timeouts, empty states)
5) Step 5: prepare for auth + persistence (Phase 6)

# Step 1 goal
Introduce a real HTTP boundary for scan/analyze (still mocked server response), and update the Scan page to use the apiClient asynchronously with loading/error handling.
Keep the rest of the app mock-driven for now.

# Hard constraints / guardrails
- Do NOT integrate real AI yet. Server returns mocked detectedDetails only.
- Do NOT migrate Confirm/Result to apiClient yet (comps/verdict remain as-is).
- Do NOT change the shapes of DetectedDetails / ResultData / CompItem.
- Keep USE_MOCK default behavior unchanged for Phase 4 compatibility.
- Prefer minimal diffs; avoid refactors not required for Step 1.

# Implementation details

## 1) API shape decision (use existing contracts)
We already have:
- ScanRequest: { imageUrl?: string, ... }
- ScanResponse: { detectedDetails: DetectedDetails }

Use JSON payload:
- Request body: { imageUrl?: string }
- Response body: { detectedDetails: <DetectedDetails> }

Even if imageUrl isn’t used server-side yet, include it so the interface is stable.

## 2) Create /api/scan route handler (mocked response)
Add a Next.js route handler:
- Path: app/api/scan/route.ts
- Method: POST
- Body: ScanRequest
- Response: ScanResponse

Server implementation should:
- Parse JSON request (best-effort)
- Return { detectedDetails: generateMockDetectedDetails() }
- Handle invalid JSON with 400 + message
- Never throw raw errors

Notes:
- Import generateMockDetectedDetails from lib/mockData
- Import types from lib/apiTypes where possible
- Keep response contract aligned with apiTypes.ts

## 3) Update apiClient.analyzeScan to support real HTTP path (future toggle)
Current Phase 4 behavior:
- USE_MOCK is true and analyzeScan returns mock detectedDetails with latency

Change behavior only when USE_MOCK is false:
- POST to /api/scan with ScanRequest JSON
- Validate response shape at runtime lightly (existence of detectedDetails)
- Return ScanResponse
- Add error message that UI can surface

Keep latency simulation on mock path only (or keep it on both; either is acceptable but be consistent).

## 4) Wire Scan page to use analyzeScan asynchronously
Update Scan flow so that when the user proceeds after selecting an image:
- Set a local loading state (e.g., "Analyzing scan…")
- Call analyzeScan({ imageUrl })
- On success:
  - create/set pendingItem with:
    - imageUrl (existing selected image URL)
    - detectedDetails from response
    - (preserve current defaults for price/note/etc. if applicable)
  - route to Confirm
- On failure:
  - show a user-friendly error state (inline banner + retry button)
  - allow user to cancel / select a different image

Important:
- Do not change Confirm’s core mock flow yet.
- Confirm should receive the same pendingItem shape it expects today.

## 5) Verification: ensure Confirm/Result remain unchanged
Explicitly verify:
- Confirm still uses current mock logic for comps/verdict
- Result still uses current mock logic
- No new imports from apiClient in Confirm/Result for Step 1

## 6) Acceptance criteria
- Scan -> Confirm works end-to-end
- While analyzeScan runs, UI is non-janky (loading indicator, button disabled)
- Errors are handled gracefully with retry
- Build passes (npm run build) with zero type errors
- No UI integration beyond Scan flow (Confirm/Result unchanged)

# Stop points (do not proceed without confirmation)
- If changing request payload to base64/multipart feels necessary, STOP and ask.
- If Confirm’s state shape must change, STOP and ask.
- If adding additional endpoints beyond /api/scan seems required, STOP and ask.

# Deliverables
- app/api/scan/route.ts (new)
- lib/apiClient.ts (updated analyzeScan only for real-path support)
- Scan page/component updated to use analyzeScan asynchronously
- No other page migrations in this step
