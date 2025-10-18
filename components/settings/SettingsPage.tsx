'use client'

import React, { useState } from 'react'
import { Settings, Key, Database, Shield, Bell, User, Globe, CreditCard, Save, ChevronRight, Check, AlertCircle, Lock, Server, Zap } from 'lucide-react'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('aws')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    webhooks: true
  })

  const tabs = [
    { id: 'aws', label: 'AWS Configuration', icon: Server },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'account', label: 'Account', icon: User },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application configuration</p>
        </div>
        <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-ger shadow-lg shadow-emerald-500/30">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-4 border-2 border-black sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon
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
                )
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
                        onClick={() => setNotifications(prev => ({ ...prev, [key as keyof typeof prev]: !prev[key as keyof typeof prev] }))}
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

            {activeTab === 'billing' && (
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-xl text-black">Billing & Usage</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-black">Current Plan</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-lg">Pro Plan</span>
                    </div>
                    <p className="text-sm text-gray-600">$99/month • Unlimited agents and executions</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-black">This Month&apos;s Usage</span>
                      <span className="text-sm font-bold text-gray-600">$47.32</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{width: '47%'}}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">47% of monthly limit used</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 border-2 border-black rounded-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-slate-600" />
                  <h3 className="font-bold text-xl text-black">Account Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium focus:border-slate-500 focus:outline-none"
                    />
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

export default SettingsPage
