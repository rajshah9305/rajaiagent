import { PrismaClient } from '@prisma/client'
import { bedrockService } from '@/lib/aws/bedrock'
import { rateLimiter } from '@/lib/rateLimiting/rateLimiter'
import { errorHandler } from '@/lib/errorHandling/errorHandler'

const prisma = new PrismaClient()

export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  message?: string
  responseTime?: number
  details?: any
  timestamp: string
}

export interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded'
  checks: HealthCheck[]
  timestamp: string
  uptime: number
  version: string
}

export class HealthMonitor {
  private static instance: HealthMonitor
  private startTime: number
  private healthHistory: SystemHealth[] = []
  private maxHistorySize = 100

  private constructor() {
    this.startTime = Date.now()
  }

  public static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor()
    }
    return HealthMonitor.instance
  }

  public async checkHealth(): Promise<SystemHealth> {
    const checks: HealthCheck[] = []
    const timestamp = new Date().toISOString()

    // Database health check
    const dbCheck = await this.checkDatabase()
    checks.push(dbCheck)

    // AWS Bedrock health check
    const bedrockCheck = await this.checkBedrock()
    checks.push(bedrockCheck)

    // Memory health check
    const memoryCheck = this.checkMemory()
    checks.push(memoryCheck)

    // Rate limiter health check
    const rateLimiterCheck = this.checkRateLimiter()
    checks.push(rateLimiterCheck)

    // Error handler health check
    const errorHandlerCheck = this.checkErrorHandler()
    checks.push(errorHandlerCheck)

    // Determine overall health
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length
    const degradedCount = checks.filter(c => c.status === 'degraded').length

    let overall: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    if (unhealthyCount > 0) {
      overall = 'unhealthy'
    } else if (degradedCount > 0) {
      overall = 'degraded'
    }

    const systemHealth: SystemHealth = {
      overall,
      checks,
      timestamp,
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0'
    }

    // Store in history
    this.healthHistory.unshift(systemHealth)
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory = this.healthHistory.slice(0, this.maxHistorySize)
    }

    return systemHealth
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now()
    try {
      await prisma.$queryRaw`SELECT 1`
      const responseTime = Date.now() - startTime
      
      return {
        name: 'database',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        message: responseTime < 1000 ? 'Database connection healthy' : 'Database response slow',
        responseTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        message: 'Database connection failed',
        responseTime: Date.now() - startTime,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  private async checkBedrock(): Promise<HealthCheck> {
    const startTime = Date.now()
    try {
      // Try to list agents to check Bedrock connectivity
      await bedrockService.listAgents(1)
      const responseTime = Date.now() - startTime
      
      return {
        name: 'aws_bedrock',
        status: responseTime < 5000 ? 'healthy' : 'degraded',
        message: responseTime < 5000 ? 'AWS Bedrock service healthy' : 'AWS Bedrock response slow',
        responseTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        name: 'aws_bedrock',
        status: 'unhealthy',
        message: 'AWS Bedrock service unavailable',
        responseTime: Date.now() - startTime,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  private checkMemory(): HealthCheck {
    const memUsage = process.memoryUsage()
    const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024)
    const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    const externalMB = Math.round(memUsage.external / 1024 / 1024)
    const rssMB = Math.round(memUsage.rss / 1024 / 1024)

    const memoryUsagePercent = (usedMB / totalMB) * 100
    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    let message = 'Memory usage normal'

    if (memoryUsagePercent > 90) {
      status = 'unhealthy'
      message = 'Memory usage critical'
    } else if (memoryUsagePercent > 75) {
      status = 'degraded'
      message = 'Memory usage high'
    }

    return {
      name: 'memory',
      status,
      message,
      details: {
        heapTotal: totalMB,
        heapUsed: usedMB,
        external: externalMB,
        rss: rssMB,
        usagePercent: Math.round(memoryUsagePercent)
      },
      timestamp: new Date().toISOString()
    }
  }

  private checkRateLimiter(): HealthCheck {
    const stats = rateLimiter.getStats()
    const activeEntries = stats.entries.length

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    let message = 'Rate limiter operating normally'

    if (activeEntries > 10000) {
      status = 'degraded'
      message = 'High number of rate limit entries'
    }

    return {
      name: 'rate_limiter',
      status,
      message,
      details: {
        totalKeys: stats.totalKeys,
        activeEntries
      },
      timestamp: new Date().toISOString()
    }
  }

  private checkErrorHandler(): HealthCheck {
    const errorStats = errorHandler.getErrorStats()
    const recentErrors = errorStats.recent.length
    const totalErrors = errorStats.total

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    let message = 'Error handling normal'

    if (recentErrors > 50) {
      status = 'unhealthy'
      message = 'High error rate detected'
    } else if (recentErrors > 20) {
      status = 'degraded'
      message = 'Elevated error rate'
    }

    return {
      name: 'error_handler',
      status,
      message,
      details: {
        totalErrors,
        recentErrors,
        errorTypes: errorStats.byType
      },
      timestamp: new Date().toISOString()
    }
  }

  public getHealthHistory(limit: number = 10): SystemHealth[] {
    return this.healthHistory.slice(0, limit)
  }

  public getUptime(): number {
    return Date.now() - this.startTime
  }

  public getMetrics(): any {
    const currentHealth = this.healthHistory[0]
    const uptime = this.getUptime()
    
    return {
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        minutes: Math.floor(uptime / (1000 * 60)),
        hours: Math.floor(uptime / (1000 * 60 * 60)),
        days: Math.floor(uptime / (1000 * 60 * 60 * 24))
      },
      currentHealth: currentHealth?.overall || 'unknown',
      healthHistory: this.healthHistory.length,
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid
    }
  }

  public async getDetailedMetrics(): Promise<any> {
    const health = await this.checkHealth()
    const metrics = this.getMetrics()
    const errorStats = errorHandler.getErrorStats()
    const rateLimiterStats = rateLimiter.getStats()

    return {
      health,
      metrics,
      errors: errorStats,
      rateLimiter: rateLimiterStats,
      timestamp: new Date().toISOString()
    }
  }
}

export const healthMonitor = HealthMonitor.getInstance()

// Utility function to check if system is healthy
export const isSystemHealthy = async (): Promise<boolean> => {
  const health = await healthMonitor.checkHealth()
  return health.overall === 'healthy'
}

// Utility function to get system status
export const getSystemStatus = async (): Promise<'healthy' | 'unhealthy' | 'degraded'> => {
  const health = await healthMonitor.checkHealth()
  return health.overall
}
