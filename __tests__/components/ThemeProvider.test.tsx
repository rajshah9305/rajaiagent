import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@/components/ThemeProvider'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    aside: 'aside',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="layout-dashboard-icon" />,
  Bot: () => <div data-testid="bot-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  Search: () => <div data-testid="search-icon" />,
  User: () => <div data-testid="user-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  HelpCircle: () => <div data-testid="help-circle-icon" />,
  MessageCircle: () => <div data-testid="message-circle-icon" />,
}))

// Mock InteractiveComponents
jest.mock('@/components/ui/InteractiveComponents', () => ({
  FloatingActionMenu: ({ isOpen, onToggle, onAction }: any) => (
    <div data-testid="floating-action-menu">
      <button onClick={onToggle} data-testid="fab-toggle">
        {isOpen ? 'Close' : 'Open'}
      </button>
      <button onClick={() => onAction('create-agent')} data-testid="create-agent">
        Create Agent
      </button>
    </div>
  ),
  NotificationCenter: ({ notifications, onMarkAsRead, onClearAll }: any) => (
    <div data-testid="notification-center">
      <span data-testid="notification-count">{notifications.length}</span>
      <button onClick={onClearAll} data-testid="clear-all">Clear All</button>
    </div>
  ),
  QuickSearch: ({ onSearch, placeholder }: any) => (
    <input
      data-testid="quick-search"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
  LoadingOverlay: ({ isLoading, message }: any) => 
    isLoading ? <div data-testid="loading-overlay">{message}</div> : null,
}))

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="test-child">Test Content</div>
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toHaveTextContent('Test Content')
  })

  it('provides theme context', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme()
      return (
        <div>
          <span data-testid="current-theme">{theme}</span>
          <button onClick={toggleTheme} data-testid="toggle-theme">
            Toggle
          </button>
        </div>
      )
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
  })

  it('toggles theme correctly', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme()
      return (
        <div>
          <span data-testid="current-theme">{theme}</span>
          <button onClick={toggleTheme} data-testid="toggle-theme">
            Toggle
          </button>
        </div>
      )
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    
    fireEvent.click(screen.getByTestId('toggle-theme'))
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })
})

// Import useTheme after the mock setup
import { useTheme } from '@/components/ThemeProvider'
