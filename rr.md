User: **FIX THE CODE** ---  '''import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Bot, MessageSquare, Zap, Clock, CheckCircle, 
  AlertCircle, Play, Plus, Settings, Bell, User, BarChart3, 
  Menu, Share2, Star, LogOut, UserCircle,
  ArrowRight, BrainCircuit, SlidersHorizontal, ShieldCheck,
  Code, Database, Cpu, ChevronsUpDown, Save, Trash2, Check,
  Pause, StopCircle, RefreshCw, Eye, TrendingUp, Target
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE = '/api'; // Next.js API routes
const AVAILABLE_MODELS = [
  { id: 'anthropic.claude-3-5-sonnet-20240620-v1:0', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'amazon.titan-text-premier-v1:0', name: 'Titan Text Premier', provider: 'Amazon' },
  { id: 'mistral.mistral-large-2402-v1:0', name: 'Mistral Large', provider: 'Mistral' }
];

// --- HELPER COMPONENTS ---

const Tooltip = ({ children, text }) => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  if (isTouch) return <>{children}</>;
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg z-50">
        {text}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    </div>
  );
};

const PageWrapper = ({ children, pageKey }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
  >
    {children}
  </motion.div>
);

// --- API INTEGRATION LAYER ---

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.invokeAgent(selectedAgent, userInput);
      setMessages(prev => [...prev, { text: response.output || response.response || "Response received", sender: 'bot' }]);
    } catch (error) {
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
  };
  
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
                <option key={agent.agentId} value={agent.agentId}>{agent.agentName}</option>
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
                  <h3 className="font-bold text-lg">{agents.find(a => a.agentId === selectedAgent)?.agentName || 'Agent'}</h3>
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

const ExecutionMonitor = ({ addNotification }) => {
  const [tasks, setTasks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [inputQuery, setInputQuery] = useState('Analyze the latest data trends...');
  const api = useAPI();
  
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents || []);
      if (data.agents?.length > 0) setSelectedAgent(data.agents[0].agentId);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const mockTasks = [
    { name: 'Initializing agent session', icon: BrainCircuit }, 
    { name: 'Processing user input', icon: BrainCircuit }, 
    { name: 'Analyzing intent and context', icon: Target }, 
    { name: 'Generating response', icon: Cpu }, 
    { name: 'Validating output', icon: CheckCircle }, 
    { name: 'Streaming response', icon: Share2 }
  ];
  
  const runExecution = async () => {
    if (isRunning || !selectedAgent) return;
    setIsRunning(true);
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
  };
  
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
                <option key={agent.agentId} value={agent.agentId}>{agent.agentName}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-bold text-gray-700 block mb-2">Input Query</label>
            <textarea 
              rows="4" 
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

const TaskItem = ({ task }) => {
  const getStatusIcon = (status) => {
    switch (status) { 
      case 'running': 
        return (
          <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <Zap size={12} className="text-white"/>
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
        {getStatusIcon(task.status)}
      </div>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl border border-gray-200">
        <task.icon size={20} className="text-gray-600"/>
      </div>
      <p className="font-semibold flex-grow">{task.name}</p>
      <p className="text-sm font-bold capitalize text-gray-500">{task.status}</p>
    </motion.div>
  );
};

const SettingsPage = ({ addNotification }) => {
  const [settings, setSettings] = useState({
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1',
    bedrockRoleArn: '',
    enableEmailNotifications: true,
    enableSlackNotifications: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAPI();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateSettings(settings);
      setShowSuccess(true);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your AWS configuration has been updated',
        time: 'Just now'
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings',
        time: 'Just now'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper pageKey="settings">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageKey="settings">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Settings</h2>
      <p className="text-gray-600 text-lg mb-8">Configure AWS Bedrock and application preferences</p>
      
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <SlidersHorizontal className="w-6 h-6 mr-3 text-emerald-600"/>
            AWS Bedrock Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Access Key ID</label>
              <input 
                type="text" 
                value={settings.awsAccessKeyId}
                onChange={(e) => setSettings({...settings, awsAccessKeyId: e.target.value})}
                placeholder="AKIAIOSFODNN7EXAMPLE" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Secret Access Key</label>
              <input 
                type="password" 
                value={settings.awsSecretAccessKey}
                onChange={(e) => setSettings({...settings, awsSecretAccessKey: e.target.value})}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Region</label>
              <select 
                value={settings.awsRegion}
                onChange={(e) => setSettings({...settings, awsRegion: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">Bedrock IAM Role ARN</label>
              <input 
                type="text" 
                value={settings.bedrockRoleArn}
                onChange={(e) => setSettings({...settings, bedrockRoleArn: e.target.value})}
                placeholder="arn:aws:iam::123456789012:role/BedrockAgentRole" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-sm text-gray-600 mt-2">Required for agent creation and execution</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-emerald-600"/>
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive execution updates via email</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableEmailNotifications: !settings.enableEmailNotifications})}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.enableEmailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enableEmailNotifications ? 'translate-x-7' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Slack Notifications</p>
                <p className="text-sm text-gray-600">Send alerts to Slack channel</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableSlackNotifications: !settings.enableSlackNotifications})}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.enableSlackNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enableSlackNotifications ? 'translate-x-7' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Configuration</span>
              </>
            )}
          </motion.button>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-emerald-600"
            >
              <Check className="w-5 h-5" />
              <span className="font-semibold">Saved successfully!</span>
            </motion.div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Security Notice</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Your AWS credentials are stored securely as environment variables. Never commit credentials to version control. For production deployments, use environment variables in your hosting platform (e.g., Vercel, AWS Systems Manager).
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ProfilePage = ({ userProfile, setUserProfile, addNotification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully',
      time: 'Just now'
    });
  };

  return (
    <PageWrapper pageKey="profile">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Profile</h2>
      <p className="text-gray-600 text-lg mb-8">Manage your account information</p>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{userProfile.name}</h3>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {userProfile.joinDate}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-2">Email</label>
                <input 
                  type="email" 
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-2">Company</label>
                <input 
                  type="text" 
                  value={editedProfile.company}
                  onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(userProfile);
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Company</p>
                <p className="font-bold">{userProfile.company}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Account Type</p>
                <p className="font-bold">AWS Bedrock Professional</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg"
              >
                Edit Profile
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Welcome to RAJ AI', message: 'Your AWS Bedrock agent platform is ready', time: '1 min ago', read: false }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Raj Shah',
    email: 'raj@example.com',
    company: 'AI Innovations Inc.',
    joinDate: 'January 2024'
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? {...notif, read: true} : notif)
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({...notif, read: true})));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', icon: BarChart3 }, 
    { name: 'Agent Builder', icon: Plus }, 
    { name: 'Chat', icon: MessageSquare }, 
    { name: 'Execution Monitor', icon: Activity }, 
    { name: 'Settings', icon: Settings }
  ];

  const SidebarContent = ({ isMobileSidebar }) => (
    <>
      <div className="flex items-center px-4 h-20 shrink-0 justify-center">
        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        {(isSidebarOpen || isMobileSidebar) && (
          <div className="ml-3">
            <h1 className="text-xl font-bold text-black">RAJ AI</h1>
            <p className="text-xs text-gray-600 font-medium">Bedrock Agent Builder</p>
          </div>
        )}
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.name}>
              <Tooltip text={!isSidebarOpen && !isMobileSidebar ? item.name : ''}>
                <motion.button 
                  onClick={() => { 
                    setActivePage(item.name); 
                    if(isMobile) setIsSidebarOpen(false); 
                  }} 
                  className={`flex items-center p-3 rounded-lg w-full font-semibold text-left ${
                    activePage === item.name 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'hover:bg-black/5 text-gray-700 hover:text-black'
                  }`} 
                  whileHover={activePage !== item.name ? { scale: 1.05 } : {}} 
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6 shrink-0" />
                  {(isSidebarOpen || isMobileSidebar) && <span className="ml-4 truncate">{item.name}</span>}
                </motion.button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
      
      {(isSidebarOpen || isMobileSidebar) && (
        <div className="p-4 border-t border-black/10">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <p className="font-bold text-sm text-emerald-900">AWS Connected</p>
            </div>
            <p className="text-xs text-emerald-700">Bedrock integration active</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 font-sans text-gray-900 flex">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className={`bg-white/30 backdrop-blur-xl text-black transition-all duration-300 ease-in-out shadow-2xl flex-col hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent isMobileSidebar={false}/>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/30 z-40" 
              onClick={() => setIsSidebarOpen(false)} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
            />
            <motion.aside 
              className="fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-xl text-black shadow-2xl flex flex-col z-50" 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent isMobileSidebar={true}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/10 backdrop-blur-xl sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2.5 hover:bg-black/5 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1"></div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Notification Button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                      setIsProfileOpen(false);
                    }}
                    className="p-2.5 hover:bg-black/5 rounded-lg relative"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    clearAll={clearAllNotifications}
                  />
                </div>

                {/* Settings Button */}
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }} 
                  className="p-2.5 hover:bg-black/5 rounded-lg" 
                  onClick={() => {
                    setActivePage('Settings');
                    setIsNotificationOpen(false);
                    setIsProfileOpen(false);
                  }}
                >
                  <Settings className="w-5 h-5 text-gray-700" />
                </motion.button>

                {/* Profile Button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationOpen(false);
                    }}
                    className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.button>
                  <ProfileDropdown
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    setActivePage={setActivePage}
                    userProfile={userProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePage === 'Dashboard' && <Dashboard setActivePage={setActivePage} addNotification={addNotification} />}
            {activePage === 'Agent Builder' && <AgentBuilder addNotification={addNotification} />}
            {activePage === 'Chat' && <ChatInterface addNotification={addNotification} />}
            {activePage === 'Execution Monitor' && <ExecutionMonitor addNotification={addNotification} />}
            {activePage === 'Settings' && <SettingsPage addNotification={addNotification} />}
            {activePage === 'Profile' && <ProfilePage userProfile={userProfile} setUserProfile={setUserProfile} addNotification={addNotification} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Agent Management
    getAgents: () => request('/agents'),
    getAgent: (id) => request(`/agents/${id}`),
    createAgent: (data) => request('/agents', { method: 'POST', body: JSON.stringify(data) }),
    updateAgent: (id, data) => request(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAgent: (id) => request(`/agents/${id}`, { method: 'DELETE' }),
    
    // Execution
    invokeAgent: (agentId, input) => request('/agents/invoke', { 
      method: 'POST', 
      body: JSON.stringify({ agentId, input }) 
    }),
    
    // Analytics
    getDashboardStats: () => request('/analytics/dashboard'),
    getAgentMetrics: (agentId) => request(`/analytics/agents/${agentId}`),
    
    // Settings
    getSettings: () => request('/settings'),
    updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
    
    loading,
    error
  };
};

// --- NOTIFICATION SYSTEM ---

const NotificationDropdown = ({ isOpen, onClose, notifications, markAsRead, clearAll }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-black/10 flex items-center justify-between">
        <h3 className="font-bold text-lg">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button onClick={clearAll} className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 border-b border-black/5 hover:bg-gray-50/50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-emerald-50/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notification.type === 'success' ? 'bg-emerald-100' :
                  notification.type === 'error' ? 'bg-red-100' :
                  notification.type === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-600" />}
                  {notification.type === 'agent' && <Bot className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
                {!notification.read && <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2"></div>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const ProfileDropdown = ({ isOpen, onClose, setActivePage, userProfile }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: UserCircle, label: 'Profile', action: () => setActivePage('Profile') },
    { icon: Settings, label: 'Settings', action: () => setActivePage('Settings') },
    { icon: ShieldCheck, label: 'Security', action: () => setActivePage('Settings') },
    { icon: LogOut, label: 'Sign Out', action: () => alert('Sign out functionality'), destructive: true }
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{userProfile.name}</p>
            <p className="text-xs text-gray-600 truncate">{userProfile.email}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => { item.action(); onClose(); }}
            className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left ${
              item.destructive ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// --- UTILITY FUNCTIONS ---

const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': case 'ready': case 'success': return 'text-emerald-700 bg-emerald-100/80 border border-emerald-300';
    case 'error': case 'failed': return 'text-red-700 bg-red-100/80 border border-red-300';
    case 'preparing': case 'pending': return 'text-amber-700 bg-amber-100/80 border border-amber-300';
    case 'idle': return 'text-gray-700 bg-gray-100/80 border border-gray-300';
    default: return 'text-gray-700 bg-gray-100/80 border border-gray-300';
  }
};

const getStatusDot = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': case 'ready': return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50';
    case 'error': case 'failed': return 'bg-red-500 shadow-lg shadow-red-500/50';
    case 'preparing': case 'pending': return 'bg-amber-500 animate-pulse';
    case 'idle': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

// --- PAGE COMPONENTS ---

const Dashboard = ({ setActivePage, addNotification }) => {
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const api = useAPI();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardData, agentsData] = await Promise.all([
        api.getDashboardStats(),
        api.getAgents()
      ]);
      setStats(dashboardData);
      setAgents(agentsData.agents || []);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Failed to load dashboard data',
        time: 'Just now'
      });
    }
  };

  const statCards = stats ? [
    { label: 'Active Agents', value: stats.activeAgents || '0', change: '+' + (stats.newAgents || 0), icon: Bot, trend: 'up' },
    { label: 'Total Executions', value: stats.totalExecutions || '0', change: '+' + (stats.recentExecutions || 0), icon: Zap, trend: 'up' },
    { label: 'Avg Response Time', value: (stats.avgResponseTime || 0) + 's', change: stats.responseTimeDelta || '0s', icon: Clock, trend: 'down' },
    { label: 'Success Rate', value: (stats.successRate || 0) + '%', change: '+' + (stats.successRateDelta || 0) + '%', icon: CheckCircle, trend: 'up' }
  ] : [];

  return (
    <PageWrapper pageKey="dashboard">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Welcome back!</h2>
          <p className="text-gray-600 text-lg">Manage your AWS Bedrock AI agents</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Chat')} className="flex-1 sm:flex-none px-4 py-3 bg-white border-2 border-gray-800 text-gray-900 font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-sm">
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Agent Builder')} className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30">
            <Plus className="w-5 h-5" />
            <span>New Agent</span>
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.length > 0 ? statCards.map((stat, index) => (
          <motion.div whileHover={{ y: -5, scale: 1.03 }} key={index} className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 cursor-pointer group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-black/5">
                <stat.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-700 text-sm font-semibold mb-1 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl sm:text-4xl font-bold text-black">{stat.value}</p>
            </div>
          </motion.div>
        )) : Array(4).fill(0).map((_, i) => <div key={i} className="bg-gray-200/50 rounded-xl p-6 h-40 animate-pulse"></div>)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-black text-lg">Your Agents</h3>
            </div>
            <button onClick={loadDashboardData} className="text-sm text-gray-600 hover:text-emerald-600 font-semibold flex items-center space-x-1">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-black/5">
            {agents.length > 0 ? agents.slice(0, 4).map((agent) => (
              <div key={agent.agentId} className="py-4 hover:bg-gray-50/50 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors cursor-pointer group flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-300/50">
                      <Bot className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(agent.agentStatus)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black truncate">{agent.agentName}</h4>
                    <p className="text-sm text-gray-600 font-medium truncate">{agent.foundationModel}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActivePage('Execution Monitor')} className="ml-2 p-2.5 bg-white border border-gray-300 hover:bg-emerald-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Play className="w-5 h-5" />
                </motion.button>
              </div>
            )) : (
              <div className="py-12 text-center text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No agents yet. Create your first agent!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 text-white border border-black/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-xl">Quick Start</h3>
          </div>
          <p className="text-gray-300 text-sm mb-6 font-medium">Create your first AWS Bedrock agent</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Agent Builder')} className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Agent</span>
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
};

const AgentBuilder = ({ addNotification }) => {
  const [agentConfig, setAgentConfig] = useState({ 
    agentName: 'My Bedrock Agent',
    foundationModel: AVAILABLE_MODELS[0].id,
    instruction: 'You are a helpful AI assistant. Provide accurate, concise responses.',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const api = useAPI();
  
  const handleSave = async () => {
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
  };

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
              <p className="text-sm text-gray-600 mb-3">Define your agent's behavior, capabilities, and constraints.</p>
              <textarea 
                value={agentConfig.instruction} 
                onChange={e => setAgentConfig({...agentConfig, instruction: e.target.value})} 
                rows="10" 
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

const ChatInterface = ({ addNotification }) => {
  const [messages, setMessages] = useState([{ text: "Hello! I'm your AWS Bedrock agent. How can I help you today?", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const messagesEndRef = useRef(null);
  const api = useAPI();
  
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents || []);
      if (data.agents?.length > 0) setSelectedAgent(data.agents[0].agentId);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isTyping || !selectedAgent) return;
    const userInput = input;
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    
    try { '''
