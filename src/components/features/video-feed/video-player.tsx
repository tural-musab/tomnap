'use client'

import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'

interface VideoPlayerProps {
  url: string
  poster?: string | null
  isActive: boolean
  onSwipe: (direction: 'up' | 'down') => void
}

export default function VideoPlayer({ url, poster, isActive, onSwipe }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isActive])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0]?.clientY ?? null
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (startY.current == null) return
      const delta = (e.changedTouches[0]?.clientY ?? startY.current) - startY.current
      if (Math.abs(delta) > 40) onSwipe(delta > 0 ? 'down' : 'up')
      startY.current = null
    }

    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [onSwipe])

  return (
    <video
      ref={videoRef}
      src={url}
      poster={poster ?? undefined}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
    />
  )
}
