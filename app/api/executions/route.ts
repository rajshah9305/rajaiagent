import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/db/store'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  try {
    const executions = store.getExecutions()
    return NextResponse.json({ executions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const execution = {
      id: nanoid(),
      agentId: body.agentId,
      sessionId: body.sessionId,
      input: body.input,
      status: body.status || 'RUNNING',
      startTime: body.startTime || new Date().toISOString(),
      endTime: body.endTime,
      duration: body.duration,
      output: body.output,
      tasks: body.tasks || [],
      metrics: body.metrics || {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        runningTasks: 0,
        averageTaskDuration: 0,
        totalDuration: 0,
        throughput: 0,
        successRate: 0,
      },
    }
    
    store.saveExecution(execution)
    
    return NextResponse.json(execution)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create execution' },
      { status: 500 }
    )
  }
}