Model: Looking at the code, I can see several critical issues that need to be fixed. Here's the corrected version:

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Bot, MessageSquare, Zap, Clock, CheckCircle, 
  AlertCircle, Play, Plus, Settings, Bell, User, BarChart3, 
  Menu, Share2, Star, LogOut, UserCircle,
  ArrowRight, BrainCircuit, SlidersHorizontal, ShieldCheck,
  Code, Database, Cpu, ChevronsUpDown, Save, Trash2, Check,
  Pause, StopCircle, RefreshCw, Eye, TrendingUp, Target
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE = '/api'; // Next.js API routes
const AVAILABLE_MODELS = [
  { id: 'anthropic.claude-3-5-sonnet-20240620-v1:0', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'amazon.titan-text-premier-v1:0', name: 'Titan Text Premier', provider: 'Amazon' },
  { id: 'mistral.mistral-large-2402-v1:0', name: 'Mistral Large', provider: 'Mistral' }
];

// --- HELPER COMPONENTS ---

const Tooltip = ({ children, text }) => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  if (isTouch) return <>{children}</>;
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg z-50">
        {text}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    </div>
  );
};

const PageWrapper = ({ children, pageKey }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
  >
    {children}
  </motion.div>
);

// --- API INTEGRATION LAYER ---

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Agent Management
    getAgents: () => request('/agents'),
    getAgent: (id) => request(`/agents/${id}`),
    createAgent: (data) => request('/agents', { method: 'POST', body: JSON.stringify(data) }),
    updateAgent: (id, data) => request(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAgent: (id) => request(`/agents/${id}`, { method: 'DELETE' }),
    
    // Execution
    invokeAgent: (agentId, input) => request('/agents/invoke', { 
      method: 'POST', 
      body: JSON.stringify({ agentId, input }) 
    }),
    
    // Analytics
    getDashboardStats: () => request('/analytics/dashboard'),
    getAgentMetrics: (agentId) => request(`/analytics/agents/${agentId}`),
    
    // Settings
    getSettings: () => request('/settings'),
    updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
    
    loading,
    error
  };
};

