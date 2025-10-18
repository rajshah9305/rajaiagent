import { renderHook, act } from '@testing-library/react'
import { useSSE } from '@/hooks/useSSE'

// Mock EventSource
class MockEventSource {
  public onopen: ((event: Event) => void) | null = null
  public onmessage: ((event: MessageEvent) => void) | null = null
  public onerror: ((event: Event) => void) | null = null
  public addEventListener: jest.Mock
  public close: jest.Mock

  constructor(public url: string) {
    this.addEventListener = jest.fn()
    this.close = jest.fn()
  }

  // Simulate connection opening
  simulateOpen() {
    if (this.onopen) {
      this.onopen(new Event('open'))
    }
  }

  // Simulate receiving a message
  simulateMessage(data: any) {
    if (this.onmessage) {
      const event = new MessageEvent('message', {
        data: JSON.stringify(data),
      })
      this.onmessage(event)
    }
  }

  // Simulate an error
  simulateError() {
    if (this.onerror) {
      this.onerror(new Event('error'))
    }
  }

  // Simulate connection close
  simulateClose() {
    const closeHandler = this.addEventListener.mock.calls.find(
      call => call[0] === 'close'
    )?.[1]
    if (closeHandler) {
      closeHandler()
    }
  }
}

// Replace global EventSource with our mock
;(global as any).EventSource = MockEventSource

describe('useSSE', () => {
  let mockEventSource: MockEventSource

  beforeEach(() => {
    jest.clearAllMocks()
    // Create a fresh mock EventSource for each test
    mockEventSource = new MockEventSource('http://test.com/sse')
    // Mock the global EventSource constructor
    ;(global as any).EventSource = jest.fn().mockImplementation((url: string) => {
      mockEventSource = new MockEventSource(url)
      return mockEventSource
    })
  })

  it('should establish SSE connection', () => {
    const onOpen = jest.fn()
    const onMessage = jest.fn()
    const onError = jest.fn()
    const onClose = jest.fn()

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onOpen,
        onMessage,
        onError,
        onClose,
      })
    )

    expect(mockEventSource.url).toBe('http://test.com/sse')
  })

  it('should handle connection open', () => {
    const onOpen = jest.fn()

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onOpen,
      })
    )

    act(() => {
      mockEventSource.simulateOpen()
    })

    expect(onOpen).toHaveBeenCalled()
  })

  it('should handle incoming messages', () => {
    const onMessage = jest.fn()
    const testData = { type: 'test', data: 'hello' }

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onMessage,
      })
    )

    act(() => {
      mockEventSource.simulateMessage(testData)
    })

    expect(onMessage).toHaveBeenCalledWith(testData)
  })

  it('should handle malformed JSON messages', () => {
    const onMessage = jest.fn()
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onMessage,
      })
    )

    act(() => {
      // Simulate malformed JSON
      if (mockEventSource.onmessage) {
        const event = new MessageEvent('message', {
          data: 'invalid json',
        })
        mockEventSource.onmessage(event)
      }
    })

    expect(onMessage).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error parsing SSE message:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it('should handle connection errors', () => {
    const onError = jest.fn()

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onError,
      })
    )

    act(() => {
      mockEventSource.simulateError()
    })

    expect(onError).toHaveBeenCalled()
  })

  it('should handle connection close', () => {
    const onClose = jest.fn()

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onClose,
      })
    )

    act(() => {
      mockEventSource.simulateClose()
    })

    expect(onClose).toHaveBeenCalled()
  })

  it('should provide close function', () => {
    const { result } = renderHook(() => useSSE('http://test.com/sse'))

    act(() => {
      result.current.close()
    })

    expect(mockEventSource.close).toHaveBeenCalled()
  })

  it('should not establish connection if URL is empty', () => {
    renderHook(() => useSSE(''))

    // EventSource should not be called with empty URL
    expect(mockEventSource.url).toBe('http://test.com/sse') // Previous URL
  })

  it('should clean up on unmount', () => {
    const { unmount } = renderHook(() => useSSE('http://test.com/sse'))

    unmount()

    expect(mockEventSource.close).toHaveBeenCalled()
  })

  it('should update connection when URL changes', () => {
    const { rerender } = renderHook(
      ({ url }) => useSSE(url),
      { initialProps: { url: 'http://test.com/sse' } }
    )

    expect(mockEventSource.close).toHaveBeenCalledTimes(0)

    rerender({ url: 'http://test.com/sse2' })

    expect(mockEventSource.close).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple message types', () => {
    const onMessage = jest.fn()

    renderHook(() =>
      useSSE('http://test.com/sse', {
        onMessage,
      })
    )

    const messages = [
      { type: 'chunk', data: 'Hello' },
      { type: 'complete' },
      { type: 'error', error: 'Something went wrong' },
    ]

    act(() => {
      messages.forEach(message => {
        mockEventSource.simulateMessage(message)
      })
    })

    expect(onMessage).toHaveBeenCalledTimes(3)
    expect(onMessage).toHaveBeenNthCalledWith(1, messages[0])
    expect(onMessage).toHaveBeenNthCalledWith(2, messages[1])
    expect(onMessage).toHaveBeenNthCalledWith(3, messages[2])
  })
})
