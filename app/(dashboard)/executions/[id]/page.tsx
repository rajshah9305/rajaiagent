'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ExecutionTimeline } from '@/components/execution/ExecutionTimeline'
import { ExecutionMetrics } from '@/components/execution/ExecutionMetrics'
import { LiveOutput } from '@/components/execution/LiveOutput'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Execution } from '@/types'

export default function ExecutionDetailPage() {
  const params = useParams()
  const [execution, setExecution] = useState<Execution | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchExecution(params.id as string)
    }
  }, [params.id])

  const fetchExecution = async (id: string) => {
    try {
      const response = await fetch(`/api/executions/${id}`)
      if (response.ok) {
        const data = await response.json()
        setExecution(data.execution)
      }
    } catch (error) {
      console.error('Failed to fetch execution:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!execution) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Execution not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The execution you're looking for doesn't exist.
          </p>
          <Link
            href="/executions"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Executions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href="/executions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Executions
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Execution Details</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Session ID: {execution.sessionId}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="metric-card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Input</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-900 dark:text-white">{execution.input}</p>
            </div>
          </div>

          <LiveOutput execution={execution} />

          <ExecutionTimeline execution={execution} />
        </div>

        <div className="space-y-6">
          <ExecutionMetrics execution={execution} />

          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Execution Info</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="text-sm">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    execution.status === 'COMPLETE' ? 'bg-green-100 text-green-800' :
                    execution.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' :
                    execution.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {execution.status}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Started</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(execution.startTime).toLocaleString()}
                </dd>
              </div>
              {execution.endTime && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Ended</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(execution.endTime).toLocaleString()}
                  </dd>
                </div>
              )}
              {execution.duration && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Duration</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {execution.duration}s
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
