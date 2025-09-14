import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  try {
    // Get recent videos for RSS feed
    const { data: videos, error } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        created_at,
        updated_at,
        creator:profiles!creator_id(
          username,
          full_name
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching videos for RSS:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    const baseUrl = 'https://tomnap.com'
    const now = new Date().toISOString()
    
    const rssItems = (videos || []).map(video => {
      const creatorName = video.creator?.full_name || video.creator?.username || 'TomNAP Creator'
      const videoTitle = video.title || 'TomNAP Video'
      const videoDescription = video.description || `${creatorName} tarafından paylaşılan video`
      
      return `
        <item>
          <title><![CDATA[${videoTitle}]]></title>
          <description><![CDATA[${videoDescription}]]></description>
          <link>${baseUrl}/videos/${video.id}</link>
          <guid isPermaLink="true">${baseUrl}/videos/${video.id}</guid>
          <pubDate>${new Date(video.created_at).toUTCString()}</pubDate>
          <author><![CDATA[${creatorName}]]></author>
          ${video.thumbnail_url ? `
          <enclosure url="${video.thumbnail_url}" type="image/jpeg" />
          <media:thumbnail url="${video.thumbnail_url}" />
          <media:content url="${video.thumbnail_url}" type="image/jpeg" medium="image" />
          ` : ''}
          <category>Video</category>
          <category>Sosyal Ticaret</category>
        </item>`
    }).join('')

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TomNAP - Sosyal E-Ticaret Videoları</title>
    <description>Video ile alışverişin buluştuğu sosyal platform. En yeni ürün videoları ve sosyal ticaret içerikleri.</description>
    <link>${baseUrl}</link>
    <language>tr-TR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <image>
      <title>TomNAP</title>
      <url>${baseUrl}/logo.png</url>
      <link>${baseUrl}</link>
      <description>TomNAP Logo</description>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>TomNAP RSS Generator</generator>
    <copyright>© ${new Date().getFullYear()} TomNAP. Tüm hakları saklıdır.</copyright>
    <managingEditor>noreply@tomnap.com (TomNAP Team)</managingEditor>
    <webMaster>tech@tomnap.com (TomNAP Tech Team)</webMaster>
    <category>E-Commerce</category>
    <category>Social Commerce</category>
    <category>Video Shopping</category>
    
    ${rssItems}
  </channel>
</rss>`

    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}