import { NextRequest, NextResponse } from 'next/server'
import { getApiDocs } from '@/lib/swagger'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const spec = await getApiDocs()
    return NextResponse.json(spec, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300, s-maxage=600'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to generate API documentation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}