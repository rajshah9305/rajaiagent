'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ServerIcon,
  PlayIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon,
    gradient: 'from-indigo-500 to-purple-600',
    bg: 'from-indigo-50/50 via-purple-50/30 to-indigo-100/50 dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-indigo-800/20',
    border: 'border-indigo-200/50 dark:border-indigo-700/30',
    hoverBorder: 'hover:border-indigo-300/70 dark:hover:border-indigo-600/50',
    iconBg: 'icon-indigo',
    textColor: 'text-indigo-600 dark:text-indigo-400'
  },
  { 
    name: 'Agents', 
    href: '/agents', 
    icon: ServerIcon,
    gradient: 'from-emerald-500 to-green-600',
    bg: 'from-emerald-50/50 via-green-50/30 to-emerald-100/50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-emerald-800/20',
    border: 'border-emerald-200/50 dark:border-emerald-700/30',
    hoverBorder: 'hover:border-emerald-300/70 dark:hover:border-emerald-600/50',
    iconBg: 'icon-emerald',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  { 
    name: 'Executions', 
    href: '/executions', 
    icon: PlayIcon,
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'from-blue-50/50 via-cyan-50/30 to-blue-100/50 dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-blue-800/20',
    border: 'border-blue-200/50 dark:border-blue-700/30',
    hoverBorder: 'hover:border-blue-300/70 dark:hover:border-blue-600/50',
    iconBg: 'icon-blue',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    gradient: 'from-purple-500 to-pink-600',
    bg: 'from-purple-50/50 via-pink-50/30 to-purple-100/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-purple-800/20',
    border: 'border-purple-200/50 dark:border-purple-700/30',
    hoverBorder: 'hover:border-purple-300/70 dark:hover:border-purple-600/50',
    iconBg: 'icon-purple',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Cog6ToothIcon,
    gradient: 'from-orange-500 to-red-600',
    bg: 'from-orange-50/50 via-red-50/30 to-orange-100/50 dark:from-orange-900/20 dark:via-red-900/10 dark:to-orange-800/20',
    border: 'border-orange-200/50 dark:border-orange-700/30',
    hoverBorder: 'hover:border-orange-300/70 dark:hover:border-orange-600/50',
    iconBg: 'icon-orange',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-full flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-64 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 shadow-2xl transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10" />
          
          <div className="relative z-10 flex h-16 items-center justify-between px-6 border-b border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-indigo">
                <SparklesIcon className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-gradient">RAJ AI</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <nav className="relative z-10 mt-6 px-3 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                      : `text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r ${item.bg} hover:border ${item.hoverBorder} hover:shadow-md hover:scale-105 transform`
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`${isActive ? 'text-white' : item.iconBg} p-1 rounded-lg transition-all duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={isActive ? 'text-white' : item.textColor}>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 border-r border-gray-200/50 dark:border-gray-700/30 shadow-xl relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 dark:from-indigo-900/5 dark:via-purple-900/3 dark:to-pink-900/5" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
          
          <div className="relative z-10 flex h-16 items-center px-6 border-b border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-indigo">
                <SparklesIcon className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-gradient">RAJ AI</span>
            </div>
          </div>
          <nav className="relative z-10 flex-1 mt-6 px-3 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                      : `text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r ${item.bg} hover:border ${item.hoverBorder} hover:shadow-md hover:scale-105 transform`
                  }`}
                >
                  <div className={`${isActive ? 'text-white' : item.iconBg} p-1 rounded-lg transition-all duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={isActive ? 'text-white' : item.textColor}>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-gradient-to-r from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/30 backdrop-blur-sm px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/10 via-purple-50/5 to-pink-50/10 dark:from-indigo-900/5 dark:via-purple-900/3 dark:to-pink-900/5" />
          
          <button
            type="button"
            className="lg:hidden relative z-10 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
