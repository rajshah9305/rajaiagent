'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PlayIcon, 
  ChartBarIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline'

export function QuickActions() {
  const actions = [
    {
      title: 'Create Agent',
      description: 'Build a new AI agent with custom capabilities',
      href: '/agents/new',
      icon: PlusIcon,
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'from-indigo-50/50 via-purple-50/30 to-indigo-100/50 dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-indigo-800/20',
      border: 'border-indigo-200/50 dark:border-indigo-700/30',
      hoverBorder: 'hover:border-indigo-300/70 dark:hover:border-indigo-600/50',
      iconBg: 'icon-indigo',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'View Analytics',
      description: 'Check detailed performance metrics and insights',
      href: '/analytics',
      icon: ChartBarIcon,
      gradient: 'from-emerald-500 to-green-600',
      bg: 'from-emerald-50/50 via-green-50/30 to-emerald-100/50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-emerald-800/20',
      border: 'border-emerald-200/50 dark:border-emerald-700/30',
      hoverBorder: 'hover:border-emerald-300/70 dark:hover:border-emerald-600/50',
      iconBg: 'icon-emerald',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Settings',
      description: 'Configure your workspace and preferences',
      href: '/settings',
      icon: Cog6ToothIcon,
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50/50 via-pink-50/30 to-purple-100/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-purple-800/20',
      border: 'border-purple-200/50 dark:border-purple-700/30',
      hoverBorder: 'hover:border-purple-300/70 dark:hover:border-purple-600/50',
      iconBg: 'icon-purple',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
  ]

  return (
    <div className="metric-card-vibrant relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10" />
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/70 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`group relative bg-gradient-to-br ${action.bg} rounded-2xl p-6 border ${action.border} ${action.hoverBorder} hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden`}
              >
              {/* Action background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${action.iconBg} group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <action.icon className="h-8 w-8" />
                  </div>
                  <h3 className={`font-bold text-gray-900 dark:text-white group-hover:${action.textColor} transition-colors duration-200 mb-2`}>
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {action.description}
                  </p>
                  <div className={`text-sm font-medium ${action.textColor} flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}>
                    Get Started →
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${action.gradient} opacity-10 rounded-full blur-lg group-hover:opacity-20 transition-opacity duration-300`} />
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
