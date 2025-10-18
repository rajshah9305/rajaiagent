export const productionConfig = {
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
    enableLogging: process.env.NODE_ENV === 'development'
  },

  // AWS Bedrock configuration
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bedrockRoleArn: process.env.AWS_BEDROCK_ROLE_ARN,
    maxRetries: parseInt(process.env.AWS_MAX_RETRIES || '3'),
    timeout: parseInt(process.env.AWS_TIMEOUT || '30000')
  },

  // Rate limiting configuration
  rateLimiting: {
    enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
    redis: {
      enabled: process.env.REDIS_ENABLED === 'true',
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'rajagenter:'
    },
    memory: {
      maxKeys: parseInt(process.env.RATE_LIMIT_MAX_KEYS || '10000'),
      cleanupInterval: parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL || '300000') // 5 minutes
    }
  },

  // Error handling configuration
  errorHandling: {
    enableLogging: process.env.ERROR_LOGGING_ENABLED !== 'false',
    maxLogs: parseInt(process.env.ERROR_MAX_LOGS || '1000'),
    externalLogging: {
      enabled: process.env.EXTERNAL_LOGGING_ENABLED === 'true',
      service: process.env.LOGGING_SERVICE || 'console', // console, sentry, datadog, cloudwatch
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development'
    }
  },

  // Monitoring configuration
  monitoring: {
    healthCheck: {
      enabled: process.env.HEALTH_CHECK_ENABLED !== 'false',
      interval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'), // 30 seconds
      timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000') // 5 seconds
    },
    metrics: {
      enabled: process.env.METRICS_ENABLED !== 'false',
      collectionInterval: parseInt(process.env.METRICS_COLLECTION_INTERVAL || '60000'), // 1 minute
      retentionPeriod: parseInt(process.env.METRICS_RETENTION_PERIOD || '604800000') // 7 days
    }
  },

  // Security configuration
  security: {
    cors: {
      enabled: process.env.CORS_ENABLED !== 'false',
      origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'X-Request-ID']
    },
    headers: {
      enabled: process.env.SECURITY_HEADERS_ENABLED !== 'false',
      hsts: process.env.HSTS_ENABLED === 'true',
      csp: process.env.CSP_ENABLED === 'true',
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin'
    },
    apiKeys: {
      enabled: process.env.API_KEYS_ENABLED === 'true',
      required: process.env.API_KEYS_REQUIRED === 'true',
      header: process.env.API_KEY_HEADER || 'X-API-Key'
    }
  },

  // Performance configuration
  performance: {
    compression: {
      enabled: process.env.COMPRESSION_ENABLED !== 'false',
      level: parseInt(process.env.COMPRESSION_LEVEL || '6'),
      threshold: parseInt(process.env.COMPRESSION_THRESHOLD || '1024')
    },
    caching: {
      enabled: process.env.CACHING_ENABLED !== 'false',
      ttl: parseInt(process.env.CACHE_TTL || '300'), // 5 minutes
      maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000')
    },
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'), // 30 seconds
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '10485760') // 10MB
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    enableConsole: process.env.LOG_CONSOLE_ENABLED !== 'false',
    enableFile: process.env.LOG_FILE_ENABLED === 'true',
    filePath: process.env.LOG_FILE_PATH || './logs/app.log',
    maxFileSize: process.env.LOG_MAX_FILE_SIZE || '10MB',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '5')
  },

  // Feature flags
  features: {
    tools: {
      enabled: process.env.TOOLS_ENABLED !== 'false',
      maxConcurrentExecutions: parseInt(process.env.TOOLS_MAX_CONCURRENT || '10'),
      executionTimeout: parseInt(process.env.TOOLS_EXECUTION_TIMEOUT || '30000')
    },
    analytics: {
      enabled: process.env.ANALYTICS_ENABLED !== 'false',
      realTime: process.env.ANALYTICS_REAL_TIME_ENABLED !== 'false',
      retentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS || '90')
    },
    taskDelegation: {
      enabled: process.env.TASK_DELEGATION_ENABLED !== 'false',
      maxConcurrentTasks: parseInt(process.env.TASK_DELEGATION_MAX_CONCURRENT || '5'),
      taskTimeout: parseInt(process.env.TASK_DELEGATION_TIMEOUT || '300000') // 5 minutes
    }
  },

  // Environment specific settings
  environment: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
  }
}

