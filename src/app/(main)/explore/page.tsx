import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface ExploreItem {
  id: string
  thumbnail_url: string
  title: string | null
}

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('id, thumbnail_url, title')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(60)

  if (error) {
    // Basit hata çıktısı; UI minimal tutuldu
    return (
      <main className="min-h-screen px-4 py-4">
        <p className="text-sm text-red-500">Keşfet verileri yüklenemedi.</p>
      </main>
    )
  }

  const items = (data ?? []) as ExploreItem[]

  return (
    <main className="min-h-screen px-2 py-3">
      <div className="mx-auto w-full max-w-[640px]">
        <h1 className="sr-only">Keşfet</h1>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((it) => (
            <Link key={it.id} href={`/feed?video=${it.id}`} className="group relative block overflow-hidden rounded-xl">
              <Image
                src={it.thumbnail_url}
                alt={it.title ?? 'Video'}
                width={600}
                height={800}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}


