'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { MetricCard } from '@/components/dashboard/MetricCard'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalExecutions: 0,
    successRate: 0,
    averageDuration: 0,
    totalAgents: 0,
    executionsByDay: [] as Array<{ day: string; executions: number }>,
    topAgents: [] as Array<{ name: string; executions: number }>,
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/metrics/dashboard')
      const data = await response.json()
      setAnalytics(prev => ({
        ...prev,
        ...data,
        // Mock additional analytics data
        executionsByDay: [
          { day: 'Mon', executions: 12 },
          { day: 'Tue', executions: 19 },
          { day: 'Wed', executions: 8 },
          { day: 'Thu', executions: 15 },
          { day: 'Fri', executions: 22 },
          { day: 'Sat', executions: 6 },
          { day: 'Sun', executions: 3 },
        ],
        topAgents: [
          { name: 'Customer Support Agent', executions: 45 },
          { name: 'Code Review Agent', executions: 32 },
          { name: 'Content Generator', executions: 28 },
        ],
      }))
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Insights into your AI agent performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Executions"
          value={analytics.totalExecutions}
          trend="+24%"
          color="indigo"
        />
        <MetricCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          trend="+5%"
          color="green"
        />
        <MetricCard
          title="Avg Duration"
          value={`${analytics.averageDuration}s`}
          trend="-12%"
          color="blue"
        />
        <MetricCard
          title="Active Agents"
          value={analytics.totalAgents}
          trend="+2"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Executions by Day</h3>
          <div className="space-y-4">
            {analytics.executionsByDay.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.day}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(item.executions / 25) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {item.executions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Agents</h3>
          <div className="space-y-4">
            {analytics.topAgents.map((agent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">{agent.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {agent.executions} runs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-4">
            <ChartBarIcon className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Peak Hour</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Peak Day</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Friday</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Efficiency</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fastest Agent</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">2.3s avg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Slowest Agent</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">8.7s avg</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reliability</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">0.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