// Validation function
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Required environment variables
  const requiredVars = [
    'DATABASE_URL',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY'
  ]

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  })

  // Validate numeric values
  const numericVars = [
    'DB_MAX_CONNECTIONS',
    'DB_CONNECTION_TIMEOUT',
    'DB_QUERY_TIMEOUT',
    'AWS_MAX_RETRIES',
    'AWS_TIMEOUT',
    'RATE_LIMIT_MAX_KEYS',
    'ERROR_MAX_LOGS',
    'HEALTH_CHECK_INTERVAL',
    'HEALTH_CHECK_TIMEOUT',
    'METRICS_COLLECTION_INTERVAL',
    'COMPRESSION_LEVEL',
    'COMPRESSION_THRESHOLD',
    'CACHE_TTL',
    'CACHE_MAX_SIZE',
    'REQUEST_TIMEOUT',
    'MAX_REQUEST_SIZE',
    'LOG_MAX_FILES',
    'TOOLS_MAX_CONCURRENT',
    'TOOLS_EXECUTION_TIMEOUT',
    'ANALYTICS_RETENTION_DAYS',
    'TASK_DELEGATION_MAX_CONCURRENT',
    'TASK_DELEGATION_TIMEOUT'
  ]

  numericVars.forEach(varName => {
    const value = process.env[varName]
    if (value && isNaN(parseInt(value))) {
      errors.push(`Invalid numeric value for ${varName}: ${value}`)
    }
  })

  // Validate boolean values
  const booleanVars = [
    'RATE_LIMITING_ENABLED',
    'REDIS_ENABLED',
    'ERROR_LOGGING_ENABLED',
    'EXTERNAL_LOGGING_ENABLED',
    'HEALTH_CHECK_ENABLED',
    'METRICS_ENABLED',
    'CORS_ENABLED',
    'SECURITY_HEADERS_ENABLED',
    'HSTS_ENABLED',
    'CSP_ENABLED',
    'API_KEYS_ENABLED',
    'API_KEYS_REQUIRED',
    'COMPRESSION_ENABLED',
    'CACHING_ENABLED',
    'LOG_CONSOLE_ENABLED',
    'LOG_FILE_ENABLED',
    'TOOLS_ENABLED',
    'ANALYTICS_ENABLED',
    'ANALYTICS_REAL_TIME_ENABLED',
    'TASK_DELEGATION_ENABLED'
  ]

  booleanVars.forEach(varName => {
    const value = process.env[varName]
    if (value && !['true', 'false'].includes(value.toLowerCase())) {
      errors.push(`Invalid boolean value for ${varName}: ${value}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

// Configuration getter with defaults
export const getConfig = (key: string, defaultValue?: any) => {
  const keys = key.split('.')
  let value: any = productionConfig

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return defaultValue
    }
  }

  return value
}

// Environment-specific configuration
export const getEnvironmentConfig = () => {
  const baseConfig = productionConfig

  if (process.env.NODE_ENV === 'development') {
    return {
      ...baseConfig,
      database: {
        ...baseConfig.database,
        enableLogging: true
      },
      logging: {
        ...baseConfig.logging,
        level: 'debug',
        enableConsole: true
      },
      errorHandling: {
        ...baseConfig.errorHandling,
        enableLogging: true
      }
    }
  }

  if (process.env.NODE_ENV === 'test') {
    return {
      ...baseConfig,
      database: {
        ...baseConfig.database,
        url: 'file:./test.db'
      },
      rateLimiting: {
        ...baseConfig.rateLimiting,
        memory: {
          ...baseConfig.rateLimiting.memory,
          maxKeys: 100
        }
      },
      logging: {
        ...baseConfig.logging,
        level: 'error',
        enableConsole: false
      }
    }
  }

  return baseConfig
}
