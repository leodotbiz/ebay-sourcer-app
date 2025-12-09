import { redirect } from 'next/navigation'

export default function Home() {
  // For now, always send users straight to the scanner
  redirect('/scan')
}