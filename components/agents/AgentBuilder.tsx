'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Database, Globe, Save, Eye, Code, Zap, ChevronRight, Sparkles, Wand2, Settings2, ArrowLeft } from 'lucide-react'
import { AgentForm } from './AgentForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const AgentBuilder = () => {
  const router = useRouter()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'form' | 'preview' | 'created'>('form')

  const foundationModels = [
    'anthropic.claude-3-sonnet-20240229-v1:0',
    'anthropic.claude-3-haiku-20240307-v1:0',
    'anthropic.claude-3-opus-20240229-v1:0',
    'amazon.titan-text-express-v1',
    'amazon.titan-text-lite-v1',
  ]

  const handleCreateAgent = async (agentData: any) => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData),
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      const agent = await response.json()
      setCurrentStep('created')
      
      // Redirect to agents page after a delay
      setTimeout(() => {
        router.push('/agents')
      }, 2000)
    } catch (error) {
      console.error('Error creating agent:', error)
      alert('Failed to create agent. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (currentStep === 'created') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white border-2 border-emerald-300 rounded-xl p-8 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Agent Created Successfully!</h2>
          <p className="text-gray-600 mb-4">Your AI agent has been created and is ready to use.</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <LoadingSpinner size="sm" />
            <span>Redirecting to agents page...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="border-b-2 border-black bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/agents')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Create New Agent</h1>
                <p className="text-sm text-gray-600">Build powerful AI agents with AWS Bedrock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border-2 border-black rounded-xl shadow-lg overflow-hidden">
          <AgentForm
            onSubmit={handleCreateAgent}
            loading={isCreating}
            foundationModels={foundationModels}
          />
        </div>
      </div>
    </div>
  )
}

export default AgentBuilder
