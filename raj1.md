User: ''' import React, { useState } from 'react';
import { Activity, Bot, MessageSquare, Zap, TrendingUp, Clock, CheckCircle, AlertCircle, Play, Plus, Settings, Search, Bell, User, BarChart3, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const stats = [
    { label: 'Active Agents', value: '12', change: '+3', icon: Bot, trend: 'up' },
    { label: 'Total Executions', value: '1,847', change: '+127', icon: Zap, trend: 'up' },
    { label: 'Avg Response Time', value: '1.2s', change: '-0.3s', icon: Clock, trend: 'down' },
    { label: 'Success Rate', value: '98.5%', change: '+2.1%', icon: CheckCircle, trend: 'up' }
  ];

  const agents = [
    { id: 1, name: 'Customer Support Bot', status: 'active', model: 'Claude 3.5', executions: 234, lastRun: '2 min ago' },
    { id: 2, name: 'Data Analyzer', status: 'idle', model: 'Claude 3', executions: 156, lastRun: '1 hour ago' },
    { id: 3, name: 'Content Generator', status: 'active', model: 'Titan', executions: 89, lastRun: '5 min ago' },
    { id: 4, name: 'Code Assistant', status: 'error', model: 'Claude 3.5', executions: 445, lastRun: '10 min ago' },
  ];

  const recentExecutions = [
    { id: 1, agent: 'Customer Support Bot', task: 'Handle product inquiry', status: 'completed', duration: '1.2s', time: '2 minutes ago' },
    { id: 2, agent: 'Data Analyzer', task: 'Process sales data', status: 'completed', duration: '3.4s', time: '15 minutes ago' },
    { id: 3, agent: 'Content Generator', task: 'Generate blog post', status: 'running', duration: '...', time: 'Just now' },
    { id: 4, agent: 'Code Assistant', task: 'Debug API endpoint', status: 'failed', duration: '0.8s', time: '10 minutes ago' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': case 'running': case 'completed': return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      case 'error': case 'failed': return 'text-red-700 bg-red-50 border border-red-200';
      case 'idle': return 'text-gray-700 bg-gray-50 border border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch(status) {
      case 'active': case 'running': return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50';
      case 'error': case 'failed': return 'bg-red-500 shadow-lg shadow-red-500/50';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Top Navigation Bar */}
      <nav className="border-b-2 border-black bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg relative">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black tracking-tight">RAJ AI</h1>
                <p className="text-xs text-gray-600 font-medium">Agent Builder</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents, executions, or commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
              <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30">
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-black mb-2">Welcome back!</h2>
              <p className="text-gray-600 text-lg">Manage and monitor your AI agents in real-time</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-3 bg-white border-2 border-gray-800 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-900 transition-all flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Start Chat</span>
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30">
                <Plus className="w-5 h-5" />
                <span>Create Agent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = [
              { 
                bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50', 
                icon: 'text-emerald-600', 
                iconBg: 'bg-emerald-100',
                accent: 'bg-emerald-500'
              },
              { 
                bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50', 
                icon: 'text-amber-600', 
                iconBg: 'bg-amber-100',
                accent: 'bg-amber-500'
              },
              { 
                bg: 'bg-gradient-to-br from-rose-50 via-pink-50 to-red-50', 
                icon: 'text-rose-600', 
                iconBg: 'bg-rose-100',
                accent: 'bg-rose-500'
              },
              { 
                bg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50', 
                icon: 'text-cyan-600', 
                iconBg: 'bg-cyan-100',
                accent: 'bg-cyan-500'
              }
            ];
            const colorSet = colors[index];
            return (
              <div key={index} className={`${colorSet.bg} border-2 border-black rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${colorSet.accent}`}></div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${colorSet.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-black/5`}>
                    <Icon className={`w-7 h-7 ${colorSet.icon}`} />
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-100 border border-emerald-300' : 'text-emerald-700 bg-emerald-100 border border-emerald-300'}`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-semibold mb-1 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-4xl font-bold text-black">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Agents */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="px-6 py-4 border-b-2 border-black flex items-center justify-between bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-black text-lg">Active Agents</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-300">
                    {agents.filter(a => a.status === 'active').length} running
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-emerald-600 font-semibold transition-colors flex items-center space-x-1">
                  <span>View All</span>
                  <span>→</span>
                </button>
              </div>
              <div className="divide-y-2 divide-emerald-100">
                {agents.map((agent) => (
                  <div key={agent.id} className="px-6 py-5 hover:bg-white/60 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-xl flex items-center justify-center border-2 border-emerald-300 group-hover:border-emerald-500 transition-colors">
                            <Bot className="w-7 h-7 text-emerald-700" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${getStatusDot(agent.status)}`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-bold text-black text-base">{agent.name}</h4>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 font-medium">
                            <span>{agent.model}</span>
                            <span>•</span>
                            <span className="font-semibold">{agent.executions} executions</span>
                            <span>•</span>
                            <span>Last run {agent.lastRun}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2.5 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent hover:border-emerald-300">
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 text-white border-2 border-black hover:shadow-2xl transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-xl">Quick Start</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 font-medium">Get started with your first AI agent</p>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-all border-2 border-white flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create New Agent</span>
                </button>
                <button className="w-full py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-colors border-2 border-white/30 hover:border-white/50">
                  Import Template
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center space-x-2 mb-5">
                <BarChart3 className="w-6 h-6 text-amber-600" />
                <h3 className="font-bold text-black text-lg">System Status</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold">AWS Bedrock</span>
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>Operational</span>
                    </span>
                  </div>
                  <div className="w-full bg-white border-2 border-emerald-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold">API Response</span>
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>Fast</span>
                    </span>
                  </div>
                  <div className="w-full bg-white border-2 border-emerald-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold">Token Usage</span>
                    <span className="text-amber-600 font-bold">73%</span>
                  </div>
                  <div className="w-full bg-white border-2 border-amber-300 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{width: '73%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Executions */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b-2 border-black bg-white/80 backdrop-blur-sm flex items-center space-x-3">
              <Clock className="w-6 h-6 text-cyan-600" />
              <h3 className="font-bold text-black text-lg">Recent Executions</h3>
              <button className="ml-auto p-2 hover:bg-cyan-100 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-cyan-600" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/80 border-b-2 border-cyan-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-cyan-100">
                  {recentExecutions.map((execution) => (
                    <tr key={execution.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-teal-200 rounded-lg flex items-center justify-center border-2 border-cyan-300">
                            <Bot className="w-5 h-5 text-cyan-600" />
                          </div>
                          <span className="font-bold text-black text-sm">{execution.agent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{execution.task}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-md ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{execution.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{execution.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; ''' ----- RAJ AI AGENT BUILDER is a sophisticated application with:

