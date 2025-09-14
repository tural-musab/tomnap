import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getOrCreateDemoUserId(): Promise<string | null> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !baseUrl) return null

  // 1) Varsa ilk profili kullan
  const supabase = await createClient()
  const { data: profileData } = await supabase.from('profiles').select('id').limit(1).single()
  const existingId = (profileData as { id: string } | null)?.id
  if (existingId) return existingId

  // 2) Yoksa admin API ile kullanıcı oluştur
  const email = `demo_${Date.now()}@example.com`
  const password = Math.random().toString(36).slice(2) + 'Aa1!'
  const resUser = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
    cache: 'no-store',
  })
  if (!resUser.ok) return null
  const created = (await resUser.json()) as { user: { id: string } }
  const newUserId = created?.user?.id
  if (!newUserId) return null

  // 3) Profil oluştur (bazı projelerde trigger olabilir; biz garantiye alalım)
  const resProfile = await fetch(`${baseUrl}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify([
      {
        id: newUserId,
        username: `demo_${newUserId.slice(0, 6)}`,
        full_name: 'Demo User',
        follower_count: 0,
        following_count: 0,
        is_verified: false,
      },
    ]),
    cache: 'no-store',
  })
  if (!resProfile.ok) return null
  return newUserId
}

async function seedInternal(creatorId: string): Promise<Response> {
  const samples = [
    {
      creator_id: creatorId,
      video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop',
      hls_url: null,
      title: 'Demo Çiçek Videosu',
      description: 'Demo amaçlı örnek video',
      duration: 30,
      status: 'active' as const,
      is_shoppable: false,
      hashtags: ['demo', 'test'],
    },
    {
      creator_id: creatorId,
      video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
      hls_url: null,
      title: 'Big Buck Bunny (Demo)',
      description: 'Örnek akış videosu',
      duration: 60,
      status: 'active' as const,
      is_shoppable: false,
      hashtags: ['demo', 'bunny'],
    },
  ]

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/videos`
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'SERVICE_ROLE key missing in env' }, { status: 500 })
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(samples),
    cache: 'no-store',
  })
  if (!res.ok) {
    const txt = await res.text()
    return NextResponse.json({ error: txt || 'Insert failed' }, { status: 500 })
  }
  const data = (await res.json()) as Array<{ id: string }>
  return NextResponse.json({ inserted: data.length })
}

export async function POST(): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let creatorId = user?.id
  if (!creatorId) {
    const demoId = await getOrCreateDemoUserId()
    if (!demoId) return NextResponse.json({ error: 'Could not provision demo user (check service role key)' }, { status: 500 })
    creatorId = demoId
  }

  return seedInternal(creatorId as string)
}

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let creatorId = user?.id
  if (!creatorId) {
    const demoId = await getOrCreateDemoUserId()
    if (!demoId) return NextResponse.json({ error: 'Could not provision demo user (check service role key)' }, { status: 500 })
    creatorId = demoId
  }
  return seedInternal(creatorId as string)
}


