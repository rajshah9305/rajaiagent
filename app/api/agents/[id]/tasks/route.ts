import { NextRequest, NextResponse } from 'next/server'
import { taskDelegator } from '@/lib/taskDelegation/taskDelegator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const tasks = await taskDelegator.getAgentTasks(params.id, limit)
    
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching agent tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent tasks' },
      { status: 500 }
    )
  }
}
