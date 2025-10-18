import { NextRequest, NextResponse } from 'next/server'
import { healthMonitor } from '@/lib/monitoring/healthMonitor'
import { withErrorHandling } from '@/lib/errorHandling/errorHandler'

async function healthCheckHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const detailed = searchParams.get('detailed') === 'true'

  if (detailed) {
    const metrics = await healthMonitor.getDetailedMetrics()
    return NextResponse.json(metrics)
  } else {
    const health = await healthMonitor.checkHealth()
    return NextResponse.json(health)
  }
}

export const GET = withErrorHandling(healthCheckHandler)
