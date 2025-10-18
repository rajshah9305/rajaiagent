'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Wrench, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Check, 
  X,
  Zap,
  BarChart3,
  Globe,
  Mail,
  FileText,
  Activity,
  Filter,
  Search
} from 'lucide-react'
import { Tool, AgentTool } from '@/types'

interface ToolsManagerProps {
  agentId: string
  onToolsChange?: (tools: AgentTool[]) => void
}

const ToolsManager = ({ agentId, onToolsChange }: ToolsManagerProps) => {
  const [availableTools, setAvailableTools] = useState<Tool[]>([])
  const [agentTools, setAgentTools] = useState<AgentTool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTool, setEditingTool] = useState<AgentTool | null>(null)

  const categories = [
    { id: 'all', name: 'All Tools', icon: Activity },
    { id: 'data', name: 'Data', icon: BarChart3 },
    { id: 'communication', name: 'Communication', icon: Mail },
    { id: 'automation', name: 'Automation', icon: Zap },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'integration', name: 'Integration', icon: Globe },
  ]

  const fetchAvailableTools = useCallback(async () => {
    try {
      const response = await fetch('/api/tools')
      const data = await response.json()
      setAvailableTools(data.tools || [])
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  }, [])

  const fetchAgentTools = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/tools`)
      const data = await response.json()
      setAgentTools(data.agentTools || [])
      onToolsChange?.(data.agentTools || [])
    } catch (error) {
      console.error('Error fetching agent tools:', error)
    } finally {
      setLoading(false)
    }
  }, [agentId, onToolsChange])

  useEffect(() => {
    fetchAvailableTools()
    fetchAgentTools()
  }, [fetchAvailableTools, fetchAgentTools])

  const addToolToAgent = async (toolId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      })

      if (response.ok) {
        await fetchAgentTools()
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding tool:', error)
    }
  }

  const updateAgentTool = async (toolId: string, updates: Partial<AgentTool>) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchAgentTools()
        setEditingTool(null)
      }
    } catch (error) {
      console.error('Error updating tool:', error)
    }
  }

  const removeToolFromAgent = async (toolId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/tools/${toolId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchAgentTools()
      }
    } catch (error) {
      console.error('Error removing tool:', error)
    }
  }

  const filteredTools = availableTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getToolIcon = (iconName?: string) => {
    const iconMap: { [key: string]: any } = {
      BarChart3,
      Globe,
      Mail,
      FileText,
      Zap,
      Activity
    }
    return iconMap[iconName || 'Activity'] || Activity
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Tools Management</h2>
            <p className="text-sm text-muted-foreground">Configure tools for your agent</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tool</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Agent Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Configured Tools ({agentTools.length})</h3>
        
        {agentTools.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tools configured for this agent</p>
            <p className="text-sm">Add tools to enable advanced capabilities</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {agentTools.map((agentTool) => {
              const Icon = getToolIcon(agentTool.tool?.icon)
              return (
                <div
                  key={agentTool.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {agentTool.tool?.displayName || 'Unknown Tool'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {agentTool.tool?.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Priority: {agentTool.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Category: {agentTool.tool?.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingTool(agentTool)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => removeToolFromAgent(agentTool.toolId)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateAgentTool(agentTool.toolId, { isEnabled: !agentTool.isEnabled })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            agentTool.isEnabled ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              agentTool.isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Tool Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add Tool to Agent</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredTools.map((tool) => {
                const Icon = getToolIcon(tool.icon)
                const isAlreadyAdded = agentTools.some(at => at.toolId === tool.name)
                
                return (
                  <div
                    key={tool.name}
                    className={`p-4 border border-border rounded-lg ${
                      isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'
                    }`}
                    onClick={() => !isAlreadyAdded && addToolToAgent(tool.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{tool.displayName}</h4>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Category: {tool.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Version: {tool.version}
                          </span>
                        </div>
                      </div>
                      {isAlreadyAdded ? (
                        <Check className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Tool Configuration</h3>
              <button
                onClick={() => setEditingTool(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  value={editingTool.priority}
                  onChange={(e) => setEditingTool({...editingTool, priority: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Configuration (JSON)
                </label>
                <textarea
                  value={editingTool.config || ''}
                  onChange={(e) => setEditingTool({...editingTool, config: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background h-24"
                  placeholder='{"key": "value"}'
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={editingTool.isEnabled}
                  onChange={(e) => setEditingTool({...editingTool, isEnabled: e.target.checked})}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="enabled" className="text-sm text-foreground">
                  Enable this tool
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setEditingTool(null)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateAgentTool(editingTool.toolId, {
                  priority: editingTool.priority,
                  config: editingTool.config,
                  isEnabled: editingTool.isEnabled
                })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToolsManager
