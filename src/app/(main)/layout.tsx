import type { ReactNode } from 'react'
import MobileShell from '@/components/features/mobile-shell/mobile-shell'
// ErrorBoundary kaldırıldı: Server Action'lar client boundary altında sorun çıkarıyordu

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <MobileShell>{children}</MobileShell>
      </div>
      <div className="hidden md:block">{children}</div>
    </>
  )
}
