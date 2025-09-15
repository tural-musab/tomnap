import type { ReactNode } from 'react'

interface ResponsiveSlotsProps {
  mobile: ReactNode
  desktop: ReactNode
}

export default function ResponsiveSlots({ mobile, desktop }: ResponsiveSlotsProps) {
  return (
    <>
      <section className="block md:hidden">{mobile}</section>
      <section className="hidden md:block">{desktop}</section>
    </>
  )
}
