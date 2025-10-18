import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics/analyticsService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const timeSeriesData = await analyticsService.getTimeSeriesData(timeRange)
    
    return NextResponse.json({ timeSeriesData })
  } catch (error) {
    console.error('Error fetching time series data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time series data' },
      { status: 500 }
    )
  }
}
