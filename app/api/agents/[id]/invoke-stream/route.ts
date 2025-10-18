import { NextRequest } from 'next/server'
import { bedrockService } from '@/lib/aws/bedrock'
import { db } from '@/lib/db/database'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const invokeAgentSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  sessionId: z.string().optional(),
  agentAliasId: z.string().default('TSTALIASID'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = invokeAgentSchema.parse(body)
    
    const agent = await db.getAgent(params.id)
    if (!agent) {
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!agent.agentId) {
      return new Response(
        JSON.stringify({ error: 'Agent not properly configured' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const executionId = nanoid()
    const sessionId = validatedData.sessionId || nanoid()
    const agentAliasId = validatedData.agentAliasId
    let execution: any = null

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Create initial execution record
          execution = await db.createExecution({
            agentId: params.id,
            sessionId,
            input: validatedData.input,
            status: 'RUNNING',
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
          })

          // Send execution start event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'execution', 
              execution 
            })}\n\n`)
          )

          // Create initial task
          const initialTask = await db.createTask({
            executionId: execution.id,
            taskName: 'Agent Processing',
            status: 'RUNNING',
            startTime: new Date().toISOString(),
            progress: 0,
          })

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'task', 
              task: initialTask 
            })}\n\n`)
          )

          // Stream agent response
          const stream = bedrockService.invokeAgentStream({
            agentId: agent.agentId,
            agentAliasId,
            sessionId,
            inputText: validatedData.input,
          })

          let fullOutput = ''
          for await (const event of stream) {
            if (event.type === 'chunk') {
              fullOutput += event.data
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ 
                  type: 'chunk', 
                  content: event.data 
                })}\n\n`)
              )
            } else if (event.type === 'error') {
              throw new Error(event.error)
            }
          }

          // Update task as complete
          const completedTask = await db.updateTask(initialTask.id, {
            status: 'COMPLETE',
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(initialTask.startTime).getTime(),
            progress: 100,
            output: fullOutput,
          })

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'task', 
              task: completedTask 
            })}\n\n`)
          )

          // Update execution as complete
          const completedExecution = await db.updateExecution(execution.id, {
            status: 'COMPLETE',
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(execution.startTime).getTime(),
            output: fullOutput,
          })

          // Update execution metrics
          await db.updateExecutionMetrics(execution.id, {
            totalTasks: 1,
            completedTasks: 1,
            failedTasks: 0,
            runningTasks: 0,
            averageTaskDuration: completedTask?.duration || 0,
            totalDuration: completedExecution?.duration || 0,
            throughput: 1,
            successRate: 100,
          })

          // Increment agent execution count
          await db.incrementExecutionCount(params.id)

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'execution', 
              execution: completedExecution 
            })}\n\n`)
          )

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'complete' 
            })}\n\n`)
          )
          
          controller.close()
        } catch (error: any) {
          console.error('Streaming error:', error)
          
          // Update execution as failed
          try {
            if (execution) {
              await db.updateExecution(execution.id, {
                status: 'FAILED',
                endTime: new Date().toISOString(),
                duration: Date.now() - new Date().getTime(),
              })
            }
          } catch (dbError) {
            console.error('Failed to update execution status:', dbError)
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'error', 
              error: error.message || 'Unknown error occurred'
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
        'X-Execution-Id': execution?.id || executionId,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Failed to start agent execution:', error)
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to start execution' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
