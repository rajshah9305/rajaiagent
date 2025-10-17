'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { AgentCard } from '@/components/agents/AgentCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Agent } from '@/types'

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter(agent =>
    agent.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-container icon-indigo">
              <SparklesIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">AI Agents</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                Manage your AWS Bedrock agents
              </p>
            </div>
          </div>
          <Link
            href="/agents/new"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform font-semibold"
          >
            <PlusIcon className="h-5 w-5" />
            Create Agent
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-600/50 bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
              placeholder="Search agents..."
            />
          </div>
        </div>

        {filteredAgents.length === 0 ? (
          <EmptyState
            title="No agents found"
            description="Get started by creating your first AI agent"
            actionLabel="Create Agent"
            actionHref="/agents/new"
            icon={<SparklesIcon className="h-12 w-12" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onUpdate={fetchAgents} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
