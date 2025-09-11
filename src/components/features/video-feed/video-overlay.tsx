'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Verified } from 'lucide-react'

interface CreatorInfo {
  id: string
  username: string
  avatar_url: string | null
  is_verified: boolean
  follower_count: number
}

interface ProductBrief {
  id?: string
  title?: string
}

interface VideoOverlayProps {
  video: { creator?: CreatorInfo; video_products?: Array<{ product?: ProductBrief }> }
  onProductClick: (p: ProductBrief) => void
}

export default function VideoOverlay({ video, onProductClick }: VideoOverlayProps) {
  const products = useMemo(() => {
    const vp = video?.video_products ?? []
    return vp.map((p) => p.product).filter(Boolean) as ProductBrief[]
  }, [video])

  const creator = (video?.creator ?? {}) as CreatorInfo

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
      <div className="flex items-center gap-2 text-white">
        <div className="h-10 w-10 rounded-full bg-white/20" />
        <div className="flex items-center gap-1">
          <span className="font-semibold">@{creator.username}</span>
          {creator.is_verified ? <Verified className="h-4 w-4 text-sky-400" /> : null}
          <Badge variant="secondary" className="ml-2 pointer-events-auto">
            {creator.follower_count} takipçi
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {products.slice(0, 3).map((p, i) => (
            <Button
              key={i}
              size="sm"
              variant="secondary"
              className="pointer-events-auto"
              onClick={() => onProductClick(p)}
            >
              {p?.title ?? 'Ürün'}
            </Button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-white pointer-events-auto">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 text-white border-0"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 text-white border-0"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 text-white border-0"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
