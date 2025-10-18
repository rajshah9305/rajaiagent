'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'metric' | 'text' | 'avatar' | 'button'
  animate?: boolean
}

export function Skeleton({ 
  className, 
  variant = 'default', 
  animate = true 
}: SkeletonProps) {
  const variants = {
    default: 'h-4 w-full rounded-md',
    card: 'h-32 w-full rounded-xl',
    metric: 'h-24 w-full rounded-2xl',
    text: 'h-4 w-3/4 rounded-md',
    avatar: 'h-8 w-8 rounded-full',
    button: 'h-10 w-24 rounded-lg'
  }

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-r from-muted via-muted/80 to-muted',
        variants[variant],
        className
      )}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        backgroundSize: '200% 100%'
      }}
    />
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="metric-card relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="avatar" className="w-3 h-3" />
      </div>
      
      <div className="flex items-end justify-between">
        <Skeleton variant="text" className="w-16 h-10" />
        <Skeleton variant="button" className="w-12 h-6" />
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-muted rounded-full blur-xl opacity-20" />
    </div>
  )
}

export function QuickActionSkeleton() {
  return (
    <div className="interactive-card">
      <div className="flex flex-col items-center text-center">
        <Skeleton variant="avatar" className="w-16 h-16 mb-4" />
        <Skeleton variant="text" className="w-20 mb-2" />
        <Skeleton variant="text" className="w-32 mb-4" />
        <Skeleton variant="button" className="w-24 h-6" />
      </div>
    </div>
  )
}

export function ExecutionCardSkeleton() {
  return (
    <div className="execution-card">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Skeleton variant="text" className="w-3/4 mb-2" />
          <div className="flex items-center gap-3">
            <Skeleton variant="button" className="w-16 h-5" />
            <Skeleton variant="text" className="w-20" />
            <Skeleton variant="text" className="w-16" />
          </div>
        </div>
        <Skeleton variant="avatar" className="w-8 h-8" />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton variant="text" className="w-32 mb-1" />
          <Skeleton variant="text" className="w-24" />
        </div>
      </div>
      <Skeleton variant="card" className="h-48" />
    </div>
  )
}
