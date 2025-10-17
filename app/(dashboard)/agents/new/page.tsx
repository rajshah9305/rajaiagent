'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AgentForm } from '@/components/agents/AgentForm'
import { FOUNDATION_MODELS } from '@/lib/constants'

export default function NewAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/agents')
      } else {
        throw new Error('Failed to create agent')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Agent</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Configure your AWS Bedrock AI agent
        </p>
      </div>

      <div className="max-w-2xl">
        <AgentForm
          onSubmit={handleSubmit}
          loading={loading}
          foundationModels={FOUNDATION_MODELS}
        />
      </div>
    </div>
  )
}
