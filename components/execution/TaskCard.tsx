'use client'

import { Task } from '@/types'
import { formatDuration } from '@/lib/utils'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  PlayIcon 
} from '@heroicons/react/24/outline'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { icon: any; badge: string; iconBg: string; bg: string; progressBg: string }> = {
      'COMPLETE': {
        icon: CheckCircleIcon,
        badge: 'status-success',
        iconBg: 'icon-emerald',
        bg: 'from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20',
        progressBg: 'bg-emerald-500'
      },
      'ERROR': {
        icon: XCircleIcon,
        badge: 'status-error',
        iconBg: 'icon-red',
        bg: 'from-red-50/50 to-rose-50/50 dark:from-red-900/20 dark:to-rose-900/20',
        progressBg: 'bg-red-500'
      },
      'RUNNING': {
        icon: PlayIcon,
        badge: 'status-running',
        iconBg: 'icon-blue',
        bg: 'from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20',
        progressBg: 'bg-blue-500'
      },
      default: {
        icon: ClockIcon,
        badge: 'status-neutral',
        iconBg: 'icon-neutral',
        bg: 'from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20',
        progressBg: 'bg-gray-500'
      }
    }
    return statusMap[status] || statusMap.default
  }

  const statusConfig = getStatusConfig(task.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className={`metric-card bg-gradient-to-br ${statusConfig.bg} relative overflow-hidden group`}>
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`icon-container ${statusConfig.iconBg} group-hover:scale-110 transition-transform duration-200`}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {task.taskName}
              </h3>
              <span className={`status-badge ${statusConfig.badge} mt-2`}>
                {task.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100/50 dark:border-gray-700/30 flex-1 mr-3">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Started</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(task.startTime).toLocaleTimeString()}
              </div>
            </div>
            {task.duration && (
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100/50 dark:border-gray-700/30">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatDuration(task.duration)}
                </div>
              </div>
            )}
          </div>

          {task.status === 'RUNNING' && (
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100/50 dark:border-gray-700/30">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ease-out ${statusConfig.progressBg} shadow-sm`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {task.output && (
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100/50 dark:border-gray-700/30">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Output
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {task.output}
              </p>
            </div>
          )}

          {task.error && (
            <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-700/30">
              <h4 className="text-sm font-bold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Error
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap leading-relaxed">
                {task.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
