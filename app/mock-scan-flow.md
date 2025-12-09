High-level context

- Tech stack: Next.js 14 (app/) + React 18 + TypeScript + Tailwind + Zustand (persist).
- Global state: store/appStore.ts.
    - Holds ScannedItem, CompItem, ResultData, items, settings (feePercent, avgShippingCost, targetRoi, minimumProfit, etc.).
    - Must remain backward compatible with existing History and Item Detail pages.
- Mock “AI” logic: lib/mockData.ts.
    - generateMockDetectedDetails() → mock OCR / attribute detection.
    - calculateMockResult(...) → mock comp search + verdict/ROI.
- Current flow:
    - /scan → shows CameraFrame and a shutter button that just navigates to /scan/confirm.
    - /scan/confirm → uses generateMockDetectedDetails() to pre-fill fields and, on “Get Buy/Pass”, builds a pendingItem, stores it in sessionStorage under "pendingItem", then navigates to /result.
    - /result → reads "pendingItem" from sessionStorage, runs calculateMockResult, and either addItem or updateItem in the Zustand store.
    - /history and /history/[id] show saved ScannedItems.

Goal for this task

Implement Phase 3: Mock Scan Flow so the app is fully usable on desktop without a real camera, using a “Pick image from device” flow and a fake camera preview, while still using all existing state management and mock logic.

Specifically:

    1. Add a desktop-friendly image selection flow to /scan.
    2. Show the selected image inside the existing CameraFrame as a fake camera preview.
    3. Ensure /scan/confirm knows about the chosen image and includes it in the pendingItem saved to sessionStorage.
    4. Keep using generateMockDetectedDetails and calculateMockResult as the mock AI pipeline.
    5. Add a small “scanning” / loading feel on Confirm to make the mock pipeline feel like an AI scan.
    6. Do not break existing history or detail pages.

Implementation steps

Please follow these steps carefully and keep changes minimal and focused.

Step 1: Update CameraFrame to support an image preview
File: components/ui/CameraFrame.tsx

- Currently this shows static corner brackets and the text “Camera Preview”.
- Change it to accept an optional prop, e.g.: type CameraFrameProps = { imageUrl?: string }
- Behavior:
    - If imageUrl is not provided:
        - Keep the current look/text (“Camera Preview”).
    - If imageUrl is provided:
        - Render the selected image filling the inner area:
            - Use a simple <img src={imageUrl} ... /> with className="w-full h-full object-cover rounded-lg" etc.
            - Keep the border/corner overlay so it still feels like a camera frame.

- Avoid introducing new dependencies (no next/image needed here).

Step 2: Add “Pick image from device” flow to /scan
File: app/scan/page.tsx

- Current behavior:
    - Shows CameraFrame.
    - handleShutter calls router.push('/scan/confirm').
- Update this page to:
    1. Hold local state for the preview image, e.g. const [previewUrl, setPreviewUrl] = useState<string | null>(null).
    2. Add a hidden file input:
        const fileInputRef = useRef<HTMLInputElement | null>(null);
        <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        />
    3. Implement handleFileChange:
        - Read the selected file using FileReader.
        - Convert it to a data: URL (base64).
        - Set previewUrl with this data URL.
        - Store it in sessionStorage under a key like "selectedImage":
            sessionStorage.setItem('selectedImage', dataUrl);
        - Navigate to /scan/confirm after the image is loaded.
    4. Change handleShutter so that:
        - Instead of immediately navigating, it triggers the hidden file input: fileInputRef.current?.click().
    5. Make sure the image icon next to the shutter allows user to pick image from device and also calls fileInputRef.current?.click().
- Use the updated CameraFrame:
    <CameraFrame imageUrl={previewUrl ?? undefined} />
- This ensures that when the user picks an image, they see a preview on the scan screen before going to Confirm. On first load, it will just show the default “Camera Preview”.

Step 3: Wire image into Confirm via sessionStorage
File: app/scan/confirm/page.tsx

