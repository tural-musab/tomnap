'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import VideoPlayer from './video-player'
import VideoOverlay from './video-overlay'
import ProductSheet from './product-sheet'
import { useIntersection } from '@/hooks/use-intersection'
import { usePerformanceMonitor } from '@/lib/performance'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CreatorInfo {
  id: string
  username: string
  avatar_url: string | null
  is_verified: boolean
  follower_count: number
}

interface Product {
  id: string
  title: string
  description?: string | null
  price?: number | null
}

interface VideoWithProducts {
  id: string
  hls_url: string | null
  video_url: string
  thumbnail_url: string
  creator: CreatorInfo
  video_products: Array<{ product?: Product }>
}

export default function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { recordUserAction, startTimer, endTimer, recordMetric } = usePerformanceMonitor()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: async ({ pageParam = 0 }) => {
      startTimer('video_fetch')
      
      const { data, error } = await supabase
        .from('videos')
        .select(
          `*,
          creator:profiles!creator_id(
            id, username, avatar_url, is_verified, follower_count
          ),
          video_products(*, product:products(*))`
        )
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(pageParam * 10, (pageParam + 1) * 10 - 1)

      endTimer('video_fetch')
      
      if (error) {
        recordMetric({
          name: 'video_fetch_error',
          value: 1,
          labels: { error: error.code || 'unknown' }
        })
        throw error
      }
      
      recordMetric({
        name: 'video_fetch_count',
        value: data?.length || 0
      })
      
      return data as unknown as VideoWithProducts[]
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < 10) return undefined
      return pages.length
    },
    initialPageParam: 0,
  })

  const videos = (data?.pages.flat() as VideoWithProducts[]) ?? []
  const currentVideo = videos[currentIndex]

  const lastVideoRef = useRef<HTMLDivElement>(null)
  const intersection = useIntersection(lastVideoRef, {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
  })

  useEffect(() => {
    if (intersection?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      recordUserAction('infinite_scroll', { page: data?.pages.length || 0 })
      void fetchNextPage()
    }
  }, [intersection?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, recordUserAction, data?.pages.length])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        recordUserAction('video_navigate', { direction: 'down', from: currentIndex, to: currentIndex + 1 })
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
        recordUserAction('video_navigate', { direction: 'up', from: currentIndex, to: currentIndex - 1 })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, videos.length, recordUserAction])

  const handleSwipe = useCallback(
    (direction: 'up' | 'down') => {
      if (direction === 'up' && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (direction === 'down' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    },
    [currentIndex, videos.length]
  )

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-muted">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-black text-white">
        <p className="text-sm text-white/80">Akış yüklenirken bir sorun oluştu.</p>
        <button
          className="rounded-xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20 hover:bg-white/20"
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
        >
          Yeniden dene
        </button>
      </div>
    )
  }

  if (!isLoading && videos.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-black text-white">
        <div className="mb-3 text-lg font-semibold">Henüz video yok</div>
        <div className="text-sm text-white/70 mb-5">Keşfet bölümüne gidip ürün ve videolara göz at.</div>
        <div className="flex gap-3">
          <Link href="/explore" className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium">
            Keşfet’e git
          </Link>
          <button
            className="rounded-xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20 hover:bg-white/20"
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
          >
            Yenile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black overflow-hidden relative" ref={containerRef}>
      <div
        className="h-full transition-transform duration-300"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={index === videos.length - 1 ? lastVideoRef : null}
            className="h-screen relative"
          >
            <VideoPlayer
              url={video.hls_url ?? video.video_url}
              poster={video.thumbnail_url}
              isActive={index === currentIndex}
              onSwipe={handleSwipe}
            />
            <VideoOverlay
              video={video}
              onProductClick={(p) =>
                setSelectedProduct({ id: p.id, title: p.title, description: null, price: null })
              }
            />
          </div>
        ))}
      </div>

      {isFetchingNextPage ? (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      ) : null}

      {selectedProduct ? (
        <ProductSheet
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      ) : null}
    </div>
  )
}
