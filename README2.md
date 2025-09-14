# 📖 README v2 – Shoppable Social Commerce Platform

## 🎯 Proje Özeti
Bu proje, sosyal medya (TikTok/Instagram) deneyimi ile e-ticareti (Amazon/Trendyol) tek çatı altında birleştiren **multi-vendor shoppable video platformudur**.  
Amaç: Kullanıcıların video/hikaye/posta içeriklerinden tek dokunuşla ürünleri sepete ekleyip satın alabilmesi.  

Hedef pazar: **Azerbaycan & Türkiye** (TikTok Shop eksikliği nedeniyle fırsat).

---

## 🖥 Uygulama Akışı (Navigation Bar)
1. **Ana Sayfa (TikTok Tarzı)**  
   - Yukarı/aşağı kaydırmalı video feed.  
   - Satıcı videoları + ürün pinleme.  
   - Beğeni, yorum, kaydet, paylaş + **sepete ekle**.  
   - Birden çok ürün için zaman damgalı pin ve varyant seçici sheet.

2. **Feed (Instagram Tarzı)**  
   - Görsel + video + hikaye paylaşımları.  
   - Fiyat rozeti ve “tek dokunuş” sepete ekle.  
   - Ürün işaretleme (Instagram product tags benzeri).  

3. **Sepet (Multi-Vendor)**  
   - Kullanıcının sepeti satıcılara göre gruplanır.  
   - Tek ödeme → sistem satıcılara ayrı ayrı dağıtır.  
   - Favoriler ve önerilen ürünler.  
   - Misafir alışveriş desteklenir, fatura/adres zorunludur.  

4. **Keşfet / Arama (Amazon/Trendyol Tarzı)**  
   - Arama çubuğu, kategori listeleri, filtreler.  
   - Çoklu dil (TR, AZ) ve para birimi (TRY, AZN).  
   - Öneri motoru: popüler + benzer ürünler.  

5. **Profil**  
   - Kullanıcı profili: sipariş geçmişi, ayarlar.  
   - Satıcı profili: mağaza yönetimi, ürün yükleme, canlı yayın planlama.  
   - Influencer profili: performans paneli (tıklama → sepete → satış hunisi).  

---

## 👥 Kullanıcı Tipleri
1. **Müşteriler (Normal Kullanıcılar)**  
   - Ürünlere bakabilir, sepete ekleyebilir, satın alabilir.  
   - Beğenme, kaydetme, paylaşma, yorum.  
   - Satıcı/Influencer’a mesaj isteği gönderebilir.  

2. **Satıcılar (Vendors)**  
   - Başvuru + KYC (kimlik, vergi numarası, IBAN).  
   - Ürün listeleme (SKU, varyant, stok).  
   - Shoppable video, feed post, hikaye, canlı yayın paylaşma.  
   - Influencerlarla affiliate anlaşması yapma.  

3. **Influencerlar (Creators)**  
   - Satıcı ürünlerini tanıtıp satış başına komisyon alır.  
   - Ürün linki generate + sepete entegrasyon.  
   - Canlı yayın, hikaye, Reels tarzı içerik paylaşma.  
   - Performans panelinden satışları takip etme.  

4. **Yöneticiler (Admins)**  
   - Satıcı ve influencer başvurularını onaylar.  
   - Ürün içeriklerini inceler ve onaylar.  
   - Moderasyon (küfür, sahte ürün, telif şikayeti).  
   - Rol tabanlı yetkilendirme.  

---

## 🛒 Sipariş & Ödeme İş Akışı
- Çok satıcılı tek sepet → sipariş bölünmüş halde satıcılara yansır.  
- Sipariş yaşam döngüsü: `Created → Authorized → Captured → Fulfilled/Partially → Refunded`.  
- İade süreci (RMA): Kullanıcı → Onay → Etiket → İade → Geri ödeme.  
- Komisyon dağıtımı: Satıcı, influencer, platform payı.  

---

## 💡 Canlı Yayın Ticareti
- Satıcı veya influencer canlı yayın açabilir.  
- Yayın sırasında ürün listesi dock görünür.  
- İzleyici tek tıkla ürünü sepete ekleyebilir.  
- Yayın bittikten sonra replay + zaman damgalı ürün pinleme aktif olur.  

---

## 🔐 Güvenlik & Moderasyon
- Satıcı KYC doğrulaması.  
- AI tabanlı küfür/telif filtreleri + manuel insan kontrolü.  
- Fraud önleme: çoklu hesap tespiti, velocity checks.  
- KVKK/GDPR uyumlu veri saklama.  

---

## ⚙️ Teknik Mimarisi
- **Frontend:** Next.js (App Router), PWA, ISR.  
- **Backend:** Medusa.js (Node.js).  
- **DB:** PostgreSQL (Supabase).  
- **Queue:** Redis/Upstash.  
- **Cache/CDN:** Cloudflare.  
- **Gerçek Zamanlı:** Agora/WebRTC (canlı yayın) + SSE/WebSocket.  
- **Görsel/Video İşleme:** Cloudinary + Mux.  
- **Arama:** Meilisearch / Typesense (başlangıç) → Algolia (ölçek).  
- **Observability:** OpenTelemetry + Grafana.  

---

## 📊 Ölçülecek KPI’lar
- **Checkout dönüşüm oranı**: video → sepete → ödeme.  
- **p95 video başlatma süresi**: <1.5s.  
- **İade oranı**.  
- **Fraud alarmı**.  
- **Satıcı SLA’leri** (kargo süresi, iade oranı).  

---

## 🛠 Yol Haritası
### V1 (8–10 hafta)  
- Video feed + ürün pinleme.  
- Çok satıcılı sepet.  
- Satıcı başvurusu + KYC.  
- Affiliate link sistemi.  
- Moderasyon v1.  

### V1.5  
- Canlı yayın ticareti.  
- Öneri motoru.  
- ERP/WooCommerce stok senkronizasyonu.  

### V2  
- Gelişmiş attribution modelleri.  
- Satıcı reklamları (sponsorlu slot).  
- Fraud otomasyonu.  

---

## ✅ Kontrol Listesi
- [ ] Zaman damgalı ürün pinleme  
- [ ] Sheet varyant seçici  
- [ ] Çok satıcılı sepet bölme  
- [ ] Affiliate muhasebesi  
- [ ] KYC + moderasyon pipeline  
- [ ] Canlı yayın modülü  
- [ ] TR/AZ dil + para birimi  
- [ ] Hukuki süreçler (iade, KVKK)  
