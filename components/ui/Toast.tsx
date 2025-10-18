'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-card border border-border',
          border: 'border-border',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          titleColor: 'text-foreground',
          messageColor: 'text-muted-foreground',
          accent: 'border-l-emerald-500'
        }
      case 'error':
        return {
          bg: 'bg-card border border-destructive',
          border: 'border-destructive',
          iconBg: 'bg-destructive/10',
          iconColor: 'text-destructive',
          titleColor: 'text-foreground',
          messageColor: 'text-muted-foreground',
          accent: 'border-l-destructive'
        }
      case 'warning':
        return {
          bg: 'bg-card border border-amber-500',
          border: 'border-amber-500',
          iconBg: 'bg-amber-100 dark:bg-amber-900/30',
          iconColor: 'text-amber-600 dark:text-amber-400',
          titleColor: 'text-foreground',
          messageColor: 'text-muted-foreground',
          accent: 'border-l-amber-500'
        }
      case 'info':
        return {
          bg: 'bg-card border border-primary',
          border: 'border-primary',
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          titleColor: 'text-foreground',
          messageColor: 'text-muted-foreground',
          accent: 'border-l-primary'
        }
    }
  }

  const config = getToastConfig()
  const Icon = icons[type]

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`${config.bg} ${config.border} ${config.accent} border-l-4 rounded-xl shadow-xl backdrop-blur-sm`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 p-2 rounded-lg ${config.iconBg}`}>
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div className="ml-3 flex-1">
              <h4 className={`text-sm font-semibold ${config.titleColor}`}>{title}</h4>
              {message && (
                <p className={`mt-1 text-sm ${config.messageColor}`}>{message}</p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(id), 300)
              }}
              className="ml-4 flex-shrink-0 p-1 rounded-lg hover:bg-secondary transition-colors duration-200"
            >
              <XMarkIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastProps[], onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
