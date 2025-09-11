import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ videos: [] })
}

export async function POST() {
  return NextResponse.json({ created: true })
}
