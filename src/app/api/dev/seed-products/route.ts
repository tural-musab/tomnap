import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const supabase = await createClient()

  // Bir demo vendor profili bul/oluştur
  let vendorId: string | undefined
  const { data: vendorProfile } = await supabase.from('profiles').select('id').limit(1).single()
  vendorId = (vendorProfile as { id: string } | null)?.id
  if (!vendorId) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return NextResponse.json({ error: 'SERVICE_ROLE key missing in env' }, { status: 500 })
    const newId = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
    const body = [{ id: newId, username: `vendor_${newId.slice(0, 6)}`, full_name: 'Demo Vendor', follower_count: 0, following_count: 0, is_verified: false, role: 'vendor' }]
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Prefer: 'return=representation' }, body: JSON.stringify(body), cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: `Profile seed failed: ${await res.text()}` }, { status: 500 })
    const inserted = (await res.json()) as Array<{ id: string }>
    vendorId = inserted[0]?.id
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'SERVICE_ROLE key missing in env' }, { status: 500 })

  const products = [
    {
      vendor_id: vendorId,
      title: 'Demo T-Shirt',
      description: 'Yumuşak pamuklu, günlük kullanım için ideal.',
      price: 199.9,
      currency: 'TRY',
      images: [{ url: 'https://images.unsplash.com/photo-1520975940208-bc1edd8e3a47?w=800&auto=format&fit=crop' }],
      category: 'Giyim',
      stock_quantity: 100,
      is_active: true,
    },
    {
      vendor_id: vendorId,
      title: 'Demo Sneaker',
      description: 'Rahat ve şık spor ayakkabı.',
      price: 899.0,
      currency: 'TRY',
      images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop' }],
      category: 'Ayakkabı',
      stock_quantity: 50,
      is_active: true,
    },
  ]

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Prefer: 'return=representation' },
    body: JSON.stringify(products),
    cache: 'no-store',
  })
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 })
  const data = (await res.json()) as Array<{ id: string }>
  return NextResponse.json({ inserted: data.length })
}
