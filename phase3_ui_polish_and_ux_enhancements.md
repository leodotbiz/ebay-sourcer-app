# Phase 4 – UI Polish & UX Enhancements  
High-End Reseller Buy/Pass Scanner

> **Scope:** Frontend-only improvements on top of the existing mock flow. No real AI or backend integrations in this phase. Focus is on polish, clarity, and preparing clean seams for Phase 5.

---

## 1. Phase 4 Goals

1. Make **sold items** visually and informationally clear across Item Detail and History (including realized performance).
2. Improve **History UX** so it’s more informative at a glance and feels snappy on mobile.
3. Reintroduce **Onboarding + gating** from `/` in a robust, type-safe way.
4. Add small but meaningful **UX polish** (transitions, loading states, accessibility).
5. Prepare **API contracts + types** so Phase 5 can plug in a real backend/AI with minimal refactor.

---

## 2. Recommended Model Usage (for Cursor)

- **Auto**  
  Small/localized UI tweaks, copy changes, tiny style adjustments.

- **Sonnet 4.5**  
  Primary model for Phase 4. Use for most feature work: new UI sections, wiring props, Zustand updates, and refactors that touch multiple files but remain in the frontend.

- **Opus 4.5 (or highest-tier model)**  
  Use selectively for:
  - Designing clean API contracts and TS types that will age well.
  - Refactors that touch store types, multiple pages, and shared utilities at once.
  - Any non-trivial architectural changes around swapping mocks ↔ future backend.

---

## 3. Detailed Task Breakdown

### 3.1 Item Detail & Sold-State Enhancements

**Objective:** Make the sold state meaningful and visible: when/for how much an item sold, and how it performed vs expectations.

---

#### 3.1.1 Add “Sold Summary” section on Item Detail

**What to do**

- On `/history/[id]` Item Detail:
  - If `status === 'Sold'` and `soldPrice` exists, show a **Sold summary** block near the top (under verdict/status badges), e.g.:

  - Line 1 (primary):  
    `Sold on {formattedSoldDate} for ${soldPrice}`

  - If `soldDate` is missing but `status === 'Sold'`, default to “Sold (date not recorded)” or use the date already being stored by the modal logic.

**Implementation hints**

- Add a helper `formatDate` utility if not already present (for consistent `MMM D, YYYY` style).
- Ensure this block is **not** shown for non-sold items.

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- Sold items show a clear sold line on Item Detail.
- Non-sold items show no sold line.
- Types remain consistent and there are no TS/ESLint errors.

---

#### 3.1.2 Show “Realized ROI” for Sold Items

**What to do**

- On Item Detail, when `status === 'Sold'` and both `purchasePrice` and `soldPrice` are defined:
  - Compute a **realized ROI**:
    - `realizedRoi = soldPrice / purchasePrice`
  - Optionally compute realized net profit:
    - For now, keep it simple: `realizedNetProfit = soldPrice - purchasePrice`  
      (ignore fees/shipping for this phase, or clearly label that fees aren’t applied).
  - Display this in a “Performance vs Purchase” section:

  Example:
  - `Realized ROI: 3.2x`
  - `Realized Profit: +$45.00`

- Use the same positive/negative formatting style as the Result/History pages (`+$X.XX` / `-$X.XX`).

**Implementation hints**

- Add helpers for:
  - `formatCurrency(value: number): string`
  - `formatMultiplier(value: number): string` (e.g., `3.2x`)
- If `purchasePrice` is 0 or missing, **do not** render the realized ROI section.

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- Sold items show realized ROI & profit.
- Values look correct in simple test scenarios.
- No change in behavior for non-sold items.

---

#### 3.1.3 (Optional) Show performance vs predicted range

**What to do**

- If `status === 'Sold'`, `soldPrice` exists, and `result?.expectedResaleMin/Max` exist:
  - Determine a simple performance label:
    - `soldPrice > expectedResaleMax` → “Above predicted range”
    - `soldPrice < expectedResaleMin` → “Below predicted range”
    - Otherwise → “Within predicted range”
  - Show a small badge or line underneath the realized ROI section:

    Example:
    - `"Performance: Above predicted range"`

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- Performance label appears only when all required data exists.
- Logic matches thresholds as specified.

---

### 3.2 History Card Improvements

**Objective:** Make the History list more informative at a glance, especially for sold items, while keeping the UI compact and mobile-friendly.

