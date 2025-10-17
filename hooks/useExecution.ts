'use client'

import { useState, useEffect } from 'react'
import { Execution } from '@/types'

export function useExecution(executionId: string) {
  const [execution, setExecution] = useState<Execution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!executionId) return

    const fetchExecution = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/executions/${executionId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch execution')
        }
        
        const data = await response.json()
        setExecution(data.execution)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchExecution()
  }, [executionId])

  const streamExecution = async (onUpdate: (execution: Execution) => void) => {
    try {
      const response = await fetch(`/api/executions/${executionId}/stream`)
      if (!response.ok) {
        throw new Error('Failed to stream execution')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'execution') {
                setExecution(data.execution)
                onUpdate(data.execution)
              } else if (data.type === 'update') {
                setExecution(data.execution)
                onUpdate(data.execution)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return {
    execution,
    loading,
    error,
    streamExecution,
  }
}
