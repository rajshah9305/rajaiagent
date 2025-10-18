import { PrismaClient } from '@prisma/client'
import { toolRegistry } from '@/lib/tools/toolsService'
import { Agent, Task, ToolExecution } from '@/types'

const prisma = new PrismaClient()

export interface TaskDelegationRequest {
  agentId: string
  taskName: string
  description: string
  priority: number
  input: any
  tools?: string[]
  deadline?: Date
  dependencies?: string[]
}

export interface TaskDelegationResult {
  success: boolean
  taskId?: string
  executionId?: string
  error?: string
  estimatedDuration?: number
}

export class TaskDelegator {
  async delegateTask(request: TaskDelegationRequest): Promise<TaskDelegationResult> {
    try {
      // Create execution
      const execution = await prisma.execution.create({
        data: {
          agentId: request.agentId,
          sessionId: `session_${Date.now()}`,
          input: JSON.stringify(request.input),
          status: 'RUNNING'
        }
      })

      // Create task
      const task = await prisma.task.create({
        data: {
          executionId: execution.id,
          taskName: request.taskName,
          status: 'PENDING',
          progress: 0
        }
      })

      // Get agent tools
      const agentTools = await prisma.agentTool.findMany({
        where: {
          agentId: request.agentId,
          isEnabled: true
        },
        include: { tool: true },
        orderBy: { priority: 'desc' }
      })

      // Filter tools if specific tools are requested
      const availableTools = request.tools 
        ? agentTools.filter(at => request.tools!.includes(at.tool.name))
        : agentTools

      // Estimate duration based on tools and complexity
      const estimatedDuration = this.estimateTaskDuration(request, availableTools)

      // Start task execution
      const taskForExecution: Task = {
        ...task,
        startTime: task.startTime?.toISOString() || new Date().toISOString(),
        endTime: task.endTime?.toISOString() || null
      }
      this.executeTask(taskForExecution, execution, availableTools, request.input)

      return {
        success: true,
        taskId: task.id,
        executionId: execution.id,
        estimatedDuration
      }
    } catch (error) {
      console.error('Error delegating task:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async executeTask(
    task: Task,
    execution: any,
    agentTools: any[],
    input: any
  ) {
    try {
      // Update task status
      await prisma.task.update({
        where: { id: task.id },
        data: { status: 'RUNNING', startTime: new Date() }
      })

      const toolExecutions: ToolExecution[] = []
      let completedTools = 0
      const totalTools = agentTools.length

      // Execute tools in parallel
      const toolPromises = agentTools.map(async (agentTool) => {
        try {
          const toolExecution = await this.executeTool(
            agentTool.tool.name,
            input,
            agentTool.config ? JSON.parse(agentTool.config) : {},
            execution.id,
            task.id
          )
          
          toolExecutions.push(toolExecution)
          completedTools++
          
          // Update task progress
          const progress = Math.round((completedTools / totalTools) * 100)
          await prisma.task.update({
            where: { id: task.id },
            data: { progress }
          })
          
          return toolExecution
        } catch (error) {
          console.error(`Error executing tool ${agentTool.tool.name}:`, error)
          return null
        }
      })

      // Wait for all tools to complete
      const results = await Promise.all(toolPromises)
      const successfulResults = results.filter(r => r && r.status === 'COMPLETE')

      // Determine task completion status
      const taskStatus = successfulResults.length === totalTools ? 'COMPLETE' : 'ERROR'
      const taskOutput = this.generateTaskOutput(successfulResults, input)

      // Update task
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: taskStatus,
          endTime: new Date(),
          duration: Date.now() - new Date(task.startTime).getTime(),
          output: taskOutput,
          progress: 100
        }
      })

      // Update execution
      await prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: taskStatus,
          endTime: new Date(),
          duration: Date.now() - new Date(execution.startTime).getTime(),
          output: taskOutput
        }
      })

      // Update execution metrics
      await this.updateExecutionMetrics(execution.id, toolExecutions)

    } catch (error) {
      console.error('Error executing task:', error)
      
      // Mark task as failed
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: 'ERROR',
          endTime: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    }
  }

  private async executeTool(
    toolName: string,
    input: any,
    config: any,
    executionId: string,
    taskId: string
  ): Promise<ToolExecution> {
    const startTime = new Date()
    let toolExecution: any = null
    
    try {
      // Create tool execution record
      toolExecution = await prisma.toolExecution.create({
        data: {
          toolId: toolName, // Using tool name as ID for simplicity
          executionId,
          taskId,
          input: JSON.stringify(input),
          status: 'RUNNING',
          startTime
        }
      })

      // Execute the tool
      const result = await toolRegistry.executeTool(toolName, input, config)
      
      const endTime = new Date()
      const duration = endTime.getTime() - startTime.getTime()

      // Update tool execution
      const updatedToolExecution = await prisma.toolExecution.update({
        where: { id: toolExecution.id },
        data: {
          output: result.success ? JSON.stringify(result.data) : null,
          status: result.success ? 'COMPLETE' : 'ERROR',
          endTime,
          duration,
          error: result.error || null,
          metadata: result.metadata ? JSON.stringify(result.metadata) : null
        }
      })

      return {
        ...updatedToolExecution,
        startTime: updatedToolExecution.startTime.toISOString(),
        endTime: updatedToolExecution.endTime?.toISOString(),
        createdAt: updatedToolExecution.createdAt.toISOString(),
        updatedAt: updatedToolExecution.updatedAt.toISOString()
      } as ToolExecution
    } catch (error) {
      const endTime = new Date()
      const duration = endTime.getTime() - startTime.getTime()

      // Update tool execution with error if it was created
      if (toolExecution) {
        await prisma.toolExecution.update({
          where: { 
            id: toolExecution.id
          },
          data: {
            status: 'ERROR',
            endTime,
            duration,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })
      }

      throw error
    }
  }

  private generateTaskOutput(successfulResults: any[], input: any): string {
    const output = {
      summary: `Task completed with ${successfulResults.length} successful tool executions`,
      results: successfulResults.map(r => ({
        tool: r.toolId,
        status: r.status,
        output: r.output ? JSON.parse(r.output) : null,
        duration: r.duration
      })),
      input,
      timestamp: new Date().toISOString()
    }

    return JSON.stringify(output, null, 2)
  }

  private async updateExecutionMetrics(executionId: string, toolExecutions: ToolExecution[]) {
    const totalTasks = toolExecutions.length
    const completedTasks = toolExecutions.filter(te => te.status === 'COMPLETE').length
    const failedTasks = toolExecutions.filter(te => te.status === 'ERROR').length
    const runningTasks = toolExecutions.filter(te => te.status === 'RUNNING').length
    
    const durations = toolExecutions
      .filter(te => te.duration)
      .map(te => te.duration!)
    
    const averageTaskDuration = durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0
    
    const totalDuration = durations.reduce((a, b) => a + b, 0)
    const throughput = totalDuration > 0 ? (completedTasks / totalDuration) * 1000 : 0
    const successRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    await prisma.executionMetrics.upsert({
      where: { executionId },
      update: {
        totalTasks,
        completedTasks,
        failedTasks,
        runningTasks,
        averageTaskDuration,
        totalDuration,
        throughput,
        successRate
      },
      create: {
        executionId,
        totalTasks,
        completedTasks,
        failedTasks,
        runningTasks,
        averageTaskDuration,
        totalDuration,
        throughput,
        successRate
      }
    })
  }

  private estimateTaskDuration(request: TaskDelegationRequest, tools: any[]): number {
    // Base duration estimation
    let baseDuration = 5000 // 5 seconds base
    
    // Add complexity based on input size
    const inputComplexity = JSON.stringify(request.input).length
    baseDuration += inputComplexity * 0.1
    
    // Add duration per tool
    const toolDuration = tools.length * 2000 // 2 seconds per tool
    
    // Add priority multiplier
    const priorityMultiplier = request.priority > 5 ? 0.5 : 1.0
    
    return Math.round((baseDuration + toolDuration) * priorityMultiplier)
  }

  async getTaskStatus(taskId: string): Promise<Task | null> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          execution: true,
          toolExecutions: {
            include: { tool: true }
          }
        }
      })
      
      if (!task) {
        return null
      }
      
      return {
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString() || null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      } as Task
    } catch (error) {
      console.error('Error fetching task status:', error)
      return null
    }
  }

  async getAgentTasks(agentId: string, limit = 10): Promise<Task[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          execution: { agentId }
        },
        include: {
          execution: true,
          toolExecutions: {
            include: { tool: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
      
      return tasks.map(task => ({
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString() || null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      })) as Task[]
    } catch (error) {
      console.error('Error fetching agent tasks:', error)
      return []
    }
  }
}

export const taskDelegator = new TaskDelegator()