---

#### 3.2.1 Enhance History cards for Sold items

**What to do**

- On `/history` cards:
  - For items with `status === 'Sold'` and `soldPrice`:
    - Show a short line like:
      - `"Sold for $X on Dec 10"` under the title or near the status badge.
  - For non-sold items, keep the current summary but ensure:
    - Verdict badge, status badge, and key financial summary remain visible.

**Implementation hints**

- Reuse the same date formatting helper used in Item Detail.
- Make sure card layout doesn’t break on small screens (wrap text gracefully, avoid overflow).

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- Sold items clearly show sold price + date on cards.
- Layout looks good on narrow widths (e.g., iPhone emulation).
- No regressions for non-sold items.

---

#### 3.2.2 Verify and refine filter behavior

**What to do**

- Confirm existing filters (verdict or status) still:
  - Filter correctly for large and small datasets.
  - Show a clear “active” state on the selected filter pill.
- If only verdict filters exist right now, consider adding **status filters**: All / Considering / Purchased / Sold.
  - Ensure UX stays simple; use pill-style buttons with wrapping and no horizontal scrollbars.

**Recommended model:**  
- Simple adjustments: **Auto**  
- If adding **new filter modes + state logic**: **Sonnet 4.5**

**Definition of done**

- Filters are intuitive and visually clear.
- Switching filters feels instant and doesn’t cause layout jank.
- No console errors and TypeScript is happy.

---

### 3.3 Onboarding & Gating from `/`

**Objective:** Reintroduce onboarding so first-time users see `/onboarding` and returning users land directly on `/scan`.

---

#### 3.3.1 Implement gating logic using `localStorage`

**What to do**

- In the root route or layout that controls `/`:
  - Implement logic that:
    - Checks `localStorage.getItem('hasSeenOnboarding')`.
    - If **not set**, redirect to `/onboarding`.
    - If **set**, redirect to `/scan`.
- In the onboarding flow:
  - On the final “Get Started” / “Continue” action:
    - Set `localStorage.setItem('hasSeenOnboarding', 'true')`.
    - Navigate to `/scan`.

**Implementation hints**

- Because `localStorage` is not available on the server, ensure this logic:
  - Runs only on the client (e.g., use a small client component that handles redirect in `useEffect`, or a client layout wrapper).
- Keep the logic isolated and testable, e.g., a small hook or utility for onboarding gating.

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- On a fresh browser (no `hasSeenOnboarding` flag), navigating to `/` shows onboarding first.
- Completing onboarding leads to `/scan`.
- Refreshing the app afterwards skips onboarding and lands on `/scan`.
- No hydration or “window is not defined” errors.

---

#### 3.3.2 Ensure onboarding screens feel cohesive with current design

**What to do**

- Light visual pass on `/onboarding`:
  - Confirm typography and spacing match the rest of the app (Tailwind classes, mobile-first).
  - Update copy if needed to better explain:
    - Scanning items
    - Confirming details
    - Getting Buy/Pass decisions
    - Saving to history and marking as sold

**Recommended model:**  
- For purely visual/tailwind tweaks: **Auto**

**Definition of done**

- Onboarding feels like part of the same product.
- No structural changes that would break navigation or gating.

---

### 3.4 Micro-Polish on Scan / Confirm / Result

**Objective:** Make the core scan → confirm → result experience feel smoother and more “app-like” with minimal complexity.

---

#### 3.4.1 Add basic page transitions

**What to do**

- Add **subtle transitions** when navigating between:
  - `/scan` → `/scan/confirm`
  - `/scan/confirm` → `/result`
  - `/result` → `/history`
- Prefer a simple approach that doesn’t require heavy animation libs:
  - CSS-based fade/slide transitions, or
  - Small framer-motion-like wrappers if already in use.

**Constraints**

- Keep it lightweight and not brittle.
- Ensure transitions do not interfere with routing or cause double-scrollbars.

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- Transitions are perceptible but not annoying.
- No regressions in navigation speed or responsiveness.

---

#### 3.4.2 “Scanning” / “Fetching comps” lightweight loading state

**What to do**

- When user taps **“Get Buy/Pass”**:
  - Show a short intermediate state:
    - Example: a small overlay or inline spinner with text like “Analyzing comps…” for 300–800ms.
  - This can be a fake delay for now (setTimeout) to simulate real network/AI latency.

**Implementation hints**

