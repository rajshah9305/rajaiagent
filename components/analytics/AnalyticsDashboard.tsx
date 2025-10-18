'use client'

import React, { useState } from 'react'
import { BarChart3, TrendingUp, Activity, DollarSign, Clock, Zap, Calendar, Download, Filter, PieChart, LineChart, Users } from 'lucide-react'

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  
  const performanceMetrics = [
    { label: 'Total Requests', value: '45,231', change: '+12.5%', icon: Activity, color: 'emerald' },
    { label: 'Avg Response Time', value: '1.24s', change: '-8.3%', icon: Clock, color: 'cyan' },
    { label: 'Success Rate', value: '98.7%', change: '+2.1%', icon: TrendingUp, color: 'amber' },
    { label: 'Cost Saved', value: '$3,420', change: '+23.7%', icon: DollarSign, color: 'rose' },
  ]

  const agentPerformance = [
    { name: 'Customer Support Bot', requests: 12450, successRate: 99.2, avgTime: '1.1s' },
    { name: 'Data Analyzer', requests: 8320, successRate: 97.8, avgTime: '2.3s' },
    { name: 'Content Generator', requests: 6890, successRate: 98.5, avgTime: '1.8s' },
    { name: 'Code Assistant', requests: 9571, successRate: 96.9, avgTime: '1.5s' },
  ]

  const chartData = [
    { day: 'Mon', value: 4200 },
    { day: 'Tue', value: 5100 },
    { day: 'Wed', value: 4800 },
    { day: 'Thu', value: 6200 },
    { day: 'Fri', value: 7100 },
    { day: 'Sat', value: 3900 },
    { day: 'Sun', value: 3200 },
  ]

  return (
    <div className="space-y-8 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-1">Performance insights and metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border-2 border-border rounded-lg font-semibold focus:outline-none focus:border-primary bg-card"
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

      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            const colorStyles = {
              emerald: 'from-emerald-50 to-green-50 border-emerald-300 text-emerald-600 bg-emerald-100',
              cyan: 'from-cyan-50 to-sky-50 border-cyan-300 text-cyan-600 bg-cyan-100',
              amber: 'from-amber-50 to-yellow-50 border-amber-300 text-amber-600 bg-amber-100',
              rose: 'from-rose-50 to-pink-50 border-rose-300 text-rose-600 bg-rose-100',
            }
            const style = colorStyles[metric.color as keyof typeof colorStyles]
            
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
            )
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
  )
}

export default AnalyticsDashboard
