'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AdvancedCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'glass' | 'neon' | 'minimal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  glow?: boolean
  animated?: boolean
}

export function AdvancedCard({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'md',
  interactive = true,
  glow = false,
  animated = true
}: AdvancedCardProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const variantClasses = {
    default: 'bg-card border border-border/50',
    gradient: 'bg-gradient-to-br from-card via-card/95 to-secondary/30 border border-border/50',
    glass: 'glass-effect',
    neon: 'bg-card border-2 border-primary/30 shadow-lg shadow-primary/10',
    minimal: 'bg-transparent border border-border/30'
  }

  const interactiveClasses = interactive ? 'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl cursor-pointer' : ''
  const glowClasses = glow ? 'hover:shadow-primary/20 hover:ring-2 hover:ring-primary/20' : ''

  return (
    <motion.div
      className={`
        rounded-2xl transition-all duration-500 backdrop-blur-sm
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${interactiveClasses}
        ${glowClasses}
        ${className}
      `}
      whileHover={interactive && animated ? { 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={interactive && animated ? { scale: 0.98 } : {}}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={animated ? { duration: 0.3 } : {}}
    >
      {children}
    </motion.div>
  )
}

interface MetricDisplayProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    period?: string
  }
  icon?: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function MetricDisplay({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color = 'primary',
  size = 'md',
  animated = true
}: MetricDisplayProps) {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  }

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }

  return (
    <motion.div
      className="space-y-2"
      initial={animated ? { opacity: 0, scale: 0.9 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={animated ? { duration: 0.3 } : {}}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {icon && (
          <motion.div
            className={`p-2 rounded-lg ${colorClasses[color]} bg-current/10`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className={`font-bold ${sizeClasses[size]} ${colorClasses[color]}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.div>
      
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
      
      {trend && (
        <motion.div 
          className={`flex items-center gap-1 text-sm font-medium ${trendColors[trend.direction]}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span>{trend.value}</span>
          {trend.period && (
            <span className="text-xs opacity-75">({trend.period})</span>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success'
  label?: string
  animated?: boolean
}

export function StatusIndicator({ status, label, animated = true }: StatusIndicatorProps) {
  const statusConfig = {
    active: {
      color: 'bg-emerald-500',
      pulse: 'bg-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    inactive: {
      color: 'bg-gray-400',
      pulse: 'bg-gray-300',
      text: 'text-gray-600 dark:text-gray-400'
    },
    pending: {
      color: 'bg-amber-500',
      pulse: 'bg-amber-400',
      text: 'text-amber-600 dark:text-amber-400'
    },
    error: {
      color: 'bg-red-500',
      pulse: 'bg-red-400',
      text: 'text-red-600 dark:text-red-400'
    },
    success: {
      color: 'bg-emerald-500',
      pulse: 'bg-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400'
    }
  }

  const config = statusConfig[status]

  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={animated ? { opacity: 0, x: -10 } : {}}
      animate={animated ? { opacity: 1, x: 0 } : {}}
      transition={animated ? { duration: 0.3 } : {}}
    >
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        {animated && (status === 'active' || status === 'success') && (
          <motion.div
            className={`absolute inset-0 w-3 h-3 rounded-full ${config.pulse}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      {label && (
        <span className={`text-sm font-medium ${config.text}`}>
          {label}
        </span>
      )}
    </motion.div>
  )
}

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  animated?: boolean
  label?: string
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = 'hsl(262 83% 58%)',
  animated = true,
  label
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <motion.div 
      className="relative inline-flex items-center justify-center"
      initial={animated ? { scale: 0.8, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={animated ? { duration: 0.5, delay: 0.2 } : {}}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={animated ? { strokeDashoffset: circumference } : {}}
          animate={animated ? { strokeDashoffset } : {}}
          transition={animated ? { duration: 1, ease: "easeInOut" } : {}}
        />
      </svg>
      
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">
            {label}
          </span>
        </div>
      )}
    </motion.div>
  )
}

interface FloatingActionButtonProps {
  onClick: () => void
  icon: ReactNode
  label?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  label,
  position = 'bottom-right',
  color = 'primary',
  size = 'md'
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary to-accent shadow-primary/30',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/30',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30'
  }

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 z-50
      `}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <motion.div
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      
      {label && (
        <motion.span
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  )
}
