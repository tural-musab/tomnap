import type { ReactNode } from 'react'
import MobileShell from '@/components/features/mobile-shell/mobile-shell'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="md:hidden">
        <MobileShell>{children}</MobileShell>
      </div>
      <div className="hidden md:block">
        {children}
      </div>
    </>
  )
}
