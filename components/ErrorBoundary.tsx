'use client'

import React from 'react'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-red-900/10 dark:via-pink-900/5 dark:to-orange-900/10">
      <div className="max-w-md w-full mx-4">
        <div className="metric-card-vibrant text-center">
          <div className="icon-container icon-red mx-auto mb-6 w-20 h-20">
            <ExclamationTriangleIcon className="h-10 w-10" />
          </div>
          
          <h1 className="text-2xl font-bold text-gradient-error mb-4">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          {error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Error Details
              </summary>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto">
                {error.message}
              </div>
            </details>
          )}
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetError}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform font-semibold"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    // You could also send this to an error reporting service
  }
}
