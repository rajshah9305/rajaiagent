import { NextRequest, NextResponse } from 'next/server'
import { taskDelegator } from '@/lib/taskDelegation/taskDelegator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, taskName, description, priority, input, tools, deadline, dependencies } = body

    if (!agentId || !taskName || !description || !input) {
      return NextResponse.json(
        { error: 'Missing required fields: agentId, taskName, description, input' },
        { status: 400 }
      )
    }

    const result = await taskDelegator.delegateTask({
      agentId,
      taskName,
      description,
      priority: priority || 5,
      input,
      tools,
      deadline: deadline ? new Date(deadline) : undefined,
      dependencies
    })

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to delegate task' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error delegating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
