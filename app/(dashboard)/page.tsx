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
      case 'active': case 'running': case 'completed': return 'status-success'
      case 'error': case 'failed': return 'status-error'
      case 'idle': return 'status-info'
      default: return 'status-info'
    }
  }

  const getStatusDot = (status: string) => {
    switch(status) {
      case 'active': case 'running': return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50'
      case 'error': case 'failed': return 'bg-red-500 shadow-lg shadow-red-500/50'
      case 'idle': return 'bg-muted-foreground'
      default: return 'bg-muted-foreground'
    }
  }

  useEffect(() => {
    fetch('/api/metrics/dashboard')
      .then(res => res.json())
      .then(setMetrics)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-8 p-6">
      {/* Page Background with Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/50 pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-primary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/5 to-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="metric-card-vibrant relative overflow-hidden group">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.trend === 'up' ? 'icon-success' : 'icon-error'
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
                <div className="relative z-10">
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-xl" />
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agents List */}
          <div className="glass-card relative overflow-hidden">
            {/* Header gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Active Agents</h2>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold rounded-lg hover:from-primary/95 hover:to-primary transition-all flex items-center space-x-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105">
                <Plus className="w-4 h-4" />
                <span>New Agent</span>
              </button>
            </div>

            <div className="relative z-10 space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:bg-card/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusDot(agent.status)}`} />
                      <h3 className="font-bold text-foreground">{agent.name}</h3>
                    </div>
                    <span className={`status-badge ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium">{agent.model}</span>
                    <div className="flex items-center space-x-4">
                      <span>{agent.executions} runs</span>
                      <span>{agent.lastRun}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Recent Executions */}
          <div className="glass-card relative overflow-hidden">
            {/* Header gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/90 rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
                  <Activity className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Recent Executions</h2>
              </div>
              <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors hover:scale-110">
                <RefreshCw className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="relative z-10 space-y-4">
              {recentExecutions.map((execution) => (
                <div key={execution.id} className="execution-card hover:border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground">{execution.agent}</h3>
                    <span className={`status-badge ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{execution.task}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{execution.duration}</span>
                    <span>{execution.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}
