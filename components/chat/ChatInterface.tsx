'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Paperclip, Mic, Image, Hash, Sparkles, Zap, MessageSquarePlus, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import { Agent } from '@/types'
import { nanoid } from 'nanoid'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  agent: Agent
}

export function ChatInterface({ agent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by AWS Bedrock. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { label: 'Analyze Data', icon: Hash },
    { label: 'Generate Code', icon: Zap },
    { label: 'Create Content', icon: Sparkles },
    { label: 'New Chat', icon: MessageSquarePlus },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: nanoid(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsStreaming(true)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(`/api/agents/${agent.id}/invoke-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userMessage.content,
          sessionId: nanoid(),
          agentAliasId: 'TSTALIASID', // Default alias ID
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to invoke agent')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let assistantMessage: Message = {
        id: nanoid(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'chunk') {
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: msg.content + data.content }
                      : msg
                  )
                )
              } else if (data.type === 'complete') {
                setIsStreaming(false)
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error invoking agent:', error)
        setMessages(prev => [...prev, {
          id: nanoid(),
          type: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        }])
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsStreaming(false)
    setIsLoading(false)
  }

  const clearChat = () => {
    setMessages([{
      id: nanoid(),
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by AWS Bedrock. How can I help you today?',
      timestamp: new Date()
    }])
  }

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
                <h1 className="text-xl font-bold text-white">{agent.agentName}</h1>
                <p className="text-xs text-gray-400">Powered by AWS Bedrock</p>
              </div>
            </div>
            <button 
              onClick={clearChat}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30"
            >
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
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex flex-col items-center space-y-2 border border-white/20 hover:border-white/40"
                  >
                    <Icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs text-gray-300 font-medium">{action.label}</span>
                  </button>
                )
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
                  <h2 className="font-bold text-black">{agent.agentName}</h2>
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
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start space-x-3">
                    {message.type === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                        : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-black border-2 border-emerald-200'
                    } rounded-xl px-5 py-3 shadow-lg`}>
                      <p className="font-medium whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                        {message.type === 'assistant' && (
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
                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isStreaming && (
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
          <div className="bg-white/90 backdrop-blur-xl border-t-2 border-black p-6 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white resize-none transition-all"
                      rows={1}
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-3 flex items-center space-x-2">
                      <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </button>
                      <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Image className="w-4 h-4 text-gray-500" />
                      </button>
                      <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Mic className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all flex items-center space-x-2 shadow-lg shadow-red-500/30"
                  >
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}