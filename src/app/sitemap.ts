import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tomnap.com'
  const supabase = await createClient()

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Get active products for sitemap
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1000) // Limit for performance

    // Get active videos for sitemap
    const { data: videos } = await supabase
      .from('videos')
      .select('id, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1000) // Limit for performance

    // Get verified profiles for sitemap
    const { data: profiles } = await supabase
      .from('profiles')
      .select('username, updated_at')
      .eq('is_verified', true)
      .not('username', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(100) // Limit verified profiles

    // Product pages
    const productRoutes: MetadataRoute.Sitemap = ((products || []) as any[]).map((product: any) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Video pages
    const videoRoutes: MetadataRoute.Sitemap = ((videos || []) as any[]).map((video: any) => ({
      url: `${baseUrl}/videos/${video.id}`,
      lastModified: new Date(video.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Profile pages (only verified profiles)
    const profileRoutes: MetadataRoute.Sitemap = ((profiles || []) as any[]).map((profile: any) => ({
      url: `${baseUrl}/profile/${profile.username}`,
      lastModified: new Date(profile.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...productRoutes, ...videoRoutes, ...profileRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes only if database query fails
    return staticRoutes
  }
}