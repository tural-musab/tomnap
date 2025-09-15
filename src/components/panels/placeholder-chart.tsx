'use client'
import { useEffect, useRef } from 'react'

export default function PlaceholderChart() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const el = document.createElement('div')
    el.className = 'h-40 rounded bg-black/40 ring-1 ring-white/10'
    ref.current.appendChild(el)
  }, [])
  return <div ref={ref} />
}