// --- NOTIFICATION SYSTEM ---

const NotificationDropdown = ({ isOpen, onClose, notifications, markAsRead, clearAll }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-black/10 flex items-center justify-between">
        <h3 className="font-bold text-lg">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button onClick={clearAll} className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 border-b border-black/5 hover:bg-gray-50/50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-emerald-50/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notification.type === 'success' ? 'bg-emerald-100' :
                  notification.type === 'error' ? 'bg-red-100' :
                  notification.type === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-600" />}
                  {notification.type === 'agent' && <Bot className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
                {!notification.read && <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2"></div>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const ProfileDropdown = ({ isOpen, onClose, setActivePage, userProfile }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: UserCircle, label: 'Profile', action: () => setActivePage('Profile') },
    { icon: Settings, label: 'Settings', action: () => setActivePage('Settings') },
    { icon: ShieldCheck, label: 'Security', action: () => setActivePage('Settings') },
    { icon: LogOut, label: 'Sign Out', action: () => alert('Sign out functionality'), destructive: true }
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{userProfile.name}</p>
            <p className="text-xs text-gray-600 truncate">{userProfile.email}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => { item.action(); onClose(); }}
            className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left ${
              item.destructive ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// --- UTILITY FUNCTIONS ---

const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': case 'ready': case 'success': return 'text-emerald-700 bg-emerald-100/80 border border-emerald-300';
    case 'error': case 'failed': return 'text-red-700 bg-red-100/80 border border-red-300';
    case 'preparing': case 'pending': return 'text-amber-700 bg-amber-100/80 border border-amber-300';
    case 'idle': return 'text-gray-700 bg-gray-100/80 border border-gray-300';
    default: return 'text-gray-700 bg-gray-100/80 border border-gray-300';
  }
};

const getStatusDot = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': case 'ready': return 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50';
    case 'error': case 'failed': return 'bg-red-500 shadow-lg shadow-red-500/50';
    case 'preparing': case 'pending': return 'bg-amber-500 animate-pulse';
    case 'idle': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

// --- PAGE COMPONENTS ---

const Dashboard = ({ setActivePage, addNotification }) => {
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const api = useAPI();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardData, agentsData] = await Promise.all([
        api.getDashboardStats(),
        api.getAgents()
      ]);
      setStats(dashboardData);
      setAgents(agentsData.agents || []);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Failed to load dashboard data',
        time: 'Just now'
      });
    }
  };

  const statCards = stats ? [
    { label: 'Active Agents', value: stats.activeAgents || '0', change: '+' + (stats.newAgents || 0), icon: Bot, trend: 'up' },
    { label: 'Total Executions', value: stats.totalExecutions || '0', change: '+' + (stats.recentExecutions || 0), icon: Zap, trend: 'up' },
    { label: 'Avg Response Time', value: (stats.avgResponseTime || 0) + 's', change: stats.responseTimeDelta || '0s', icon: Clock, trend: 'down' },
    { label: 'Success Rate', value: (stats.successRate || 0) + '%', change: '+' + (stats.successRateDelta || 0) + '%', icon: CheckCircle, trend: 'up' }
  ] : [];

  return (
    <PageWrapper pageKey="dashboard">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Welcome back!</h2>
          <p className="text-gray-600 text-lg">Manage your AWS Bedrock AI agents</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Chat')} className="flex-1 sm:flex-none px-4 py-3 bg-white border-2 border-gray-800 text-gray-900 font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-sm">
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Agent Builder')} className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30">
            <Plus className="w-5 h-5" />
            <span>New Agent</span>
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.length > 0 ? statCards.map((stat, index) => (
          <motion.div whileHover={{ y: -5, scale: 1.03 }} key={index} className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 cursor-pointer group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-black/5">
                <stat.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-700 text-sm font-semibold mb-1 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl sm:text-4xl font-bold text-black">{stat.value}</p>
            </div>
          </motion.div>
        )) : Array(4).fill(0).map((_, i) => <div key={i} className="bg-gray-200/50 rounded-xl p-6 h-40 animate-pulse"></div>)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-black text-lg">Your Agents</h3>
            </div>
            <button onClick={loadDashboardData} className="text-sm text-gray-600 hover:text-emerald-600 font-semibold flex items-center space-x-1">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-black/5">
            {agents.length > 0 ? agents.slice(0, 4).map((agent) => (
              <div key={agent.agentId} className="py-4 hover:bg-gray-50/50 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors cursor-pointer group flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-300/50">
                      <Bot className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(agent.agentStatus)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black truncate">{agent.agentName}</h4>
                    <p className="text-sm text-gray-600 font-medium truncate">{agent.foundationModel}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActivePage('Execution Monitor')} className="ml-2 p-2.5 bg-white border border-gray-300 hover:bg-emerald-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Play className="w-5 h-5" />
                </motion.button>
              </div>
            )) : (
              <div className="py-12 text-center text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No agents yet. Create your first agent!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 text-white border border-black/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-xl">Quick Start</h3>
          </div>
          <p className="text-gray-300 text-sm mb-6 font-medium">Create your first AWS Bedrock agent</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('Agent Builder')} className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Agent</span>
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
};

