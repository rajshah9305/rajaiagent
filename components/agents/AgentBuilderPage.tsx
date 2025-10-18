'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, ChevronsUpDown, AlertCircle } from 'lucide-react';
import { AgentConfig } from '@/types/ui';
import { useAPI } from '@/hooks/useAPI';
import { PageWrapper } from '@/components/shared/PageWrapper';

interface AgentBuilderProps {
  addNotification: (notification: any) => void;
}

const AVAILABLE_MODELS = [
  { id: 'anthropic.claude-3-5-sonnet-20240620-v1:0', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'amazon.titan-text-premier-v1:0', name: 'Titan Text Premier', provider: 'Amazon' },
  { id: 'mistral.mistral-large-2402-v1:0', name: 'Mistral Large', provider: 'Mistral' }
];


export const AgentBuilderPage: React.FC<AgentBuilderProps> = ({ addNotification }) => {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({ 
    agentName: 'My Bedrock Agent',
    foundationModel: AVAILABLE_MODELS[0].id,
    instruction: 'You are a helpful AI assistant. Provide accurate, concise responses.',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const api = useAPI();
  
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const result = await api.createAgent(agentConfig);
      addNotification({
        type: 'success',
        title: 'Agent Created',
        message: `${agentConfig.agentName} has been created successfully`,
        time: 'Just now'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create agent. Check your AWS credentials.',
        time: 'Just now'
      });
    } finally {
      setIsSaving(false);
    }
  }, [agentConfig, api, addNotification]);

  return (
    <PageWrapper pageKey="agent-builder">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Agent Builder</h2>
          <p className="text-gray-600 text-lg">Create your AWS Bedrock AI agent</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 disabled:opacity-70">
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Creating...' : 'Create Agent'}</span>
          </motion.button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Agent Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="font-bold text-gray-700 block mb-2">Agent Name</label>
              <input 
                type="text" 
                value={agentConfig.agentName} 
                onChange={e => setAgentConfig({...agentConfig, agentName: e.target.value})} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Customer Support Agent"
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-700 block mb-2">Foundation Model</label>
              <div className="relative">
                <select 
                  value={agentConfig.foundationModel} 
                  onChange={e => setAgentConfig({...agentConfig, foundationModel: e.target.value})} 
                  className="w-full p-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                  ))}
                </select>
                <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-2">Description (Optional)</label>
              <input 
                type="text" 
                value={agentConfig.description} 
                onChange={e => setAgentConfig({...agentConfig, description: e.target.value})} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Brief description of your agent"
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-700 block mb-2">Instructions</label>
              <p className="text-sm text-gray-600 mb-3">Define your agent&apos;s behavior, capabilities, and constraints.</p>
              <textarea 
                value={agentConfig.instruction} 
                onChange={e => setAgentConfig({...agentConfig, instruction: e.target.value})} 
                rows={10} 
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm bg-gray-50/50"
                placeholder="You are a helpful AI assistant..."
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">AWS Bedrock Integration</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                This agent will be created in your AWS Bedrock environment. Ensure your AWS credentials are configured in Settings and you have the necessary IAM permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
