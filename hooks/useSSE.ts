'use client'

import { useState, useEffect, useRef } from 'react'

interface SSEOptions {
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
}

export function useSSE(url: string, options: SSEOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const { onMessage, onError, onOpen, onClose } = options

  useEffect(() => {
    if (!url) return

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
      onOpen?.()
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch (err) {
        console.error('Error parsing SSE message:', err)
      }
    }

    eventSource.onerror = (event) => {
      setIsConnected(false)
      setError('Connection error')
      onError?.(event)
    }

    eventSource.addEventListener('close', () => {
      setIsConnected(false)
      onClose?.()
    })

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [url, onMessage, onError, onOpen, onClose])

  const close = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }

  return {
    isConnected,
    error,
    close,
  }
}
