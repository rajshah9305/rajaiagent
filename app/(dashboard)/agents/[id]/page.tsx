'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Agent } from '@/types'

export default function AgentDetailPage() {
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
            The agent you&apos;re looking for doesn&apos;t exist.
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
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Agents
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{agent.agentName}</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{agent.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="metric-card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {agent.instructions}
              </pre>
            </div>
          </div>

          <div className="metric-card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Foundation Model</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{agent.foundationModel}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Session TTL</dt>
                <dd className="text-sm text-gray-900 dark:text-white">{agent.idleSessionTTL} seconds</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="text-sm">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    agent.agentStatus === 'PREPARED' ? 'bg-green-100 text-green-800' :
                    agent.agentStatus === 'CREATING' ? 'bg-yellow-100 text-yellow-800' :
                    agent.agentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                    agent.agentStatus === 'UPDATING' ? 'bg-blue-100 text-blue-800' :
                    agent.agentStatus === 'DELETING' ? 'bg-gray-100 text-gray-800' :
                    agent.agentStatus === 'NOT_PREPARED' ? 'bg-orange-100 text-orange-800' :
                    agent.agentStatus === 'PREPARING' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.agentStatus}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/agents/${agent.id}/execute`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlayIcon className="h-4 w-4" />
                Execute Agent
              </Link>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Executions</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">{agent.executionCount || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </dd>
              </div>
              {agent.lastExecutionTime && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Last Execution</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(agent.lastExecutionTime).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
