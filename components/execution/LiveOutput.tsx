'use client'

import { useState, useEffect } from 'react'
import { Execution } from '@/types'
import { PlayIcon, StopIcon } from '@heroicons/react/24/outline'

interface LiveOutputProps {
  execution: Execution
}

export function LiveOutput({ execution }: LiveOutputProps) {
  const [output, setOutput] = useState(execution.output || '')
  const [isStreaming, setIsStreaming] = useState(execution.status === 'RUNNING')

  useEffect(() => {
    if (execution.status === 'RUNNING' && !isStreaming) {
      setIsStreaming(true)
      startStreaming()
    } else if (execution.status !== 'RUNNING' && isStreaming) {
      setIsStreaming(false)
    }
  }, [execution.status])

  const startStreaming = async () => {
    try {
      const response = await fetch(`/api/executions/${execution.id}/stream`)
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

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
                setOutput(prev => prev + data.content)
              } else if (data.type === 'update') {
                // Handle execution updates
                console.log('Execution update:', data.execution)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming execution:', error)
      setIsStreaming(false)
    }
  }

  const stopStreaming = () => {
    setIsStreaming(false)
  }

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Output</h2>
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              <StopIcon className="h-4 w-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={startStreaming}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              <PlayIcon className="h-4 w-4" />
              Resume
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {output ? (
          <pre className="whitespace-pre-wrap">{output}</pre>
        ) : (
          <div className="text-gray-500">
            {isStreaming ? 'Waiting for output...' : 'No output available'}
          </div>
        )}
      </div>

      {isStreaming && (
        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Streaming live output...
        </div>
      )}
    </div>
  )
}
