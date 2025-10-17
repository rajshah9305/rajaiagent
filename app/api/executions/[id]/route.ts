import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/db/store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const execution = store.getExecution(params.id)
    if (!execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ execution })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch execution' },
      { status: 500 }
    )
  }
}
