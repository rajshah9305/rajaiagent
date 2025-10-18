'use client'

import { useEffect, useState } from 'react'
import { Activity, Bot, MessageSquare, Zap, TrendingUp, Clock, CheckCircle, AlertCircle, Play, Plus, Settings, Search, Bell, User, BarChart3, RefreshCw } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { RecentExecutions } from '@/components/dashboard/RecentExecutions'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    totalExecutions: 0,
    successRate: 0,
    activeExecutions: 0,
  })

  // Mock data for demonstration
  const stats = [
    { label: 'Active Agents', value: '12', change: '+3', icon: Bot, trend: 'up' },
    { label: 'Total Executions', value: '1,847', change: '+127', icon: Zap, trend: 'up' },
    { label: 'Avg Response Time', value: '1.2s', change: '-0.3s', icon: Clock, trend: 'down' },
    { label: 'Success Rate', value: '98.5%', change: '+2.1%', icon: CheckCircle, trend: 'up' }
  ]

  const agents = [
    { id: 1, name: 'Customer Support Bot', status: 'active', model: 'Claude 3.5', executions: 234, lastRun: '2 min ago' },
    { id: 2, name: 'Data Analyzer', status: 'idle', model: 'Claude 3', executions: 156, lastRun: '1 hour ago' },
    { id: 3, name: 'Content Generator', status: 'active', model: 'Titan', executions: 89, lastRun: '5 min ago' },
    { id: 4, name: 'Code Assistant', status: 'error', model: 'Claude 3.5', executions: 445, lastRun: '10 min ago' },
  ]

  const recentExecutions = [
    { id: 1, agent: 'Customer Support Bot', task: 'Handle product inquiry', status: 'completed', duration: '1.2s', time: '2 minutes ago' },
    { id: 2, agent: 'Data Analyzer', task: 'Process sales data', status: 'completed', duration: '3.4s', time: '15 minutes ago' },
    { id: 3, agent: 'Content Generator', task: 'Generate blog post', status: 'running', duration: '...', time: 'Just now' },
    { id: 4, agent: 'Code Assistant', task: 'Debug API endpoint', status: 'failed', duration: '0.8s', time: '10 minutes ago' },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': case 'running': case 'completed': return 'text-emerald-700 bg-emerald-50 border border-emerald-200'
      case 'error': case 'failed': return 'text-red-700 bg-red-50 border border-red-200'
      case 'idle': return 'text-gray-700 bg-gray-50 border border-gray-200'
      default: return 'text-gray-700 bg-gray-50 border border-gray-200'
    }
  }

  const getStatusDot = (status: string) => {
    switch(status) {
      case 'active': case 'running': return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50'
      case 'error': case 'failed': return 'bg-red-500 shadow-lg shadow-red-500/50'
      case 'idle': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  useEffect(() => {
    fetch('/api/metrics/dashboard')
      .then(res => res.json())
      .then(setMetrics)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-gradient-to-br from-white via-white to-gray-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-all hover:scale-105 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className={`text-sm font-bold ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agents List */}
          <div className="bg-gradient-to-br from-white via-white to-gray-50 border-2 border-black rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Active Agents</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30">
                <Plus className="w-4 h-4" />
                <span>New Agent</span>
              </button>
            </div>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusDot(agent.status)}`}></div>
                      <h3 className="font-bold text-black">{agent.name}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md border ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-medium">{agent.model}</span>
                    <div className="flex items-center space-x-4">
                      <span>{agent.executions} runs</span>
                      <span>{agent.lastRun}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Executions */}
          <div className="bg-gradient-to-br from-white via-white to-gray-50 border-2 border-black rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Recent Executions</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              {recentExecutions.map((execution) => (
                <div key={execution.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-black">{execution.agent}</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md border ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{execution.task}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{execution.duration}</span>
                    <span>{execution.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}
