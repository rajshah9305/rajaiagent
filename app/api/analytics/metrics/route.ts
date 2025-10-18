import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics/analyticsService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const metrics = await analyticsService.getOverallMetrics(timeRange)
    
    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching analytics metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    )
  }
}
