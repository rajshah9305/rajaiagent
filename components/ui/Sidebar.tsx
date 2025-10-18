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
  Zap,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';

interface SidebarProps {
  className?: string;
  onItemClick?: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onItemClick }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = useMemo(() => [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/',
      description: 'Overview and metrics',
      badge: null
    },
    { 
      id: 'agents', 
      label: 'Agents', 
      icon: Bot, 
      path: '/agents', 
      badge: '4',
      badgeVariant: 'success' as const,
      description: 'Manage AI agents'
    },
    { 
      id: 'executions', 
      label: 'Executions', 
      icon: Activity, 
      path: '/executions',
      badge: '12',
      badgeVariant: 'info' as const,
      description: 'View execution history'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics',
      badge: null,
      description: 'Performance insights'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      badge: null,
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

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    onItemClick?.(itemId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:static top-0 left-0 h-full z-50 lg:z-auto',
          'bg-sidebar border-r border-sidebar-border flex flex-col',
          'transition-all duration-300 ease-in-out shadow-xl lg:shadow-none',
          isCollapsed ? 'w-16' : 'w-72',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-sidebar-border flex items-center justify-between bg-gradient-to-r from-primary to-primary/90 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {!isCollapsed && (
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 bg-primary-foreground/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-foreground tracking-tight">RAJ AI</h1>
                <p className="text-xs text-primary-foreground/80 font-medium">Agent Platform</p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 bg-primary-foreground/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mx-auto relative z-10">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors relative z-10"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border bg-sidebar-accent/50">
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-sidebar border border-sidebar-border rounded-lg hover:bg-sidebar-accent transition-colors group">
                <Search className="w-4 h-4 text-sidebar-foreground/60 group-hover:text-primary" />
                <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-foreground">Search</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-sidebar border border-sidebar-border rounded-lg hover:bg-sidebar-accent transition-colors group">
                <Bell className="w-4 h-4 text-sidebar-foreground/60 group-hover:text-primary" />
                <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-foreground">Alerts</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="mb-4">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
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
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'w-full flex items-center py-3 rounded-xl transition-all duration-200 group relative',
                  isCollapsed ? 'justify-center px-3' : 'justify-between px-4',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transform scale-[1.02]'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:transform hover:scale-[1.01]'
                )}
                aria-label={`${item.label}${item.description ? ` - ${item.description}` : ''}`}
                title={!isCollapsed ? undefined : item.label}
              >
                <div className="flex items-center space-x-3">
                  <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                    <Icon className={`w-5 h-5 transition-all duration-200 ${
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-sidebar-foreground/60 group-hover:text-primary'
                    }`} />
                    {isActive && (
                      <div className="absolute inset-0 bg-primary-foreground/20 rounded-full blur-sm"></div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className={`font-medium text-sm transition-colors ${
                        isActive ? 'text-primary-foreground' : 'text-sidebar-foreground'
                      }`}>
                        {item.label}
                      </span>
                      <span className={`text-xs transition-colors ${
                        isActive ? 'text-primary-foreground/80' : 'text-sidebar-foreground/60'
                      }`}>
                        {item.description}
                      </span>
                    </div>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge 
                        variant={isActive ? 'secondary' : item.badgeVariant || 'default'}
                        size="sm"
                        className={cn(
                          isActive && 'bg-primary-foreground/20 text-primary-foreground'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-primary-foreground animate-pulse" />
                    )}
                  </div>
                )}

                {/* Keyboard shortcut indicator */}
                {!isCollapsed && !isActive && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-sidebar-foreground/40 font-mono">
                      Alt+{index + 1}
                    </span>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-border">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                    )}
                    {item.badge && (
                      <Badge variant="default" size="sm" className="mt-1">
                        {item.badge}
                      </Badge>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                  </div>
                )}

                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full shadow-sm"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Help Section */}
        {!isCollapsed && (
          <div className="p-4 m-3 bg-gradient-to-br from-accent/50 to-accent/30 border border-border rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/30 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 border border-border">
                  <Zap className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1">Quick Start</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Get up and running in minutes</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary text-primary-foreground text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                View Guide
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4 bg-gradient-to-r from-sidebar-accent to-sidebar">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                    RS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-sidebar"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">Raj Shah</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">raj@example.com</p>
                </div>
              </div>
              <button
                className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors group"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4 text-sidebar-foreground/60 group-hover:text-destructive transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg hover:scale-105 transition-transform relative">
                RS
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-sidebar"></div>
              </button>
            </div>
          )}
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <div className="hidden lg:block absolute -right-3 top-8 z-20">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-all shadow-lg hover:scale-110"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-sidebar-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 left-4 lg:hidden z-30 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;
