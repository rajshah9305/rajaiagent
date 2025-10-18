import { 
  errorHandler, 
  CustomError, 
  ErrorType, 
  createValidationError,
  createNotFoundError,
  createAuthenticationError,
  createDatabaseError,
  withErrorHandling
} from '@/lib/errorHandling/errorHandler'
import { NextRequest } from 'next/server'

describe('Error Handler', () => {
  beforeEach(() => {
    // Clear error logs before each test
    errorHandler['errorLogs'] = []
  })

  describe('CustomError', () => {
    it('should create custom error with all properties', () => {
      const error = new CustomError(
        ErrorType.VALIDATION_ERROR,
        'Test error message',
        400,
        'TEST_ERROR',
        { field: 'test' },
        'req_123'
      )

      expect(error.type).toBe(ErrorType.VALIDATION_ERROR)
      expect(error.message).toBe('Test error message')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.details).toEqual({ field: 'test' })
      expect(error.requestId).toBe('req_123')
    })
  })

  describe('Error Handling', () => {
    it('should handle CustomError correctly', () => {
      const customError = new CustomError(
        ErrorType.VALIDATION_ERROR,
        'Custom error message',
        400,
        'CUSTOM_ERROR'
      )

      const appError = errorHandler.handleError(customError, 'req_123')

      expect(appError.type).toBe(ErrorType.VALIDATION_ERROR)
      expect(appError.message).toBe('Custom error message')
      expect(appError.statusCode).toBe(400)
      expect(appError.code).toBe('CUSTOM_ERROR')
      expect(appError.requestId).toBe('req_123')
    })

    it('should handle ValidationError', () => {
      const validationError = new Error('Validation failed')
      validationError.name = 'ValidationError'
      validationError.details = { field: 'email' }

      const appError = errorHandler.handleError(validationError)

      expect(appError.type).toBe(ErrorType.VALIDATION_ERROR)
      expect(appError.statusCode).toBe(400)
      expect(appError.details).toEqual({ field: 'email' })
    })

    it('should handle PrismaClientKnownRequestError', () => {
      const prismaError = new Error('Database error')
      prismaError.name = 'PrismaClientKnownRequestError'
      prismaError.code = 'P2002'
      prismaError.meta = { target: ['email'] }

      const appError = errorHandler.handleError(prismaError)

      expect(appError.type).toBe(ErrorType.DATABASE_ERROR)
      expect(appError.statusCode).toBe(500)
      expect(appError.code).toBe('P2002')
      expect(appError.details).toEqual({ target: ['email'] })
    })

    it('should handle network errors', () => {
      const networkError = new Error('Connection refused')
      networkError.code = 'ECONNREFUSED'

      const appError = errorHandler.handleError(networkError)

      expect(appError.type).toBe(ErrorType.EXTERNAL_SERVICE_ERROR)
      expect(appError.statusCode).toBe(503)
      expect(appError.code).toBe('ECONNREFUSED')
    })

    it('should handle rate limit errors', () => {
      const rateLimitError = new Error('Too many requests')
      rateLimitError.status = 429

      const appError = errorHandler.handleError(rateLimitError)

      expect(appError.type).toBe(ErrorType.RATE_LIMIT_ERROR)
      expect(appError.statusCode).toBe(429)
    })

    it('should handle unknown errors', () => {
      const unknownError = new Error('Unknown error')

      const appError = errorHandler.handleError(unknownError)

      expect(appError.type).toBe(ErrorType.INTERNAL_SERVER_ERROR)
      expect(appError.statusCode).toBe(500)
    })
  })

  describe('Error Response Creation', () => {
    it('should create error response without details in production', () => {
      process.env.NODE_ENV = 'production'
      
      const appError = {
        type: ErrorType.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        statusCode: 500,
        details: { stack: 'Error stack trace' },
        timestamp: new Date().toISOString(),
        requestId: 'req_123'
      }

      const response = errorHandler.createErrorResponse(appError)
      const responseData = JSON.parse(response.body as string)

      expect(responseData.error.type).toBe(ErrorType.INTERNAL_SERVER_ERROR)
      expect(responseData.error.message).toBe('Internal server error')
      expect(responseData.error.details).toBeUndefined()
      expect(response.status).toBe(500)
    })

    it('should include details in development', () => {
      process.env.NODE_ENV = 'development'
      
      const appError = {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Validation failed',
        statusCode: 400,
        details: { field: 'email' },
        timestamp: new Date().toISOString(),
        requestId: 'req_123'
      }

      const response = errorHandler.createErrorResponse(appError)
      const responseData = JSON.parse(response.body as string)

      expect(responseData.error.details).toEqual({ field: 'email' })
    })
  })

  describe('Error Logging', () => {
    it('should log errors to memory', () => {
      const error = new CustomError(
        ErrorType.VALIDATION_ERROR,
        'Test error',
        400
      )

      errorHandler.handleError(error)

      const logs = errorHandler.getErrorLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0].type).toBe(ErrorType.VALIDATION_ERROR)
    })

    it('should maintain max log size', () => {
      // Add more errors than maxLogs
      for (let i = 0; i < 1001; i++) {
        const error = new CustomError(
          ErrorType.VALIDATION_ERROR,
          `Test error ${i}`,
          400
        )
        errorHandler.handleError(error)
      }

      const logs = errorHandler.getErrorLogs()
      expect(logs.length).toBeLessThanOrEqual(1000)
    })

    it('should provide error statistics', () => {
      // Add some test errors
      errorHandler.handleError(new CustomError(ErrorType.VALIDATION_ERROR, 'Error 1', 400))
      errorHandler.handleError(new CustomError(ErrorType.DATABASE_ERROR, 'Error 2', 500))
      errorHandler.handleError(new CustomError(ErrorType.VALIDATION_ERROR, 'Error 3', 400))

      const stats = errorHandler.getErrorStats()

      expect(stats.total).toBe(3)
      expect(stats.byType[ErrorType.VALIDATION_ERROR]).toBe(2)
      expect(stats.byType[ErrorType.DATABASE_ERROR]).toBe(1)
      expect(stats.byStatusCode[400]).toBe(2)
      expect(stats.byStatusCode[500]).toBe(1)
    })
  })

  describe('Utility Functions', () => {
    it('should create validation error', () => {
      const error = createValidationError('Invalid input', { field: 'email' }, 'req_123')

      expect(error.type).toBe(ErrorType.VALIDATION_ERROR)
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.details).toEqual({ field: 'email' })
      expect(error.requestId).toBe('req_123')
    })

    it('should create not found error', () => {
      const error = createNotFoundError('Resource not found', 'req_123')

      expect(error.type).toBe(ErrorType.NOT_FOUND_ERROR)
      expect(error.message).toBe('Resource not found')
      expect(error.statusCode).toBe(404)
      expect(error.requestId).toBe('req_123')
    })

    it('should create authentication error', () => {
      const error = createAuthenticationError('Invalid credentials', 'req_123')

      expect(error.type).toBe(ErrorType.AUTHENTICATION_ERROR)
      expect(error.message).toBe('Invalid credentials')
      expect(error.statusCode).toBe(401)
      expect(error.requestId).toBe('req_123')
    })

    it('should create database error', () => {
      const error = createDatabaseError('Connection failed', { code: 'P1001' }, 'req_123')

      expect(error.type).toBe(ErrorType.DATABASE_ERROR)
      expect(error.message).toBe('Connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.details).toEqual({ code: 'P1001' })
      expect(error.requestId).toBe('req_123')
    })
  })

  describe('Error Handling Middleware', () => {
    it('should handle errors in middleware', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/test')
      mockRequest.headers.set('x-request-id', 'req_123')

      const failingHandler = async () => {
        throw new Error('Test error')
      }

      const wrappedHandler = withErrorHandling(failingHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error.type).toBe(ErrorType.INTERNAL_SERVER_ERROR)
      expect(responseData.error.requestId).toBe('req_123')
    })

    it('should pass through successful responses', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/test')

      const successHandler = async () => {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const wrappedHandler = withErrorHandling(successHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
    })
  })
})
