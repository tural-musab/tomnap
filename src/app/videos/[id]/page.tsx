import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'

type AnyPromise = Promise<unknown>

async function getVideo(id: string) {
  const supabase = await createClient()

  const { data: video, error } = await supabase
    .from('videos')
    .select(
      `
      *,
      creator:profiles!creator_id(
        id, 
        username, 
        full_name,
        avatar_url,
        is_verified,
        follower_count
      ),
      video_products(
        *,
        product:products(*)
      )
    `
    )
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error || !video) {
    return null
  }

  return video
}

export async function generateMetadata({ params }: { params?: AnyPromise }): Promise<Metadata> {
  const p = (params ? await params : undefined) as { id?: string } | undefined
  const video = p?.id ? await getVideo(p.id) : null

  if (!video) {
    return {
      title: 'Video Bulunamadı',
      description: 'Aradığınız video mevcut değil veya kaldırılmış.',
    }
  }

  const v = video as any
  const videoTitle = v.title || 'TomNAP Video'
  const videoDescription =
    v.description ||
    `${v.creator?.full_name || v.creator?.username || 'Anonim'} tarafından paylaşılan video`
  const creatorName = v.creator?.full_name || v.creator?.username || 'TomNAP Creator'

  return {
    title: videoTitle,
    description: videoDescription,
    keywords: [
      videoTitle,
      creatorName,
      'TomNAP video',
      'sosyal ticaret',
      'video alışveriş',
      ...(v.tags || []),
    ],
    openGraph: {
      title: videoTitle,
      description: videoDescription,
      url: `https://tomnap.com/videos/${v.id}`,
      siteName: 'TomNAP',
      images: v.thumbnail_url
        ? [
            {
              url: v.thumbnail_url,
              width: 1200,
              height: 630,
              alt: videoTitle,
            },
          ]
        : [],
      locale: 'tr_TR',
      type: 'video.other',
      videos: [
        {
          url: v.video_url,
          secureUrl: v.video_url,
          type: 'video/mp4',
          width: 1080,
          height: 1920,
        },
      ],
    },
    twitter: {
      card: 'player',
      title: videoTitle,
      description: videoDescription,
      images: v.thumbnail_url ? [v.thumbnail_url] : [],
      players: [
        {
          playerUrl: `https://tomnap.com/videos/${v.id}/embed`,
          streamUrl: v.video_url,
          width: 480,
          height: 854,
        },
      ],
    },
  }
}

export default async function VideoPage({ params }: { params?: AnyPromise }) {
  const p = (params ? await params : undefined) as { id?: string } | undefined
  const video = p?.id ? await getVideo(p.id) : null

  if (!video) {
    notFound()
  }

  const v = video as any
  const creatorName = v.creator?.full_name || v.creator?.username || 'TomNAP Creator'
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title || 'TomNAP Video',
    description: v.description || `${creatorName} tarafından paylaşılan video`,
    thumbnailUrl: v.thumbnail_url,
    uploadDate: v.created_at,
    duration: v.duration ? `PT${v.duration}S` : undefined,
    contentUrl: v.video_url,
    embedUrl: `https://tomnap.com/videos/${v.id}/embed`,
    publisher: {
      '@type': 'Organization',
      name: 'TomNAP',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tomnap.com/logo.png',
      },
    },
    author: {
      '@type': 'Person',
      name: creatorName,
      url: `https://tomnap.com/profile/${v.creator?.username}`,
      image: v.creator?.avatar_url,
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: v.views_count || 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: v.likes_count || 0,
      },
    ],
    keywords: v.tags ? v.tags.join(', ') : undefined,
    inLanguage: 'tr-TR',
    isFamilyFriendly: true,
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: 'https://tomnap.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Video Feed',
        item: 'https://tomnap.com/feed',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: v.title || 'Video',
        item: `https://tomnap.com/videos/${v.id}`,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <Script
        id="video-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema),
        }}
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="aspect-[9/16] md:aspect-video relative rounded-lg overflow-hidden bg-black">
            <video
              src={v.video_url}
              poster={v.thumbnail_url}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            >
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>

          {/* Video Info */}
          <div className="mt-6 space-y-4">
            <h1 className="text-2xl font-bold text-foreground">{v.title || 'TomNAP Video'}</h1>

            {v.description && (
              <p className="text-muted-foreground leading-relaxed">{v.description}</p>
            )}

            {/* Creator Info */}
            {v.creator && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                {v.creator.avatar_url && (
                  <img
                    src={v.creator.avatar_url}
                    alt={creatorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{creatorName}</span>
                    {v.creator.is_verified && <span className="text-blue-500 text-sm">✓</span>}
                  </div>
                  {v.creator.follower_count !== null && (
                    <span className="text-sm text-muted-foreground">
                      {v.creator.follower_count} takipçi
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {v.tags && v.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {v.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {v.views_count !== null && (
                <span>{v.views_count.toLocaleString('tr-TR')} görüntüleme</span>
              )}
              {v.likes_count !== null && (
                <span>{v.likes_count.toLocaleString('tr-TR')} beğeni</span>
              )}
              <span>
                {new Date(v.created_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Videodaki Ürünler</h2>

          {v.video_products && v.video_products.length > 0 ? (
            <div className="space-y-4">
              {v.video_products.map((vp: any, index: number) => {
                const product = vp.product
                if (!product) return null

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    {product.images && product.images.length > 0 && (
                      <div className="aspect-square w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <h3 className="font-medium mb-2 line-clamp-2">{product.title}</h3>

                    {product.price && (
                      <div className="text-lg font-bold text-primary mb-3">
                        {product.price.toLocaleString('tr-TR')} TL
                      </div>
                    )}

                    <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Ürünü Görüntüle
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Bu videoda ürün bulunmuyor.</p>
          )}
        </div>
      </div>
    </div>
  )
}
