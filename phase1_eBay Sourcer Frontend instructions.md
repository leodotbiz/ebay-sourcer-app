# eBay Sourcer – Frontend Instructions

## 0. Overview

eBay Sourcer is a **mobile-first web app** that helps resellers decide whether to **buy or pass** on items while sourcing in-store.

Primary flow:

1. User completes **quick onboarding** (marketplace, fees, shipping, ROI).
2. App opens on the **Scanner** (camera home).
3. User snaps a photo of an item + price tag.
4. User lands on **Confirm Details** to edit detected info and enter purchase price.
5. User taps **“Get Buy/Pass”** to see the **Result & Recommendation** screen.
6. User can **save** the item and later review it from **History** and **Item Detail**.

**Important:** Focus only on **frontend UI/UX**. All AI/comp logic can be mocked.

**Source of truth:**  
This markdown file is the canonical spec. The attached screenshots are visual references. Where there is any conflict, **follow this spec**, including the layout optimizations described below.

---

## 1. Tech Stack & Project Setup

- Next.js (App Router) with TypeScript.
- Tailwind CSS for styling.
- Mobile-first, single-column layout that looks good on ~390–430px width.
- Use a global `<ScreenContainer>` to center content and constrain max width on desktop.

---

## 2. Design System & Shared Components

Implement these shared UI components first:

1. **Button**
   - Variants: `primary` (filled dark navy), `secondary` (outline), `ghost`.
   - Supports `fullWidth` boolean.

2. **TextField / NumberField**
   - Label, optional helper text, optional error text.
   - Optional left prefix (e.g. `$`, `%`).

3. **Slider**
   - For ROI target.
   - Shows current value (e.g. `2.5x`) near the slider.

4. **Pill / Chip**
   - Used for marketplace selection and History filter tabs.
   - Props: `label`, `active`.

5. **ProgressDots**
   - For onboarding step indicator (4 steps).

6. **BottomNav**
   - Three items: History, Scan, Settings.
   - Center Scan item is visually primary (larger camera icon, filled circular background).
   - Takes an `activeTab` prop.

7. **TopBar**
   - Optional back button, title, optional right action (e.g. “Reshoot”).

8. **CameraFrame (placeholder)**
   - For now, a dark container with corner brackets and “Camera Preview” text.

---

## 3. Navigation Model

Use client-side routing:

- `/onboarding` – handles all onboarding steps.
- `/scan` (or `/`) – default home after onboarding.
- `/scan/confirm` – Confirm Details after a photo is “taken”.
- `/result` – Result & Recommendation screen (see spec below).
- `/history` – list of saved items.
- `/history/[id]` – Item Detail screen for a specific item.
- `/settings` – Settings screen.

Bottom nav:

- History → `/history`
- Scan → `/scan`
- Settings → `/settings`

---

## 4. Global State (v1)

Use React Context or a small state library (e.g., Zustand) to store:

- `primaryMarketplace`
- `feePercent`
- `avgShippingCost`
- `targetRoi`
- `minimumProfit`
- `items` (array of scanned items with id, fields, verdict, etc.)

Persistence (localStorage) is optional in v1; implement if time allows.

---

## 5. Screens

### 5.1 Onboarding (`/onboarding`)

Four internal steps, using `ProgressDots` at the top.

#### Step 1 – Welcome

- Content:
  - Camera icon in a soft square.
  - Heading: **“Snap. Scan. Decide.”**
  - Subcopy: “Faster sourcing decisions for professional resellers.”
- Actions:
  - Primary: **“Set up in 60 seconds”** → Step 2.
  - Text button: **“Skip for now”** → go directly to `/scan` with safe defaults.
- Layout:
  - Reduce excessive top white space vs mock; keep content in middle of screen.

#### Step 2 – Primary marketplace

- Title: “Where do you sell?”
- Subcopy: “We’ll use this to find relevant comps.”
- Options rendered as **selectable cards/pills**:
  - eBay (default selected)
  - Poshmark
  - Other
- Visual behavior:
  - Selected card has darker background and checkmark.
- Primary button: **“Next”** (disabled until one option selected).

#### Step 3 – Fees & Shipping

