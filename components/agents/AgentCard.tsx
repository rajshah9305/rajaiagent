import Link from 'next/link'
import { Agent } from '@/types'
import { 
  SparklesIcon, 
  PlayIcon, 
  TrashIcon,
  PencilIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface AgentCardProps {
  agent: Agent
  onUpdate: () => void
}

export function AgentCard({ agent, onUpdate }: AgentCardProps) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    
    try {
      await fetch(`/api/agents/${agent.id}`, { method: 'DELETE' })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete agent:', error)
    }
  }

  const toggleFavorite = async () => {
    try {
      await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !agent.isFavorite })
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to update agent:', error)
    }
  }

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { badge: string; icon: string; text: string }> = {
      'PREPARED': {
        badge: 'status-success',
        icon: 'icon-emerald',
        text: 'text-gradient-success'
      },
      'CREATING': {
        badge: 'status-warning',
        icon: 'icon-orange',
        text: 'text-gradient-warning'
      },
      'FAILED': {
        badge: 'status-error',
        icon: 'icon-red',
        text: 'text-gradient-error'
      },
      'UPDATING': {
        badge: 'status-info',
        icon: 'icon-blue',
        text: 'text-gradient'
      },
      'DELETING': {
        badge: 'status-neutral',
        icon: 'icon-neutral',
        text: 'text-gray-600 dark:text-gray-400'
      },
      'NOT_PREPARED': {
        badge: 'status-warning',
        icon: 'icon-orange',
        text: 'text-gradient-warning'
      },
      'PREPARING': {
        badge: 'status-info',
        icon: 'icon-purple',
        text: 'text-gradient'
      },
    }
    return statusMap[status] || statusMap['NOT_PREPARED']
  }

  const statusConfig = getStatusConfig(agent.agentStatus)

  return (
    <div className="agent-card group relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`icon-container ${statusConfig.icon} group-hover:scale-110 transition-transform duration-200`}>
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {agent.agentName}
              </h3>
              <span className={`status-badge ${statusConfig.badge} mt-2`}>
                {agent.agentStatus}
              </span>
            </div>
          </div>
          <button 
            onClick={toggleFavorite} 
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
          >
            {agent.isFavorite ? (
              <StarSolidIcon className="h-5 w-5 text-yellow-500 drop-shadow-sm" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors duration-200" />
            )}
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {agent.description || 'No description provided'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100/50 dark:border-gray-700/30">
            <div className="text-gray-500 dark:text-gray-400 mb-1">Model</div>
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {agent.foundationModel}
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100/50 dark:border-gray-700/30">
            <div className="text-gray-500 dark:text-gray-400 mb-1">Executions</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {agent.executionCount || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/agents/${agent.id}/execute`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium group-hover:scale-105 transform"
          >
            <PlayIcon className="h-4 w-4" />
            Execute
          </Link>
          <Link
            href={`/agents/${agent.id}`}
            className="p-3 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-200"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-3 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
    </div>
  )
}
