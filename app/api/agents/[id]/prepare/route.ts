import { NextRequest, NextResponse } from 'next/server'
import { bedrockService } from '@/lib/aws/bedrock'
import { store } from '@/lib/db/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = store.getAgent(params.id)
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    if (!agent.agentId) {
      return NextResponse.json(
        { error: 'Agent ID not found' },
        { status: 400 }
      )
    }

    const result = await bedrockService.prepareAgent(agent.agentId)
    
    // Update agent status
    const updatedAgent = {
      ...agent,
      agentStatus: 'PREPARED' as const,
      updatedAt: new Date().toISOString(),
    }
    store.saveAgent(updatedAgent)
    
    return NextResponse.json({ 
      success: true, 
      agent: updatedAgent,
      preparation: result 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to prepare agent' },
      { status: 500 }
    )
  }
}
