import { NextRequest, NextResponse } from 'next/server'
import { toolRegistry } from '@/lib/tools/toolsService'

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const tool = toolRegistry.getTool(params.name)
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: tool.name,
      name: tool.name,
      displayName: tool.displayName,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      version: tool.version,
      schema: tool.getSchema()
    })
  } catch (error) {
    console.error('Error fetching tool:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { input, config } = await request.json()

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      )
    }

    const result = await toolRegistry.executeTool(params.name, input, config)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error executing tool:', error)
    return NextResponse.json(
      { error: 'Failed to execute tool' },
      { status: 500 }
    )
  }
}
