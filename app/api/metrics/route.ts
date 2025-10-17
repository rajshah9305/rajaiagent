import { NextResponse } from 'next/server'
import { store } from '@/lib/db/store'

export async function GET() {
  const agents = store.getAgents()
  const executions = store.getExecutions()
  
  const successfulExecutions = executions.filter(e => e.status === 'COMPLETE')
  const activeExecutions = executions.filter(e => e.status === 'RUNNING')
  
  const metrics = {
    totalAgents: agents.length,
    totalExecutions: executions.length,
    successRate: executions.length > 0 
      ? Math.round((successfulExecutions.length / executions.length) * 100)
      : 0,
    activeExecutions: activeExecutions.length,
  }
  
  return NextResponse.json(metrics)
}
