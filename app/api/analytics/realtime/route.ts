import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics/analyticsService'

export async function GET(request: NextRequest) {
  try {
    const realTimeMetrics = await analyticsService.getRealTimeMetrics()
    
    return NextResponse.json({ realTimeMetrics })
  } catch (error) {
    console.error('Error fetching real-time metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch real-time metrics' },
      { status: 500 }
    )
  }
}
