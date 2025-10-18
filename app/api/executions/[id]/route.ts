import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const execution = await db.getExecution(params.id)
    if (!execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ execution })
  } catch (error) {
    console.error('Failed to fetch execution:', error)
    return NextResponse.json(
      { error: 'Failed to fetch execution' },
      { status: 500 }
    )
  }
}
