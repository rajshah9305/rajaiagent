'use client'

import { useEffect, useState } from 'react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { RecentExecutions } from '@/components/dashboard/RecentExecutions'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    totalExecutions: 0,
    successRate: 0,
    activeExecutions: 0,
  })

  useEffect(() => {
    fetch('/api/metrics/dashboard')
      .then(res => res.json())
      .then(setMetrics)
      .catch(console.error)
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to RAJ AI Agent Builder
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and execute your AI agents with real-time monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Agents"
          value={metrics.totalAgents}
          trend="+12%"
          color="indigo"
        />
        <MetricCard
          title="Executions"
          value={metrics.totalExecutions}
          trend="+24%"
          color="emerald"
        />
        <MetricCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          trend="+5%"
          color="green"
        />
        <MetricCard
          title="Active"
          value={metrics.activeExecutions}
          color="orange"
          pulse
        />
      </div>

      <QuickActions />
      
      <div className="mt-8">
        <RecentExecutions />
      </div>
    </div>
  )
}
