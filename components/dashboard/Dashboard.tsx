'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Bot, MessageSquare, Zap, Clock, CheckCircle, 
  Play, Plus, RefreshCw, ArrowRight, Star
} from 'lucide-react';
import { DashboardStats } from '@/types/ui';
import { Agent } from '@/types';
import { useAPI } from '@/hooks/useAPI';
import { PageWrapper } from '@/components/shared/PageWrapper';

interface DashboardProps {
  setActivePage: (page: string) => void;
  addNotification: (notification: any) => void;
}


const getStatusDot = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'active': case 'ready': return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50';
    case 'error': case 'failed': return 'bg-red-500 shadow-lg shadow-red-500/50';
    case 'preparing': case 'pending': return 'bg-amber-500 animate-pulse';
    case 'idle': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage, addNotification }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const api = useAPI();

  const loadDashboardData = useCallback(async () => {
    try {
      const [dashboardData, agentsData] = await Promise.all([
        api.getDashboardStats(),
        api.getAgents()
      ]);
      setStats(dashboardData);
      setAgents(agentsData.agents || []);
    } catch (error) {
      // Use mock data when API fails
      const mockStats = {
        activeAgents: 12,
        totalExecutions: 1847,
        avgResponseTime: 1.2,
        successRate: 98.5,
        newAgents: 3,
        recentExecutions: 127,
        responseTimeDelta: '0.3',
        successRateDelta: 2.1
      };
      
      const mockAgents = [
        {
          id: 'agent-1',
          agentId: 'agent-1',
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/agent-1',
          agentName: 'Customer Support Bot',
          description: 'Handles customer inquiries and support tickets',
          instructions: 'You are a helpful customer support agent...',
          foundationModel: 'Claude 3.5 Sonnet',
          idleSessionTTL: 600,
          agentStatus: 'PREPARED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['support', 'customer-service'],
          isFavorite: false,
          executionCount: 0
        },
        {
          id: 'agent-2',
          agentId: 'agent-2',
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/agent-2',
          agentName: 'Content Generator',
          description: 'Generates high-quality content for various purposes',
          instructions: 'You are a creative content generator...',
          foundationModel: 'Claude 3 Opus',
          idleSessionTTL: 600,
          agentStatus: 'PREPARED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['content', 'writing'],
          isFavorite: false,
          executionCount: 0
        },
        {
          id: 'agent-3',
          agentId: 'agent-3',
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/agent-3',
          agentName: 'Data Analyst',
          description: 'Analyzes data and provides insights',
          instructions: 'You are a data analysis expert...',
          foundationModel: 'Titan Text Premier',
          idleSessionTTL: 600,
          agentStatus: 'PREPARING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['data', 'analysis'],
          isFavorite: false,
          executionCount: 0
        }
      ];
      
      setStats(mockStats);
      setAgents(mockAgents);
      
      addNotification({
        type: 'info',
        title: 'Using Demo Data',
        message: 'Connected to demo environment with sample agents',
        time: 'Just now'
      });
    }
  }, [api, addNotification]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    
    return [
      { label: 'Active Agents', value: stats.activeAgents?.toString() || '0', change: '+' + (stats.newAgents || 0), icon: Bot, trend: 'up' },
      { label: 'Total Executions', value: stats.totalExecutions?.toLocaleString() || '0', change: '+' + (stats.recentExecutions || 0), icon: Zap, trend: 'up' },
      { label: 'Avg Response Time', value: (stats.avgResponseTime || 0) + 's', change: '-' + (stats.responseTimeDelta || 0) + 's', icon: Clock, trend: 'down' },
      { label: 'Success Rate', value: (stats.successRate || 0) + '%', change: '+' + (stats.successRateDelta || 0) + '%', icon: CheckCircle, trend: 'up' }
    ];
  }, [stats]);

  return (
    <PageWrapper pageKey="dashboard">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Welcome back!</h2>
          <p className="text-muted-foreground text-lg">Your AI agents at a glance</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Chat')} className="flex-1 sm:flex-none px-6 py-3 bg-card border-2 border-border text-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all hover:bg-muted/50">
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Agent Builder')} className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
            <Plus className="w-5 h-5" />
            <span>New Agent</span>
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.length > 0 ? statCards.map((stat, index) => (
          <motion.div whileHover={{ y: -5, scale: 1.03 }} key={index} className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-6 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/20 shadow-sm">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${stat.trend === 'up' ? 'text-success bg-success/10 border border-success/20' : 'text-destructive bg-destructive/10 border border-destructive/20'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-semibold mb-2 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        )) : Array(4).fill(0).map((_, i) => <div key={i} className="bg-muted/50 rounded-2xl p-6 h-44 animate-pulse"></div>)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-xl">Active Agents</h3>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={loadDashboardData} className="text-sm text-muted-foreground hover:text-primary font-semibold flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {agents.length > 0 ? agents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="py-5 hover:bg-muted/50 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors cursor-pointer group flex items-center justify-between rounded-lg">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                      <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusDot(agent.agentStatus)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-lg truncate">{agent.agentName}</h4>
                      <Star className="w-4 h-4 text-warning fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium truncate">{agent.foundationModel}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActivePage('Execution Monitor')} className="ml-2 p-3 bg-card border border-border hover:bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all shrink-0 shadow-sm hover:shadow-md">
                  <Play className="w-5 h-5 text-primary" />
                </motion.button>
              </div>
            )) : (
              <div className="py-16 text-center text-muted-foreground">
                <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-10 h-10 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-2">No agents yet</h4>
                <p className="text-sm">Create your first agent to get started!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary via-primary/90 to-accent rounded-2xl p-8 text-primary-foreground border border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-2xl">Quick Start</h3>
          </div>
          <p className="text-primary-foreground/80 text-base mb-8 font-medium leading-relaxed">Create your first AWS Bedrock agent and start building intelligent applications</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Agent Builder')} className="w-full py-4 bg-primary-foreground text-primary font-bold rounded-xl flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-shadow">
            <Plus className="w-6 h-6" />
            <span>Create New Agent</span>
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
};
