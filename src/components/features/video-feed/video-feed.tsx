'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import VideoPlayer from './video-player'
import VideoOverlay from './video-overlay'
import ProductSheet from './product-sheet'
import { useIntersection } from '@/hooks/use-intersection'
import { Loader2 } from 'lucide-react'

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: async ({ pageParam = 0 }) => {
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

      if (error) throw error
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
      void fetchNextPage()
    }
  }, [intersection?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, videos.length])

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
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
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
            <VideoOverlay video={video} onProductClick={setSelectedProduct} />
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