- This page already:
    - Initializes detectedDetails with generateMockDetectedDetails().
    - Tracks purchasePrice, note, editingItemId.
    - On handleGetBuyPass, builds a pendingItem, stores it in sessionStorage as "pendingItem", and navigates to Result.
- We want Confirm to also:
    1. Read the selectedImage from sessionStorage on mount:
        const [imageUrl, setImageUrl] = useState<string | null>(null);

        useEffect(() => {
        const stored = sessionStorage.getItem('selectedImage');
        if (stored) setImageUrl(stored);
        }, []);
    2. Display a small image preview above the form if imageUrl exists:
        - A simple rounded rectangle with <img src={imageUrl} ... />.
        - Keep styling consistent with the rest of the app (use neutral gray backgrounds / borders).
    3. When constructing the pendingItem inside handleGetBuyPass, include this imageUrl:
        const pendingItem = {
        imageUrl: imageUrl ?? existingFallbackImage ?? '', // if you had a default before
        detectedDetails,
        purchasePrice: parsedPrice,
        note: note || undefined,
        editingItemId: editingItemId || undefined,
        };
        - Make sure this matches the PendingItem type defined in app/result/page.tsx:
            - imageUrl, detectedDetails, purchasePrice, note?, editingItemId?.
    4. After saving "pendingItem", you may optionally clear "selectedImage" from sessionStorage to avoid stale previews on later scans:
        sessionStorage.removeItem('selectedImage');
- Do not change the shape of PendingItem in result/page.tsx; just guarantee we always include a meaningful imageUrl.

Step 4: Add a “mock scanning” / loading state on Confirm
Also in app/scan/confirm/page.tsx:

- Add a transient “scanning” state so it feels like we’re doing OCR/detection:
    1. Introduce const [isScanning, setIsScanning] = useState(false);.
    2. On first mount, simulate a short scan:
        useEffect(() => {
        setIsScanning(true);
        const timer = setTimeout(() => {
            // we already have detectedDetails from generateMockDetectedDetails()
            setIsScanning(false);
        }, 600); // ~0.6s feels snappy but noticeable
        return () => clearTimeout(timer);
        }, []);
    3. In the JSX:
        - While isScanning is true:
            - Disable the form fields and the “Get Buy/Pass” button.
            - Show a subtle “Scanning item…” text and maybe a light shimmer/skeleton.
        - Once isScanning is false:
            - Render the current form as it is now.
- This doesn’t change the underlying mock logic; it just wraps it in UX.

Step 5: Verify the full flow

Please manually or programmatically check:

1. Start at /scan.
2. Click “shutter” → file picker opens.
3. Choose an image:
    - Scan page briefly shows the preview (if the navigation happens after FileReader load).
    - Confirm page:
        - Shows the same image preview at the top.
        - Shows mocked attributes from generateMockDetectedDetails().
        - Shows a short “Scanning…” state on initial mount.
4.Enter a purchase price and tap “Get Buy/Pass”:
    - pendingItem is saved to sessionStorage with the chosen imageUrl.
    - Route goes to /result.
5. On /result:
    - The page reads pendingItem (with imageUrl) from sessionStorage.
    - Calls calculateMockResult(...).
    - “Save” creates or updates a ScannedItem in the Zustand store (useAppStore).
6. Check /history and /history/[id]/{id}:
    - Cards and detail pages display the correct imageUrl for the saved item.

If anything breaks, adjust types or minor props, but do not change the structure of ScannedItem, ResultData, or history logic.

Step 6: Quality checks

- Run npm run lint and fix any TypeScript or ESLint issues.
- Make sure no runtime errors appear when running npm run dev and clicking through:
    - Onboarding → Scan → Confirm → Result → Save → History → Item detail.

Keep styling consistent with the existing Tailwind classes and color palette.

Constraints / style guidelines

- Don’t introduce new state libraries or routing patterns.
- Don’t add new dependencies beyond what’s already in package.json.
- Prefer small, surgical edits to:
    - components/ui/CameraFrame.tsx
    - app/scan/page.tsx
    - app/scan/confirm/page.tsx
- Leave store/appStore.ts and lib/mockData.ts structurally intact; they’re already aligned with the planned backend/API phase.