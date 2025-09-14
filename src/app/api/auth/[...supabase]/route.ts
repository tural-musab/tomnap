// This file is not needed for Supabase Auth
// Auth is handled through server actions and Supabase client
// Keeping this file as placeholder for future auth-related API endpoints

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Auth is handled through Supabase client and server actions' 
  })
}
