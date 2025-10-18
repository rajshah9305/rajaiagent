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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
          <p className="text-muted-foreground mt-1">Manage your AWS Bedrock agents</p>
        </div>
        <Link
          href="/agents/new"
          className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold rounded-lg hover:from-primary/95 hover:to-primary transition-all flex items-center space-x-2 shadow-lg shadow-primary/30"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Agent</span>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card transition-all shadow-sm hover:shadow-md focus:shadow-lg"
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
