'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Agent } from '@/types'

export default function ExecuteAgentPage() {
  const params = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchAgent(params.id as string)
    }
  }, [params.id])

  const fetchAgent = async (id: string) => {
    try {
      const response = await fetch(`/api/agents/${id}`)
      if (response.ok) {
        const data = await response.json()
        setAgent(data.agent)
      }
    } catch (error) {
      console.error('Failed to fetch agent:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The agent you're looking for doesn't exist.
          </p>
          <Link
            href="/agents"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Agents
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
        <Link
          href={`/agents/${agent.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Agent
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Execute: {agent.agentName}</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{agent.description}</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatInterface agent={agent} />
      </div>
    </div>
  )
}