- Title: “Fees & Shipping”
- Subcopy: “Your defaults for profit calculation.”
- Fields (required):
  - **Average total fees (%)**
    - TextField with `%` prefix.
    - Helper: “Marketplace + payment + other fees.”
  - **Average shipping cost ($)**
    - TextField with `$` prefix.
    - Helper: “Typical label cost for a shirt/soft good.”
- Primary button: **“Next”** (validated).

#### Step 4 – Target ROI

- Title: “Target ROI”
- Subcopy: “Minimum return you look for.”
- Centered large value: `2.5x` (tap or slider change).
- Slider:
  - Range: 1.5x – 5.0x (step 0.1).
- Helper text:
  - “We’ll lean toward PASS when expected ROI is below this.”
- Primary button: **“Finish & Start Scanning”** → `/scan`.

---

### 5.2 Scanner (Home) (`/scan`)

This is the **primary home screen**.

- Background: dark navy full-screen.
- Top:
  - Small “SCANNER” pill in top left.
  - Flash icon/button in top right (non-functional stub is fine).
- Middle:
  - `CameraFrame` placeholder with white corner brackets.
  - Text in center: “Camera Preview”.
- Just below frame:
  - Small rounded pill: “Frame item & price tag”.
- Bottom (above nav):
  - Large circular camera shutter button in center.
  - Optional small gallery icon to the left (for future “import photo”).
- BottomNav with `activeTab="scan"`.

Behavior:

- When user taps shutter, navigate to `/scan/confirm` with a mock image.

---

### 5.3 Confirm Details (`/scan/confirm`)

Objective: edit detected fields, enter purchase price, then request recommendation.

Layout:

- **TopBar**:
  - Back arrow (to `/scan`).
  - Title: “Confirm Details”.
- Below TopBar:
  - Image preview (mock photo) across full width; height not too tall so form fields are mostly visible.
  - Overlaid in bottom-right corner of image: small pill button **“Reshoot”** (no-op for now).
- Main content: white bottom-sheet style panel sticking up over dark background.

#### Panel sections

1. **“Detected details” section**
   - Microcopy: “Edit anything that looks off before we search comps.”
   - Fields:
     - Brand (TextField)
     - Category (Select or TextField, e.g. “Men’s Shirt”)
     - Size (TextField, e.g. “L”)
     - Condition (Select: New / Like New / Excellent / Good / Fair)
     - Color (TextField, e.g. “Blue Plaid”)
   - Arrange in a single column for simplicity; reduce vertical spacing so more is visible above the fold.

2. **“Price & notes” section**
   - **Purchase price** (NumberField with `$` prefix) – required.
   - **Quick note (Optional)** – TextField with placeholder “e.g. Small stain on cuff”.

#### Primary CTA (important optimization)

- Add a **full-width, sticky primary button** at the bottom of the panel:
  - Label: **“Get Buy/Pass”**
  - Always visible above BottomNav (even when scrolled to bottom).
- Button disabled if purchase price is empty or 0.

BottomNav remains visible with `activeTab="scan"`.

Behavior:

- On click of “Get Buy/Pass”, for v1, navigate to `/result` with mock calculated data.

---

### 5.4 Result & Recommendation (`/result`)

> **Non-negotiable for v1:** This screen must be implemented even though it isn’t shown in the current screenshots. This is where the user gets the BUY / PASS decision.

Use a light background (white) with content in a single column.

Sections (in order):

1. **Verdict card**
   - Large centered label: `BUY`, `MAYBE`, or `PASS`.
   - Color:
     - BUY: green background/badge.
     - MAYBE: amber.
     - PASS: red.
   - Subtext:
     - BUY: “Strong margin, even with conservative comps.”
     - MAYBE: “Borderline — worth a closer look.”
     - PASS: “Low margin or weak comps. Probably not worth it.”

2. **Key numbers row**
   - Three horizontally arranged stat cards (stack vertically on very narrow screens):
     - **Expected resale price** – e.g. “$35–$42”
       - Subtext: “Based on similar sold listings.”
     - **Estimated net profit** – e.g. “+$18”
       - Subtext: “After your fees & shipping.”
     - **ROI** – e.g. “3.2x”
       - Subtext: “Target: 2.5x”

3. **Time-to-sell band**
   - Text: “Likely to sell in **30–60 days**.”
   - Subtext: “Based on sell-through of similar items.”

