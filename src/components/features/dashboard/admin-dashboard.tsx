import ProfileForm from './profile-form'
import ControlSwitch from './control-switch'

export default function AdminDashboard() {
  return (
    <div className="mx-auto w-full max-w-[1024px] space-y-6 px-4 pb-24">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <DashboardCard title="Toplam Satış" value="₺0" subtitle="Bu ay" />
        <DashboardCard title="Sipariş" value="0" subtitle="Aylık" />
        <DashboardCard title="Kullanıcı" value="0" subtitle="Toplam" />
        <DashboardCard title="Ürün" value="0" subtitle="Aktif" />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Panel title="Profili Düzenle">
          <ProfileForm initial={{}} />
        </Panel>
        <Panel title="Sistem Kontrolleri">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <span>Platform Durumu</span>
              <ControlSwitch initial />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <span>Bakım Modu</span>
              <ControlSwitch />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <span>Yeni Kayıtlar</span>
              <ControlSwitch initial />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <span>Canlı Yayınlar</span>
              <ControlSwitch initial />
            </div>
          </div>
        </Panel>
      </section>
    </div>
  )
}

function DashboardCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-5 text-white shadow-lg">
      <div className="text-xs/4 opacity-80">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs/4 opacity-80">{subtitle}</div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/20 backdrop-blur-xl">
      <h2 className="mb-2 text-sm font-semibold opacity-95">{title}</h2>
      {children}
    </div>
  )
}
