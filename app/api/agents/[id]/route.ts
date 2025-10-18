import { NextRequest, NextResponse } from 'next/server'
import { bedrockService } from '@/lib/aws/bedrock'
import { db } from '@/lib/db/database'
import { z } from 'zod'

const updateAgentSchema = z.object({
  agentName: z.string().min(1).optional(),
  instructions: z.string().min(1).optional(),
  foundationModel: z.string().min(1).optional(),
  description: z.string().optional(),
  idleSessionTTL: z.number().min(60).max(3600).optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await db.getAgent(params.id)
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Failed to fetch agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateAgentSchema.parse(body)
    
    const agent = await db.getAgent(params.id)
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Update agent in AWS Bedrock if agentId exists
    if (agent.agentId) {
      await bedrockService.updateAgent(agent.agentId, {
        agentName: validatedData.agentName,
        instruction: validatedData.instructions,
        description: validatedData.description,
        foundationModel: validatedData.foundationModel,
        idleSessionTTLInSeconds: validatedData.idleSessionTTL,
      })
    }
    
    // Update agent in database
    const updatedAgent = await db.updateAgent(params.id, {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    })
    
    return NextResponse.json({ agent: updatedAgent })
  } catch (error) {
    console.error('Failed to update agent:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update agent' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await db.getAgent(params.id)
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Delete agent from AWS Bedrock if agentId exists
    if (agent.agentId) {
      await bedrockService.deleteAgent(agent.agentId)
    }
    
    // Delete agent from database
    await db.deleteAgent(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete agent:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete agent' },
      { status: 500 }
    )
  }
}
