import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics/analyticsService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const agentPerformance = await analyticsService.getAgentPerformance(timeRange)
    
    return NextResponse.json({ agentPerformance })
  } catch (error) {
    console.error('Error fetching agent performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent performance' },
      { status: 500 }
    )
  }
}