const AgentBuilder = ({ addNotification }) => {
  const [agentConfig, setAgentConfig] = useState({ 
    agentName: 'My Bedrock Agent',
    foundationModel: AVAILABLE_MODELS[0].id,
    instruction: 'You are a helpful AI assistant. Provide accurate, concise responses.',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const api = useAPI();
  
  const handleSave = async () => {
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
  };

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
              <p className="text-sm text-gray-600 mb-3">Define your agent's behavior, capabilities, and constraints.</p>
              <textarea 
                value={agentConfig.instruction} 
                onChange={e => setAgentConfig({...agentConfig, instruction: e.target.value})} 
                rows="10" 
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

const ChatInterface = ({ addNotification }) => {
  const [messages, setMessages] = useState([{ text: "Hello! I'm your AWS Bedrock agent. How can I help you today?", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const messagesEndRef = useRef(null);
  const api = useAPI();
  
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents || []);
      if (data.agents?.length > 0) setSelectedAgent(data.agents[0].agentId);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isTyping || !selectedAgent) return;
    const userInput = input;
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await api.invokeAgent(selectedAgent, userInput);
      setMessages(prev => [...prev, { text: response.output || response.response || "Response received", sender: 'bot' }]);
    } catch (error) {
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
  };
  
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
                <option key={agent.agentId} value={agent.agentId}>{agent.agentName}</option>
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
                  <h3 className="font-bold text-lg">{agents.find(a => a.agentId === selectedAgent)?.agentName || 'Agent'}</h3>
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

const ExecutionMonitor = ({ addNotification }) => {
  const [tasks, setTasks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [inputQuery, setInputQuery] = useState('Analyze the latest data trends...');
  const api = useAPI();
  
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data.agents || []);
      if (data.agents?.length > 0) setSelectedAgent(data.agents[0].agentId);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const mockTasks = [
    { name: 'Initializing agent session', icon: BrainCircuit }, 
    { name: 'Processing user input', icon: BrainCircuit }, 
    { name: 'Analyzing intent and context', icon: Target }, 
    { name: 'Generating response', icon: Cpu }, 
    { name: 'Validating output', icon: CheckCircle }, 
    { name: 'Streaming response', icon: Share2 }
  ];
  
  const runExecution = async () => {
    if (isRunning || !selectedAgent) return;
    setIsRunning(true);
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
  };
  
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
                <option key={agent.agentId} value={agent.agentId}>{agent.agentName}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-bold text-gray-700 block mb-2">Input Query</label>
            <textarea 
              rows="4" 
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

const TaskItem = ({ task }) => {
  const getStatusIcon = (status) => {
    switch (status) { 
      case 'running': 
        return (
          <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <Zap size={12} className="text-white"/>
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
        {getStatusIcon(task.status)}
      </div>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl border border-gray-200">
        <task.icon size={20} className="text-gray-600"/>
      </div>
      <p className="font-semibold flex-grow">{task.name}</p>
      <p className="text-sm font-bold capitalize text-gray-500">{task.status}</p>
    </motion.div>
  );
};

const SettingsPage = ({ addNotification }) => {
  const [settings, setSettings] = useState({
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1',
    bedrockRoleArn: '',
    enableEmailNotifications: true,
    enableSlackNotifications: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAPI();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateSettings(settings);
      setShowSuccess(true);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your AWS configuration has been updated',
        time: 'Just now'
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings',
        time: 'Just now'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper pageKey="settings">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageKey="settings">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Settings</h2>
      <p className="text-gray-600 text-lg mb-8">Configure AWS Bedrock and application preferences</p>
      
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <SlidersHorizontal className="w-6 h-6 mr-3 text-emerald-600"/>
            AWS Bedrock Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Access Key ID</label>
              <input 
                type="text" 
                value={settings.awsAccessKeyId}
                onChange={(e) => setSettings({...settings, awsAccessKeyId: e.target.value})}
                placeholder="AKIAIOSFODNN7EXAMPLE" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Secret Access Key</label>
              <input 
                type="password" 
                value={settings.awsSecretAccessKey}
                onChange={(e) => setSettings({...settings, awsSecretAccessKey: e.target.value})}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Region</label>
              <select 
                value={settings.awsRegion}
                onChange={(e) => setSettings({...settings, awsRegion: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">Bedrock IAM Role ARN</label>
              <input 
                type="text" 
                value={settings.bedrockRoleArn}
                onChange={(e) => setSettings({...settings, bedrockRoleArn: e.target.value})}
                placeholder="arn:aws:iam::123456789012:role/BedrockAgentRole" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-sm text-gray-600 mt-2">Required for agent creation and execution</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-emerald-600"/>
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive execution updates via email</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableEmailNotifications: !settings.enableEmailNotifications})}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.enableEmailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enableEmailNotifications ? 'translate-x-7' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Slack Notifications</p>
                <p className="text-sm text-gray-600">Send alerts to Slack channel</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableSlackNotifications: !settings.enableSlackNotifications})}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.enableSlackNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enableSlackNotifications ? 'translate-x-7' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Configuration</span>
              </>
            )}
          </motion.button>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-emerald-600"
            >
              <Check className="w-5 h-5" />
              <span className="font-semibold">Saved successfully!</span>
            </motion.div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Security Notice</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Your AWS credentials are stored securely as environment variables. Never commit credentials to version control. For production deployments, use environment variables in your hosting platform (e.g., Vercel, AWS Systems Manager).
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ProfilePage = ({ userProfile, setUserProfile, addNotification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully',
      time: 'Just now'
    });
  };

  return (
    <PageWrapper pageKey="profile">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Profile</h2>
      <p className="text-gray-600 text-lg mb-8">Manage your account information</p>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{userProfile.name}</h3>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {userProfile.joinDate}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-2">Email</label>
                <input 
                  type="email" 
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-2">Company</label>
                <input 
                  type="text" 
                  value={editedProfile.company}
                  onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(userProfile);
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Company</p>
                <p className="font-bold">{userProfile.company}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Account Type</p>
                <p className="font-bold">AWS Bedrock Professional</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg"
              >
                Edit Profile
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Welcome to RAJ AI', message: 'Your AWS Bedrock agent platform is ready', time: '1 min ago', read: false }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Raj Shah',
    email: 'raj@example.com',
    company: 'AI Innovations Inc.',
    joinDate: 'January 2024'
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? {...notif, read: true} : notif)
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({...notif, read: true})));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', icon: BarChart3 }, 
    { name: 'Agent Builder', icon: Plus }, 
    { name: 'Chat', icon: MessageSquare }, 
    { name: 'Execution Monitor', icon: Activity }, 
    { name: 'Settings', icon: Settings }
  ];

  const SidebarContent = ({ isMobileSidebar }) => (
    <>
      <div className="flex items-center px-4 h-20 shrink-0 justify-center">
        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        {(isSidebarOpen || isMobileSidebar) && (
          <div className="ml-3">
            <h1 className="text-xl font-bold text-black">RAJ AI</h1>
            <p className="text-xs text-gray-600 font-medium">Bedrock Agent Builder</p>
          </div>
        )}
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.name}>
              <Tooltip text={!isSidebarOpen && !isMobileSidebar ? item.name : ''}>
                <motion.button 
                  onClick={() => { 
                    setActivePage(item.name); 
                    if(isMobile) setIsSidebarOpen(false); 
                  }} 
                  className={`flex items-center p-3 rounded-lg w-full font-semibold text-left ${
                    activePage === item.name 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'hover:bg-black/5 text-gray-700 hover:text-black'
                  }`} 
                  whileHover={activePage !== item.name ? { scale: 1.05 } : {}} 
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6 shrink-0" />
                  {(isSidebarOpen || isMobileSidebar) && <span className="ml-4 truncate">{item.name}</span>}
                </motion.button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
      
      {(isSidebarOpen || isMobileSidebar) && (
        <div className="p-4 border-t border-black/10">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <p className="font-bold text-sm text-emerald-900">AWS Connected</p>
            </div>
            <p className="text-xs text-emerald-700">Bedrock integration active</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 font-sans text-gray-900 flex">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className={`bg-white/30 backdrop-blur-xl text-black transition-all duration-300 ease-in-out shadow-2xl flex-col hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent isMobileSidebar={false}/>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/30 z-40" 
              onClick={() => setIsSidebarOpen(false)} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
            />
            <motion.aside 
              className="fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-xl text-black shadow-2xl flex flex-col z-50" 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent isMobileSidebar={true}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/10 backdrop-blur-xl sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2.5 hover:bg-black/5 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1"></div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Notification Button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                      setIsProfileOpen(false);
                    }}
                    className="p-2.5 hover:bg-black/5 rounded-lg relative"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    clearAll={clearAllNotifications}
                  />
                </div>

                {/* Settings Button */}
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }} 
                  className="p-2.5 hover:bg-black/5 rounded-lg" 
                  onClick={() => {
                    setActivePage('Settings');
                    setIsNotificationOpen(false);
                    setIsProfileOpen(false);
                  }}
                >
                  <Settings className="w-5 h-5 text-gray-700" />
                </motion.button>

                {/* Profile Button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationOpen(false);
                    }}
                    className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.button>
                  <ProfileDropdown
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    setActivePage={setActivePage}
                    userProfile={userProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePage === 'Dashboard' && <Dashboard setActivePage={setActivePage} addNotification={addNotification} />}
            {activePage === 'Agent Builder' && <AgentBuilder addNotification={addNotification} />}
            {activePage === 'Chat' && <ChatInterface addNotification={addNotification} />}
            {activePage === 'Execution Monitor' && <ExecutionMonitor addNotification={addNotification} />}
            {activePage === 'Settings' && <SettingsPage addNotification={addNotification} />}
            {activePage === 'Profile' && <ProfilePage userProfile={userProfile} setUserProfile={setUserProfile} addNotification={addNotification} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
```

**Key fixes made:**

1. **Fixed `useAPI` hook**: Properly implemented the request method and API methods
2. **Removed misplaced JSX**: Eliminated the erroneous return statement in the middle of the hook
3. **Fixed API usage**: Ensured all components properly use the API hook
4. **Completed truncated code**: Fixed the incomplete `handleSend` function at the end
5. **Corrected component structure**: Ensured all components are properly defined and structured

The application should now work correctly with proper API integration, chat functionality, and all UI components functioning as expected.