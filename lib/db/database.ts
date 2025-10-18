import { PrismaClient } from '@prisma/client'
import { Agent, Execution, Task, ExecutionMetrics } from '@/types'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export class DatabaseService {
  // Agent operations
  async getAgents(): Promise<Agent[]> {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return agents.map(agent => ({
      ...agent,
      tags: JSON.parse(agent.tags || '[]'),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      lastExecutionTime: agent.lastExecutionTime?.toISOString()
    }))
  }

  async getAgent(id: string): Promise<Agent | null> {
    const agent = await prisma.agent.findUnique({
      where: { id }
    })
    
    if (!agent) return null
    
    return {
      ...agent,
      tags: JSON.parse(agent.tags || '[]'),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      lastExecutionTime: agent.lastExecutionTime?.toISOString()
    }
  }

  async createAgent(agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    const agent = await prisma.agent.create({
      data: {
        ...agentData,
        tags: JSON.stringify(agentData.tags || []),
        lastExecutionTime: agentData.lastExecutionTime ? new Date(agentData.lastExecutionTime) : null
      }
    })
    
    return {
      ...agent,
      tags: JSON.parse(agent.tags || '[]'),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      lastExecutionTime: agent.lastExecutionTime?.toISOString()
    }
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        ...updates,
        tags: updates.tags ? JSON.stringify(updates.tags) : undefined,
        lastExecutionTime: updates.lastExecutionTime ? new Date(updates.lastExecutionTime) : undefined
      }
    })
    
    return {
      ...agent,
      tags: JSON.parse(agent.tags || '[]'),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      lastExecutionTime: agent.lastExecutionTime?.toISOString()
    }
  }

  async deleteAgent(id: string): Promise<void> {
    await prisma.agent.delete({
      where: { id }
    })
  }

  async incrementExecutionCount(agentId: string): Promise<void> {
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        executionCount: { increment: 1 },
        lastExecutionTime: new Date()
      }
    })
  }

  // Execution operations
  async getExecutions(): Promise<Execution[]> {
    const executions = await prisma.execution.findMany({
      include: {
        tasks: true,
        metrics: true,
        agent: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return executions.map(execution => ({
      ...execution,
      startTime: execution.startTime.toISOString(),
      endTime: execution.endTime?.toISOString(),
      tasks: execution.tasks.map(task => ({
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString()
      })),
      agent: execution.agent ? {
        ...execution.agent,
        tags: JSON.parse(execution.agent.tags || '[]'),
        createdAt: execution.agent.createdAt.toISOString(),
        updatedAt: execution.agent.updatedAt.toISOString(),
        lastExecutionTime: execution.agent.lastExecutionTime?.toISOString()
      } : undefined
    }))
  }

  async getExecution(id: string): Promise<Execution | null> {
    const execution = await prisma.execution.findUnique({
      where: { id },
      include: {
        tasks: true,
        metrics: true,
        agent: true
      }
    })
    
    if (!execution) return null
    
    return {
      ...execution,
      startTime: execution.startTime.toISOString(),
      endTime: execution.endTime?.toISOString(),
      tasks: execution.tasks.map(task => ({
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString()
      })),
      agent: execution.agent ? {
        ...execution.agent,
        tags: JSON.parse(execution.agent.tags || '[]'),
        createdAt: execution.agent.createdAt.toISOString(),
        updatedAt: execution.agent.updatedAt.toISOString(),
        lastExecutionTime: execution.agent.lastExecutionTime?.toISOString()
      } : undefined
    }
  }

  async getExecutionsByAgent(agentId: string): Promise<Execution[]> {
    const executions = await prisma.execution.findMany({
      where: { agentId },
      include: {
        tasks: true,
        metrics: true,
        agent: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return executions.map(execution => ({
      ...execution,
      startTime: execution.startTime.toISOString(),
      endTime: execution.endTime?.toISOString(),
      tasks: execution.tasks.map(task => ({
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString()
      })),
      agent: execution.agent ? {
        ...execution.agent,
        tags: JSON.parse(execution.agent.tags || '[]'),
        createdAt: execution.agent.createdAt.toISOString(),
        updatedAt: execution.agent.updatedAt.toISOString(),
        lastExecutionTime: execution.agent.lastExecutionTime?.toISOString()
      } : undefined
    }))
  }

  async createExecution(executionData: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Execution> {
    const { agent, ...data } = executionData
    const execution = await prisma.execution.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        tasks: {
          create: data.tasks?.map(task => ({
            ...task,
            startTime: new Date(task.startTime),
            endTime: task.endTime ? new Date(task.endTime) : null
          })) || []
        },
        metrics: data.metrics ? {
          create: data.metrics
        } : undefined
      },
      include: {
        tasks: true,
        metrics: true,
        agent: true
      }
    })
    
    return {
      ...execution,
      startTime: execution.startTime.toISOString(),
      endTime: execution.endTime?.toISOString(),
      tasks: execution.tasks.map(task => ({
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString()
      })),
      agent: execution.agent ? {
        ...execution.agent,
        tags: JSON.parse(execution.agent.tags || '[]'),
        createdAt: execution.agent.createdAt.toISOString(),
        updatedAt: execution.agent.updatedAt.toISOString(),
        lastExecutionTime: execution.agent.lastExecutionTime?.toISOString()
      } : undefined
    }
  }

  async updateExecution(id: string, updates: Partial<Execution>): Promise<Execution | null> {
    const { agent, metrics, tasks, ...data } = updates
    const execution = await prisma.execution.update({
      where: { id },
      data: {
        ...data,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined
      },
      include: {
        tasks: true,
        metrics: true,
        agent: true
      }
    })
    
    return {
      ...execution,
      startTime: execution.startTime.toISOString(),
      endTime: execution.endTime?.toISOString(),
      tasks: execution.tasks.map(task => ({
        ...task,
        startTime: task.startTime.toISOString(),
        endTime: task.endTime?.toISOString()
      })),
      agent: execution.agent ? {
        ...execution.agent,
        tags: JSON.parse(execution.agent.tags || '[]'),
        createdAt: execution.agent.createdAt.toISOString(),
        updatedAt: execution.agent.updatedAt.toISOString(),
        lastExecutionTime: execution.agent.lastExecutionTime?.toISOString()
      } : undefined
    }
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        startTime: new Date(taskData.startTime),
        endTime: taskData.endTime ? new Date(taskData.endTime) : null
      }
    })
    
    return {
      ...task,
      startTime: task.startTime.toISOString(),
      endTime: task.endTime?.toISOString()
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...updates,
        startTime: updates.startTime ? new Date(updates.startTime) : undefined,
        endTime: updates.endTime ? new Date(updates.endTime) : undefined
      }
    })
    
    return {
      ...task,
      startTime: task.startTime.toISOString(),
      endTime: task.endTime?.toISOString()
    }
  }

  async updateExecutionMetrics(executionId: string, metrics: ExecutionMetrics): Promise<void> {
    await prisma.executionMetrics.upsert({
      where: { executionId },
      create: {
        executionId,
        ...metrics
      },
      update: metrics
    })
  }

  // Analytics operations
  async getAgentStats(agentId: string) {
    const executions = await prisma.execution.findMany({
      where: { agentId },
      include: { metrics: true }
    })

    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => e.status === 'COMPLETE').length
    const failedExecutions = executions.filter(e => e.status === 'FAILED').length
    const avgDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0) / totalExecutions || 0

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      avgDuration
    }
  }

  async getDashboardMetrics() {
    const [totalAgents, totalExecutions, recentExecutions] = await Promise.all([
      prisma.agent.count(),
      prisma.execution.count(),
      prisma.execution.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { agent: true }
      })
    ])

    const successfulExecutions = await prisma.execution.count({
      where: { status: 'COMPLETE' }
    })

    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0

    return {
      totalAgents,
      totalExecutions,
      successfulExecutions,
      successRate,
      recentExecutions: recentExecutions.map(execution => ({
        ...execution,
        startTime: execution.startTime.toISOString(),
        endTime: execution.endTime?.toISOString()
      }))
    }
  }
}

export const db = new DatabaseService()