4. **Assumptions strip**
   - Small pill or line:
     - “Using: eBay · Fees 15% · Shipping $5.50 · Min ROI 2.5x”
   - Tapping this can open a small modal or just link to `/settings` (v1: simple link).

5. **Confidence indicator**
   - Badge: High / Medium / Low confidence.
   - Microcopy explaining what that means.

6. **Comps list**
   - For v1, mock array of 3–5 comps.
   - Each comp row:
     - Thumbnail (placeholder image).
     - Title (two lines max).
     - “Sold: $34.99 · Oct 15”.
     - Similarity tag: “Very similar / Similar / Loose match”.
     - Two small icon buttons: 👍 (Good match), 👎 (Bad match) – these can be non-functional.

7. **Footer actions**
   - Primary full-width button: **“Save item”**
     - On press, open small modal or inline options to choose status:
       - `Purchased` (default)
       - `Considering`
   - Secondary text button: **“Rescan / adjust details”** → goes back to `/scan/confirm`.

BottomNav with `activeTab="scan"`.

---

### 5.5 History (`/history`)

Layout:

- Top: title **“History”**.
- Below: filter chips in a horizontal row:
  - All (default active)
  - Purchased
  - Considering
  - Sold
- If there are no items:
  - Empty state:
    - Icon (search glass).
    - “No scans yet”.
    - Subtext: “Your saved items will appear here.”
    - Ghost button: **“Scan your first item”** → `/scan`.
- If items exist:
  - List of cards. Each card:
    - Left: small thumbnail.
    - Center:
      - First line: `[Brand] [Category]` (e.g., “J.Crew Men’s Shirt”).
      - Second line: “Buy price: $7.99 · Saved: Nov 25”.
    - Right:
      - Verdict pill (BUY / MAYBE / PASS).
      - Small chevron indicating it’s clickable.
  - Clicking a card → `/history/[id]` (Item Detail).

BottomNav with `activeTab="history"`.

---

### 5.6 Item Detail (`/history/[id]`)

> **Also non-negotiable for v1.** Even if data is mocked, this view must exist so we can test the end-to-end flow.

Layout:

- TopBar with back arrow and title: Brand + category.
- Main sections:

1. **Header**
   - Larger image (same photo as scan).
   - Verdict pill (BUY/MAYBE/PASS).
   - Status pill: Purchased / Considering / Sold.

2. **Key details**
   - Display as a simple definition list or cards:
     - Purchase price.
     - Expected resale price range.
     - Net profit & ROI.
     - Time-to-sell band.
     - Marketplace used.

3. **Notes**
   - Show any quick note (e.g. “Small stain on cuff”).

4. **Comps used**
   - Same comp cards as Result screen, but static.

5. **Actions**
   - Button: **“Mark as Sold”** (for now, can just toggle status and expose a simple modal with sold price + date fields).
   - Button: **“Edit details”** (can re-open `/scan/confirm` pre-filled with this item’s data, or a simple inline edit for v1).

BottomNav, likely with activeTab `"history"`.

---

### 5.7 Settings (`/settings`)

Sections:

1. **Fees & Shipping**
   - Heading: “Fees & Shipping”.
   - Fields:
     - **Average total fees (%)** – matches onboarding value.
     - **Average shipping cost ($)** – matches onboarding.
   - Helper text under each, same as onboarding.

2. **ROI Targets**
   - **Minimum target ROI** – Slider with label on the right (e.g. “2.5x”).
   - **Minimum profit ($)** – NumberField.
   - Helper: “We’ll lean toward PASS if expected profit is below this.”

3. **Account**
   - Placeholder “Sign Out” button (non-functional is fine).
   - Version text “Version 1.0.0” in small, muted font at bottom.

BottomNav with `activeTab="settings"`.

---

## 6. Implementation Notes

- **Screenshots vs spec:**  
  When coding, use the attached screenshots for typography and general look, but apply the adjustments above:
  - Less empty whitespace on onboarding.
  - Purchase price + “Get Buy/Pass” clearly visible on Confirm Details.
  - Explicit Result & Item Detail screens even though they’re not in the screenshot set.
- **Mock data:**  
  For v1, hard-code or randomly generate comp data, verdict, profit numbers, etc. The focus is on **layout and user flow**, not correctness.
- **Accessibility:**  
  - Ensure primary buttons are obvious.
  - Use clear labels for all fields.

---
