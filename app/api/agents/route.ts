import { NextRequest, NextResponse } from 'next/server'
import { bedrockService } from '@/lib/aws/bedrock'
import { db } from '@/lib/db/database'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const createAgentSchema = z.object({
  agentName: z.string().min(1, 'Agent name is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  foundationModel: z.string().min(1, 'Foundation model is required'),
  description: z.string().optional(),
  idleSessionTTL: z.number().min(60).max(3600).optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const agents = await db.getAgents()
    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createAgentSchema.parse(body)
    
    // Create agent in AWS Bedrock
    const result = await bedrockService.createAgent({
      agentName: validatedData.agentName,
      instructions: validatedData.instructions,
      foundationModel: validatedData.foundationModel,
      description: validatedData.description,
      idleSessionTTL: validatedData.idleSessionTTL,
    })
    
    if (!result.agent?.agentId) {
      throw new Error('Failed to create agent in AWS Bedrock')
    }
    
    // Save agent to database
    const agent = await db.createAgent({
      agentId: result.agent.agentId,
      agentArn: result.agent.agentArn || '',
      agentName: validatedData.agentName,
      description: validatedData.description || '',
      instructions: validatedData.instructions,
      foundationModel: validatedData.foundationModel,
      idleSessionTTL: validatedData.idleSessionTTL || 600,
      agentStatus: result.agent.agentStatus || 'PREPARED',
      tags: validatedData.tags || [],
      isFavorite: false,
      executionCount: 0,
    })
    
    return NextResponse.json(agent)
  } catch (error) {
    console.error('Failed to create agent:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create agent' },
      { status: 500 }
    )
  }
}
