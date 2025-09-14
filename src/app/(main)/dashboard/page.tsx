import { redirect } from 'next/navigation'
import Image from 'next/image'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import CustomerDashboard from '@/components/features/dashboard/customer-dashboard'
import VendorDashboard from '@/components/features/dashboard/vendor-dashboard'
import InfluencerDashboard from '@/components/features/dashboard/influencer-dashboard'
import AdminDashboard from '@/components/features/dashboard/admin-dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  type Profile = Database['public']['Tables']['profiles']['Row']
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, role, follower_count, following_count, is_verified')
    .eq('id', user.id)
    .single()

  const role: Profile['role'] = (profile?.role ?? 'customer') as Profile['role']

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#13131a] to-[#0a0a0f] text-white">
      <section className="relative mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-xl ring-1 ring-white/30">
            <Image
              src={profile?.avatar_url || '/icons/placeholder.svg'}
              alt={profile?.full_name ?? 'Kullanıcı'}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm/5 opacity-80">{role.toUpperCase()}</div>
            <h1 className="text-lg font-semibold">{profile?.full_name || user.email}</h1>
          </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/30 transition hover:bg-white/20"
            >
              Çıkış
            </button>
          </form>
        </div>
      </section>

      {role === 'admin' ? (
        <AdminDashboard />
      ) : role === 'vendor' ? (
        <VendorDashboard />
      ) : role === 'influencer' ? (
        <InfluencerDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </main>
  )
}


