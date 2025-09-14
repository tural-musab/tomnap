export default function VendorDashboard() {
  return (
    <div className="mx-auto w-full max-w-[640px] space-y-4 px-2 pb-24">
      <section className="grid grid-cols-2 gap-3">
        <Card title="Bugünkü Satış" value="₺0" />
        <Card title="Ürün Sayısı" value="0" />
      </section>
      <div className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10">
        <h2 className="mb-2 text-sm font-semibold opacity-90">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-3">Ürün Ekle</button>
          <button className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-3">Kupon Oluştur</button>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10">
      <div className="text-xs/4 opacity-80">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
