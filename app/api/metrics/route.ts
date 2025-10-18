import { NextResponse } from 'next/server'
import { db } from '@/lib/db/database'

export async function GET() {
  try {
    const metrics = await db.getDashboardMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
