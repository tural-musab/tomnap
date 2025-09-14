export default function InfluencerDashboard() {
  return (
    <div className="mx-auto w-full max-w-[640px] space-y-4 px-2 pb-24">
      <section className="grid grid-cols-3 gap-3">
        <Card title="Takipçi" value="0" />
        <Card title="Beğeni" value="0" />
        <Card title="Yorum" value="0" />
      </section>
      <div className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10">
        <h2 className="mb-2 text-sm font-semibold opacity-90">Son Videolar</h2>
        <p className="text-sm opacity-80">Henüz video yüklemedin.</p>
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
