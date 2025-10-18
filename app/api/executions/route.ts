import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { z } from 'zod'

const createExecutionSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  input: z.string().min(1, 'Input is required'),
  status: z.enum(['RUNNING', 'COMPLETE', 'FAILED', 'CANCELLED']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    
    let executions
    if (agentId) {
      executions = await db.getExecutionsByAgent(agentId)
    } else {
      executions = await db.getExecutions()
    }
    
    return NextResponse.json({ executions })
  } catch (error) {
    console.error('Failed to fetch executions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createExecutionSchema.parse(body)
    
    const execution = await db.createExecution({
      agentId: validatedData.agentId,
      sessionId: validatedData.sessionId,
      input: validatedData.input,
      status: validatedData.status || 'RUNNING',
      startTime: new Date().toISOString(),
      tasks: [],
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        runningTasks: 1,
        averageTaskDuration: 0,
        totalDuration: 0,
        throughput: 0,
        successRate: 0,
      },
    })
    
    return NextResponse.json(execution)
  } catch (error) {
    console.error('Failed to create execution:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create execution' },
      { status: 500 }
    )
  }
}