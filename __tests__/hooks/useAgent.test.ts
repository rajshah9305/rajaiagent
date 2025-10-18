import { renderHook, act } from '@testing-library/react'
import { useAgent } from '@/hooks/useAgent'
import { Agent } from '@/types'

// Mock fetch
global.fetch = jest.fn()

describe('useAgent', () => {
  const mockAgent: Agent = {
    id: 'test-id',
    agentId: 'agent-123',
    agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/agent-123',
    agentName: 'Test Agent',
    description: 'Test description',
    instructions: 'Test instructions',
    foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
    idleSessionTTL: 600,
    agentStatus: 'PREPARED',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    tags: ['test'],
    isFavorite: false,
    executionCount: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch agent on mount', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ agent: mockAgent }),
    })

    const { result } = renderHook(() => useAgent('test-id'))

    expect(result.current.loading).toBe(true)
    expect(result.current.agent).toBe(null)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.agent).toEqual(mockAgent)
    expect(result.current.error).toBe(null)
  })

  it('should handle fetch errors', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.agent).toBe(null)
    expect(result.current.error).toBe('Failed to fetch agent')
  })

  it('should update agent successfully', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: mockAgent }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: { ...mockAgent, agentName: 'Updated Agent' } }),
      })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateAgent({ agentName: 'Updated Agent' })
    })

    expect(result.current.agent?.agentName).toBe('Updated Agent')
    expect(fetch).toHaveBeenCalledWith('/api/agents/test-id', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentName: 'Updated Agent' }),
    })
  })

  it('should handle update errors', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: mockAgent }),
      })
      .mockResolvedValueOnce({
        ok: false,
      })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      try {
        await result.current.updateAgent({ agentName: 'Updated Agent' })
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe('Failed to update agent')
  })

  it('should delete agent successfully', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: mockAgent }),
      })
      .mockResolvedValueOnce({
        ok: true,
      })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.deleteAgent()
    })

    expect(result.current.agent).toBe(null)
    expect(fetch).toHaveBeenCalledWith('/api/agents/test-id', {
      method: 'DELETE',
    })
  })

  it('should handle delete errors', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: mockAgent }),
      })
      .mockResolvedValueOnce({
        ok: false,
      })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      try {
        await result.current.deleteAgent()
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe('Failed to delete agent')
  })

  it('should prepare agent successfully', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: mockAgent }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: { ...mockAgent, agentStatus: 'PREPARED' } }),
      })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.prepareAgent()
    })

    expect(fetch).toHaveBeenCalledWith('/api/agents/test-id/prepare', {
      method: 'POST',
    })
  })

  it('should handle prepare errors', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: mockAgent }),
      })
      .mockResolvedValueOnce({
        ok: false,
      })

    const { result } = renderHook(() => useAgent('test-id'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(async () => {
      try {
        await result.current.prepareAgent()
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe('Failed to prepare agent')
  })

  it('should not fetch if agentId is empty', () => {
    renderHook(() => useAgent(''))

    expect(fetch).not.toHaveBeenCalled()
  })
})
