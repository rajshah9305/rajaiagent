'use client'

import React, { useState } from 'react'
import { Activity, Play, Pause, StopCircle, CheckCircle, XCircle, Clock, Cpu, Terminal, AlertTriangle, TrendingUp, Filter, Download, RefreshCw } from 'lucide-react'

const ExecutionMonitor = () => {
  const [selectedExecution, setSelectedExecution] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('all')

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
  ]

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'running': return 'status-running'
      case 'completed': return 'status-success'
      case 'failed': return 'status-error'
      case 'queued': return 'status-info'
      default: return 'status-info'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'queued': return <Clock className="w-4 h-4" />
      default: return null
    }
  }

  const filteredExecutions = executions.filter(exec => 
    filterStatus === 'all' || exec.status === filterStatus
  )

  return (
    <div className="space-y-8 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Execution Monitor</h1>
              <p className="text-muted-foreground mt-1">Real-time task tracking and monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-border">
              <RefreshCw className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
            <button className="px-5 py-2.5 bg-card text-foreground font-semibold rounded-lg hover:bg-secondary transition-all flex items-center space-x-2 border-2 border-border hover:border-primary/50">
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>

      <div className="space-y-8">
        {/* Filter Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">Filter by Status:</span>
              <div className="flex space-x-2">
                {['all', 'running', 'completed', 'failed', 'queued'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                      filterStatus === status
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{executions.length}</span> total executions
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Execution List */}
          <div className="space-y-4">
            {filteredExecutions.map((execution) => (
              <div
                key={execution.id}
                onClick={() => setSelectedExecution(execution)}
                className={`glass-card p-5 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden ${
                  selectedExecution?.id === execution.id ? 'ring-4 ring-primary/30' : ''
                }`}
              >
                {/* Header gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">{execution.agent}</h3>
                      <span className={`status-badge ${getStatusStyles(execution.status)} flex items-center space-x-1`}>
                        {getStatusIcon(execution.status)}
                        <span>{execution.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{execution.task}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-semibold">ID: {execution.id}</p>
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
                      <Cpu className="w-4 h-4" />
                      <span>{execution.duration}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {execution.status === 'running' && (
                      <>
                        <button className="p-1.5 hover:bg-white/50 rounded transition-colors">
                          <Pause className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-white/50 rounded transition-colors">
                          <StopCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                    {execution.status === 'queued' && (
                      <button className="p-1.5 hover:bg-white/50 rounded transition-colors">
                        <Play className="w-4 h-4 text-emerald-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Execution Details */}
          <div className="space-y-6">
            {selectedExecution ? (
              <>
                {/* Execution Details */}
                <div className="bg-gradient-to-br from-white via-white to-gray-50 border-2 border-black rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Terminal className="w-6 h-6 text-cyan-600" />
                    <h2 className="text-xl font-bold text-black">Execution Details</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-gray-600">Agent</label>
                        <p className="text-lg font-semibold text-black">{selectedExecution.agent}</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-600">Status</label>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(selectedExecution.status)}
                          <span className="text-lg font-semibold text-black capitalize">{selectedExecution.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-600">Task</label>
                      <p className="text-lg font-semibold text-black">{selectedExecution.task}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-gray-600">Start Time</label>
                        <p className="text-lg font-semibold text-black">{selectedExecution.startTime}</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-600">Duration</label>
                        <p className="text-lg font-semibold text-black">{selectedExecution.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logs */}
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-black rounded-xl p-6 shadow-lg text-white">
                  <div className="flex items-center space-x-2 mb-4">
                    <Terminal className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Execution Logs</h2>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                    {selectedExecution.logs.length > 0 ? (
                      <div className="space-y-2">
                        {selectedExecution.logs.map((log: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <span className="text-gray-400 font-bold">{log.time}</span>
                            <span className={`font-bold ${
                              log.type === 'success' ? 'text-emerald-400' :
                              log.type === 'error' ? 'text-red-400' :
                              'text-cyan-400'
                            }`}>
                              [{log.type.toUpperCase()}]
                            </span>
                            <span className="text-gray-200">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No logs available for this execution</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-white via-white to-gray-50 border-2 border-black rounded-xl p-6 shadow-lg text-center">
                <Terminal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-600 mb-2">Select an Execution</h2>
                <p className="text-gray-500">Choose an execution from the list to view detailed information and logs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutionMonitor
