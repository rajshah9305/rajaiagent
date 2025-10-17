import { NextRequest } from 'next/server'
import { store } from '@/lib/db/store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const execution = store.getExecution(params.id)
  
  if (!execution) {
    return new Response('Execution not found', { status: 404 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      // Send initial execution data
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ 
          type: 'execution', 
          execution 
        })}\n\n`)
      )

      // Simulate real-time updates
      const interval = setInterval(() => {
        if (execution.status === 'RUNNING') {
          // Simulate task progress
          const updatedExecution = {
            ...execution,
            tasks: execution.tasks.map(task => ({
              ...task,
              progress: Math.min(task.progress + Math.random() * 20, 100)
            }))
          }
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'update', 
              execution: updatedExecution 
            })}\n\n`)
          )
        } else {
          clearInterval(interval)
        }
      }, 1000)

      // Cleanup after 30 seconds
      setTimeout(() => {
        clearInterval(interval)
        controller.close()
      }, 30000)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
