import { Logger, LogLevel } from '@/lib/logger'

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation()
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset console methods
    mockConsoleLog.mockClear()
    mockConsoleWarn.mockClear()
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
    mockConsoleWarn.mockRestore()
    mockConsoleError.mockRestore()
  })

  describe('LogLevel', () => {
    it('should have correct numeric values', () => {
      expect(LogLevel.DEBUG).toBe(0)
      expect(LogLevel.INFO).toBe(1)
      expect(LogLevel.WARN).toBe(2)
      expect(LogLevel.ERROR).toBe(3)
    })
  })

  describe('Logger with DEBUG level', () => {
    let logger: Logger

    beforeEach(() => {
      logger = new Logger(LogLevel.DEBUG)
    })

    it('should log debug messages', () => {
      logger.debug('Debug message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] DEBUG: Debug message/)
      )
    })

    it('should log info messages', () => {
      logger.info('Info message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] INFO: Info message/)
      )
    })

    it('should log warn messages', () => {
      logger.warn('Warning message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] WARN: Warning message/)
      )
    })

    it('should log error messages', () => {
      logger.error('Error message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] ERROR: Error message/)
      )
    })

    it('should include additional arguments', () => {
      logger.info('Info message', { key: 'value' }, 123)
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] INFO: Info message/),
        { key: 'value' },
        123
      )
    })
  })

  describe('Logger with INFO level', () => {
    let logger: Logger

    beforeEach(() => {
      logger = new Logger(LogLevel.INFO)
    })

    it('should not log debug messages', () => {
      logger.debug('Debug message')
      expect(mockConsoleLog).not.toHaveBeenCalled()
    })

    it('should log info messages', () => {
      logger.info('Info message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] INFO: Info message/)
      )
    })

    it('should log warn messages', () => {
      logger.warn('Warning message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] WARN: Warning message/)
      )
    })

    it('should log error messages', () => {
      logger.error('Error message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] ERROR: Error message/)
      )
    })
  })

  describe('Logger with WARN level', () => {
    let logger: Logger

    beforeEach(() => {
      logger = new Logger(LogLevel.WARN)
    })

    it('should not log debug messages', () => {
      logger.debug('Debug message')
      expect(mockConsoleLog).not.toHaveBeenCalled()
    })

    it('should not log info messages', () => {
      logger.info('Info message')
      expect(mockConsoleLog).not.toHaveBeenCalled()
    })

    it('should log warn messages', () => {
      logger.warn('Warning message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] WARN: Warning message/)
      )
    })

    it('should log error messages', () => {
      logger.error('Error message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] ERROR: Error message/)
      )
    })
  })

  describe('Logger with ERROR level', () => {
    let logger: Logger

    beforeEach(() => {
      logger = new Logger(LogLevel.ERROR)
    })

    it('should not log debug messages', () => {
      logger.debug('Debug message')
      expect(mockConsoleLog).not.toHaveBeenCalled()
    })

    it('should not log info messages', () => {
      logger.info('Info message')
      expect(mockConsoleLog).not.toHaveBeenCalled()
    })

    it('should not log warn messages', () => {
      logger.warn('Warning message')
      expect(mockConsoleLog).not.toHaveBeenCalled()
    })

    it('should log error messages', () => {
      logger.error('Error message')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] ERROR: Error message/)
      )
    })
  })

  describe('Default logger instance', () => {
    it('should be created with correct level based on environment', () => {
      const originalEnv = process.env.NODE_ENV
      
      // Test development environment
      process.env.NODE_ENV = 'development'
      const devLogger = new Logger()
      devLogger.debug('Debug message')
      expect(mockConsoleLog).toHaveBeenCalled()

      jest.clearAllMocks()

      // Test production environment
      process.env.NODE_ENV = 'production'
      const prodLogger = new Logger()
      prodLogger.debug('Debug message')
      expect(mockConsoleLog).not.toHaveBeenCalled()

      // Restore original environment
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Timestamp format', () => {
    it('should include ISO timestamp', () => {
      const logger = new Logger(LogLevel.INFO)
      logger.info('Test message')
      
      const logCall = mockConsoleLog.mock.calls[0][0]
      expect(logCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
    })
  })

  describe('Log level names', () => {
    it('should use correct level names', () => {
      const logger = new Logger(LogLevel.DEBUG)
      
      logger.debug('Debug')
      logger.info('Info')
      logger.warn('Warn')
      logger.error('Error')

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/DEBUG: Debug/)
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/INFO: Info/)
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/WARN: Warn/)
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/ERROR: Error/)
      )
    })
  })
})
