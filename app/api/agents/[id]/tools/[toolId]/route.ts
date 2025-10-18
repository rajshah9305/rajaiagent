import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; toolId: string } }
) {
  try {
    const { isEnabled, config, priority } = await request.json()

    const updateData: any = {}
    if (typeof isEnabled === 'boolean') updateData.isEnabled = isEnabled
    if (config !== undefined) updateData.config = config ? JSON.stringify(config) : null
    if (typeof priority === 'number') updateData.priority = priority

    const agentTool = await prisma.agentTool.update({
      where: {
        agentId_toolId: {
          agentId: params.id,
          toolId: params.toolId
        }
      },
      data: updateData,
      include: { tool: true }
    })

    return NextResponse.json({ agentTool })
  } catch (error) {
    console.error('Error updating agent tool:', error)
    return NextResponse.json(
      { error: 'Failed to update agent tool' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; toolId: string } }
) {
  try {
    await prisma.agentTool.delete({
      where: {
        agentId_toolId: {
          agentId: params.id,
          toolId: params.toolId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing tool from agent:', error)
    return NextResponse.json(
      { error: 'Failed to remove tool from agent' },
      { status: 500 }
    )
  }
}
