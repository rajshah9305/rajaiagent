import { NextRequest, NextResponse } from 'next/server'
import { bedrockService } from '@/lib/aws/bedrock'
import { store } from '@/lib/db/store'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  try {
    const agents = store.getAgents()
    return NextResponse.json({ agents })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For demo purposes, create a mock agent when AWS is not configured
    const isAWSConfigured = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    
    let result
    if (isAWSConfigured) {
      result = await bedrockService.createAgent(body)
    } else {
      // Mock response for demo
      result = {
        agent: {
          agentId: `agent_${nanoid()}`,
          agentArn: `arn:aws:bedrock:us-east-1:123456789012:agent/${nanoid()}`,
          agentStatus: 'PREPARED'
        }
      }
    }
    
    const agent = {
      id: nanoid(),
      agentId: result.agent?.agentId || '',
      agentArn: result.agent?.agentArn || '',
      agentName: body.agentName,
      description: body.description || '',
      instructions: body.instructions,
      foundationModel: body.foundationModel,
      idleSessionTTL: body.idleSessionTTL || 600,
      agentStatus: result.agent?.agentStatus || 'PREPARED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: body.tags || [],
      isFavorite: false,
      executionCount: 0,
    }
    
    store.saveAgent(agent)
    
    return NextResponse.json(agent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}
