A. Startup routing & onboarding

File: app/page.tsx

1. Make app/page.tsx a client component.
2. Use useAppStore to read onboardingCompleted.
3. Use useRouter and useEffect:
    - If onboardingCompleted is false, router.replace('/onboarding').
    - Else, router.replace('/scan').
4. While deciding, render a simple centered “Loading…” or spinner—never render a blank screen.

File: app/onboarding/page.tsx

5. Ensure the final CTA (“Finish & Start Scanning”) does:

    - setOnboardingCompleted(true) in the store.
    - router.replace('/scan').

Result: opening / always lands on either onboarding (first-time) or scan (returning), never the weird blank view.

B. Bottom nav redesign (make camera tab a normal tab)

File: components/ui/BottomNav.tsx

Goal: All three items are tabs, not two tabs + floating shutter.

1. Keep 3 nav items: History, Scan, Settings.
2. Use a data array:
    const navItems = [
        { href: '/history', label: 'History', icon: HistoryIcon },
        { href: '/scan', label: 'Scan', icon: CameraIcon },
        { href: '/settings', label: 'Settings', icon: SettingsIcon },
    ]
3. Use usePathname() to detect the active tab.
4. Layout:
    - Parent wrapper: absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200
    - Inner: flex justify-around py-2
5. For each tab:
    - Wrapper button: flex flex-col items-center gap-1 text-xs
    - When active: text-slate-900 + maybe small pill:
        className={cn(
            "flex flex-col items-center gap-1 text-xs",
            isActive && "text-slate-900"
        )}
    - The camera tab should look like the others—no big round dark circle anymore. If you want it a bit special, just give it a slightly bolder icon or small filled pill when active, not a giant button.

Result: users understand that the middle icon is “go to scan,” not “take a photo right now.”

C. CTA bar borders & spacing

1. Confirm page “Get Buy/Pass” bar
File: app/scan/confirm/page.tsx

Find the CTA container:
    <div className="absolute bottom-20 left-0 right-0 px-6 pb-4 bg-white border-t border-gray-200">
Change it to something softer:
    <div className="absolute bottom-20 left-0 right-0 px-6 pb-4 bg-white shadow-[0_-2px_6px_rgba(15,23,42,0.08)]">

- Remove border-t (hides the grey line hugging the button).
- Add a very light upward shadow so it still separates from content.

2. BottomNav separation
File: components/ui/BottomNav.tsx

On the outer wrapper:
    <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700">
Change to something lighter:
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200">

Result: Now the separation between app & nav is still there, but not a heavy navy bar.