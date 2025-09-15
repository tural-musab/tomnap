import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }
  const supabase = await createClient()

  // Explicitly type the selected columns so that TypeScript can infer the
  // shape of the response instead of widening it to `never`.
  type RowId = {
    id: string
  }

  const { data: videos } = await supabase
    .from('videos')
    .select('id')
    .returns<RowId>()
    .order('created_at', { ascending: false })
    .limit(2)

  const { data: products } = await supabase
    .from('products')
    .select('id')
    .returns<RowId>()
    .order('created_at', { ascending: false })
    .limit(2)
  if (!videos?.length || !products?.length) {
    return NextResponse.json(
      { error: 'Videos or products missing. Seed them first.' },
      { status: 400 }
    )
  }

  const pairs = [
    { video_id: videos[0]!.id, product_id: products[0]!.id },
    { video_id: videos[0]!.id, product_id: products[1]!.id },
    { video_id: videos[1]!.id, product_id: products[0]!.id },
  ]

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey)
    return NextResponse.json({ error: 'SERVICE_ROLE key missing in env' }, { status: 500 })

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/video_products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(pairs),
    cache: 'no-store',
  })
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 })
  const data = (await res.json()) as Array<{ id: string }>
  return NextResponse.json({ inserted: data.length })
}
