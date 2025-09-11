import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ route: 'auth/supabase', method: 'GET' })
}

export async function POST() {
  return NextResponse.json({ route: 'auth/supabase', method: 'POST' })
}
