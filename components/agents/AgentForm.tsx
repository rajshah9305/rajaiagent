'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { 
  SparklesIcon, 
  Cog6ToothIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface AgentFormProps {
  onSubmit: (data: any) => void
  loading?: boolean
  foundationModels: string[]
  initialData?: any
}

export function AgentForm({ onSubmit, loading = false, foundationModels, initialData }: AgentFormProps) {
  const [formData, setFormData] = useState({
    agentName: initialData?.agentName || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    foundationModel: initialData?.foundationModel || foundationModels[0],
    idleSessionTTL: initialData?.idleSessionTTL || 600,
    tags: initialData?.tags?.join(', ') || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.agentName.trim()) {
      newErrors.agentName = 'Agent name is required'
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required'
    }

    if (formData.idleSessionTTL < 60 || formData.idleSessionTTL > 3600) {
      newErrors.idleSessionTTL = 'Session TTL must be between 60 and 3600 seconds'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="metric-card-vibrant relative overflow-hidden group">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10" />
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container icon-indigo">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gradient">Basic Information</h3>
          </div>
          
          <div className="space-y-6">
            <Input
              label="Agent Name"
              value={formData.agentName}
              onChange={(e) => handleChange('agentName', e.target.value)}
              error={errors.agentName}
              placeholder="Enter agent name"
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter agent description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter detailed instructions for the agent"
                rows={6}
                required
              />
              {errors.instructions && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.instructions}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="metric-card relative overflow-hidden group">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-green-50/10 to-teal-50/20 dark:from-emerald-900/10 dark:via-green-900/5 dark:to-teal-900/10" />
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container icon-emerald">
              <Cog6ToothIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gradient-success">Configuration</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Foundation Model
              </label>
              <select
                value={formData.foundationModel}
                onChange={(e) => handleChange('foundationModel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                {foundationModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-emerald-600" />
                  Session Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={formData.idleSessionTTL}
                  onChange={(e) => handleChange('idleSessionTTL', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  min="60"
                  max="3600"
                  placeholder="600"
                />
                {errors.idleSessionTTL && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.idleSessionTTL}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-emerald-600" />
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="customer-support, ai-assistant"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button 
          type="button" 
          variant="outline"
          className="px-8 py-3 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Creating...' : 'Create Agent'}
        </Button>
      </div>
    </form>
  )
}
