export interface MobilePanelItem {
  label: string
  badge?: number
}

export default function MobilePanel() {
  const items: MobilePanelItem[] = [
    { label: 'Siparişlerim', badge: 3 },
    { label: 'Favorilerim', badge: 12 },
    { label: 'İzleme Geçmişi' },
    { label: 'Adreslerim' },
    { label: 'Ödeme Yöntemlerim' },
    { label: 'Kuponlarım', badge: 5 },
    { label: 'Ayarlar' },
  ]

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white/5 p-5 text-white ring-1 ring-white/10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
          <div>
            <div className="text-lg font-semibold">Mehmet Yılmaz</div>
            <div className="text-xs text-white/70">Premium Müşteri ⭐</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 text-center text-sm">
          <div>
            <div className="font-semibold">156</div>
            <div className="text-white/70">Sipariş</div>
          </div>
          <div>
            <div className="font-semibold">89</div>
            <div className="text-white/70">Takip</div>
          </div>
          <div>
            <div className="font-semibold">4.9</div>
            <div className="text-white/70">Puan</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {items.map((x) => (
          <button
            key={x.label}
            className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-white ring-1 ring-white/10"
          >
            <span className="text-base">{x.label}</span>
            <div className="flex items-center gap-3">
              {typeof x.badge === 'number' ? (
                <span className="min-w-6 rounded-full bg-red-600 px-2 text-center text-xs">
                  {x.badge}
                </span>
              ) : null}
              <span className="opacity-60">›</span>
            </div>
          </button>
        ))}
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-5 p-2 text-center text-xs text-white/80">
          {['Ana Sayfa', 'Keşfet', 'Sepet', 'Mağaza', 'Profil'].map((t) => (
            <a key={t} href="#" className="py-1">
              {t}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
