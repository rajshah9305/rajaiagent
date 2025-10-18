'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Share2,
  MoreVertical,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  Bot,
  Timer,
  Target,
  Layers,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  StopCircle
} from 'lucide-react'
import { AdvancedCard } from '@/components/ui/AdvancedComponents'
import { StatusIndicator, ProgressRing } from '@/components/ui/AdvancedComponents'
// Chart components temporarily removed
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Execution } from '@/types'

interface ExecutionStats {
  total: number
  running: number
  completed: number
  failed: number
  cancelled: number
  avgDuration: number
  successRate: number
  totalDuration: number
}

interface ExecutionMetrics {
  hourly: Array<{ hour: string; executions: number; success: number; failed: number }>
  daily: Array<{ day: string; executions: number; avgDuration: number }>
  realtime: Array<{ time: string; active: number; completed: number }>
}

export default function EnhancedExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'completed' | 'failed' | 'cancelled'>('all')
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [sortBy, setSortBy] = useState<'startTime' | 'duration' | 'status'>('startTime')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedExecutions, setSelectedExecutions] = useState<string[]>([])
  const [stats, setStats] = useState<ExecutionStats>({
    total: 0,
    running: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    avgDuration: 0,
    successRate: 0,
    totalDuration: 0
  })
  const [metrics, setMetrics] = useState<ExecutionMetrics>({
    hourly: [],
    daily: [],
    realtime: []
  })
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchExecutions()
    
    if (autoRefresh) {
      const interval = setInterval(fetchExecutions, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchExecutions = async () => {
    try {
      const response = await fetch('/api/executions')
      const data = await response.json()
      setExecutions(data.executions || [])
      calculateStats(data.executions || [])
      generateMetrics(data.executions || [])
    } catch (error) {
      console.error('Failed to fetch executions:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (executionList: Execution[]) => {
    const stats = executionList.reduce((acc, execution) => {
      acc.total++
      if (execution.status === 'RUNNING') acc.running++
      else if (execution.status === 'COMPLETE') acc.completed++
      else if (execution.status === 'FAILED') acc.failed++
      else if (execution.status === 'CANCELLED') acc.cancelled++
      
      if (execution.duration) {
        acc.totalDuration += execution.duration
      }
      
      return acc
    }, {
      total: 0,
      running: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      avgDuration: 0,
      successRate: 0,
      totalDuration: 0
    })
    
    stats.avgDuration = stats.total > 0 ? stats.totalDuration / stats.total : 0
    stats.successRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
    setStats(stats)
  }

  const generateMetrics = (executionList: Execution[]) => {
    // Generate hourly metrics
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = `${i.toString().padStart(2, '0')}:00`
      const hourExecutions = executionList.filter(exec => {
        const execHour = new Date(exec.startTime).getHours()
        return execHour === i
      })
      
      return {
        hour,
        executions: hourExecutions.length,
        success: hourExecutions.filter(e => e.status === 'COMPLETE').length,
        failed: hourExecutions.filter(e => e.status === 'FAILED').length
      }
    })

    // Generate daily metrics
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const day = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      const dayExecutions = executionList.filter(exec => {
        const execDate = new Date(exec.startTime)
        return execDate.toDateString() === date.toDateString()
      })
      
      const avgDuration = dayExecutions.length > 0 
        ? dayExecutions.reduce((sum, exec) => sum + (exec.duration || 0), 0) / dayExecutions.length
        : 0
      
      return {
        day,
        executions: dayExecutions.length,
        avgDuration: Math.round(avgDuration * 100) / 100
      }
    }).reverse()

    // Generate real-time data
    const realtimeData = Array.from({ length: 20 }, (_, i) => {
      const time = new Date(Date.now() - i * 30000).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      const activeExecutions = executionList.filter(exec => 
        exec.status === 'RUNNING' && 
        new Date(exec.startTime).getTime() > Date.now() - i * 30000
      ).length
      
      const completedExecutions = executionList.filter(exec => 
        exec.status === 'COMPLETE' && 
        new Date(exec.startTime).getTime() > Date.now() - i * 30000
      ).length
      
      return {
        time,
        active: activeExecutions,
        completed: completedExecutions
      }
    }).reverse()

    setMetrics({
      hourly: hourlyData,
      daily: dailyData,
      realtime: realtimeData
    })
  }

  const filteredExecutions = executions
    .filter(execution => {
      const matchesSearch = execution.input.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || execution.status.toLowerCase() === filterStatus
      
      const matchesDate = filterDate === 'all' || (() => {
        const execDate = new Date(execution.startTime)
        const now = new Date()
        
        switch (filterDate) {
          case 'today':
            return execDate.toDateString() === now.toDateString()
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return execDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return execDate >= monthAgo
          default:
            return true
        }
      })()
      
      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'startTime':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          break
        case 'duration':
          comparison = (a.duration || 0) - (b.duration || 0)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { badge: string; icon: string; color: string }> = {
      'COMPLETE': {
        badge: 'status-success',
        icon: 'icon-emerald',
        color: 'text-emerald-600'
      },
      'RUNNING': {
        badge: 'status-running',
        icon: 'icon-blue',
        color: 'text-blue-600'
      },
      'FAILED': {
        badge: 'status-error',
        icon: 'icon-red',
        color: 'text-red-600'
      },
      'CANCELLED': {
        badge: 'status-neutral',
        icon: 'icon-neutral',
        color: 'text-gray-600'
      },
    }
    return statusMap[status] || statusMap['CANCELLED']
  }

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration.toFixed(1)}s`
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${(duration % 60).toFixed(0)}s`
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
      <div>
        <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
            <Activity className="w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient">Execution Monitor</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time monitoring and analytics for AI agent executions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              autoRefresh 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-sm font-medium">Live Updates</span>
          </motion.button>
          
          <motion.button
            onClick={fetchExecutions}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Execution Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AdvancedCard variant="gradient" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Executions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
              </div>
              <div className="icon-container icon-blue">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </AdvancedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AdvancedCard variant="gradient" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Running Now</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.running}</p>
              </div>
              <div className="icon-container icon-emerald">
                <PlayCircle className="h-6 w-6" />
              </div>
            </div>
          </AdvancedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AdvancedCard variant="gradient" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.successRate.toFixed(1)}%</p>
              </div>
              <div className="icon-container icon-emerald">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </AdvancedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AdvancedCard variant="gradient" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg Duration</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatDuration(stats.avgDuration)}</p>
              </div>
              <div className="icon-container icon-purple">
                <Timer className="h-6 w-6" />
              </div>
            </div>
          </AdvancedCard>
        </motion.div>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AdvancedCard variant="glass">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Execution Trends</h3>
              <p className="text-sm text-muted-foreground mb-4">Hourly execution volume</p>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart component temporarily unavailable</p>
              </div>
            </div>
          </AdvancedCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AdvancedCard variant="glass">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Real-time Activity</h3>
              <p className="text-sm text-muted-foreground mb-4">Live execution monitoring</p>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart component temporarily unavailable</p>
              </div>
            </div>
          </AdvancedCard>
        </motion.div>
      </div>

      {/* Enhanced Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
              placeholder="Search executions by input..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value as any)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as any)
                setSortOrder(order as any)
              }}
              className="px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="startTime-desc">Newest First</option>
              <option value="startTime-asc">Oldest First</option>
              <option value="duration-desc">Longest Duration</option>
              <option value="duration-asc">Shortest Duration</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </div>
      </div>
      </motion.div>

      {/* Executions List */}
      {filteredExecutions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
        <EmptyState
          title="No executions found"
            description="No executions match your current filters. Try adjusting your search criteria or create a new execution."
            actionLabel="View All Executions"
            actionHref="/executions"
          icon={<Activity className="h-12 w-12" />}
        />
        </motion.div>
      ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredExecutions.map((execution, index) => {
              const statusConfig = getStatusConfig(execution.status)
                  return (
                    <motion.div
                      key={execution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                >
                  <AdvancedCard 
                    variant="gradient" 
                    interactive 
                    className="group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Status Indicator */}
                        <StatusIndicator 
                          status={execution.status === 'COMPLETE' ? 'success' : execution.status === 'RUNNING' ? 'active' : execution.status === 'FAILED' ? 'error' : 'inactive'}
                          animated={execution.status === 'RUNNING'}
                        />
                        
                        {/* Execution Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {execution.input}
                            </h3>
                            <span className={`status-badge ${statusConfig.badge}`}>
                              {execution.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(execution.startTime)}</span>
                            </div>
                            {execution.duration && (
                              <div className="flex items-center gap-1">
                                <Timer className="w-4 h-4" />
                                <span>{formatDuration(execution.duration)}</span>
                              </div>
                            )}
                            {/* Agent name removed - not available in Execution type */}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                      <Link
                        href={`/executions/${execution.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                      >
                          <Eye className="h-4 w-4" />
                      </Link>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Progress Bar for Running Executions */}
                    {execution.status === 'RUNNING' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>Execution in progress...</span>
                          <span>Running</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                  </AdvancedCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
        </div>
      )}
    </div>
  )
}