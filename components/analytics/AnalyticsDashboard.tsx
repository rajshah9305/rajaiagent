'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { BarChart3, TrendingUp, Activity, DollarSign, Clock, Zap, Calendar, Download, Filter, PieChart, LineChart, Users, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface AnalyticsMetrics {
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  totalDuration: number
  averageDuration: number
  successRate: number
  totalCost: number
  averageCost: number
  toolsUsed: number
  uniqueAgents: number
  peakUsageHour: number
  peakUsageDay: string
}

interface TimeSeriesData {
  date: string
  executions: number
  successRate: number
  duration: number
  cost: number
}

interface AgentPerformance {
  agentId: string
  agentName: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageDuration: number
  successRate: number
  totalCost: number
  toolsUsed: string[]
  lastExecution?: string
}

interface ToolUsage {
  toolId: string
  toolName: string
  usageCount: number
  successRate: number
  averageDuration: number
  category: string
}

interface RealTimeMetrics {
  executionsLastHour: number
  activeTasks: number
  activeToolExecutions: number
  averageResponseTime: number
  errorRate: number
}

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([])
  const [toolUsage, setToolUsage] = useState<ToolUsage[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAnalyticsData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const [metricsRes, timeSeriesRes, agentsRes, toolsRes, realTimeRes] = await Promise.all([
        fetch(`/api/analytics/metrics?timeRange=${timeRange}`),
        fetch(`/api/analytics/timeseries?timeRange=${timeRange}`),
        fetch(`/api/analytics/agents?timeRange=${timeRange}`),
        fetch(`/api/analytics/tools?timeRange=${timeRange}`),
        fetch('/api/analytics/realtime')
      ])

      const [metricsData, timeSeriesData, agentsData, toolsData, realTimeData] = await Promise.all([
        metricsRes.json(),
        timeSeriesRes.json(),
        agentsRes.json(),
        toolsRes.json(),
        realTimeRes.json()
      ])

      setMetrics(metricsData.metrics)
      setTimeSeriesData(timeSeriesData.timeSeriesData)
      setAgentPerformance(agentsData.agentPerformance)
      setToolUsage(toolsData.toolUsage)
      setRealTimeMetrics(realTimeData.realTimeMetrics)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [timeRange])

  // Debounced effect for timeRange changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnalyticsData()
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [timeRange, fetchAnalyticsData])

  // Initial load
  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData]) // Include fetchAnalyticsData dependency

  const handleRefresh = useCallback(() => {
    fetchAnalyticsData(true)
  }, [fetchAnalyticsData])

  const performanceMetrics = useMemo(() => {
    if (!metrics) return []
    
    return [
      { 
        label: 'Total Executions', 
        value: metrics.totalExecutions.toLocaleString(), 
        change: '+12.5%', 
        icon: Activity, 
        color: 'emerald',
        trend: 'up'
      },
      { 
        label: 'Avg Response Time', 
        value: `${(metrics.averageDuration / 1000).toFixed(2)}s`, 
        change: '-8.3%', 
        icon: Clock, 
        color: 'cyan',
        trend: 'down'
      },
      { 
        label: 'Success Rate', 
        value: `${metrics.successRate.toFixed(1)}%`, 
        change: '+2.1%', 
        icon: TrendingUp, 
        color: 'amber',
        trend: 'up'
      },
      { 
        label: 'Total Cost', 
        value: `$${metrics.totalCost.toFixed(2)}`, 
        change: '+23.7%', 
        icon: DollarSign, 
        color: 'rose',
        trend: 'up'
      },
    ]
  }, [metrics])

  const chartData = useMemo(() => {
    return timeSeriesData.map(data => ({
      day: new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: data.executions,
      successRate: data.successRate,
      cost: data.cost
    }))
  }, [timeSeriesData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Performance insights and metrics</p>
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border-2 border-border rounded-lg font-semibold focus:outline-none focus:border-primary bg-card"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all flex items-center space-x-2 border-2 border-gray-800">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      {realTimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Active Tasks</p>
                <p className="text-2xl font-bold text-emerald-800">{realTimeMetrics.activeTasks}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700">Tool Executions</p>
                <p className="text-2xl font-bold text-blue-800">{realTimeMetrics.activeToolExecutions}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-700">Avg Response</p>
                <p className="text-2xl font-bold text-amber-800">{(realTimeMetrics.averageResponseTime / 1000).toFixed(1)}s</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-700">Error Rate</p>
                <p className="text-2xl font-bold text-rose-800">{realTimeMetrics.errorRate.toFixed(1)}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            const colorStyles = {
              emerald: 'from-emerald-50 to-green-50 border-emerald-300 text-emerald-600 bg-emerald-100',
              cyan: 'from-cyan-50 to-sky-50 border-cyan-300 text-cyan-600 bg-cyan-100',
              amber: 'from-amber-50 to-yellow-50 border-amber-300 text-amber-600 bg-amber-100',
              rose: 'from-rose-50 to-pink-50 border-rose-300 text-rose-600 bg-rose-100',
            }
            const style = colorStyles[metric.color as keyof typeof colorStyles]
            
            return (
              <div key={index} className={`bg-gradient-to-br ${style.split(' ')[0]} ${style.split(' ')[1]} border-2 border-black rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${style.split(' ')[4]} rounded-xl flex items-center justify-center border-2 ${style.split(' ')[2]}`}>
                    <Icon className={`w-7 h-7 ${style.split(' ')[3]}`} />
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                    metric.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-semibold mb-1 uppercase tracking-wide">{metric.label}</p>
                <p className="text-3xl font-bold text-black">{metric.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Volume Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <LineChart className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-xl text-black">Request Volume</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-300">
                Live
              </span>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 px-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-xs font-bold text-gray-700 mb-2">{data.value}</span>
                      <div 
                        className="w-12 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg hover:from-emerald-600 hover:to-teal-500 transition-all cursor-pointer"
                        style={{ height: `${(data.value / 7500) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 mt-2">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Distribution */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <PieChart className="w-6 h-6 text-amber-600" />
              <h3 className="font-bold text-xl text-black">Usage by Model</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Claude 3.5</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <span className="text-sm font-bold">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Claude 3</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <span className="text-sm font-bold">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Titan</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full" style={{width: '15%'}}></div>
                  </div>
                  <span className="text-sm font-bold">15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Others</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-cyan-500 to-sky-500 h-3 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <span className="text-sm font-bold">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance Table */}
        <div className="mt-6 bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="px-6 py-4 border-b-2 border-black bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-cyan-600" />
                <h3 className="font-bold text-xl text-black">Agent Performance</h3>
              </div>
              <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">View Details →</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/80 border-b-2 border-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Agent Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Total Executions</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Success Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Avg Response</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tools Used</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-cyan-100">
                {agentPerformance.map((agent, index) => (
                  <tr key={index} className="hover:bg-white/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">{agent.agentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{agent.totalExecutions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        agent.successRate > 98 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}>
                        {agent.successRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{(agent.averageDuration / 1000).toFixed(2)}s</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">${agent.totalCost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {agent.toolsUsed.slice(0, 3).map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">
                            {tool}
                          </span>
                        ))}
                        {agent.toolsUsed.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{agent.toolsUsed.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tool Usage Table */}
        {toolUsage.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b-2 border-black bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-xl text-black">Tool Usage</h3>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold">View Details →</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/80 border-b-2 border-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tool Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Usage Count</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Success Rate</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Avg Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-purple-100">
                  {toolUsage.map((tool, index) => (
                    <tr key={index} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-black">{tool.toolName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{tool.usageCount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          tool.successRate > 95 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                            : tool.successRate > 80
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          {tool.successRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{(tool.averageDuration / 1000).toFixed(2)}s</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded capitalize">
                          {tool.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard
