'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Message } from '@/types/ui';
import { Agent } from '@/types';
import { useAPI } from '@/hooks/useAPI';
import { PageWrapper } from '@/components/shared/PageWrapper';

interface ChatInterfaceProps {
  addNotification: (notification: any) => void;
}


export const ChatInterfacePage: React.FC<ChatInterfaceProps> = ({ addNotification }) => {
  const [messages, setMessages] = useState<Message[]>([{ text: "Hello! I'm your AWS Bedrock agent. How can I help you today?", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);
  
  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isTyping || !selectedAgent) return;
    const userInput = input;
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await api.invokeAgent(selectedAgent, userInput);
      setMessages(prev => [...prev, { text: response.output || response.response || "Response received", sender: 'bot' }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please check your AWS credentials.", sender: 'bot' }]);
      addNotification({
        type: 'error',
        title: 'Invocation Failed',
        message: error.message,
        time: 'Just now'
      });
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, selectedAgent, api, addNotification]);
  
  return (
    <PageWrapper pageKey="chat">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Chat Interface</h2>
      <p className="text-gray-600 text-lg mb-6">Real-time conversation with your agents</p>
      
      {agents.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl shadow-xl p-12 text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No Agents Available</h3>
          <p className="text-gray-600 mb-6">Create an agent first to start chatting</p>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg">
            Create Agent
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="font-bold text-gray-700 block mb-2">Select Agent</label>
            <select 
              value={selectedAgent || ''} 
              onChange={e => setSelectedAgent(e.target.value)}
              className="max-w-md p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.agentName}</option>
              ))}
            </select>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl shadow-xl flex flex-col" style={{height: 'calc(100vh - 320px)', minHeight: '400px'}}>
            <div className="p-4 border-b border-black/10 flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Bot className="w-8 h-8 text-emerald-600" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-emerald-500"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{agents.find(a => a.id === selectedAgent)?.agentName || 'Agent'}</h3>
                  <p className="text-sm text-emerald-600">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100/50 rounded-lg">
                <SlidersHorizontal size={20}/>
              </button>
            </div>
            
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              {messages.map((msg, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`flex gap-3 items-end ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Bot className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                  <div className={`max-w-md p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md' 
                      : 'bg-gray-100 border border-gray-200 text-black rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center self-end">
                    <Bot className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-100 border border-gray-200">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-black/10">
              <div className="relative">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="Type your message..." 
                  className="w-full pl-4 pr-14 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80"
                  disabled={!selectedAgent}
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }} 
                  onClick={handleSend} 
                  disabled={!selectedAgent}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  <ArrowRight size={20}/>
                </motion.button>
              </div>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
};
