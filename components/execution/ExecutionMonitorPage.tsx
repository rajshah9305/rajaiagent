'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, StopCircle, BrainCircuit, Target, Cpu, CheckCircle, Share2 } from 'lucide-react';
import { Task } from '@/types/ui';
import { Agent } from '@/types';
import { useAPI } from '@/hooks/useAPI';
import { PageWrapper } from '@/components/shared/PageWrapper';

interface ExecutionMonitorProps {
  addNotification: (notification: any) => void;
}


const TaskItem = ({ task }: { task: Task }) => {
  const getStatusIcon = (status: string) => {
    switch (status) { 
      case 'running': 
        return (
          <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <Play size={12} className="text-white"/>
          </div>
        ); 
      case 'success': 
        return (
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle size={12} className="text-white"/>
          </div>
        ); 
      default: 
        return <div className="w-5 h-5 bg-gray-300 rounded-full border-2 border-white"></div>; 
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="flex items-center space-x-4 py-3 relative"
    >
      <div className="absolute -left-2.5 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white">
        {getStatusIcon(task.status || '')}
      </div>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl border border-gray-200">
        <task.icon size={20} className="text-gray-600"/>
      </div>
      <p className="font-semibold flex-grow">{task.name}</p>
      <p className="text-sm font-bold capitalize text-gray-500">{task.status}</p>
    </motion.div>
  );
};

export const ExecutionMonitorPage: React.FC<ExecutionMonitorProps> = ({ addNotification }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState('Analyze the latest data trends...');
  const api = useAPI();
  
  const loadAgents = useCallback(async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents || []);
      if (data.agents?.length > 0) setSelectedAgent(data.agents[0].id);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  }, [api]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const runExecution = useCallback(async () => {
    if (isRunning || !selectedAgent) return;
    setIsRunning(true);
    
    const mockTasks = [
      { name: 'Initializing agent session', icon: BrainCircuit }, 
      { name: 'Processing user input', icon: BrainCircuit }, 
      { name: 'Analyzing intent and context', icon: Target }, 
      { name: 'Generating response', icon: Cpu }, 
      { name: 'Validating output', icon: CheckCircle }, 
      { name: 'Streaming response', icon: Share2 }
    ];
    
    setTasks(mockTasks.map(t => ({...t, status: 'pending'})));
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockTasks.length) {
        setTasks(prev => prev.map((task, index) => 
          index < i ? { ...task, status: 'success' } : 
          index === i ? { ...task, status: 'running' } : task
        ));
        i++;
      } else {
        setTasks(prev => prev.map(task => ({ ...task, status: 'success' })));
        setIsRunning(false);
        clearInterval(interval);
        addNotification({
          type: 'success',
          title: 'Execution Complete',
          message: 'Agent executed successfully',
          time: 'Just now'
        });
      }
    }, 1000);
  }, [isRunning, selectedAgent, addNotification]);
  
  return (
    <PageWrapper pageKey="execution-monitor">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Execution Monitor</h2>
      <p className="text-gray-600 text-lg mb-8">Real-time execution monitoring and analytics</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2 lg:sticky top-28 bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-4">Execution Control</h3>
          
          <div className="mb-4">
            <label className="font-bold text-gray-700 block mb-2">Select Agent</label>
            <select 
              value={selectedAgent || ''} 
              onChange={e => setSelectedAgent(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              disabled={isRunning}
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.agentName}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-bold text-gray-700 block mb-2">Input Query</label>
            <textarea 
              rows={4} 
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              disabled={isRunning}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={runExecution} 
              disabled={isRunning || !selectedAgent} 
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Play size={18}/>
              <span>{isRunning ? 'Executing...' : 'Start Execution'}</span>
            </motion.button>
            {isRunning && (
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="px-4 py-3 bg-red-600 text-white font-semibold rounded-lg"
              >
                <StopCircle size={18}/>
              </motion.button>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl shadow-xl p-6 min-h-[500px]">
          <h3 className="text-xl font-bold mb-6">Execution Timeline</h3>
          {tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Cpu size={40} className="mx-auto mb-4"/>
              <p>Start an execution to monitor the timeline</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-1">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200"></div>
              {tasks.map((task, index) => <TaskItem key={index} task={task} />)}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
