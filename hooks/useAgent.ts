'use client'

import { useState, useEffect } from 'react'
import { Agent } from '@/types'

export function useAgent(agentId: string) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!agentId) return

    const fetchAgent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/agents/${agentId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch agent')
        }
        
        const data = await response.json()
        setAgent(data.agent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [agentId])

  const updateAgent = async (updates: Partial<Agent>) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      const data = await response.json()
      setAgent(data.agent)
      return data.agent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const deleteAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete agent')
      }

      setAgent(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const prepareAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/prepare`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to prepare agent')
      }

      const data = await response.json()
      setAgent(data.agent)
      return data.agent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    agent,
    loading,
    error,
    updateAgent,
    deleteAgent,
    prepareAgent,
  }
}
