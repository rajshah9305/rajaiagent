'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, MessageSquare, Plus, Settings as SettingsIcon, Bell, User, BarChart3, 
  Menu, LogOut, UserCircle, SlidersHorizontal, ShieldCheck, CheckCircle, AlertCircle
} from 'lucide-react';
import { 
  Notification, 
  UserProfile, 
  NavItem 
} from '@/types/ui';
import { Dashboard } from './dashboard/Dashboard';
import { AgentBuilderPage } from './agents/AgentBuilderPage';
import { ChatInterfacePage } from './chat/ChatInterfacePage';
import { ExecutionMonitorPage } from './execution/ExecutionMonitorPage';
import { SettingsPage } from './settings/SettingsPage';
import { ProfilePage } from './profile/ProfilePage';

// --- HELPER COMPONENTS ---

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  if (isTouch) return <>{children}</>;
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg z-50">
        {text}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    </div>
  );
};

// --- NOTIFICATION SYSTEM ---

const NotificationDropdown = ({ 
  isOpen, 
  onClose, 
  notifications, 
  markAsRead, 
  clearAll 
}: {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  markAsRead: (id: number) => void;
  clearAll: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-black/10 flex items-center justify-between">
        <h3 className="font-bold text-lg">Notifications</h3>
        {notifications.some((n: Notification) => !n.read) && (
          <button onClick={clearAll} className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification: Notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 border-b border-black/5 hover:bg-gray-50/50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-emerald-50/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notification.type === 'success' ? 'bg-emerald-100' :
                  notification.type === 'error' ? 'bg-red-100' :
                  notification.type === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-600" />}
                  {notification.type === 'agent' && <Bot className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
                {!notification.read && <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-2"></div>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const ProfileDropdown = ({ 
  isOpen, 
  onClose, 
  setActivePage, 
  userProfile 
}: {
  isOpen: boolean;
  onClose: () => void;
  setActivePage: (page: string) => void;
  userProfile: UserProfile;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: UserCircle, label: 'Profile', action: () => setActivePage('Profile') },
    { icon: SettingsIcon, label: 'Settings', action: () => setActivePage('Settings') },
    { icon: ShieldCheck, label: 'Security', action: () => setActivePage('Settings') },
    { icon: LogOut, label: 'Sign Out', action: () => alert('Sign out functionality'), destructive: true }
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-black/10 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{userProfile.name}</p>
            <p className="text-xs text-gray-600 truncate">{userProfile.email}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => { item.action(); onClose(); }}
            className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left ${
              item.destructive ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'info', title: 'Welcome to RAJ AI', message: 'Your AWS Bedrock agent platform is ready', time: '1 min ago', read: false }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Raj Shah',
    email: 'raj@example.com',
    company: 'AI Innovations Inc.',
    joinDate: 'January 2024'
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? {...notif, read: true} : notif)
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({...notif, read: true})));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', icon: BarChart3 }, 
    { name: 'Agent Builder', icon: Plus }, 
    { name: 'Chat', icon: MessageSquare }, 
    { name: 'Execution Monitor', icon: SlidersHorizontal }, 
    { name: 'Settings', icon: SettingsIcon }
  ];

  const SidebarContent = ({ isMobileSidebar }: { isMobileSidebar: boolean }) => (
    <>
      <div className="flex items-center px-4 h-20 shrink-0 justify-center">
        <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        {(isSidebarOpen || isMobileSidebar) && (
          <div className="ml-3">
            <h1 className="text-xl font-bold text-foreground">RAJ AI</h1>
            <p className="text-xs text-muted-foreground font-medium">Bedrock Agent Builder</p>
          </div>
        )}
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.name}>
              <Tooltip text={!isSidebarOpen && !isMobileSidebar ? item.name : ''}>
                <motion.button 
                  onClick={() => { 
                    setActivePage(item.name); 
                    if(isMobile) setIsSidebarOpen(false); 
                  }} 
                  className={`flex items-center p-3 rounded-lg w-full font-semibold text-left transition-colors ${
                    activePage === item.name 
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg' 
                      : 'hover:bg-muted/50 text-foreground hover:text-foreground'
                  }`} 
                  whileHover={activePage !== item.name ? { scale: 1.05 } : {}} 
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6 shrink-0" />
                  {(isSidebarOpen || isMobileSidebar) && <span className="ml-4 truncate">{item.name}</span>}
                </motion.button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
      
      {(isSidebarOpen || isMobileSidebar) && (
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-4 border border-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              <p className="font-bold text-sm text-success">AWS Connected</p>
            </div>
            <p className="text-xs text-success/80">Bedrock integration active</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50 font-sans text-foreground flex">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-info/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className={`bg-card/80 backdrop-blur-xl text-foreground transition-all duration-300 ease-in-out shadow-2xl flex-col hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'} border-0 outline-0`}>
        <SidebarContent isMobileSidebar={false}/>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/30 z-40" 
              onClick={() => setIsSidebarOpen(false)} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
            />
            <motion.aside 
              className="fixed top-0 left-0 h-full w-64 bg-card/95 backdrop-blur-xl text-foreground shadow-2xl flex flex-col z-50 border-0 outline-0" 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent isMobileSidebar={true}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden border-0 outline-0">
        <header className="bg-card/80 backdrop-blur-xl sticky top-0 z-30 border-b border-border">
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2.5 hover:bg-muted/50 rounded-lg lg:hidden transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex-1"></div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Notification Button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                      setIsProfileOpen(false);
                    }}
                    className="p-2.5 hover:bg-muted/50 rounded-lg relative transition-colors"
                  >
                    <Bell className="w-5 h-5 text-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full text-destructive-foreground text-xs flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    clearAll={clearAllNotifications}
                  />
                </div>

                {/* Settings Button */}
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }} 
                  className="p-2.5 hover:bg-muted/50 rounded-lg transition-colors" 
                  onClick={() => {
                    setActivePage('Settings');
                    setIsNotificationOpen(false);
                    setIsProfileOpen(false);
                  }}
                >
                  <SettingsIcon className="w-5 h-5 text-foreground" />
                </motion.button>

                {/* Profile Button */}
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationOpen(false);
                    }}
                    className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <User className="w-5 h-5 text-primary-foreground" />
                  </motion.button>
                  <ProfileDropdown
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    setActivePage={setActivePage}
                    userProfile={userProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePage === 'Dashboard' && <Dashboard setActivePage={setActivePage} addNotification={addNotification} />}
            {activePage === 'Agent Builder' && <AgentBuilderPage addNotification={addNotification} />}
            {activePage === 'Chat' && <ChatInterfacePage addNotification={addNotification} />}
            {activePage === 'Execution Monitor' && <ExecutionMonitorPage addNotification={addNotification} />}
            {activePage === 'Settings' && <SettingsPage addNotification={addNotification} />}
            {activePage === 'Profile' && <ProfilePage userProfile={userProfile} setUserProfile={setUserProfile} addNotification={addNotification} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}