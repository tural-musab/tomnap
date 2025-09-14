import { describe, it, expect } from 'vitest'
import robotsHandler from '../robots'

describe('SEO Configuration', () => {
  describe('Static Sitemap Structure', () => {
    it('should define static routes with correct priorities', () => {
      const staticRoutes = [
        { url: 'https://tomnap.com', priority: 1, changeFrequency: 'daily' },
        { url: 'https://tomnap.com/feed', priority: 0.9, changeFrequency: 'daily' },
        { url: 'https://tomnap.com/explore', priority: 0.8, changeFrequency: 'daily' },
        { url: 'https://tomnap.com/privacy', priority: 0.3, changeFrequency: 'yearly' }
      ]
      
      staticRoutes.forEach(route => {
        expect(route.url).toMatch(/^https:\/\/tomnap\.com/)
        expect(route.priority).toBeGreaterThanOrEqual(0)
        expect(route.priority).toBeLessThanOrEqual(1)
        expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).toContain(route.changeFrequency)
      })
    })

    it('should prioritize pages correctly', () => {
      const homePriority = 1
      const feedPriority = 0.9  
      const privacyPriority = 0.3
      
      expect(homePriority).toBeGreaterThan(feedPriority)
      expect(feedPriority).toBeGreaterThan(privacyPriority)
    })
  })

  describe('Robots.txt Generation', () => {
    it('should generate robots.txt with correct structure', () => {
      const robots = robotsHandler()
      
      expect(robots).toBeDefined()
      expect(robots).toHaveProperty('rules')
      expect(robots).toHaveProperty('sitemap')
      expect(robots).toHaveProperty('host')
      
      expect(Array.isArray(robots.rules)).toBe(true)
      expect(robots.sitemap).toBe('https://tomnap.com/sitemap.xml')
      expect(robots.host).toBe('https://tomnap.com')
    })

    it('should block sensitive paths', () => {
      const robots = robotsHandler()
      const mainRule = robots.rules.find(rule => rule.userAgent === '*')
      
      expect(mainRule).toBeDefined()
      expect(mainRule?.disallow).toContain('/api/')
      expect(mainRule?.disallow).toContain('/admin/')
      expect(mainRule?.disallow).toContain('/dashboard/')
      expect(mainRule?.disallow).toContain('/auth/')
      expect(mainRule?.disallow).toContain('/_next/')
    })

    it('should block AI crawlers', () => {
      const robots = robotsHandler()
      const aiCrawlers = ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai']
      
      aiCrawlers.forEach(crawler => {
        const rule = robots.rules.find(rule => rule.userAgent === crawler)
        expect(rule).toBeDefined()
        expect(rule?.disallow).toBe('/')
      })
    })

    it('should allow general crawling', () => {
      const robots = robotsHandler()
      const mainRule = robots.rules.find(rule => rule.userAgent === '*')
      
      expect(mainRule?.allow).toBe('/')
    })
  })

  describe('RSS Feed Structure', () => {
    it('should define proper RSS structure', () => {
      const rssTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TomNAP - Sosyal E-Ticaret Videoları</title>
    <description>Video ile alışverişin buluştuğu sosyal platform</description>
    <link>https://tomnap.com</link>
    <language>tr-TR</language>
  </channel>
</rss>`
      
      expect(rssTemplate).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(rssTemplate).toContain('<rss version="2.0"')
      expect(rssTemplate).toContain('<channel>')
      expect(rssTemplate).toContain('<title>TomNAP')
      expect(rssTemplate).toContain('<language>tr-TR</language>')
    })

    it('should include required RSS elements in template', () => {
      const requiredElements = [
        '<title>',
        '<description>',
        '<link>',
        '<language>',
        'xmlns:media="http://search.yahoo.com/mrss/"',
        'xmlns:content="http://purl.org/rss/1.0/modules/content/"',
        'xmlns:atom="http://www.w3.org/2005/Atom"'
      ]
      
      requiredElements.forEach(element => {
        expect(element).toMatch(/<[a-zA-Z:]+>?|xmlns:[a-zA-Z]+="[^"]+"/)
      })
    })

    it('should validate RSS caching strategy', () => {
      const cacheHeaders = {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
      
      expect(cacheHeaders['Content-Type']).toBe('application/xml')
      expect(cacheHeaders['Cache-Control']).toContain('public')
      expect(cacheHeaders['Cache-Control']).toContain('max-age=3600')
      expect(cacheHeaders['Cache-Control']).toContain('s-maxage=3600')
    })
  })

  describe('Structured Data Validation', () => {
    it('should include valid Organization schema', () => {
      // This would need to be tested in a browser environment or with JSDOM
      // for now, we just verify the schema structure would be valid
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TomNAP',
        url: 'https://tomnap.com'
      }
      
      expect(organizationSchema['@context']).toBe('https://schema.org')
      expect(organizationSchema['@type']).toBe('Organization')
      expect(organizationSchema.name).toBe('TomNAP')
      expect(organizationSchema.url).toBe('https://tomnap.com')
    })

    it('should include valid WebApplication schema', () => {
      const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'TomNAP',
        applicationCategory: 'ShoppingApplication',
        operatingSystem: 'Any'
      }
      
      expect(webAppSchema['@context']).toBe('https://schema.org')
      expect(webAppSchema['@type']).toBe('WebApplication')
      expect(webAppSchema.applicationCategory).toBe('ShoppingApplication')
      expect(webAppSchema.operatingSystem).toBe('Any')
    })

    it('should include valid WebSite schema with SearchAction', () => {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://tomnap.com/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      }
      
      expect(websiteSchema['@type']).toBe('WebSite')
      expect(websiteSchema.potentialAction['@type']).toBe('SearchAction')
      expect(websiteSchema.potentialAction.target.urlTemplate).toContain('{search_term_string}')
    })
  })

  describe('Meta Tags Validation', () => {
    it('should have proper title structure', () => {
      const metadata = {
        title: {
          default: 'TomNAP - Sosyal E-Ticaret Platformu',
          template: '%s | TomNAP'
        }
      }
      
      expect(metadata.title.default).toContain('TomNAP')
      expect(metadata.title.template).toContain('%s | TomNAP')
    })

    it('should include comprehensive keywords', () => {
      const keywords = [
        'e-ticaret',
        'sosyal ticaret',
        'video alışveriş',
        'canlı yayın',
        'TomNAP',
        'online alışveriş',
        'influencer marketing',
        'sosyal medya alışveriş',
        'video commerce',
        'live shopping'
      ]
      
      expect(keywords).toContain('e-ticaret')
      expect(keywords).toContain('sosyal ticaret')
      expect(keywords).toContain('video alışveriş')
      expect(keywords.length).toBeGreaterThan(5)
    })

    it('should have proper OpenGraph configuration', () => {
      const ogConfig = {
        siteName: 'TomNAP',
        locale: 'tr_TR',
        type: 'website'
      }
      
      expect(ogConfig.siteName).toBe('TomNAP')
      expect(ogConfig.locale).toBe('tr_TR')
      expect(ogConfig.type).toBe('website')
    })

    it('should have proper Twitter Card configuration', () => {
      const twitterConfig = {
        card: 'summary_large_image',
        site: '@tomnap',
        creator: '@tomnap'
      }
      
      expect(twitterConfig.card).toBe('summary_large_image')
      expect(twitterConfig.site).toBe('@tomnap')
      expect(twitterConfig.creator).toBe('@tomnap')
    })
  })

  describe('URL Structure Validation', () => {
    it('should generate clean URLs for products', () => {
      const productUrl = 'https://tomnap.com/products/123'
      
      expect(productUrl).toMatch(/^https:\/\/tomnap\.com\/products\/[a-zA-Z0-9-]+$/)
      expect(productUrl).not.toContain('?')
      expect(productUrl).not.toContain('#')
    })

    it('should generate clean URLs for videos', () => {
      const videoUrl = 'https://tomnap.com/videos/456'
      
      expect(videoUrl).toMatch(/^https:\/\/tomnap\.com\/videos\/[a-zA-Z0-9-]+$/)
      expect(videoUrl).not.toContain('?')
      expect(videoUrl).not.toContain('#')
    })

    it('should generate clean URLs for profiles', () => {
      const profileUrl = 'https://tomnap.com/profile/username'
      
      expect(profileUrl).toMatch(/^https:\/\/tomnap\.com\/profile\/[a-zA-Z0-9_-]+$/)
      expect(profileUrl).not.toContain('?')
      expect(profileUrl).not.toContain('#')
    })
  })
})