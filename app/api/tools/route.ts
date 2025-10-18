import { NextRequest, NextResponse } from 'next/server'
import { toolRegistry } from '@/lib/tools/toolsService'

export async function GET() {
  try {
    const tools = toolRegistry.getAllTools().map(tool => ({
      id: tool.name,
      name: tool.name,
      displayName: tool.displayName,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      version: tool.version,
      schema: tool.getSchema()
    }))

    return NextResponse.json({ tools })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { toolName, input, config } = await request.json()

    if (!toolName || !input) {
      return NextResponse.json(
        { error: 'Tool name and input are required' },
        { status: 400 }
      )
    }

    const result = await toolRegistry.executeTool(toolName, input, config)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error executing tool:', error)
    return NextResponse.json(
      { error: 'Failed to execute tool' },
      { status: 500 }
    )
  }
}