- Add a `isProcessingResult` or similar piece of state in the Confirm or Result flow.
- Keep durations short; this is about **feedback**, not long blocking.

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- User gets immediate feedback after tapping “Get Buy/Pass”.
- No double-submissions or stuck states.
- “Get Buy/Pass” button is disabled while processing.

---

#### 3.4.3 Accessibility & focus states

**What to do**

- Add ARIA labels where appropriate:
  - Camera shutter button.
  - Thumbnail button.
  - Filter pills and status toggles.
- Ensure:
  - Modals (e.g., Mark as Sold) trap focus while open.
  - Primary actions are reachable via keyboard.
- Confirm high-contrast focus outlines or tailored focus styles on interactive elements.

**Recommended model:** **Sonnet 4.5**  
**Definition of done**

- Basic keyboard navigation works across major flows.
- Screen readers have useful labels for key controls (camera, save buttons, close buttons, etc.).
- No a11y-related console warnings introduced.

---

### 3.5 Prep for Phase 5 – API Contracts & Mock Abstraction

**Objective:** Define clean TypeScript contracts and an abstraction layer so Phase 5 can plug in real AI/backend without rewriting UI.

---

#### 3.5.1 Define TypeScript interfaces for API contracts

**What to do**

- In a central file (e.g., `lib/apiTypes.ts`), define interfaces for:

  1. **Scan detection**  
     - `ScanRequest`: basic info about the scan (at minimum an `imageId` or placeholder field).  
     - `ScanResponse`: maps to what is currently `DetectedDetails` + any metadata.

  2. **Comps fetching**  
     - `CompsRequest`: item attributes (brand, category, etc.) + marketplace/platform.  
     - `CompsResponse`: a list of `CompItem` in a shape compatible with current UI.

  3. **Verdict calculation**  
     - `VerdictRequest`: purchase price, detected attributes, and settings (fee%, shipping, targetRoi, minimumProfit).  
     - `VerdictResponse`: maps closely to `ResultData` (verdict, resale range, net profit, roi, confidence, timeToSell, comps, assumptionsSummary).

- Ensure these interfaces **reuse** existing internal types where appropriate (e.g., `ResultData`, `CompItem`) to avoid duplication.

**Recommended model:** **Opus 4.5 (or highest-tier model)**  
**Definition of done**

- A single source of truth TS file defines all API request/response shapes.
- Existing types are updated to align where needed, without breaking the current mock flow.
- Type names are clear and future-proof.

---

#### 3.5.2 Create a thin abstraction layer for mock vs real

**What to do**

- Create an `apiClient` module (e.g., `lib/apiClient.ts`) that exposes async functions:

  - `analyzeScan(request: ScanRequest): Promise<ScanResponse>`
  - `fetchComps(request: CompsRequest): Promise<CompsResponse>`
  - `getVerdict(request: VerdictRequest): Promise<VerdictResponse>`

- For Phase 4:
  - Implement these functions using the existing **mock** functions in `lib/mockData.ts` (or equivalent).
  - Accept a simple `useMock` flag or environment-based toggle to make future backend swap easy.

- Update the current flow so UI components (Confirm/Result) call **only** through this `apiClient`, not directly into mock helpers.

**Recommended model:** **Opus 4.5 (or highest-tier model)**  
**Definition of done**

- All UI calls for detection/comps/verdict go through `apiClient`.
- Mock behavior remains identical to Phase 3 (same results, just new plumbing).
- Swapping implementations later (mock ↔ real API) becomes straightforward.

---

## 4. Explicitly Out of Scope for Phase 4

- No real **camera integration** (still using file picker / mock).
- No real **backend** or **AI models** (that’s Phase 5).
- No **authentication**, user accounts, or multi-device sync.
- No changes to pricing/ROI algorithms beyond what’s necessary to show realized performance for sold items.

---

## 5. Suggested Implementation Order (for Cursor)

1. **Onboarding gating** (3.3) – align navigation before adding more UI complexity.
2. **Sold-state enhancements** (3.1) – makes existing flows feel more complete.
3. **History improvements** (3.2) – better overview for users with multiple items.
4. **Micro-polish (UX + a11y)** (3.4) – animations, loading, and accessibility.
5. **API contracts + abstraction** (3.5) – set up clean seams for Phase 5.

> This order keeps risk low: stabilize navigation, then enhance visuals & UX, then lock in the contracts for the future backend.
