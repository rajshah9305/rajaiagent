import { NextRequest, NextResponse } from 'next/server'

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  TOOL_EXECUTION_ERROR = 'TOOL_EXECUTION_ERROR',
  AGENT_EXECUTION_ERROR = 'AGENT_EXECUTION_ERROR'
}

export interface AppError {
  type: ErrorType
  message: string
  code?: string
  statusCode: number
  details?: any
  timestamp: string
  requestId?: string
}

export class CustomError extends Error {
  public type: ErrorType
  public statusCode: number
  public code?: string
  public details?: any
  public requestId?: string

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number,
    code?: string,
    details?: any,
    requestId?: string
  ) {
    super(message)
    this.name = 'CustomError'
    this.type = type
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.requestId = requestId
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLogs: AppError[] = []
  private maxLogs = 1000

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  public handleError(error: any, requestId?: string): AppError {
    let appError: AppError

    if (error instanceof CustomError) {
      appError = {
        type: error.type,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId: requestId || error.requestId
      }
    } else if (error.name === 'ValidationError') {
      appError = {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Validation failed',
        statusCode: 400,
        details: error.details || error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.name === 'PrismaClientKnownRequestError') {
      appError = {
        type: ErrorType.DATABASE_ERROR,
        message: 'Database operation failed',
        statusCode: 500,
        code: error.code,
        details: error.meta,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.name === 'PrismaClientUnknownRequestError') {
      appError = {
        type: ErrorType.DATABASE_ERROR,
        message: 'Unknown database error',
        statusCode: 500,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.name === 'PrismaClientRustPanicError') {
      appError = {
        type: ErrorType.DATABASE_ERROR,
        message: 'Database connection error',
        statusCode: 503,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.name === 'PrismaClientInitializationError') {
      appError = {
        type: ErrorType.DATABASE_ERROR,
        message: 'Database initialization failed',
        statusCode: 503,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.name === 'PrismaClientValidationError') {
      appError = {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Database validation failed',
        statusCode: 400,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      appError = {
        type: ErrorType.EXTERNAL_SERVICE_ERROR,
        message: 'External service unavailable',
        statusCode: 503,
        code: error.code,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.status === 429) {
      appError = {
        type: ErrorType.RATE_LIMIT_ERROR,
        message: 'Rate limit exceeded',
        statusCode: 429,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.status === 401) {
      appError = {
        type: ErrorType.AUTHENTICATION_ERROR,
        message: 'Authentication required',
        statusCode: 401,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.status === 403) {
      appError = {
        type: ErrorType.AUTHORIZATION_ERROR,
        message: 'Access denied',
        statusCode: 403,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else if (error.status === 404) {
      appError = {
        type: ErrorType.NOT_FOUND_ERROR,
        message: 'Resource not found',
        statusCode: 404,
        details: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    } else {
      appError = {
        type: ErrorType.INTERNAL_SERVER_ERROR,
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message || 'Unknown error',
        statusCode: 500,
        details: process.env.NODE_ENV === 'production' ? undefined : error.stack,
        timestamp: new Date().toISOString(),
        requestId
      }
    }

    this.logError(appError)
    return appError
  }

  public createErrorResponse(error: AppError): NextResponse {
    const response: any = {
      error: {
        type: error.type,
        message: error.message,
        code: error.code,
        requestId: error.requestId,
        timestamp: error.timestamp
      }
    }

    // Add details in development mode
    if (process.env.NODE_ENV !== 'production' && error.details) {
      response.error.details = error.details
    }

    return NextResponse.json(response, { status: error.statusCode })
  }

  public logError(error: AppError): void {
    // Add to in-memory logs
    this.errorLogs.unshift(error)
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLogs)
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', {
        type: error.type,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId,
        details: error.details,
        timestamp: error.timestamp
      })
    }

    // In production, you would send to external logging service
    // Example: Sentry, DataDog, CloudWatch, etc.
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(error)
    }
  }

  public getErrorLogs(limit: number = 100): AppError[] {
    return this.errorLogs.slice(0, limit)
  }

  public getErrorStats(): any {
    const stats = {
      total: this.errorLogs.length,
      byType: {} as { [key: string]: number },
      byStatusCode: {} as { [key: string]: number },
      recent: this.errorLogs.slice(0, 10)
    }

    this.errorLogs.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1
      stats.byStatusCode[error.statusCode] = (stats.byStatusCode[error.statusCode] || 0) + 1
    })

    return stats
  }

  private sendToExternalLogger(error: AppError): void {
    // Implement external logging service integration
    // Example implementations:
    
    // Sentry
    // Sentry.captureException(new Error(error.message), {
    //   tags: {
    //     errorType: error.type,
    //     statusCode: error.statusCode
    //   },
    //   extra: error.details
    // })

    // CloudWatch
    // console.log(JSON.stringify({
    //   level: 'error',
    //   message: error.message,
    //   type: error.type,
    //   statusCode: error.statusCode,
    //   requestId: error.requestId,
    //   timestamp: error.timestamp,
    //   details: error.details
    // }))

    // For now, just log to console
    console.error('Production Error:', JSON.stringify(error, null, 2))
  }
}

export const errorHandler = ErrorHandler.getInstance()

// Utility functions for common error scenarios
export const createValidationError = (message: string, details?: any, requestId?: string) => {
  return new CustomError(ErrorType.VALIDATION_ERROR, message, 400, 'VALIDATION_ERROR', details, requestId)
}

export const createNotFoundError = (message: string, requestId?: string) => {
  return new CustomError(ErrorType.NOT_FOUND_ERROR, message, 404, 'NOT_FOUND', undefined, requestId)
}

export const createAuthenticationError = (message: string = 'Authentication required', requestId?: string) => {
  return new CustomError(ErrorType.AUTHENTICATION_ERROR, message, 401, 'AUTH_REQUIRED', undefined, requestId)
}

export const createAuthorizationError = (message: string = 'Access denied', requestId?: string) => {
  return new CustomError(ErrorType.AUTHORIZATION_ERROR, message, 403, 'ACCESS_DENIED', undefined, requestId)
}

export const createRateLimitError = (message: string = 'Rate limit exceeded', requestId?: string) => {
  return new CustomError(ErrorType.RATE_LIMIT_ERROR, message, 429, 'RATE_LIMIT', undefined, requestId)
}

export const createExternalServiceError = (message: string, details?: any, requestId?: string) => {
  return new CustomError(ErrorType.EXTERNAL_SERVICE_ERROR, message, 503, 'EXTERNAL_SERVICE', details, requestId)
}

export const createDatabaseError = (message: string, details?: any, requestId?: string) => {
  return new CustomError(ErrorType.DATABASE_ERROR, message, 500, 'DATABASE_ERROR', details, requestId)
}

export const createToolExecutionError = (message: string, details?: any, requestId?: string) => {
  return new CustomError(ErrorType.TOOL_EXECUTION_ERROR, message, 500, 'TOOL_EXECUTION_ERROR', details, requestId)
}

export const createAgentExecutionError = (message: string, details?: any, requestId?: string) => {
  return new CustomError(ErrorType.AGENT_EXECUTION_ERROR, message, 500, 'AGENT_EXECUTION_ERROR', details, requestId)
}

// Middleware for error handling
export const withErrorHandling = (handler: Function) => {
  return async (request: NextRequest, context?: any) => {
    const requestId = request.headers.get('x-request-id') || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      return await handler(request, context)
    } catch (error) {
      const appError = errorHandler.handleError(error, requestId)
      return errorHandler.createErrorResponse(appError)
    }
  }
}
