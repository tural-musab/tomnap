import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  CircleDollarSign,
  Store,
  Package,
  UserCog,
  StoreIcon,
  BarChart4,
  ShieldCheck,
  Settings,
  Megaphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Prototipteki Stat Card'lar için bir bileşen
function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string
  value: string
  change: string
  icon: LucideIcon
}) {
  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-green-400">{change}</p>
      </CardContent>
    </Card>
  )
}

// Prototipteki Quick Action'lar için bir bileşen
function ActionCard({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <Card className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Icon className="h-8 w-8 mb-2 text-gray-300" />
        <span className="text-sm font-semibold text-gray-300">{label}</span>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Toplam Kullanıcı" value="458K" change="+12.5K" icon={Users} />
        <StatCard title="Platform GMV" value="₺12.4M" change="+45%" icon={CircleDollarSign} />
        <StatCard title="Aktif Satıcı" value="8,456" change="+234" icon={Store} />
        <StatCard title="Günlük İşlem" value="45.6K" change="+3.2K" icon={Package} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hızlı Eylemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ActionCard label="Kullanıcı Yönetimi" icon={UserCog} />
          <ActionCard label="Satıcı Onayları" icon={StoreIcon} />
          <ActionCard label="Platform Analitik" icon={BarChart4} />
          <ActionCard label="Ödeme Sistemleri" icon={Settings} />
          <ActionCard label="Güvenlik" icon={ShieldCheck} />
          <ActionCard label="Duyurular" icon={Megaphone} />
        </div>
      </div>
    </div>
  )
}
