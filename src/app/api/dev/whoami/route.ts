import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ authenticated: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, role')
    .eq('id', user.id)
    .single()
  
  const profileData = profile as { id: string; username: string; role: string } | null

  return NextResponse.json({ 
    authenticated: true, 
    user_id: user.id, 
    email: user.email, 
    role: profileData?.role ?? null 
  })
}


