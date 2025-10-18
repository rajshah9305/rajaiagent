import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics/analyticsService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const toolUsage = await analyticsService.getToolUsage(timeRange)
    
    return NextResponse.json({ toolUsage })
  } catch (error) {
    console.error('Error fetching tool usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tool usage' },
      { status: 500 }
    )
  }
}
