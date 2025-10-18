'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

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

  const handleOpen = useCallback(() => {
    setIsConnected(true)
    setError(null)
    onOpen?.()
  }, [onOpen])

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      onMessage?.(data)
    } catch (err) {
      console.error('Error parsing SSE message:', err)
    }
  }, [onMessage])

  const handleError = useCallback((event: Event) => {
    setIsConnected(false)
    setError('Connection error')
    onError?.(event)
  }, [onError])

  const handleClose = useCallback(() => {
    setIsConnected(false)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (!url) return

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = handleOpen
    eventSource.onmessage = handleMessage
    eventSource.onerror = handleError
    eventSource.addEventListener('close', handleClose)

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [url, handleOpen, handleMessage, handleError, handleClose])

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
