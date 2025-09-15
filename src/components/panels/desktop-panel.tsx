'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Chart = dynamic(() => import('./placeholder-chart'), { ssr: false })

export default function DesktopPanel() {
  const [mdUp, setMdUp] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)')
    const apply = () => setMdUp(m.matches)
    apply()
    m.addEventListener('change', apply)
    return () => m.removeEventListener('change', apply)
  }, [])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/5 p-5 text-white ring-1 ring-white/10">
        <div className="mb-4 text-lg font-semibold">Merhaba, Ahmet!</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { k: 'Toplam Sipariş', v: '156' },
            { k: 'Toplam Harcama', v: '₺24,750' },
            { k: 'Kazanılan İndirim', v: '₺2,450' },
            { k: 'Ortalama Puan', v: '4.9' },
          ].map((c) => (
            <div key={c.k} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-sm text-white/70">{c.k}</div>
              <div className="mt-1 text-2xl font-semibold">{c.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-56">
          <div className="mb-2 text-sm text-white/70">Aylık Harcama</div>
          {mdUp ? (
            <Chart />
          ) : (
            <div className="text-white/60 text-sm">Grafik masaüstünde yüklenir.</div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-56">
          <div className="mb-2 text-sm text-white/70">Kategori Dağılımı</div>
          {mdUp ? <Chart /> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-sm text-white/70">Son Siparişler</div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white/70">
              <tr className="text-left">
                <th className="py-2 pr-4">Sipariş No</th>
                <th className="py-2 pr-4">Ürün</th>
                <th className="py-2 pr-4">Satıcı</th>
                <th className="py-2 pr-4">Tutar</th>
                <th className="py-2 pr-4">Durum</th>
                <th className="py-2">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="py-2 pr-4">#SF20241{i + 2}</td>
                  <td className="py-2 pr-4">Wireless Earbuds Pro</td>
                  <td className="py-2 pr-4">TechHub</td>
                  <td className="py-2 pr-4">₺999</td>
                  <td className="py-2 pr-4">
                    <span className="rounded bg-emerald-600/20 px-2 py-0.5 text-emerald-300">
                      Teslim Edildi
                    </span>
                  </td>
                  <td className="py-2">15 Ara 2024</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
