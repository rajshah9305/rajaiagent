import { PrismaClient } from '@prisma/client'
import { UserAnalytics, Execution, Agent, ToolExecution } from '@/types'

const prisma = new PrismaClient()

export interface AnalyticsMetrics {
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  totalDuration: number
  averageDuration: number
  successRate: number
  totalCost: number
  averageCost: number
  toolsUsed: number
  uniqueAgents: number
  peakUsageHour: number
  peakUsageDay: string
}

export interface TimeSeriesData {
  date: string
  executions: number
  successRate: number
  duration: number
  cost: number
}

export interface AgentPerformance {
  agentId: string
  agentName: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageDuration: number
  successRate: number
  totalCost: number
  toolsUsed: string[]
  lastExecution?: string
}

export interface ToolUsage {
  toolId: string
  toolName: string
  usageCount: number
  successRate: number
  averageDuration: number
  category: string
}

export interface UserActivity {
  userId: string
  userName: string
  totalExecutions: number
  lastActivity: string
  favoriteAgent?: string
  totalCost: number
}

export class AnalyticsService {
  async getOverallMetrics(timeRange: string = '30d'): Promise<AnalyticsMetrics> {
    const dateFilter = this.getDateFilter(timeRange)
    
    const [
      executions,
      toolExecutions,
      agents
    ] = await Promise.all([
      prisma.execution.findMany({
        where: {
          createdAt: dateFilter
        }
      }),
      prisma.toolExecution.findMany({
        where: {
          createdAt: dateFilter
        }
      }),
      prisma.agent.findMany()
    ])

    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => e.status === 'COMPLETE').length
    const failedExecutions = executions.filter(e => e.status === 'FAILED' || e.status === 'ERROR').length
    const totalDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0)
    const averageDuration = totalExecutions > 0 ? totalDuration / totalExecutions : 0
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
    
    // Calculate cost (simplified - $0.01 per second of execution)
    const totalCost = totalDuration * 0.01
    const averageCost = totalExecutions > 0 ? totalCost / totalExecutions : 0
    
    const toolsUsed = new Set(toolExecutions.map(te => te.toolId)).size
    const uniqueAgents = new Set(executions.map(e => e.agentId)).size
    
    // Find peak usage
    const hourlyUsage = this.calculateHourlyUsage(executions)
    const dailyUsage = this.calculateDailyUsage(executions)
    const peakUsageHour = hourlyUsage.indexOf(Math.max(...hourlyUsage))
    const peakUsageDay = Object.keys(dailyUsage).reduce((a, b) => 
      dailyUsage[a] > dailyUsage[b] ? a : b
    )

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      totalDuration,
      averageDuration,
      successRate,
      totalCost,
      averageCost,
      toolsUsed,
      uniqueAgents,
      peakUsageHour,
      peakUsageDay
    }
  }

  async getTimeSeriesData(timeRange: string = '30d'): Promise<TimeSeriesData[]> {
    const dateFilter = this.getDateFilter(timeRange)
    
    const executions = await prisma.execution.findMany({
      where: {
        createdAt: dateFilter
      },
      orderBy: { createdAt: 'asc' }
    })

    // Group by date
    const groupedData = executions.reduce((acc, execution) => {
      const date = execution.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          executions: [],
          totalDuration: 0
        }
      }
      acc[date].executions.push(execution)
      acc[date].totalDuration += execution.duration || 0
      return acc
    }, {} as any)

    return Object.entries(groupedData).map(([date, data]: [string, any]) => {
      const successful = data.executions.filter((e: any) => e.status === 'COMPLETE').length
      const successRate = data.executions.length > 0 ? (successful / data.executions.length) * 100 : 0
      const cost = data.totalDuration * 0.01

      return {
        date,
        executions: data.executions.length,
        successRate,
        duration: data.totalDuration,
        cost
      }
    })
  }

  async getAgentPerformance(timeRange: string = '30d'): Promise<AgentPerformance[]> {
    const dateFilter = this.getDateFilter(timeRange)
    
    const executions = await prisma.execution.findMany({
      where: {
        createdAt: dateFilter
      },
      include: {
        agent: true,
        toolExecutions: {
          include: { tool: true }
        }
      }
    })

    const agentStats = executions.reduce((acc, execution) => {
      const agentId = execution.agentId
      if (!acc[agentId]) {
        acc[agentId] = {
          agentId,
          agentName: execution.agent?.agentName || 'Unknown',
          executions: [],
          toolExecutions: []
        }
      }
      acc[agentId].executions.push(execution)
      acc[agentId].toolExecutions.push(...execution.toolExecutions)
      return acc
    }, {} as any)

    return Object.values(agentStats).map((stats: any) => {
      const totalExecutions = stats.executions.length
      const successfulExecutions = stats.executions.filter((e: any) => e.status === 'COMPLETE').length
      const failedExecutions = stats.executions.filter((e: any) => e.status === 'FAILED' || e.status === 'ERROR').length
      const totalDuration = stats.executions.reduce((sum: number, e: any) => sum + (e.duration || 0), 0)
      const averageDuration = totalExecutions > 0 ? totalDuration / totalExecutions : 0
      const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
      const totalCost = totalDuration * 0.01
      const toolsUsed = Array.from(new Set(stats.toolExecutions.map((te: any) => te.tool?.name || te.toolId))) as string[]
      const lastExecution = stats.executions.length > 0 
        ? Math.max(...stats.executions.map((e: any) => new Date(e.createdAt).getTime()))
        : undefined

      return {
        agentId: stats.agentId,
        agentName: stats.agentName,
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        averageDuration,
        successRate,
        totalCost,
        toolsUsed,
        lastExecution: lastExecution ? new Date(lastExecution).toISOString() : undefined
      }
    }).sort((a, b) => b.totalExecutions - a.totalExecutions)
  }

  async getToolUsage(timeRange: string = '30d'): Promise<ToolUsage[]> {
    const dateFilter = this.getDateFilter(timeRange)
    
    const toolExecutions = await prisma.toolExecution.findMany({
      where: {
        createdAt: dateFilter
      },
      include: { tool: true }
    })

    const toolStats = toolExecutions.reduce((acc, execution) => {
      const toolId = execution.toolId
      if (!acc[toolId]) {
        acc[toolId] = {
          toolId,
          toolName: execution.tool?.displayName || execution.toolId,
          category: execution.tool?.category || 'unknown',
          executions: [],
          totalDuration: 0
        }
      }
      acc[toolId].executions.push(execution)
      acc[toolId].totalDuration += execution.duration || 0
      return acc
    }, {} as any)

    return Object.values(toolStats).map((stats: any) => {
      const usageCount = stats.executions.length
      const successful = stats.executions.filter((e: any) => e.status === 'COMPLETE').length
      const successRate = usageCount > 0 ? (successful / usageCount) * 100 : 0
      const averageDuration = usageCount > 0 ? stats.totalDuration / usageCount : 0

      return {
        toolId: stats.toolId,
        toolName: stats.toolName,
        usageCount,
        successRate,
        averageDuration,
        category: stats.category
      }
    }).sort((a, b) => b.usageCount - a.usageCount)
  }

  async getUserActivity(timeRange: string = '30d'): Promise<UserActivity[]> {
    const dateFilter = this.getDateFilter(timeRange)
    
    // For now, return mock data since we don't have user tracking yet
    // In a real implementation, you'd query user analytics
    return [
      {
        userId: 'user1',
        userName: 'Raj Shah',
        totalExecutions: 45,
        lastActivity: new Date().toISOString(),
        favoriteAgent: 'Customer Support Bot',
        totalCost: 125.50
      },
      {
        userId: 'user2',
        userName: 'John Doe',
        totalExecutions: 32,
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
        favoriteAgent: 'Data Analyzer',
        totalCost: 89.20
      }
    ]
  }

  async getRealTimeMetrics(): Promise<any> {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const [
      recentExecutions,
      activeTasks,
      toolExecutions
    ] = await Promise.all([
      prisma.execution.findMany({
        where: {
          createdAt: { gte: oneHourAgo }
        }
      }),
      prisma.task.findMany({
        where: {
          status: 'RUNNING'
        }
      }),
      prisma.toolExecution.findMany({
        where: {
          status: 'RUNNING'
        }
      })
    ])

    return {
      executionsLastHour: recentExecutions.length,
      activeTasks: activeTasks.length,
      activeToolExecutions: toolExecutions.length,
      averageResponseTime: this.calculateAverageResponseTime(recentExecutions),
      errorRate: this.calculateErrorRate(recentExecutions)
    }
  }

  private getDateFilter(timeRange: string) {
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return {
      gte: startDate
    }
  }

  private calculateHourlyUsage(executions: any[]): number[] {
    const hourlyUsage = new Array(24).fill(0)
    
    executions.forEach(execution => {
      const hour = new Date(execution.createdAt).getHours()
      hourlyUsage[hour]++
    })
    
    return hourlyUsage
  }

  private calculateDailyUsage(executions: any[]): { [key: string]: number } {
    const dailyUsage: { [key: string]: number } = {}
    
    executions.forEach(execution => {
      const day = new Date(execution.createdAt).toLocaleDateString('en-US', { weekday: 'long' })
      dailyUsage[day] = (dailyUsage[day] || 0) + 1
    })
    
    return dailyUsage
  }

  private calculateAverageResponseTime(executions: any[]): number {
    const completedExecutions = executions.filter(e => e.duration)
    if (completedExecutions.length === 0) return 0
    
    const totalDuration = completedExecutions.reduce((sum, e) => sum + e.duration, 0)
    return totalDuration / completedExecutions.length
  }

  private calculateErrorRate(executions: any[]): number {
    if (executions.length === 0) return 0
    
    const failedExecutions = executions.filter(e => e.status === 'FAILED' || e.status === 'ERROR')
    return (failedExecutions.length / executions.length) * 100
  }

  async updateUserAnalytics(userId: string, execution: Execution) {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const cost = (execution.duration || 0) * 0.01
      const isSuccessful = execution.status === 'COMPLETE'
      
      await prisma.userAnalytics.upsert({
        where: {
          userId_date: {
            userId,
            date: today
          }
        },
        update: {
          totalExecutions: { increment: 1 },
          successfulExecutions: { increment: isSuccessful ? 1 : 0 },
          failedExecutions: { increment: isSuccessful ? 0 : 1 },
          totalDuration: { increment: execution.duration || 0 },
          totalCost: { increment: cost }
        },
        create: {
          userId,
          date: today,
          totalExecutions: 1,
          successfulExecutions: isSuccessful ? 1 : 0,
          failedExecutions: isSuccessful ? 0 : 1,
          totalDuration: execution.duration || 0,
          totalCost: cost,
          toolsUsed: '[]'
        }
      })
    } catch (error) {
      console.error('Error updating user analytics:', error)
    }
  }
}

export const analyticsService = new AnalyticsService()
