export default function CustomerDashboard() {
  return (
    <div className="mx-auto w-full max-w-[640px] space-y-4 px-2 pb-24">
      <div className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10">
        <h2 className="mb-2 text-sm font-semibold opacity-90">Siparişlerim</h2>
        <p className="text-sm opacity-80">Henüz sipariş bulunmuyor.</p>
      </div>
      <div className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10">
        <h2 className="mb-2 text-sm font-semibold opacity-90">Listelerim</h2>
        <p className="text-sm opacity-80">Favori listen boş.</p>
      </div>
    </div>
  )
}
