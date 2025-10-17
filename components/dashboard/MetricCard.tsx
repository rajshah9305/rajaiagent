import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: string
  color: 'indigo' | 'green' | 'emerald' | 'yellow' | 'red' | 'purple' | 'blue' | 'orange' | 'pink' | 'cyan'
  pulse?: boolean
}

export function MetricCard({ title, value, trend, color, pulse }: MetricCardProps) {
  const colorConfig = {
    indigo: {
      gradient: 'from-indigo-500 via-purple-500 to-indigo-600',
      bg: 'from-indigo-50/50 via-purple-50/30 to-indigo-100/50 dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-indigo-800/20',
      border: 'border-indigo-200/50 dark:border-indigo-700/30',
      hoverBorder: 'hover:border-indigo-300/70 dark:hover:border-indigo-600/50',
      iconBg: 'icon-indigo'
    },
    green: {
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      bg: 'from-emerald-50/50 via-green-50/30 to-emerald-100/50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-emerald-800/20',
      border: 'border-emerald-200/50 dark:border-emerald-700/30',
      hoverBorder: 'hover:border-emerald-300/70 dark:hover:border-emerald-600/50',
      iconBg: 'icon-emerald'
    },
    emerald: {
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      bg: 'from-emerald-50/50 via-teal-50/30 to-emerald-100/50 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-emerald-800/20',
      border: 'border-emerald-200/50 dark:border-emerald-700/30',
      hoverBorder: 'hover:border-emerald-300/70 dark:hover:border-emerald-600/50',
      iconBg: 'icon-emerald'
    },
    yellow: {
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      bg: 'from-yellow-50/50 via-amber-50/30 to-orange-50/50 dark:from-yellow-900/20 dark:via-amber-900/10 dark:to-orange-900/20',
      border: 'border-yellow-200/50 dark:border-yellow-700/30',
      hoverBorder: 'hover:border-yellow-300/70 dark:hover:border-yellow-600/50',
      iconBg: 'icon-orange'
    },
    red: {
      gradient: 'from-red-500 via-rose-500 to-red-600',
      bg: 'from-red-50/50 via-rose-50/30 to-red-100/50 dark:from-red-900/20 dark:via-rose-900/10 dark:to-red-800/20',
      border: 'border-red-200/50 dark:border-red-700/30',
      hoverBorder: 'hover:border-red-300/70 dark:hover:border-red-600/50',
      iconBg: 'icon-red'
    },
    purple: {
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      bg: 'from-purple-50/50 via-violet-50/30 to-purple-100/50 dark:from-purple-900/20 dark:via-violet-900/10 dark:to-purple-800/20',
      border: 'border-purple-200/50 dark:border-purple-700/30',
      hoverBorder: 'hover:border-purple-300/70 dark:hover:border-purple-600/50',
      iconBg: 'icon-purple'
    },
    blue: {
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      bg: 'from-blue-50/50 via-cyan-50/30 to-blue-100/50 dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-blue-800/20',
      border: 'border-blue-200/50 dark:border-blue-700/30',
      hoverBorder: 'hover:border-blue-300/70 dark:hover:border-blue-600/50',
      iconBg: 'icon-blue'
    },
    orange: {
      gradient: 'from-orange-500 via-amber-500 to-orange-600',
      bg: 'from-orange-50/50 via-amber-50/30 to-orange-100/50 dark:from-orange-900/20 dark:via-amber-900/10 dark:to-orange-800/20',
      border: 'border-orange-200/50 dark:border-orange-700/30',
      hoverBorder: 'hover:border-orange-300/70 dark:hover:border-orange-600/50',
      iconBg: 'icon-orange'
    },
    pink: {
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      bg: 'from-pink-50/50 via-rose-50/30 to-pink-100/50 dark:from-pink-900/20 dark:via-rose-900/10 dark:to-pink-800/20',
      border: 'border-pink-200/50 dark:border-pink-700/30',
      hoverBorder: 'hover:border-pink-300/70 dark:hover:border-pink-600/50',
      iconBg: 'icon-red'
    },
    cyan: {
      gradient: 'from-cyan-500 via-blue-500 to-cyan-600',
      bg: 'from-cyan-50/50 via-blue-50/30 to-cyan-100/50 dark:from-cyan-900/20 dark:via-blue-900/10 dark:to-cyan-800/20',
      border: 'border-cyan-200/50 dark:border-cyan-700/30',
      hoverBorder: 'hover:border-cyan-300/70 dark:hover:border-cyan-600/50',
      iconBg: 'icon-blue'
    }
  }

  const config = colorConfig[color]
  const isPositive = trend?.startsWith('+')

  return (
    <div className={`bg-gradient-to-br ${config.bg} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${config.border} ${config.hoverBorder} hover:scale-[1.02] group`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </span>
        {pulse && (
          <div className="relative">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className={`text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200`}>
          {value}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300' 
              : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300'
          }`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="h-4 w-4" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4" />
            )}
            {trend}
          </div>
        )}
      </div>
      
      {/* Decorative element */}
      <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity duration-300`} />
    </div>
  )
}
