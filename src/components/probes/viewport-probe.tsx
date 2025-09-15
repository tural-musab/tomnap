'use client'
import { useEffect } from 'react'

export default function ViewportProbe() {
  useEffect(() => {
    const write = () => {
      document.cookie = `vw=${window.innerWidth}; Path=/; SameSite=Lax`
    }
    write()
    window.addEventListener('resize', write)
    return () => window.removeEventListener('resize', write)
  }, [])
  return null
}
