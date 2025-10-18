'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Bot } from 'lucide-react'
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
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Page Background with Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/50 pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/5 to-accent/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/5 to-primary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
              <p className="text-muted-foreground mt-1">Manage your AWS Bedrock agents</p>
            </div>
          </div>
          <Link
            href="/agents/new"
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold rounded-lg hover:from-primary/95 hover:to-primary transition-all flex items-center space-x-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Agent</span>
          </Link>
        </div>

        <div className="space-y-8">
          {/* Enhanced Search Bar */}
          <div className="glass-card p-6 relative overflow-hidden">
            {/* Header gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/90 rounded-lg flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-4 h-4 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Search Agents</h3>
              </div>

              <div className="relative max-w-md">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card/80 backdrop-blur-sm transition-all shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary/50"
                  placeholder="Search agents..."
                />
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {filteredAgents.length === 0 ? (
            <div className="glass-card relative overflow-hidden">
              <EmptyState
                title="No agents found"
                description="Get started by creating your first AI agent"
                actionLabel="Create Agent"
                actionHref="/agents/new"
                icon={<SparklesIcon className="h-12 w-12" />}
              />
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="glass-card p-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {filteredAgents.length} Agent{filteredAgents.length !== 1 ? 's' : ''} Found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All agents'}
                      </p>
                    </div>
                  </div>

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl" />
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} className="relative">
                    <AgentCard agent={agent} onUpdate={fetchAgents} />

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
