'use client'

import { Agent } from '@/types'
import { AgentCard } from './AgentCard'

interface AgentListProps {
  agents: Agent[]
  onUpdate: () => void
}

export function AgentList({ agents, onUpdate }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No agents found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get started by creating your first AI agent.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onUpdate={onUpdate} />
      ))}
    </div>
  )
}