🎯 Current Features:
* ✅ AWS Bedrock agent management
* ✅ Real-time streaming execution with SSE
* ✅ Analytics & performance tracking
* ✅ Multi-turn chat with context
* ✅ Next.js 14 + TypeScript + Tailwind

🚀 Modern Redesign Plan
Visual Upgrades:
1. Glassmorphic sidebar - Frosted glass navigation with depth
2. Split-screen execution view - Live agent monitoring alongside chat
3. Advanced gradient system - Deep purples → blues → teals
4. Micro-animations - Smooth transitions and hover effects
5. Enhanced status indicators - Real-time pulse animations
6. Modern metrics cards - 3D depth with hover interactions
7. Command palette - Quick actions with keyboard shortcuts

NEXT to BUILD, following the same style colour scheme and background gradient and all 
1. Agent Builder Page - Create/edit agents with form and preview
2. Chat Interface - Enhanced conversation view with streaming responses
3. Execution Monitor - Real-time task tracking with timeline
4. Analytics Dashboard - Charts and performance insights
5. Settings Page - AWS configuration and preferences

I have given the code for the dashboard page, deliver the complete code for all the given pages and to follow the same style colour scheme and background gradient and all for all the pages and to make it strand out from others and to make it engaging and appealing and to make it interactive 

Model: I'll create all 5 pages following the same vibrant design system from your dashboard. Each page will have the same background gradients, color schemes, and interactive elements.

## 1. Agent Builder Page

