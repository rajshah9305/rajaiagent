import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, variant = 'default', ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'gradient':
          return 'border-indigo-200/50 dark:border-indigo-700/50 focus:ring-indigo-500 focus:border-indigo-300 dark:focus:border-indigo-600'
        case 'success':
          return 'border-emerald-200/50 dark:border-emerald-700/50 focus:ring-emerald-500 focus:border-emerald-300 dark:focus:border-emerald-600'
        case 'warning':
          return 'border-yellow-200/50 dark:border-yellow-700/50 focus:ring-yellow-500 focus:border-yellow-300 dark:focus:border-yellow-600'
        case 'error':
          return 'border-red-200/50 dark:border-red-700/50 focus:ring-red-500 focus:border-red-300 dark:focus:border-red-600'
        default:
          return 'border-gray-200/50 dark:border-gray-600/50 focus:ring-indigo-500 focus:border-indigo-300 dark:focus:border-indigo-600'
      }
    }

    const getBackgroundClasses = () => {
      switch (variant) {
        case 'gradient':
          return 'bg-white/60 dark:bg-gray-800/60'
        case 'success':
          return 'bg-emerald-50/30 dark:bg-emerald-900/10'
        case 'warning':
          return 'bg-yellow-50/30 dark:bg-yellow-900/10'
        case 'error':
          return 'bg-red-50/30 dark:bg-red-900/10'
        default:
          return 'bg-white/60 dark:bg-gray-800/60'
      }
    }

    return (
      <div className="space-y-3">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg',
            getVariantClasses(),
            getBackgroundClasses(),
            error && 'border-red-500 focus:ring-red-500 bg-red-50/30 dark:bg-red-900/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
