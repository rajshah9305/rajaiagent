'use client'

import React, { useState } from 'react'
import { Bot, Cpu, Database, Globe, Layers, Save, Eye, Code, Zap, Terminal, FileText, AlertCircle, CheckCircle, ChevronRight, Sparkles, Brain, Wand2, Settings2 } from 'lucide-react'

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState('')
  const [selectedModel, setSelectedModel] = useState('claude-3.5')
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const models = [
    { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', speed: 'Fast', cost: '$$' },
    { id: 'claude-3', name: 'Claude 3 Opus', provider: 'Anthropic', speed: 'Slower', cost: '$$$' },
    { id: 'titan', name: 'Amazon Titan', provider: 'AWS', speed: 'Very Fast', cost: '$' },
    { id: 'llama2', name: 'Llama 2', provider: 'Meta', speed: 'Fast', cost: '$' },
  ]

  const capabilities = [
    { id: 'web-search', name: 'Web Search', icon: Globe, color: 'emerald' },
    { id: 'data-analysis', name: 'Data Analysis', icon: Database, color: 'amber' },
    { id: 'code-gen', name: 'Code Generation', icon: Code, color: 'cyan' },
    { id: 'api-calls', name: 'API Integration', icon: Zap, color: 'rose' },
  ]

  const templates = [
    { id: 1, name: 'Customer Support', icon: '💬', description: 'Handle customer inquiries' },
    { id: 2, name: 'Data Analyst', icon: '📊', description: 'Process and analyze data' },
    { id: 3, name: 'Content Creator', icon: '✍️', description: 'Generate creative content' },
    { id: 4, name: 'Code Assistant', icon: '👨‍💻', description: 'Help with programming' },
  ]

  const toggleCapability = (capabilityId: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capabilityId) 
        ? prev.filter(id => id !== capabilityId)
        : [...prev, capabilityId]
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
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Agent Builder</h1>
                <p className="text-sm text-gray-600">Create powerful AI agents with AWS Bedrock</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-5 py-2.5 font-semibold rounded-lg transition-all flex items-center space-x-2 border-2 ${
                  isPreviewMode 
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30' 
                    : 'bg-white text-gray-900 border-gray-800 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30 border-2 border-black">
                <Save className="w-4 h-4" />
                <span>Save Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Templates */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 text-white border-2 border-black hover:shadow-2xl transition-shadow">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-xl">Quick Start Templates</h3>
              </div>
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left group border border-white/20 hover:border-white/40"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{template.name}</p>
                        <p className="text-xs text-gray-300 mt-1">{template.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Configuration */}
            <div className="bg-gradient-to-br from-white via-white to-gray-50 border-2 border-black rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-6">
                <Settings2 className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-black">Agent Configuration</h2>
              </div>

              <div className="space-y-6">
                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter agent name..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all"
                  />
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">AI Model</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedModel === model.id
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/30'
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-black">{model.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-600">{model.cost}</span>
                            <span className="text-xs font-bold text-gray-600">{model.speed}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{model.provider}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Capabilities</label>
                  <div className="grid grid-cols-2 gap-3">
                    {capabilities.map((capability) => {
                      const Icon = capability.icon
                      const isSelected = selectedCapabilities.includes(capability.id)
                      return (
                        <button
                          key={capability.id}
                          onClick={() => toggleCapability(capability.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left flex items-center space-x-3 ${
                            isSelected
                              ? `border-${capability.color}-500 bg-${capability.color}-50 shadow-lg shadow-${capability.color}-500/30`
                              : 'border-gray-300 hover:border-gray-400 bg-white'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${
                            isSelected ? `text-${capability.color}-600` : 'text-gray-600'
                          }`} />
                          <span className="font-semibold text-black">{capability.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {isPreviewMode && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-black">Agent Preview</h2>
                </div>
                <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{agentName || 'Untitled Agent'}</h3>
                      <p className="text-sm text-gray-600">
                        {models.find(m => m.id === selectedModel)?.name || 'No model selected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCapabilities.map((capId) => {
                      const capability = capabilities.find(c => c.id === capId)
                      if (!capability) return null
                      const Icon = capability.icon
                      return (
                        <span
                          key={capId}
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 bg-${capability.color}-100 text-${capability.color}-700 border border-${capability.color}-300`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{capability.name}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentBuilder
