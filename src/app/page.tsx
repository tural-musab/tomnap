import Navigation from '@/components/landing/Navigation'
import Hero from '@/components/landing/Hero'
import Stats from '@/components/landing/Stats'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import PWAInstallPrompt from '@/components/pwa-install-prompt'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// PWA Install Prompt

export default async function HomePage() {
  const h = await headers()
  const chMobile = h.get('sec-ch-ua-mobile')
  const ua = h.get('user-agent') ?? ''
  const isMobileUserAgent = (u: string): boolean => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(u)
  const isMobile = chMobile === '?1' || isMobileUserAgent(ua)

  // Mobil cihazlarda feed'e yönlendir
  if (isMobile) {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/20 dark:to-pink-950/20">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
      <PWAInstallPrompt />
    </div>
  )
}
