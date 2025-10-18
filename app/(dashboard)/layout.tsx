'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Bot, 
  Activity, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  ChevronRight,
  Sparkles,
  Plus,
  HelpCircle,
  MessageCircle
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { FloatingActionMenu, NotificationCenter, QuickSearch, LoadingOverlay } from '@/components/ui/InteractiveComponents'

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Agents', icon: Bot, path: '/agents' },
  { name: 'Executions', icon: Activity, path: '/executions' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [fabOpen, setFabOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success' as const,
      title: 'Agent Created',
      message: 'Customer Support Bot has been successfully created',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'System Update',
      message: 'New features are now available in the dashboard',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'High Usage',
      message: 'You are approaching your execution limit',
      timestamp: '3 hours ago',
      read: true
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleFabAction = (action: string) => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
    
    switch (action) {
      case 'create-agent':
        window.location.href = '/agents/new'
        break
      case 'execute-agent':
        window.location.href = '/agents'
        break
      case 'view-analytics':
        window.location.href = '/analytics'
        break
      case 'quick-settings':
        window.location.href = '/settings'
        break
      case 'help-support':
        // Open help modal or redirect to support
        break
    }
  }

  const handleNotificationMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const handleNotificationClearAll = () => {
    setNotifications([])
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // Implement search functionality
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300 mobile-safe-area"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <motion.div 
              className="flex items-center gap-3"
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
            >
              <motion.div 
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-lg font-bold text-gradient">RAJ AI</h1>
                  <p className="text-xs text-muted-foreground">Agent Builder</p>
                </motion.div>
              )}
            </motion.div>
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navigation.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.path}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'text-foreground hover:bg-secondary/80'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`w-5 h-5 ${sidebarOpen ? '' : 'mx-auto'}`} />
                    </motion.div>
                    
                    {sidebarOpen && (
                      <motion.span 
                        className="font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                    
                    {sidebarOpen && isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-3 border-t border-border">
            <motion.div
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                RS
              </motion.div>
              {sidebarOpen && (
                <motion.div 
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-sm font-medium truncate">Raj Shah</p>
                  <p className="text-xs text-muted-foreground truncate">raj@example.com</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Top Bar */}
        <header className="h-16 bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Enhanced Search */}
            <div className="flex-1 max-w-md">
              <QuickSearch 
                onSearch={handleSearch}
                placeholder="Search agents, executions..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.button>

              {/* Enhanced Notifications */}
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleNotificationMarkAsRead}
                onClearAll={handleNotificationClearAll}
              />

              {/* User Menu */}
              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                  RS
                </div>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="responsive-padding mobile-optimized">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu
        isOpen={fabOpen}
        onToggle={() => setFabOpen(!fabOpen)}
        onAction={handleFabAction}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} message="Processing..." />
    </div>
  )
}
