import type { ReactNode } from 'react'
import MobileShell from '@/components/features/mobile-shell/mobile-shell'
import ErrorBoundary from '@/components/error-boundary'

interface MainLayoutProps { children: ReactNode }

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <ErrorBoundary isolate>
          <MobileShell>{children}</MobileShell>
        </ErrorBoundary>
      </div>
      <div className="hidden md:block">
        <ErrorBoundary isolate>
          {children}
        </ErrorBoundary>
      </div>
    </>
  )
}
