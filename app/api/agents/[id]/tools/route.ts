import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentTools = await prisma.agentTool.findMany({
      where: { agentId: params.id },
      include: { tool: true },
      orderBy: { priority: 'desc' }
    })

    return NextResponse.json({ agentTools })
  } catch (error) {
    console.error('Error fetching agent tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent tools' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { toolId, isEnabled = true, config, priority = 0 } = await request.json()

    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      )
    }

    // Check if tool is already assigned to agent
    const existingAgentTool = await prisma.agentTool.findUnique({
      where: {
        agentId_toolId: {
          agentId: params.id,
          toolId
        }
      }
    })

    if (existingAgentTool) {
      return NextResponse.json(
        { error: 'Tool is already assigned to this agent' },
        { status: 400 }
      )
    }

    const agentTool = await prisma.agentTool.create({
      data: {
        agentId: params.id,
        toolId,
        isEnabled,
        config: config ? JSON.stringify(config) : null,
        priority
      },
      include: { tool: true }
    })

    return NextResponse.json({ agentTool })
  } catch (error) {
    console.error('Error adding tool to agent:', error)
    return NextResponse.json(
      { error: 'Failed to add tool to agent' },
      { status: 500 }
    )
  }
}
