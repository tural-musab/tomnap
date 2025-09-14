# TomNAP - Sosyal E-Ticaret Platformu

<div align="center">
  <img src="logo/logo.svg" alt="TomNAP Logo" width="120" height="120">
  
  ### 🛍️ Video İzle, Anında Satın Al
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.0-green)](https://supabase.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-orange)](https://web.dev/progressive-web-apps/)
</div>

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [PWA Kurulumu](#-pwa-kurulumu)
- [Geliştirme](#-geliştirme)
- [Performans Optimizasyonları](#-performans-optimizasyonları)
- [Deployment](#-deployment)
- [Scripts](#-scripts)
- [Katkıda Bulunma](#-katkıda-bulunma)

## ✨ Özellikler

- 🎥 **Video Commerce**: TikTok tarzı video akışında ürün keşfi
- 🛒 **Anında Satın Alma**: Video içi satın alma özelliği
- 📱 **PWA Desteği**: Native uygulama deneyimi
- 🔴 **Canlı Yayın**: Influencer'lar için canlı satış imkanı
- 👥 **Sosyal Alışveriş**: Arkadaşlarla ortak alışveriş
- 💳 **Güvenli Ödeme**: Stripe & İyzico entegrasyonu
- 🎁 **Ödül Sistemi**: Puan ve hediye kazanma
- 📊 **Analitik**: Detaylı satış ve performans raporları
- 🌙 **Dark Mode**: Göz yormayan karanlık tema
- 🌍 **Çoklu Dil**: Türkçe ve İngilizce desteği

## 🚀 Teknolojiler

### Frontend
- **Next.js 15.5** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Services
- **Supabase** - Database, Auth, Storage
- **Stripe** - Payment processing
- **İyzico** - Local payment gateway
- **Sentry** - Error tracking
- **Vercel** - Hosting

### PWA & Performance
- **Service Worker** - Offline support
- **Web Manifest** - Installable app
- **Image Optimization** - Next/Image
- **Code Splitting** - Dynamic imports
- **Bundle Optimization** - Tree shaking

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- pnpm 8+
- Git

### Adımlar

1. **Repoyu klonlayın**
```bash
git clone https://github.com/yourusername/tomnap.git
cd tomnap
```

2. **Bağımlılıkları yükleyin**
```bash
pnpm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# İyzico
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key

# Sentry
SENTRY_DSN=your_sentry_dsn
```

4. **Geliştirme sunucusunu başlatın**
```bash
pnpm dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📱 PWA Kurulumu

### Icon Oluşturma

1. **Sharp paketini yükleyin** (sadece geliştirme için)
```bash
pnpm add -D sharp
```

2. **Logo dosyanızı hazırlayın**
- `logo/logo.png` dosyasını oluşturun (minimum 512x512px)

3. **Icon'ları generate edin**
```bash
pnpm generate-icons
```

Bu komut tüm PWA icon boyutlarını otomatik oluşturacaktır.

### Manuel PWA Kurulumu

#### Desktop (Chrome/Edge)
1. Adres çubuğundaki install icon'una tıklayın
2. "Install" butonuna tıklayın

#### Mobile (Android)
1. Chrome'da "Add to Home Screen" seçeneğini kullanın
2. Otomatik PWA prompt'u bekleyin

#### iOS
1. Safari'de paylaş butonuna tıklayın
2. "Add to Home Screen" seçeneğini seçin

## 🛠️ Geliştirme

### CRUD Generator

Yeni bir tablo için CRUD operasyonları oluşturmak:

```bash
node scripts/generate-crud.js [table-name]

# Örnek:
node scripts/generate-crud.js products
```

Bu komut şunları oluşturur:
- `src/types/[table-name].ts` - TypeScript types
- `src/lib/api/[table-name].ts` - API functions
- `src/hooks/use-[table-name].ts` - React hooks
- `src/components/admin/[table-name]-manager.tsx` - Admin component

### Klasör Yapısı

```
src/
├── app/                  # Next.js app router
│   ├── (auth)/          # Auth routes
│   ├── (main)/          # Main app routes
│   └── (legal)/         # Legal pages
├── components/          
│   ├── landing/         # Landing page components (Client Components)
│   ├── ui/              # Shadcn UI components
│   └── admin/           # Admin components
├── lib/                 
│   ├── api/             # API functions
│   ├── supabase/        # Supabase client
│   └── utils.ts         # Utility functions
├── hooks/               # Custom React hooks
├── stores/              # Zustand stores
├── types/               # TypeScript types
└── styles/              # Global styles
```

## ⚡ Performans Optimizasyonları

### Uygulanan Optimizasyonlar

1. **RSC (React Server Components)**
   - Landing page Server Component olarak refactor edildi
   - Sadece interaktif bölümler Client Component

2. **Code Splitting**
   - Dynamic imports kullanıldı
   - Lazy loading utilities eklendi
   - Route-based splitting aktif

3. **Bundle Optimization**
   - Tree shaking için icon optimizasyonu
   - Package imports optimize edildi
   - Unused code elimination

4. **Image Optimization**
   - Next/Image kullanımı
   - WebP/AVIF format desteği
   - Lazy loading images

5. **PWA Features**
   - Service Worker caching
   - Offline support
   - Background sync
   - Push notifications ready

6. **SEO & Meta Tags**
   - Structured data
   - Open Graph tags
   - Twitter cards
   - Sitemap generation

## 🚢 Deployment

### Vercel Deployment

```bash
# Vercel CLI ile
vercel

# Otomatik deployment için GitHub'a push
git push origin main
```

### Docker Deployment

```bash
# Build
docker build -t tomnap .

# Run
docker run -p 3000:3000 tomnap
```

## 📜 Scripts

```json
{
  "dev": "Next.js development server",
  "build": "Production build",
  "start": "Production server",
  "lint": "ESLint check",
  "generate-icons": "PWA icon generator",
  "pwa-assets": "Generate all PWA assets"
}
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 İletişim

- Website: [tomnap.com](https://tomnap.com)
- Email: info@tomnap.com
- Twitter: [@tomnap](https://twitter.com/tomnap)

---

<div align="center">
  Made with ❤️ by TomNAP Team
</div>
