import { renderHook, act } from '@testing-library/react'
import { useExecution } from '@/hooks/useExecution'
import { Execution } from '@/types'

// Mock TextEncoder and TextDecoder for Node.js environment
global.TextEncoder = class TextEncoder {
  encode(input: string): Uint8Array {
    return new Uint8Array(Buffer.from(input, 'utf8'))
  }
}

global.TextDecoder = class TextDecoder {
  decode(input: Uint8Array): string {
    return Buffer.from(input).toString('utf8')
  }
}

// Mock fetch
global.fetch = jest.fn()

describe('useExecution', () => {
  const mockExecution: Execution = {
    id: 'execution-123',
    agentId: 'agent-123',
    sessionId: 'session-123',
    input: 'Test input',
    status: 'RUNNING',
    startTime: '2024-01-01T00:00:00Z',
    tasks: [],
    metrics: {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      runningTasks: 1,
      averageTaskDuration: 0,
      totalDuration: 0,
      throughput: 0,
      successRate: 0,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch execution on mount', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ execution: mockExecution }),
    })

    const { result } = renderHook(() => useExecution('execution-123'))

    expect(result.current.loading).toBe(true)
    expect(result.current.execution).toBe(null)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.execution).toEqual(mockExecution)
    expect(result.current.error).toBe(null)
  })

  it('should handle fetch errors', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useExecution('execution-123'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.execution).toBe(null)
    expect(result.current.error).toBe('Failed to fetch execution')
  })

  it('should stream execution updates', async () => {
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"type":"execution","execution":{"id":"execution-123","status":"COMPLETE"}}\n\n'),
        })
        .mockResolvedValueOnce({
          done: true,
        }),
    }

    const mockResponse = {
      ok: true,
      body: {
        getReader: jest.fn().mockReturnValue(mockReader),
      },
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ execution: mockExecution }),
    }).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useExecution('execution-123'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const onUpdate = jest.fn()

    await act(async () => {
      await result.current.streamExecution(onUpdate)
    })

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'execution-123',
        status: 'COMPLETE',
      })
    )
  })

  it('should handle streaming errors', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ execution: mockExecution }),
      })
      .mockResolvedValueOnce({
        ok: false,
      })

    const { result } = renderHook(() => useExecution('execution-123'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const onUpdate = jest.fn()

    await act(async () => {
      await result.current.streamExecution(onUpdate)
    })

    expect(result.current.error).toBe('Failed to stream execution')
  })

  it('should not fetch if executionId is empty', () => {
    renderHook(() => useExecution(''))

    expect(fetch).not.toHaveBeenCalled()
  })

  it('should handle malformed SSE data', async () => {
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: invalid json\n\n'),
        })
        .mockResolvedValueOnce({
          done: true,
        }),
    }

    const mockResponse = {
      ok: true,
      body: {
        getReader: jest.fn().mockReturnValue(mockReader),
      },
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ execution: mockExecution }),
    }).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useExecution('execution-123'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const onUpdate = jest.fn()

    // Should not throw error for malformed data
    await act(async () => {
      await result.current.streamExecution(onUpdate)
    })

    expect(result.current.error).toBe(null)
  })
})
