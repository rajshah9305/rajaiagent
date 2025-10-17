'use client'

import { Execution, Task } from '@/types'
import { formatDate, formatDuration } from '@/lib/utils'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  PlayIcon 
} from '@heroicons/react/24/outline'

interface ExecutionTimelineProps {
  execution: Execution
}

export function ExecutionTimeline({ execution }: ExecutionTimelineProps) {
  const getTaskIcon = (task: Task) => {
    switch (task.status) {
      case 'COMPLETE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'ERROR':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'RUNNING':
        return <PlayIcon className="h-5 w-5 text-blue-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-100 text-green-800'
      case 'ERROR':
        return 'bg-red-100 text-red-800'
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="metric-card">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Execution Timeline</h2>
      
      <div className="space-y-4">
        {execution.tasks.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No tasks available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {execution.tasks.map((task, index) => (
              <div key={task.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getTaskIcon(task)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.taskName}
                    </h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTaskStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Started: {formatDate(task.startTime)}</span>
                      {task.duration && (
                        <span>Duration: {formatDuration(task.duration)}</span>
                      )}
                    </div>
                    
                    {task.status === 'RUNNING' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {task.output && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-900 dark:text-white">{task.output}</p>
                      </div>
                    )}
                    
                    {task.error && (
                      <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">{task.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
