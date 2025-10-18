'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus,
  Bot,
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  MessageCircle,
  Zap,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Target,
  Layers,
  Globe,
  Cloud,
  Database,
  Key,
  Shield,
  User,
  Users,
  Clock,
  Timer,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Link,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Menu,
  X,
  MoreVertical,
  MoreHorizontal,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Hash as HashIcon,
  Minus,
  Equal,
  Plus as PlusIcon,
  Divide,
  Calculator,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Timer as TimerIcon,
  Hourglass,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  Calendar as CalendarAlt,
  Clock as ClockAlt,
  Timer as TimerAlt,
  Hourglass as HourglassAlt
} from 'lucide-react'

interface FloatingActionMenuProps {
  isOpen: boolean
  onToggle: () => void
  onAction: (action: string) => void
}

export function FloatingActionMenu({ isOpen, onToggle, onAction }: FloatingActionMenuProps) {
  const actions = [
    { id: 'create-agent', label: 'Create Agent', icon: Bot, color: 'bg-indigo-500' },
    { id: 'execute-agent', label: 'Execute Agent', icon: Play, color: 'bg-emerald-500' },
    { id: 'view-analytics', label: 'View Analytics', icon: BarChart3, color: 'bg-purple-500' },
    { id: 'quick-settings', label: 'Quick Settings', icon: Settings, color: 'bg-gray-500' },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle, color: 'bg-blue-500' }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.span
                  className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {action.label}
                </motion.span>
                <motion.button
                  onClick={() => onAction(action.id)}
                  className={`w-12 h-12 ${action.color} rounded-full text-white shadow-lg hover:shadow-xl flex items-center justify-center group`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <action.icon className="w-6 h-6" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={onToggle}
        className={`w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

interface NotificationToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function NotificationToast({ id, type, title, message, duration = 5000, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const typeConfig = {
    success: { icon: CheckCircle, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    error: { icon: XCircle, color: 'bg-red-500', textColor: 'text-red-600' },
    warning: { icon: AlertCircle, color: 'bg-amber-500', textColor: 'text-amber-600' },
    info: { icon: Info, color: 'bg-blue-500', textColor: 'text-blue-600' }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
    >
      <div className="bg-card border border-border rounded-xl shadow-lg p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${config.color} text-white`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          
          <motion.button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(id), 300)
            }}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
        
        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-b-xl"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

interface NotificationCenterProps {
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export function NotificationCenter({ notifications, onMarkAsRead, onClearAll }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const typeConfig = {
    success: { icon: CheckCircle, color: 'text-emerald-600' },
    error: { icon: XCircle, color: 'text-red-600' },
    warning: { icon: AlertCircle, color: 'text-amber-600' },
    info: { icon: Info, color: 'text-blue-600' }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-80 bg-card border border-border rounded-xl shadow-lg z-50"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={onClearAll}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const config = typeConfig[notification.type]
                    const Icon = config.icon
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-secondary transition-colors cursor-pointer ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => onMarkAsRead(notification.id)}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface QuickSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function QuickSearch({ onSearch, placeholder = "Search..." }: QuickSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
      setRecentSearches(prev => [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5))
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-50"
          >
            {recentSearches.length > 0 && (
              <div className="p-3 border-b border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="w-4 h-4" />
                <span>Press Enter to search</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message = "Loading..." }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card border border-border rounded-xl p-8 shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              />
              <p className="text-foreground font-medium">{message}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
