'use client';

import { useState, useCallback } from 'react';
import { AgentConfig, Settings } from '@/types/ui';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Agent Management
    getAgents: () => request('/agents'),
    getAgent: (id: string) => request(`/agents/${id}`),
    createAgent: (data: AgentConfig) => request('/agents', { method: 'POST', body: JSON.stringify(data) }),
    updateAgent: (id: string, data: AgentConfig) => request(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAgent: (id: string) => request(`/agents/${id}`, { method: 'DELETE' }),
    
    // Execution
    invokeAgent: (agentId: string, input: string) => request('/agents/invoke', { 
      method: 'POST', 
      body: JSON.stringify({ agentId, input }) 
    }),
    
    // Analytics
    getDashboardStats: () => request('/analytics/dashboard'),
    getAgentMetrics: (agentId: string) => request(`/analytics/agents/${agentId}`),
    
    // Settings
    getSettings: () => request('/settings'),
    updateSettings: (data: Settings) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
    
    loading,
    error
  };
};
