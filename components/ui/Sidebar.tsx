import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Activity, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  LogOut, 
  HelpCircle,
  Bell,
  Search,
  Zap
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = useMemo(() => [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/',
      description: 'Overview and metrics'
    },
    { 
      id: 'agents', 
      label: 'Agents', 
      icon: Bot, 
      path: '/agents', 
      badge: '4',
      badgeColor: 'bg-emerald-500',
      description: 'Manage AI agents'
    },
    { 
      id: 'executions', 
      label: 'Executions', 
      icon: Activity, 
      path: '/executions',
      badge: '12',
      badgeColor: 'bg-blue-500',
      description: 'View execution history'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics',
      description: 'Performance insights'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      description: 'Configuration options'
    }
  ], []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        if (menuItems[index]) {
          setActiveItem(menuItems[index].id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuItems]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${
          isCollapsed ? 'w-16' : 'w-72'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative shadow-xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">RAJ AI</h1>
                <p className="text-xs text-emerald-100 font-medium">Agent Platform</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mx-auto relative z-10">
              <Bot className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <Search className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">Search</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <Bell className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">Alerts</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="mb-4">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Navigation
              </p>
            )}
          </div>
          
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-3' : 'justify-between px-4'
                } py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]' 
                    : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-[1.01]'
                }`}
                aria-label={`${item.label}${item.description ? ` - ${item.description}` : ''}`}
                title={!isCollapsed ? undefined : item.label}
              >
                <div className="flex items-center space-x-3">
                  <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                    <Icon className={`w-5 h-5 transition-all duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 group-hover:text-emerald-600'
                    }`} />
                    {isActive && (
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className={`font-medium text-sm transition-colors ${
                        isActive ? 'text-white' : 'text-gray-800'
                      }`}>
                        {item.label}
                      </span>
                      <span className={`text-xs transition-colors ${
                        isActive ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </span>
                    </div>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : `bg-${item.badgeColor?.split('-')[1]}-100 text-${item.badgeColor?.split('-')[1]}-700`
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white animate-pulse" />
                    )}
                  </div>
                )}

                {/* Keyboard shortcut indicator */}
                {!isCollapsed && !isActive && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-400 font-mono">
                      Alt+{index + 1}
                    </span>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                    )}
                    {item.badge && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}

                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Help Section */}
        {!isCollapsed && (
          <div className="p-4 m-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/30 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-200">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">Quick Start</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Get up and running in minutes</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                View Guide
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-white">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    RS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Raj Shah</p>
                  <p className="text-xs text-gray-500 truncate">raj@example.com</p>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform relative">
                RS
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </button>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-8 z-20">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-lg hover:scale-110"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Demo Content */}
        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Refined Sidebar</h2>
                  <p className="text-gray-600">Enhanced navigation with modern design patterns</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Improvements</h3>
                  {[
                    'Smoother animations and transitions',
                    'Better accessibility with ARIA labels',
                    'Keyboard shortcuts (Alt+1-5)',
                    'Enhanced visual hierarchy',
                    'Improved hover states and feedback',
                    'Professional color scheme'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 font-bold text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Interactive Features</h3>
                  {[
                    'Collapsible sidebar with smooth transitions',
                    'Contextual tooltips in collapsed mode',
                    'Active state indicators with animations',
                    'Badge notifications with color coding',
                    'Quick action buttons',
                    'Online status indicator'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-xs">⚡</span>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Try the Features</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Click the toggle button to collapse the sidebar, hover over menu items, and use Alt+1-5 for quick navigation.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white/50 text-xs font-mono rounded border">Alt+1</span>
                      <span className="px-2 py-1 bg-white/50 text-xs font-mono rounded border">Alt+2</span>
                      <span className="px-2 py-1 bg-white/50 text-xs font-mono rounded border">Alt+3</span>
                      <span className="px-2 py-1 bg-white/50 text-xs font-mono rounded border">Alt+4</span>
                      <span className="px-2 py-1 bg-white/50 text-xs font-mono rounded border">Alt+5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