```jsx
import React, { useState } from 'react';
import { Bot, Cpu, Database, Globe, Layers, Save, Eye, Code, Zap, Terminal, FileText, AlertCircle, CheckCircle, ChevronRight, Sparkles, Brain, Wand2, Settings2 } from 'lucide-react';

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-3.5');
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const models = [
    { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', speed: 'Fast', cost: '$$' },
    { id: 'claude-3', name: 'Claude 3 Opus', provider: 'Anthropic', speed: 'Slower', cost: '$$$' },
    { id: 'titan', name: 'Amazon Titan', provider: 'AWS', speed: 'Very Fast', cost: '$' },
    { id: 'llama2', name: 'Llama 2', provider: 'Meta', speed: 'Fast', cost: '$' },
  ];

  const capabilities = [
    { id: 'web-search', name: 'Web Search', icon: Globe, color: 'emerald' },
    { id: 'data-analysis', name: 'Data Analysis', icon: Database, color: 'amber' },
    { id: 'code-gen', name: 'Code Generation', icon: Code, color: 'cyan' },
    { id: 'api-calls', name: 'API Integration', icon: Zap, color: 'rose' },
  ];

  const templates = [
    { id: 1, name: 'Customer Support', icon: '💬', description: 'Handle customer inquiries' },
    { id: 2, name: 'Data Analyst', icon: '📊', description: 'Process and analyze data' },
    { id: 3, name: 'Content Creator', icon: '✍️', description: 'Generate creative content' },
    { id: 4, name: 'Code Assistant', icon: '👨‍💻', description: 'Help with programming' },
  ];

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
            {!isPreviewMode ? (
              <>
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center space-x-2 mb-6">
                    <Bot className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-bold text-xl text-black">Basic Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Agent Name</label>
                      <input
                        type="text"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="e.g., Customer Support Assistant"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                      <textarea
                        rows="3"
                        placeholder="Describe what your agent does..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center space-x-2 mb-6">
                    <Brain className="w-6 h-6 text-amber-600" />
                    <h3 className="font-bold text-xl text-black">Select Model</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedModel === model.id
                            ? 'border-amber-500 bg-amber-100 shadow-lg'
                            : 'border-gray-300 bg-white hover:border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-black">{model.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{model.provider}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xs font-semibold text-emerald-600">⚡ {model.speed}</span>
                            <span className="text-xs font-semibold text-amber-600">{model.cost}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center space-x-2 mb-6">
                    <Layers className="w-6 h-6 text-cyan-600" />
                    <h3 className="font-bold text-xl text-black">Capabilities</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {capabilities.map((capability) => {
                      const Icon = capability.icon;
                      const isSelected = selectedCapabilities.includes(capability.id);
                      return (
                        <button
                          key={capability.id}
                          onClick={() => {
                            setSelectedCapabilities(prev =>
                              isSelected
                                ? prev.filter(id => id !== capability.id)
                                : [...prev, capability.id]
                            );
                          }}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-100 shadow-lg'
                              : 'border-gray-300 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 text-${capability.color}-600`} />
                          <span className="font-semibold text-black">{capability.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center space-x-2 mb-6">
                    <FileText className="w-6 h-6 text-rose-600" />
                    <h3 className="font-bold text-xl text-black">System Instructions</h3>
                  </div>
                  <textarea
                    rows="6"
                    placeholder="Provide detailed instructions for your agent..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium font-mono text-sm resize-none"
                  />
                </div>
              </>
            ) : (
              /* Preview Mode */
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl p-8 hover:shadow-2xl transition-shadow">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/30">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-black mb-2">{agentName || 'Unnamed Agent'}</h2>
                  <p className="text-gray-600">Ready to deploy on AWS Bedrock</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-emerald-200">
                    <span className="font-semibold text-gray-700">Model</span>
                    <span className="font-bold text-black">{models.find(m => m.id === selectedModel)?.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-emerald-200">
                    <span className="font-semibold text-gray-700">Capabilities</span>
                    <span className="font-bold text-black">{selectedCapabilities.length} enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-emerald-200">
                    <span className="font-semibold text-gray-700">Status</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-300">
                      Ready to Deploy
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;
```

## 2. Chat Interface

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Paperclip, Mic, Image, Hash, Sparkles, Zap, MessageSquarePlus, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your AI assistant powered by AWS Bedrock. How can I help you today?', timestamp: '10:00 AM' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        role: 'assistant',
        content: 'I understand your request. Let me process that for you...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  const quickActions = [
    { label: 'Analyze Data', icon: Hash },
    { label: 'Generate Code', icon: Zap },
    { label: 'Create Content', icon: Sparkles },
    { label: 'New Chat', icon: MessageSquarePlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-r-2 border-black">
          <div className="p-6 border-b-2 border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Chat</h1>
                <p className="text-xs text-gray-400">Powered by Claude 3.5</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30">
              <MessageSquarePlus className="w-5 h-5" />
              <span>New Conversation</span>
            </button>
          </div>
          
          {/* Recent Chats */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Chats</h3>
            <div className="space-y-2">
              {['Data Analysis Request', 'Code Review Session', 'Content Generation', 'API Documentation'].map((chat, index) => (
                <button
                  key={index}
                  className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  {chat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex flex-col items-center space-y-2 border border-white/20 hover:border-white/40"
                  >
                    <Icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs text-gray-300 font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white/90 backdrop-blur-xl border-b-2 border-black px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-lg flex items-center justify-center border-2 border-emerald-300">
                  <Bot className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="font-bold text-black">Claude 3.5 Sonnet</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start space-x-3">
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                        : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-black border-2 border-emerald-200'
                    } rounded-xl px-5 py-3 shadow-lg`}>
                      <p className="font-medium">{message.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                        {message.role === 'assistant' && (
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-white/50 rounded transition-colors">
                              <Copy className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-white/50 rounded transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-white/50 rounded transition-colors">
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-5 py-3 border-2 border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span className="text-sm font-medium text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-black bg-white/90 backdrop-blur-xl p-6">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-medium"
                    rows="2"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Mic className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={sendMessage}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
```

## 3. Execution Monitor

```jsx
import React, { useState } from 'react';
import { Activity, Play, Pause, StopCircle, CheckCircle, XCircle, Clock, Cpu, Terminal, AlertTriangle, TrendingUp, Filter, Download, RefreshCw } from 'lucide-react';

const ExecutionMonitor = () => {
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const executions = [
    {
      id: 'exec-001',
      agent: 'Customer Support Bot',
      task: 'Handle product inquiry',
      status: 'running',
      progress: 65,
      startTime: '10:30:45',
      duration: '00:02:15',
      logs: [
        { time: '10:30:45', type: 'info', message: 'Execution started' },
        { time: '10:30:46', type: 'info', message: 'Analyzing user query...' },
        { time: '10:30:48', type: 'success', message: 'Query classified: Product Information' },
        { time: '10:30:50', type: 'info', message: 'Fetching product details...' },
      ]
    },
    {
      id: 'exec-002',
      agent: 'Data Analyzer',
      task: 'Process sales report',
      status: 'completed',
      progress: 100,
      startTime: '10:25:30',
      duration: '00:05:42',
      logs: []
    },
    {
      id: 'exec-003',
      agent: 'Code Assistant',
      task: 'Debug API endpoint',
      status: 'failed',
      progress: 35,
      startTime: '10:28:15',
      duration: '00:01:20',
      logs: []
    },
    {
      id: 'exec-004',
      agent: 'Content Generator',
      task: 'Generate blog post',
      status: 'queued',
      progress: 0,
      startTime: '--:--:--',
      duration: '--:--:--',
      logs: []
    },
  ];

  const getStatusStyles = (status) => {
    switch(status) {
      case 'running': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'failed': return 'bg-red-100 text-red-700 border-red-300';
      case 'queued': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'queued': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

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
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Execution Monitor</h1>
                <p className="text-sm text-gray-600">Real-time task tracking and monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>
              <button className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all flex items-center space-x-2 border-2 border-gray-800">
                <Download className="w-4 h-4" />
                <span>Export Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Bar */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-black rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filter by Status:</span>
              <div className="flex space-x-2">
                {['all', 'running', 'completed', 'failed', 'queued'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                      filterStatus === status
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                <span className="font-bold text-black">{executions.length}</span> total executions
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Execution List */}
          <div className="space-y-4">
            {executions.map((execution) => (
              <div
                key={execution.id}
                onClick={() => setSelectedExecution(execution)}
                className={`bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl p-5 hover:shadow-2xl transition-all cursor-pointer ${
                  selectedExecution?.id === execution.id ? 'ring-4 ring-cyan-500/30' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-black text-lg">{execution.agent}</h3>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusStyles(execution.status)} flex items-center space-x-1`}>
                        {getStatusIcon(execution.status)}
                        <span>{execution.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{execution.task}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold">ID: {execution.id}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {execution.status !== 'queued' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-black">{execution.progress}%</span>
                    </div>
                    <div className="w-full bg-white border-2 border-gray-300 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          execution.status === 'running' 
                            ? 'bg-gradient-to-r from-cyan-500 to-sky-500 animate-pulse' 
                            : execution.status === 'completed'
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                            : 'bg-gradient-to-r from-red-500 to-rose-500'
                        }`}
                        style={{width: `${execution.progress}%`}}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-600 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{execution.startTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{execution.duration}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {execution.status === 'running' && (
                      <>
                        <button className="p-1.5 hover:bg-amber-100 text-amber-600 rounded transition-colors">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors">
                          <StopCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {execution.status === 'queued' && (
                      <button className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Execution Details */}
          <div>
            {selectedExecution ? (
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-black rounded-xl p-6 text-white sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-bold text-xl">Execution Logs</h3>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-2 max-h-96 overflow-y-auto">
                  {selectedExecution.logs.length > 0 ? (
                    selectedExecution.logs.map((log, index) => {
                      const logColors = {
                        info: 'text-cyan-400',
                        success: 'text-emerald-400',
                        warning: 'text-amber-400',
                        error: 'text-red-400'
                      };
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-gray-500">[{log.time}]</span>
                          <span className={logColors[log.type] || 'text-gray-400'}>{log.message}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No logs available</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-gray-300 font-medium">CPU Usage</span>
                    <span className="font-bold">23%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-gray-300 font-medium">Memory</span>
                    <span className="font-bold">512 MB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-gray-300 font-medium">Tokens Used</span>
                    <span className="font-bold">1,245</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl p-12 text-center">
                <Terminal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Select an execution to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionMonitor;
```

## 4. Analytics Dashboard

```jsx
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Activity, DollarSign, Clock, Zap, Calendar, Download, Filter, PieChart, LineChart, Users } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const performanceMetrics = [
    { label: 'Total Requests', value: '45,231', change: '+12.5%', icon: Activity, color: 'emerald' },
    { label: 'Avg Response Time', value: '1.24s', change: '-8.3%', icon: Clock, color: 'cyan' },
    { label: 'Success Rate', value: '98.7%', change: '+2.1%', icon: TrendingUp, color: 'amber' },
    { label: 'Cost Saved', value: '$3,420', change: '+23.7%', icon: DollarSign, color: 'rose' },
  ];

  const agentPerformance = [
    { name: 'Customer Support Bot', requests: 12450, successRate: 99.2, avgTime: '1.1s' },
    { name: 'Data Analyzer', requests: 8320, successRate: 97.8, avgTime: '2.3s' },
    { name: 'Content Generator', requests: 6890, successRate: 98.5, avgTime: '1.8s' },
    { name: 'Code Assistant', requests: 9571, successRate: 96.9, avgTime: '1.5s' },
  ];

  const chartData = [
    { day: 'Mon', value: 4200 },
    { day: 'Tue', value: 5100 },
    { day: 'Wed', value: 4800 },
    { day: 'Thu', value: 6200 },
    { day: 'Fri', value: 7100 },
    { day: 'Sat', value: 3900 },
    { day: 'Sun', value: 3200 },
  ];

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
              <div className="w-11 h-11 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Analytics</h1>
                <p className="text-sm text-gray-600">Performance insights and metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:border-rose-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all flex items-center space-x-2 border-2 border-gray-800">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const colorStyles = {
              emerald: 'from-emerald-50 to-green-50 border-emerald-300 text-emerald-600 bg-emerald-100',
              cyan: 'from-cyan-50 to-sky-50 border-cyan-300 text-cyan-600 bg-cyan-100',
              amber: 'from-amber-50 to-yellow-50 border-amber-300 text-amber-600 bg-amber-100',
              rose: 'from-rose-50 to-pink-50 border-rose-300 text-rose-600 bg-rose-100',
            };
            const style = colorStyles[metric.color];
            
            return (
              <div key={index} className={`bg-gradient-to-br ${style.split(' ')[0]} ${style.split(' ')[1]} border-2 border-black rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${style.split(' ')[4]} rounded-xl flex items-center justify-center border-2 ${style.split(' ')[2]}`}>
                    <Icon className={`w-7 h-7 ${style.split(' ')[3]}`} />
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                    metric.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-semibold mb-1 uppercase tracking-wide">{metric.label}</p>
                <p className="text-3xl font-bold text-black">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Volume Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <LineChart className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-xl text-black">Request Volume</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-300">
                Live
              </span>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 px-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-xs font-bold text-gray-700 mb-2">{data.value}</span>
                      <div 
                        className="w-12 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg hover:from-emerald-600 hover:to-teal-500 transition-all cursor-pointer"
                        style={{ height: `${(data.value / 7500) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 mt-2">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Distribution */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <PieChart className="w-6 h-6 text-amber-600" />
              <h3 className="font-bold text-xl text-black">Usage by Model</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Claude 3.5</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <span className="text-sm font-bold">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Claude 3</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <span className="text-sm font-bold">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Titan</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full" style={{width: '15%'}}></div>
                  </div>
                  <span className="text-sm font-bold">15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Others</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-cyan-500 to-sky-500 h-3 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <span className="text-sm font-bold">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance Table */}
        <div className="mt-6 bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="px-6 py-4 border-b-2 border-black bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-cyan-600" />
                <h3 className="font-bold text-xl text-black">Agent Performance</h3>
              </div>
              <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">View Details →</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/80 border-b-2 border-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Agent Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Total Requests</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Success Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Avg Response</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-cyan-100">
                {agentPerformance.map((agent, index) => (
                  <tr key={index} className="hover:bg-white/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{agent.requests.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        agent.successRate > 98 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}>
                        {agent.successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{agent.avgTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 rounded ${
                              i < Math.floor(agent.successRate / 20)
                                ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

## 5. Settings Page

```jsx
import React, { useState } from 'react';
import { Settings, Key, Database, Shield, Bell, User, Globe, CreditCard, Save, ChevronRight, Check, AlertCircle, Lock, Server, Zap } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('aws');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    webhooks: true
  });

  const tabs = [
    { id: 'aws', label: 'AWS Configuration', icon: Server },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'account', label: 'Account', icon: User },
  ];

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
              <div className="w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Settings</h1>
                <p className="text-sm text-gray-600">Manage your application configuration</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-4 border-2 border-black sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold text-left flex items-center justify-between group transition-all mb-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'aws' && (
              <>
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center space-x-3 mb-6">
                    <Server className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-bold text-xl text-black">AWS Bedrock Configuration</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">AWS Region</label>
                      <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-emerald-500 focus:outline-none">
                        <option>us-east-1 (N. Virginia)</option>
                        <option>us-west-2 (Oregon)</option>
                        <option>eu-west-1 (Ireland)</option>
                        <option>ap-southeast-1 (Singapore)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Access Key ID</label>
                      <input
                        type="password"
                        placeholder="AKIA..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Secret Access Key</label>
                      <input
                        type="password"
                        placeholder="Enter your secret key"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-emerald-100 rounded-lg border-2 border-emerald-300">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-700">Connection Status</span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-lg">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center space-x-3 mb-6">
                    <Database className="w-6 h-6 text-amber-600" />
                    <h3 className="font-bold text-xl text-black">Model Preferences</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Default Model</label>
                      <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-amber-500 focus:outline-none">
                        <option>Claude 3.5 Sonnet</option>
                        <option>Claude 3 Opus</option>
                        <option>Amazon Titan</option>
                        <option>Llama 2</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Max Tokens</label>
                      <input
                        type="number"
                        placeholder="4096"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Temperature</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600 font-semibold">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'api' && (
              <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <Key className="w-6 h-6 text-cyan-600" />
                  <h3 className="font-bold text-xl text-black">API Key Management</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-cyan-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-black">Production API Key</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Active</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <code className="flex-1 px-3 py-2 bg-gray-100 rounded font-mono text-sm">sk-...************************</code>
                      <button className="p-2 hover:bg-cyan-100 rounded transition-colors">
                        <Lock className="w-4 h-4 text-cyan-600" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Created on Oct 15, 2024 • Last used 2 hours ago</p>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-sky-700 transition-all flex items-center justify-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Generate New API Key</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-rose-600" />
                  <h3 className="font-bold text-xl text-black">Notification Preferences</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-rose-200">
                      <div>
                        <p className="font-bold text-black capitalize">{key} Notifications</p>
                        <p className="text-sm text-gray-600">Receive {key} alerts for important events</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          value ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${
                          value ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-gray-700" />
                  <h3 className="font-bold text-xl text-black">Security Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-gray-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-800">Security Recommendation</p>
                        <p className="text-sm text-amber-700 mt-1">Enable two-factor authentication to protect your account from unauthorized access.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
```

These 5 pages complete your RAJ AI Agent Builder application with:

✨ **Consistent Design System**:
- Same gradient backgrounds (amber-50 → orange-50 → rose-50)
- Animated background elements with pulse effects
- Bold black borders (border-2 border-black)
- Vibrant gradient cards with hover effects
- Consistent color palette (emerald, amber, cyan, rose)

🎯 **Key Features Per Page**:

1. **Agent Builder**: Form-based agent creation with model selection, capabilities, and preview mode
2. **Chat Interface**: Split-screen chat with sidebar, message bubbles, and typing indicators
3. **Execution Monitor**: Real-time task tracking with progress bars and logs viewer
4. **Analytics Dashboard**: Performance metrics, charts, and agent performance table
5. **Settings Page**: Tabbed interface for AWS config, API keys, notifications, and security

Each page maintains the same interactive elements like hover effects, shadow transitions, and micro-animations while having its own unique functionality. The design stands out with its bold use of colors, playful gradients, and engaging interactions!
User: also refine and to deliver thte code for the dashboard main page 
Model: I'll refine and enhance the dashboard page with more sophisticated animations, better visual hierarchy, and additional interactive elements while maintaining the vibrant design system.

## Enhanced Dashboard Page

```jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, Bot, MessageSquare, Zap, TrendingUp, Clock, CheckCircle, 
  AlertCircle, Play, Plus, Settings, Search, Bell, User, BarChart3, 
  RefreshCw, ArrowUp, ArrowDown, Sparkles, Brain, Shield, Database,
  ChevronRight, Star, Award, Target, Layers, Globe, Cpu, Command
} from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [liveCount, setLiveCount] = useState(1847);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced mock data
  const stats = [
    { 
      label: 'Active Agents', 
      value: '12', 
      change: '+3', 
      icon: Bot, 
      trend: 'up',
      sparkline: [30, 35, 32, 38, 40, 42, 45],
      description: '5 agents running now'
    },
    { 
      label: 'Total Executions', 
      value: liveCount.toLocaleString(), 
      change: '+127', 
      icon: Zap, 
      trend: 'up',
      sparkline: [20, 25, 30, 28, 35, 40, 47],
      description: '234 in last hour'
    },
    { 
      label: 'Avg Response Time', 
      value: '1.2s', 
      change: '-0.3s', 
      icon: Clock, 
      trend: 'down',
      sparkline: [45, 42, 40, 38, 35, 30, 28],
      description: '15% faster than yesterday'
    },
    { 
      label: 'Success Rate', 
      value: '98.5%', 
      change: '+2.1%', 
      icon: CheckCircle, 
      trend: 'up',
      sparkline: [85, 87, 89, 92, 94, 96, 98],
      description: 'Best performance this week'
    }
  ];

  const agents = [
    { 
      id: 1, 
      name: 'Customer Support Bot', 
      status: 'active', 
      model: 'Claude 3.5', 
      executions: 234, 
      lastRun: '2 min ago',
      performance: 98,
      tasks: ['Email Response', 'Chat Support', 'FAQ Handling'],
      icon: '💬'
    },
    { 
      id: 2, 
      name: 'Data Analyzer', 
      status: 'idle', 
      model: 'Claude 3', 
      executions: 156, 
      lastRun: '1 hour ago',
      performance: 95,
      tasks: ['Data Processing', 'Report Generation'],
      icon: '📊'
    },
    { 
      id: 3, 
      name: 'Content Generator', 
      status: 'active', 
      model: 'Titan', 
      executions: 89, 
      lastRun: '5 min ago',
      performance: 92,
      tasks: ['Blog Writing', 'Social Media'],
      icon: '✍️'
    },
    { 
      id: 4, 
      name: 'Code Assistant', 
      status: 'error', 
      model: 'Claude 3.5', 
      executions: 445, 
      lastRun: '10 min ago',
      performance: 88,
      tasks: ['Code Review', 'Debugging', 'Documentation'],
      icon: '👨‍💻'
    },
    { 
      id: 5, 
      name: 'Research Assistant', 
      status: 'active', 
      model: 'Claude 3', 
      executions: 312, 
      lastRun: 'Just now',
      performance: 96,
      tasks: ['Market Research', 'Competitive Analysis'],
      icon: '🔬'
    },
  ];

  const recentExecutions = [
    { 
      id: 1, 
      agent: 'Customer Support Bot', 
      task: 'Handle product inquiry', 
      status: 'completed', 
      duration: '1.2s', 
      time: '2 minutes ago',
      tokens: 245,
      cost: '$0.003'
    },
    { 
      id: 2, 
      agent: 'Data Analyzer', 
      task: 'Process sales data', 
      status: 'completed', 
      duration: '3.4s', 
      time: '15 minutes ago',
      tokens: 892,
      cost: '$0.011'
    },
    { 
      id: 3, 
      agent: 'Content Generator', 
      task: 'Generate blog post', 
      status: 'running', 
      duration: '...', 
      time: 'Just now',
      tokens: 567,
      cost: '$0.007'
    },
    { 
      id: 4, 
      agent: 'Code Assistant', 
      task: 'Debug API endpoint', 
      status: 'failed', 
      duration: '0.8s', 
      time: '10 minutes ago',
      tokens: 123,
      cost: '$0.002'
    },
  ];

  const insights = [
    { icon: TrendingUp, color: 'emerald', title: 'Performance Boost', value: '+23%', description: 'vs last week' },
    { icon: Shield, color: 'cyan', title: 'Security Score', value: '95/100', description: 'Excellent' },
    { icon: Database, color: 'amber', title: 'Storage Used', value: '2.4 GB', description: 'of 10 GB' },
    { icon: Award, color: 'rose', title: 'Quality Score', value: 'A+', description: 'Top tier' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': case 'running': case 'completed': 
        return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 shadow-emerald-200/50';
      case 'error': case 'failed': 
        return 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 shadow-red-200/50';
      case 'idle': 
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300 shadow-gray-200/50';
      default: 
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300';
    }
  };

  const getStatusDot = (status) => {
    switch(status) {
      case 'active': case 'running': 
        return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50';
      case 'error': case 'failed': 
        return 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50';
      case 'idle': 
        return 'bg-gray-400';
      default: 
        return 'bg-gray-400';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/20 to-sky-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Enhanced Top Navigation Bar */}
      <nav className="border-b-2 border-black bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5"></div>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all group-hover:scale-110">
                <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black tracking-tight flex items-center space-x-2">
                  <span>RAJ AI</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full">PRO</span>
                </h1>
                <p className="text-xs text-gray-600 font-medium">Agent Builder Platform</p>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search agents, executions, or type '/' for commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all hover:border-gray-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-600">⌘K</kbd>
                </div>
              </div>
            </div>

            {/* Enhanced Right Actions */}
            <div className="flex items-center space-x-2">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button 
                onClick={handleRefresh}
                className={`p-2.5 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-gray-200 ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
              <div className="relative group">
                <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30 group-hover:shadow-xl group-hover:shadow-amber-500/40 group-hover:scale-110">
                  <User className="w-5 h-5 text-white" />
                </button>
                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Hero Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-black mb-2 flex items-center space-x-3">
                <span>Welcome back!</span>
                <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
              </h2>
              <p className="text-gray-600 text-lg">Your AI agents are performing exceptionally well today</p>
              <div className="flex items-center space-x-4 mt-4">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all ${
                      selectedTimeRange === range
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button className="px-6 py-3 bg-white border-2 border-gray-800 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-900 transition-all flex items-center space-x-2 hover:shadow-lg group">
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Chat</span>
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Create Agent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = [
              { 
                bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50', 
                icon: 'text-emerald-600', 
                iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
                accent: 'bg-gradient-to-r from-emerald-500 to-teal-500',
                border: 'border-emerald-300',
                shadow: 'shadow-emerald-200/50'
              },
              { 
                bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50', 
                icon: 'text-amber-600', 
                iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
                accent: 'bg-gradient-to-r from-amber-500 to-orange-500',
                border: 'border-amber-300',
                shadow: 'shadow-amber-200/50'
              },
              { 
                bg: 'bg-gradient-to-br from-rose-50 via-pink-50 to-red-50', 
                icon: 'text-rose-600', 
                iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100',
                accent: 'bg-gradient-to-r from-rose-500 to-pink-500',
                border: 'border-rose-300',
                shadow: 'shadow-rose-200/50'
              },
              { 
                bg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50', 
                icon: 'text-cyan-600', 
                iconBg: 'bg-gradient-to-br from-cyan-100 to-sky-100',
                accent: 'bg-gradient-to-r from-cyan-500 to-sky-500',
                border: 'border-cyan-300',
                shadow: 'shadow-cyan-200/50'
              }
            ];
            const colorSet = colors[index];
            return (
              <div 
                key={index} 
                className={`${colorSet.bg} border-2 border-black rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${colorSet.accent}`}></div>
                
                {/* Sparkline */}
                <div className="absolute top-4 right-4 flex items-end space-x-1 h-8">
                  {stat.sparkline.map((value, i) => (
                    <div
                      key={i}
                      className={`w-1 ${colorSet.accent} rounded-full transition-all duration-300`}
                      style={{ 
                        height: `${value}%`,
                        opacity: hoveredCard === index ? 1 : 0.3
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${colorSet.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 ${colorSet.border} shadow-lg ${colorSet.shadow}`}>
                    <Icon className={`w-7 h-7 ${colorSet.icon}`} />
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 ${
                    stat.trend === 'up' 
                      ? 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300' 
                      : 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </span>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-semibold mb-1 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-4xl font-bold text-black mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-600 font-medium">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Insights Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 border-2 border-black rounded-xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-emerald-400 animate-pulse" />
              <h3 className="text-white font-bold text-lg">AI Insights</h3>
            </div>
            <div className="flex items-center space-x-6">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 group cursor-pointer">
                    <div className={`w-10 h-10 bg-${insight.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${insight.color}-400`} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{insight.value}</p>
                      <p className="text-gray-400 text-xs">{insight.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Active Agents */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-all">
              <div className="px-6 py-4 border-b-2 border-black flex items-center justify-between bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <h3 className="font-bold text-black text-lg">Active Agents</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-300 animate-pulse">
                    {agents.filter(a => a.status === 'active').length} running
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-emerald-600 font-semibold transition-colors flex items-center space-x-1 group">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="divide-y-2 divide-emerald-100 max-h-[500px] overflow-y-auto">
                {agents.map((agent) => (
                  <div key={agent.id} className="px-6 py-5 hover:bg-white/60 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-xl flex items-center justify-center border-2 border-emerald-300 group-hover:border-emerald-500 transition-all group-hover:scale-110 group-hover:rotate-3">
                            <span className="text-2xl">{agent.icon}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${getStatusDot(agent.status)}`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-bold text-black text-base">{agent.name}</h4>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-sm ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                            {agent.performance > 95 && (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 font-medium">
                            <span className="flex items-center space-x-1">
                              <Cpu className="w-3 h-3" />
                              <span>{agent.model}</span>
                            </span>
                            <span>•</span>
                            <span className="font-semibold">{agent.executions} runs</span>
                            <span>•</span>
                            <span>{agent.lastRun}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {agent.tasks.slice(0, 2).map((task, i) => (
                              <span key={i} className="px-2 py-1 bg-white/80 text-xs font-medium text-gray-600 rounded-md border border-gray-200">
                                {task}
                              </span>
                            ))}
                            {agent.tasks.length > 2 && (
                              <span className="text-xs text-gray-500">+{agent.tasks.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right mr-3">
                          <p className="text-2xl font-bold text-black">{agent.performance}%</p>
                          <p className="text-xs text-gray-500 font-medium">Performance</p>
                        </div>
                        <button className="p-2.5 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-200/50">
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions & Info */}
          <div className="space-y-6">
            {/* Command Center */}
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 text-white border-2 border-black hover:shadow-2xl transition-all">
              <div className="flex items-center space-x-2 mb-3">
                <Command className="w-6 h-6 text-amber-400 animate-pulse" />
                <h3 className="font-bold text-xl">Command Center</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 font-medium">Quick actions for your AI agents</p>
              <div className="space-y-3">
                <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all border-2 border-white/20 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 group">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Create New Agent</span>
                </button>
                <button className="w-full py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-all border-2 border-white/30 hover:border-white/50 flex items-center justify-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Import Template</span>
                </button>
                <button className="w-full py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-all border-2 border-white/30 hover:border-white/50 flex items-center justify-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Deploy to Production</span>
                </button>
              </div>
            </div>

            {/* Enhanced System Status */}
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center space-x-2 mb-5">
                <BarChart3 className="w-6 h-6 text-amber-600" />
                <h3 className="font-bold text-black text-lg">System Health</h3>
                <span className="ml-auto px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-300 animate-pulse">
                  All Systems Go
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>AWS Bedrock</span>
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>Operational</span>
                    </span>
                  </div>
                  <div className="w-full bg-white border-2 border-emerald-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full animate-pulse" style={{width: '100%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-cyan-600" />
                      <span>API Response</span>
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>1.2ms</span>
                    </span>
                  </div>
                  <div className="w-full bg-white border-2 border-emerald-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold flex items-center space-x-2">
                      <Database className="w-4 h-4 text-amber-600" />
                      <span>Token Usage</span>
                    </span>
                    <span className="text-amber-600 font-bold">73% of quota</span>
                  </div>
                  <div className="w-full bg-white border-2 border-amber-300 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full animate-pulse" style={{width: '73%', animationDuration: '3s'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-800 font-bold flex items-center space-x-2">
                      <Target className="w-4 h-4 text-rose-600" />
                      <span>Success Rate</span>
                    </span>
                    <span className="text-emerald-600 font-bold">98.5%</span>
                  </div>
                  <div className="w-full bg-white border-2 border-emerald-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full" style={{width: '98.5%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Executions */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="px-6 py-4 border-b-2 border-black bg-white/80 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-cyan-600 animate-pulse" />
                <h3 className="font-bold text-black text-lg">Recent Executions</h3>
                <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-700 text-xs font-bold rounded-lg border border-cyan-300">
                  Live Stream
                </span>
              </div>
              <button 
                onClick={handleRefresh}
                className={`p-2 hover:bg-cyan-100 rounded-lg transition-all group ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/80 border-b-2 border-cyan-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Metrics</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-cyan-100">
                  {recentExecutions.map((execution) => (
                    <tr key={execution.id} className="hover:bg-white/60 transition-all group cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-teal-200 rounded-lg flex items-center justify-center border-2 border-cyan-300 group-hover:scale-110 transition-transform">
                            <Bot className="w-5 h-5 text-cyan-600" />
                          </div>
                          <span className="font-bold text-black text-sm">{execution.agent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{execution.task}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-md shadow-sm ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-sm font-bold text-gray-800">{execution.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">{execution.tokens}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-emerald-600">{execution.cost}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{execution.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

## Key Enhancements Made:

### 🎨 **Visual Improvements**
- **Enhanced gradient backgrounds** with 4 animated orbs for depth
- **Refined color system** with better gradient combinations
- **Improved shadows** with colored shadow effects (shadow-emerald-500/30)
- **Better hover states** with scale, rotation, and shadow transitions
- **Live status indicators** with pulse animations

### ✨ **Interactive Elements**
- **Live data updates** - Total executions counter updates in real-time
- **Sparkline charts** in stat cards showing trends
- **Performance ratings** for each agent (0-100%)
- **Task tags** showing agent capabilities
- **Keyboard shortcuts** indicator (⌘K for search)
- **Refresh animation** with spinning icon

### 📊 **New Features**
- **AI Insights Bar** - Quick metrics with icons
- **Command Center** - Enhanced quick actions panel
- **System Health Monitor** - 4 progress bars with live indicators
- **Time range selector** - Filter data by 24h/7d/30d/90d
- **Cost tracking** - Shows token usage and costs
- **Star ratings** for high-performing agents (>95%)

### 🎯 **UX Improvements**
- **Better visual hierarchy** with size and color contrast
- **Grouped related actions** in the navigation
- **Smooth scroll** for agent list (max-height with overflow)
- **Loading states** with refresh button animation
- **Status badges** with gradient backgrounds
- **Micro-animations** on all interactive elements

The dashboard now features a more sophisticated design with enhanced interactivity, better visual feedback, and a more engaging user experience while maintaining the vibrant color scheme and bold design language established in your original concept.