import { rateLimiter, rateLimitConfigs, withRateLimit } from '@/lib/rateLimiting/rateLimiter'
import { NextRequest } from 'next/server'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear rate limiter state before each test
    rateLimiter['requests'].clear()
  })

  describe('Rate Limit Checking', () => {
    it('should allow requests within limit', () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000, // 1 minute
        maxRequests: 5
      }

      // Make 5 requests (within limit)
      for (let i = 0; i < 5; i++) {
        const result = rateLimiter.checkRateLimit(request, config)
        expect(result.allowed).toBe(true)
        expect(result.info.remaining).toBe(5 - i - 1)
      }
    })

    it('should block requests exceeding limit', () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000, // 1 minute
        maxRequests: 3
      }

      // Make 3 requests (within limit)
      for (let i = 0; i < 3; i++) {
        const result = rateLimiter.checkRateLimit(request, config)
        expect(result.allowed).toBe(true)
      }

      // Make 4th request (exceeds limit)
      const result = rateLimiter.checkRateLimit(request, config)
      expect(result.allowed).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.info.retryAfter).toBeDefined()
    })

    it('should reset after window expires', async () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 100, // 100ms
        maxRequests: 2
      }

      // Exceed limit
      rateLimiter.checkRateLimit(request, config)
      rateLimiter.checkRateLimit(request, config)
      const blockedResult = rateLimiter.checkRateLimit(request, config)
      expect(blockedResult.allowed).toBe(false)

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150))

      // Should be allowed again
      const allowedResult = rateLimiter.checkRateLimit(request, config)
      expect(allowedResult.allowed).toBe(true)
    })
  })

  describe('Custom Key Generation', () => {
    it('should use custom key generator', () => {
      const request = new NextRequest('http://localhost:3000/test')
      request.headers.set('x-user-id', 'user123')
      
      const config = {
        windowMs: 60000,
        maxRequests: 2,
        keyGenerator: (req: NextRequest) => `user:${req.headers.get('x-user-id')}`
      }

      const result1 = rateLimiter.checkRateLimit(request, config)
      expect(result1.allowed).toBe(true)

      const result2 = rateLimiter.checkRateLimit(request, config)
      expect(result2.allowed).toBe(true)

      const result3 = rateLimiter.checkRateLimit(request, config)
      expect(result3.allowed).toBe(false)
    })

    it('should use different keys for different users', () => {
      const request1 = new NextRequest('http://localhost:3000/test')
      request1.headers.set('x-user-id', 'user1')
      
      const request2 = new NextRequest('http://localhost:3000/test')
      request2.headers.set('x-user-id', 'user2')
      
      const config = {
        windowMs: 60000,
        maxRequests: 1,
        keyGenerator: (req: NextRequest) => `user:${req.headers.get('x-user-id')}`
      }

      const result1 = rateLimiter.checkRateLimit(request1, config)
      const result2 = rateLimiter.checkRateLimit(request2, config)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true) // Different user, should be allowed
    })
  })

  describe('Rate Limit Info', () => {
    it('should provide correct rate limit information', () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000,
        maxRequests: 5
      }

      const info = rateLimiter.getRateLimitInfo(request, config)
      
      expect(info.limit).toBe(5)
      expect(info.remaining).toBe(5)
      expect(info.reset).toBeGreaterThan(Date.now())
      expect(info.retryAfter).toBeUndefined()
    })

    it('should update remaining count after requests', () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000,
        maxRequests: 5
      }

      // Make 2 requests
      rateLimiter.checkRateLimit(request, config)
      rateLimiter.checkRateLimit(request, config)

      const info = rateLimiter.getRateLimitInfo(request, config)
      expect(info.remaining).toBe(3)
    })
  })

  describe('Rate Limit Reset', () => {
    it('should reset rate limit for specific key', () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000,
        maxRequests: 2
      }

      // Exceed limit
      rateLimiter.checkRateLimit(request, config)
      rateLimiter.checkRateLimit(request, config)
      const blockedResult = rateLimiter.checkRateLimit(request, config)
      expect(blockedResult.allowed).toBe(false)

      // Reset rate limit
      rateLimiter.resetRateLimit(request, config)

      // Should be allowed again
      const allowedResult = rateLimiter.checkRateLimit(request, config)
      expect(allowedResult.allowed).toBe(true)
    })
  })

  describe('Statistics', () => {
    it('should provide rate limiter statistics', () => {
      const request1 = new NextRequest('http://localhost:3000/test1')
      const request2 = new NextRequest('http://localhost:3000/test2')
      const config = {
        windowMs: 60000,
        maxRequests: 2
      }

      // Make requests with different keys
      rateLimiter.checkRateLimit(request1, config)
      rateLimiter.checkRateLimit(request2, config)

      const stats = rateLimiter.getStats()
      expect(stats.totalKeys).toBe(2)
      expect(stats.entries).toHaveLength(2)
    })
  })

  describe('Predefined Configurations', () => {
    it('should have valid API rate limit config', () => {
      const config = rateLimitConfigs.api
      expect(config.windowMs).toBe(15 * 60 * 1000) // 15 minutes
      expect(config.maxRequests).toBe(1000)
      expect(config.message).toContain('Too many API requests')
    })

    it('should have valid agent execution rate limit config', () => {
      const config = rateLimitConfigs.agentExecution
      expect(config.windowMs).toBe(60 * 1000) // 1 minute
      expect(config.maxRequests).toBe(10)
      expect(config.message).toContain('Too many agent executions')
    })

    it('should have valid tool execution rate limit config', () => {
      const config = rateLimitConfigs.toolExecution
      expect(config.windowMs).toBe(60 * 1000) // 1 minute
      expect(config.maxRequests).toBe(50)
      expect(config.message).toContain('Too many tool executions')
    })
  })

  describe('Rate Limit Middleware', () => {
    it('should apply rate limiting in middleware', async () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000,
        maxRequests: 2
      }

      const handler = async () => {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const rateLimitedHandler = withRateLimit(config)(handler)

      // First two requests should succeed
      const response1 = await rateLimitedHandler(request)
      expect(response1.status).toBe(200)

      const response2 = await rateLimitedHandler(request)
      expect(response2.status).toBe(200)

      // Third request should be rate limited
      const response3 = await rateLimitedHandler(request)
      expect(response3.status).toBe(429)

      const responseData = await response3.json()
      expect(responseData.error.type).toBe('RATE_LIMIT_ERROR')
    })

    it('should add rate limit headers to successful responses', async () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000,
        maxRequests: 5
      }

      const handler = async () => {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const rateLimitedHandler = withRateLimit(config)(handler)
      const response = await rateLimitedHandler(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('4')
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })

    it('should add retry-after header to rate limited responses', async () => {
      const request = new NextRequest('http://localhost:3000/test')
      const config = {
        windowMs: 60000,
        maxRequests: 1
      }

      const handler = async () => {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const rateLimitedHandler = withRateLimit(config)(handler)

      // First request succeeds
      await rateLimitedHandler(request)

      // Second request is rate limited
      const response = await rateLimitedHandler(request)
      expect(response.status).toBe(429)
      expect(response.headers.get('Retry-After')).toBeDefined()
    })
  })
})
