import { NextRequest } from 'next/server'
import { createRateLimitError } from '@/lib/errorHandling/errorHandler'

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  message?: string
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

class RateLimiter {
  private static instance: RateLimiter
  private requests: Map<string, { count: number; resetTime: number }> = new Map()
  private cleanupInterval: NodeJS.Timeout

  private constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  public checkRateLimit(
    request: NextRequest,
    config: RateLimitConfig
  ): { allowed: boolean; info: RateLimitInfo; error?: any } {
    const key = config.keyGenerator ? config.keyGenerator(request) : this.getDefaultKey(request)
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get or create rate limit entry
    let entry = this.requests.get(key)
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }

    // Check if request is within the window
    if (entry.resetTime > now) {
      entry.count++
    } else {
      entry.count = 1
      entry.resetTime = now + config.windowMs
    }

    this.requests.set(key, entry)

    const remaining = Math.max(0, config.maxRequests - entry.count)
    const reset = entry.resetTime
    const retryAfter = entry.count > config.maxRequests ? Math.ceil((reset - now) / 1000) : undefined

    const info: RateLimitInfo = {
      limit: config.maxRequests,
      remaining,
      reset,
      retryAfter
    }

    if (entry.count > config.maxRequests) {
      const error = createRateLimitError(
        config.message || `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      )
      return { allowed: false, info, error }
    }

    return { allowed: true, info }
  }

  public getRateLimitInfo(request: NextRequest, config: RateLimitConfig): RateLimitInfo {
    const key = config.keyGenerator ? config.keyGenerator(request) : this.getDefaultKey(request)
    const entry = this.requests.get(key)
    const now = Date.now()

    if (!entry || entry.resetTime <= now) {
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests,
        reset: now + config.windowMs
      }
    }

    return {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      reset: entry.resetTime
    }
  }

  public resetRateLimit(request: NextRequest, config: RateLimitConfig): void {
    const key = config.keyGenerator ? config.keyGenerator(request) : this.getDefaultKey(request)
    this.requests.delete(key)
  }

  public getStats(): { totalKeys: number; entries: Array<{ key: string; count: number; resetTime: number }> } {
    return {
      totalKeys: this.requests.size,
      entries: Array.from(this.requests.entries()).map(([key, entry]) => ({
        key,
        count: entry.count,
        resetTime: entry.resetTime
      }))
    }
  }

  private getDefaultKey(request: NextRequest): string {
    // Use IP address as default key
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    return `ip:${ip}`
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of Array.from(this.requests.entries())) {
      if (entry.resetTime <= now) {
        this.requests.delete(key)
      }
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.requests.clear()
  }
}

export const rateLimiter = RateLimiter.getInstance()

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    message: 'Too many API requests. Please try again later.'
  },

  // Agent execution rate limiting
  agentExecution: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many agent executions. Please wait before trying again.'
  },

  // Tool execution rate limiting
  toolExecution: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50,
    message: 'Too many tool executions. Please wait before trying again.'
  },

  // Analytics data fetching
  analytics: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    message: 'Too many analytics requests. Please wait before trying again.'
  },

  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts. Please try again later.'
  },

  // File uploads
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many file uploads. Please wait before trying again.'
  }
}

// Middleware for rate limiting
export const withRateLimit = (config: RateLimitConfig) => {
  return (handler: Function) => {
    return async (request: NextRequest, context?: any) => {
      const result = rateLimiter.checkRateLimit(request, config)
      
      if (!result.allowed) {
        return new Response(
          JSON.stringify({
            error: {
              type: 'RATE_LIMIT_ERROR',
              message: result.error.message,
              retryAfter: result.info.retryAfter
            }
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': result.info.limit.toString(),
              'X-RateLimit-Remaining': result.info.remaining.toString(),
              'X-RateLimit-Reset': result.info.reset.toString(),
              'Retry-After': result.info.retryAfter?.toString() || '0'
            }
          }
        )
      }

      // Add rate limit headers to response
      const response = await handler(request, context)
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', result.info.limit.toString())
        response.headers.set('X-RateLimit-Remaining', result.info.remaining.toString())
        response.headers.set('X-RateLimit-Reset', result.info.reset.toString())
      }

      return response
    }
  }
}

// Utility function to get rate limit info for a request
export const getRateLimitInfo = (request: NextRequest, config: RateLimitConfig): RateLimitInfo => {
  return rateLimiter.getRateLimitInfo(request, config)
}

// Utility function to reset rate limit for a request
export const resetRateLimit = (request: NextRequest, config: RateLimitConfig): void => {
  rateLimiter.resetRateLimit(request, config)
}
