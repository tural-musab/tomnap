# 🛍️ TomNAP - Sosyal E-Ticaret Platformu

<div align="center">
  <img src="public/logo.png" alt="TomNAP Logo" width="200" />
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase)](https://supabase.com/)
</div>

## 📌 Proje Hakkında

TomNAP, TikTok tarzı video akışı ile e-ticareti birleştiren yenilikçi bir sosyal ticaret platformudur. Kullanıcılar video izlerken aynı anda ürünleri keşfedebilir ve anında satın alabilir.

## 🧭 Genel Değerlendirme

- Next.js 15 App Router ile modüler route grupları kuruldu: `(auth)`, `(main)`, `api`.
- UI katmanı shadcn/ui + Tailwind v4 ile yapılandırıldı; TomNAP teması `globals.css` üzerinden token tabanlı.
- Global durum için Zustand, server state için React Query altyapısı hazır.
- Supabase client/server yardımcıları eklendi; auth ve veri erişimi için temel iskelet mevcut.
- Husky + commitlint + lint-staged ile commit kalite kontrol hattı hazır.

## ✨ Özellikler

- 🎥 **Video Commerce**: Dikey video akışında ürün keşfi
- 🛒 **Tek Tıkla Alışveriş**: Video izlerken sepete ekleme
- 📱 **Mobil Öncelikli**: Tam responsive tasarım
- 🔴 **Canlı Yayın**: Satıcılar için canlı satış imkanı
- 👥 **Sosyal Özellikler**: Takip, beğeni, yorum
- 💳 **Güvenli Ödeme**: Stripe & İyzico entegrasyonu

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya pnpm
- Supabase hesabı
- Git

### Kurulum

1. **Repoyu klonlayın**

```bash
git clone https://github.com/yourusername/tomnap.git
cd tomnap
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
# veya
pnpm install
```

3. **Çevre değişkenlerini ayarlayın**

```bash
cp .env.local.example .env.local
# .env.local dosyasını düzenleyip API anahtarlarınızı ekleyin
```

4. **Supabase kurulumu**

```bash
# Supabase CLI'yi yükleyin
npm install -g supabase

# Supabase'i başlatın
supabase init

# Yeni proje başlatın veya mevcut projeye bağlanın
supabase init

# Migrasyonları uygulayın
supabase migration up --local
```

> Not: Migration dosyaları `supabase/migrations/` altındadır. Çekirdek şema ve RLS politikaları `0001_core_schema.sql` dosyasında tanımlıdır.

5. **Geliştirme sunucusunu başlatın**

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
tomnap/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Auth layout grubu
│   │   ├── (main)/       # Ana uygulama layoutu
│   │   └── api/          # API routes
│   ├── components/       # React componentleri
│   │   ├── ui/           # Shadcn UI componentleri
│   │   ├── features/     # Özellik bazlı componentler
│   │   └── layouts/      # Layout componentleri
│   ├── lib/              # Utility fonksiyonları
│   │   └── supabase/     # Supabase client
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   └── types/            # TypeScript type tanımları
```

## 🛠️ Teknoloji Stack

### Frontend

- **Next.js 15.5** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component library
- **Framer Motion** - Animasyonlar
- **React Player** - Video oynatıcı

### Backend & Database

- **Supabase** - Auth & PostgreSQL
- **Medusa.js** - E-commerce engine (yakında)
- **Redis** - Cache (yakında)

### State Management

- **Zustand** - Global state
- **React Query** - Server state
- **SWR** - Data fetching

### DevOps

- **Vercel** - Hosting
- **GitHub Actions** - CI/CD
- **Sentry** - Error tracking (yakında)
- **PostHog** - Analytics (yakında)

## 📐 Kod Standartları

Proje standartları `.cursorrules` içinde bulunur (özet):

- TypeScript sıkı mod; `any` yok. Bileşenler arrow function, util fonksiyonları `function` ile.
- Zod ile runtime doğrulama. Girdi/çıkışlar tiplenmiş.
- Server Components varsayılan, `"use client"` yalnızca gerektiğinde.
- Suspense, Error Boundary, RSC ile veri çekme tercih edilir.
- Tailwind yalnız; koşullu sınıflar için `cn()` yardımcı fonksiyonu.
- Zustand (global), React Query (server state), useState/useReducer (lokal) kullanımı.
- Erişilebilirlik ve performans (lazy load, image optimizasyonu, caching) öncelikli.

## 🎨 UI & Tema (shadcn/ui + Tailwind v4)

- shadcn CLI yapılandırması: `components.json` (baseColor: `violet`, aliases: `@/components`, `@/lib/utils`).
- Eklenen bileşenler: button, dialog, card, tabs, avatar, dropdown-menu, sheet, drawer, badge, skeleton, input, textarea, select, checkbox. (toast deprecated → proje `sonner` kullanıyor)
- Tema ve tokenlar: `src/app/globals.css` altında `@layer base` + `@theme inline` ile `--background`, `--foreground`, `--primary`, `--border` vb. tanımlı.
- Faydalı yardımcılar: `src/lib/utils.ts` içinde `cn`, `formatPrice`, `formatNumber`.
- Global Toaster: `src/components/ui/sonner-toaster.tsx` ve `src/app/layout.tsx` içinde kullanıma hazır.

## 🔐 Çevre Değişkenleri

`/.env.local` örneği:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
```

Not: Gizli anahtarlar hiçbir zaman istemciye sızdırılmamalıdır.

## 🪝 Husky & Commit Standartları

- Husky başlatıldı, hook’lar hazır:
  - `.husky/pre-commit`: `npx lint-staged`
  - `.husky/commit-msg`: `npx commitlint --edit $1`
- Commit mesajları: Conventional Commits (feat, fix, docs, style, refactor, test, chore).

## 📝 Komutlar

```bash
# Geliştirme
npm run dev          # Geliştirme sunucusu

# Build
npm run build        # Production build
npm run start        # Production sunucusu

# Linting & Formatting
npm run lint         # ESLint kontrolü
npm run format       # Prettier formatla

# Shadcn UI
npm run shadcn-add   # Yeni component ekle

# Testing (yakında)
npm run test         # Test çalıştır
npm run test:watch   # Watch modunda test
```

## 🗺️ Yol Haritası

- [x] Proje kurulumu
- [x] UI component library
- [x] Klasör yapısı
- [ ] Supabase auth entegrasyonu
- [ ] Video feed özelliği
- [ ] Ürün listeleme
- [ ] Sepet sistemi
- [ ] Ödeme entegrasyonu
- [ ] Canlı yayın özelliği
- [ ] Mobil uygulama

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 💬 İletişim

- Email: your@email.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

<div align="center">
  Made with ❤️ using Next.js and Supabase
</div>

---

## 🧰 Sorun Giderme

- Unknown utility class `border-border` hatası:
  - Tailwind v4 tokenları için `src/app/globals.css` içinde `@theme inline` tanımlıdır. Değerler `--border`, `--ring`, `--background` gibi HSL tokenlarından türetilir. Derleme yeniden başlatıldığında hata çözülür.
- shadcn baseColor `violet` kayıt hatası:
  - Geçici olarak `components.json` ile `baseColor` değiştirilip bileşenler eklendikten sonra tema `globals.css` üzerinden override edilir (şu an `violet` aktif).
