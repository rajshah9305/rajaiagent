'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, PlayIcon } from '@heroicons/react/24/outline'
import { formatDate, formatDuration } from '@/lib/utils'
import type { Execution } from '@/types'

export function RecentExecutions() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExecutions()
  }, [])

  const fetchExecutions = async () => {
    try {
      const response = await fetch('/api/executions')
      const data = await response.json()
      setExecutions(data.executions?.slice(0, 5) || [])
    } catch (error) {
      console.error('Failed to fetch executions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { badge: string; icon: string; bg: string }> = {
      'COMPLETE': {
        badge: 'status-success',
        icon: 'icon-emerald',
        bg: 'from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20'
      },
      'RUNNING': {
        badge: 'status-running',
        icon: 'icon-blue',
        bg: 'from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20'
      },
      'FAILED': {
        badge: 'status-error',
        icon: 'icon-red',
        bg: 'from-red-50/50 to-rose-50/50 dark:from-red-900/20 dark:to-rose-900/20'
      },
      'CANCELLED': {
        badge: 'status-neutral',
        icon: 'icon-neutral',
        bg: 'from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20'
      },
    }
    return statusMap[status] || statusMap['CANCELLED']
  }

  if (loading) {
    return (
      <div className="metric-card relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-purple-50/20 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10" />
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container icon-blue">
              <PlayIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gradient">Recent Executions</h2>
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="metric-card relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-purple-50/20 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10" />
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="icon-container icon-blue">
              <PlayIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gradient">Recent Executions</h2>
          </div>
          <Link
            href="/executions"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 hover:underline"
          >
            View all
          </Link>
        </div>

        {executions.length === 0 ? (
          <div className="text-center py-12">
            <div className="icon-container icon-blue mx-auto mb-4 w-16 h-16">
              <PlayIcon className="h-8 w-8" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No recent executions</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Start by executing an agent</p>
          </div>
        ) : (
          <div className="space-y-4">
            {executions.map((execution, index) => {
              const statusConfig = getStatusConfig(execution.status)
              return (
                <motion.div 
                  key={execution.id} 
                  className={`execution-card bg-gradient-to-r ${statusConfig.bg} group`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <motion.p 
                        className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        {execution.input}
                      </motion.p>
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className={`status-badge ${statusConfig.badge}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {execution.status}
                        </motion.span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {formatDate(execution.startTime)}
                        </span>
                        {execution.duration && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {formatDuration(execution.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/executions/${execution.id}`}
                        className="ml-4 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
