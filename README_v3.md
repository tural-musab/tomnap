# 📖 README v3 – TomNAP Sosyal E-Ticaret Platformu

<div align="center">
  <img src="logo/logo.svg" alt="TomNAP Logo" width="120" height="120">
  
  ### 🛍️ Video İzle, Anında Satın Al
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.0-green)](https://supabase.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-orange)](https://web.dev/progressive-web-apps/)
</div>

---

## 🎯 Proje Özeti
TomNAP, sosyal medya (TikTok/Instagram) deneyimini e-ticaret (Amazon/Trendyol) ile birleştiren **multi-vendor shoppable video platformudur**.  
Kullanıcılar, video, hikaye ve paylaşımlardan tek tıkla ürünleri sepete ekleyip satın alabilir.  

Hedef pazar: **Azerbaycan & Türkiye**.

---

## 🖥 Uygulama Akışı (Navigation Bar)
1. **Ana Sayfa (TikTok Tarzı)**: Kaydırmalı video feed, ürün pinleme, varyant seçici.  
2. **Feed (Instagram Tarzı)**: Görsel/video/hikaye akışı, fiyat rozetleri, ürün etiketleme.  
3. **Sepet (Multi-Vendor)**: Çok satıcılı sepet bölme, favoriler, önerilen ürünler.  
4. **Keşfet / Arama (Amazon Tarzı)**: Arama, kategori listeleri, TR/AZ dil ve para birimi.  
5. **Profil**: Kullanıcı siparişleri, satıcı mağazaları, influencer performans paneli.  

---

## 👥 Kullanıcı Tipleri
- **Müşteriler**: Ürün keşfi, satın alma, yorum, paylaşım, DM (onaylı).  
- **Satıcılar**: Başvuru + KYC, ürün listeleme, shoppable video, canlı yayın.  
- **Influencerlar**: Affiliate link, satış komisyonu, canlı yayın, performans paneli.  
- **Yöneticiler**: Başvuru ve içerik onayı, moderasyon, rol tabanlı yetkilendirme.  

---

## 🛒 Sipariş & Ödeme İş Akışı
- Çok satıcılı tek sepet → sistem siparişleri bölerek satıcılara iletir.  
- İade süreci (RMA) → Onay → Etiket → İade → Geri ödeme.  
- Komisyon dağıtımı: satıcı, influencer, platform.  
- Desteklenen ödeme yöntemleri: **Stripe & İyzico**.  

---

## 💡 Canlı Yayın Ticareti
- Satıcı/Influencer canlı yayın açabilir.  
- Yayın sırasında ürün listesi dock görünür.  
- Replay videolarında ürün pinleme korunur.  

---

## 🔐 Güvenlik & Moderasyon
- Satıcı KYC (kimlik, vergi numarası, IBAN).  
- AI tabanlı içerik filtreleme + manuel moderasyon.  
- Fraud önleme: çoklu hesap, hız kontrolleri.  
- KVKK/GDPR uyumlu veri işleme.  

---

## 📊 Ölçülecek KPI’lar
- Checkout dönüşüm oranı.  
- p95 video başlatma süresi < 1.5s.  
- İade oranı.  
- Fraud alarm oranı.  
- Satıcı SLA (kargo süresi, iade oranı).  

---

## ✨ Özellikler
- 🎥 **Video Commerce**: TikTok tarzı video akışında ürün keşfi  
- 🛒 **Anında Satın Alma**: Video içi satın alma özelliği  
- 📱 **PWA Desteği**: Native uygulama deneyimi  
- 🔴 **Canlı Yayın**: Influencer’lar için canlı satış imkanı  
- 👥 **Sosyal Alışveriş**: Arkadaşlarla ortak alışveriş  
- 💳 **Güvenli Ödeme**: Stripe & İyzico entegrasyonu  
- 🎁 **Ödül Sistemi**: Puan ve hediye kazanma  
- 📊 **Analitik**: Detaylı satış ve performans raporları  
- 🌙 **Dark Mode**: Göz yormayan karanlık tema  
- 🌍 **Çoklu Dil**: Türkçe, İngilizce, Azerice desteği  

---

## 🚀 Teknolojiler
### Frontend
- **Next.js 15.5** (App Router)  
- **TypeScript 5.0**  
- **Tailwind CSS 3.0**  
- **Framer Motion**  
- **Zustand** (state management)  
- **React Query**  
- **React Hook Form** + **Zod**  

### Backend & Services
- **Supabase** (Database, Auth, Storage)  
- **Stripe & İyzico** (ödemeler)  
- **Sentry** (error tracking)  
- **Vercel** (hosting)  

### PWA & Performance
- Service Worker, Offline desteği  
- Next/Image optimizasyonu  
- Dynamic imports, Tree shaking  
- Push notifications  

---

## 📦 Kurulum
```bash
git clone https://github.com/yourusername/tomnap.git
cd tomnap
pnpm install
cp .env.local.example .env.local
pnpm dev
```

`.env.local` içeriği:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# İyzico
IYZICO_API_KEY=
IYZICO_SECRET_KEY=

# Sentry
SENTRY_DSN=
```

---

## 📱 PWA Kurulumu
- `logo/logo.png` (512x512) hazırlayın.  
- `pnpm generate-icons` ile PWA iconlarını oluşturun.  
- Mobilde “Add to Home Screen”, masaüstünde install icon ile kurulabilir.  

---

## 🛠️ Geliştirme
- **CRUD Generator**: `node scripts/generate-crud.js products`  
- Otomatik: types, API functions, hooks, admin component.  

### Klasör Yapısı
```
src/
├── app/ (auth, main, legal)
├── components/ (landing, ui, admin)
├── lib/ (api, supabase, utils)
├── hooks/
├── stores/
├── types/
└── styles/
```

---

## ⚡ Performans Optimizasyonları
- RSC (server components)  
- Code splitting (dynamic imports)  
- Lazy loading images  
- WebP/AVIF format  
- SEO: Structured data, OG tags, sitemap  

---

## 🚢 Deployment
### Vercel
```bash
vercel
```
### Docker
```bash
docker build -t tomnap .
docker run -p 3000:3000 tomnap
```

---

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

---

## 🛠 Yol Haritası
### V1
- Video feed + ürün pinleme  
- Çok satıcılı sepet  
- Satıcı başvurusu + KYC  
- Affiliate link sistemi  
- Moderasyon v1  

### V1.5
- Canlı yayın ticareti  
- Öneri motoru  
- ERP/WooCommerce stok senkronizasyonu  

### V2
- Gelişmiş attribution modelleri  
- Satıcı reklamları  
- Fraud otomasyonu  

---

## 🤝 Katkıda Bulunma
1. Fork edin  
2. Branch oluşturun  
3. Commit atın  
4. Pull request açın  

---

## 📄 Lisans
MIT License → [LICENSE](LICENSE)  

---

## 👥 İletişim
- Website: [tomnap.com](https://tomnap.com)  
- Email: info@tomnap.com  
- Twitter: [@tomnap](https://twitter.com/tomnap)  

---

<div align="center">
  Made with ❤️ by TomNAP Team
</div>
