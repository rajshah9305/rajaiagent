import { NextRequest } from 'next/server'
import { bedrockService } from '@/lib/aws/bedrock'
import { store } from '@/lib/db/store'
import { nanoid } from 'nanoid'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const executionId = nanoid()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const execution = {
          id: executionId,
          agentId: params.id,
          sessionId: body.sessionId,
          input: body.input,
          status: 'RUNNING' as const,
          startTime: new Date().toISOString(),
          tasks: [],
          metrics: {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            runningTasks: 1,
            averageTaskDuration: 0,
            totalDuration: 0,
            throughput: 0,
            successRate: 0,
          },
        }

        store.saveExecution(execution)

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'execution', 
            execution 
          })}\n\n`)
        )

        const agent = store.getAgent(params.id)
        if (agent && agent.agentId) {
          const stream = bedrockService.invokeAgentStream({
            agentId: agent.agentId,
            agentAliasId: body.agentAliasId,
            sessionId: body.sessionId,
            inputText: body.input,
          })

          for await (const event of stream) {
            if (event.type === 'chunk') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ 
                  type: 'chunk', 
                  content: event.data 
                })}\n\n`)
              )
            }
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete' 
          })}\n\n`)
        )
        
        controller.close()
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: error.message 
          })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Execution-Id': executionId,
    },
  })
}
