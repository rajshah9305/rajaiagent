'use client'

import { Execution } from '@/types'
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

interface ExecutionMetricsProps {
  execution: Execution
}

export function ExecutionMetrics({ execution }: ExecutionMetricsProps) {
  const metrics = execution.metrics || {
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    runningTasks: 0,
    averageTaskDuration: 0,
    totalDuration: 0,
    throughput: 0,
    successRate: 0,
  }

  const metricCards = [
    {
      title: 'Total Tasks',
      value: metrics.totalTasks,
      icon: ChartBarIcon,
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20'
    },
    {
      title: 'Completed',
      value: metrics.completedTasks,
      icon: CheckCircleIcon,
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-600',
      bg: 'from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20'
    },
    {
      title: 'Failed',
      value: metrics.failedTasks,
      icon: XCircleIcon,
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      bg: 'from-red-50/50 to-rose-50/50 dark:from-red-900/20 dark:to-rose-900/20'
    },
    {
      title: 'Running',
      value: metrics.runningTasks,
      icon: PlayIcon,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20'
    }
  ]

  const detailMetrics = [
    {
      label: 'Success Rate',
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: CheckCircleIcon,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      label: 'Avg Duration',
      value: `${metrics.averageTaskDuration.toFixed(1)}s`,
      icon: ClockIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Throughput',
      value: `${metrics.throughput.toFixed(1)} tasks/min`,
      icon: ChartBarIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ]

  return (
    <div className="metric-card relative overflow-hidden group">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-purple-50/20 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10" />
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-container icon-blue">
            <ChartBarIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gradient">Execution Metrics</h3>
        </div>
        
        {/* Main Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.title} className={`bg-gradient-to-br ${metric.bg} rounded-xl p-4 border border-gray-100/50 dark:border-gray-700/30 hover:scale-105 transition-transform duration-200`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${metric.bg}`}>
                    <Icon className={`h-5 w-5 ${metric.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 
                      metric.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                      metric.color === 'red' ? 'text-red-600 dark:text-red-400' :
                      'text-blue-600 dark:text-blue-400'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {metric.title}
                  </span>
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Metrics */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Details</h4>
          
          <div className="space-y-3">
            {detailMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100/50 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric.bg}`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {metric.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Total Duration */}
          {execution.duration && (
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/30">
                <div className="flex items-center gap-3">
                  <div className="icon-container icon-indigo">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Duration
                  </span>
                </div>
                <span className="text-lg font-bold text-gradient">
                  {execution.duration}s
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
