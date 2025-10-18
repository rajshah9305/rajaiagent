import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient' | 'success' | 'warning' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer border border-transparent'

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow-md active:scale-95',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50 shadow-sm hover:shadow-md active:scale-95',
      outline: 'border-border bg-transparent text-foreground hover:bg-secondary hover:border-border/80 focus:ring-primary/50 shadow-sm hover:shadow-md active:scale-95',
      ghost: 'text-foreground hover:bg-secondary/50 focus:ring-primary/50 active:scale-95',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50 shadow-sm hover:shadow-md active:scale-95',
      gradient: 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 focus:ring-primary/50 shadow-lg hover:shadow-xl active:scale-95',
      success: 'bg-success text-success-foreground hover:bg-success/90 focus:ring-success/50 shadow-sm hover:shadow-md active:scale-95',
      warning: 'bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning/50 shadow-sm hover:shadow-md active:scale-95',
      info: 'bg-info text-info-foreground hover:bg-info/90 focus:ring-info/50 shadow-sm hover:shadow-md active:scale-95',
    }
    
    const sizes = {
      xs: 'h-8 px-3 text-xs rounded-md',
      sm: 'h-9 px-3 text-sm rounded-lg',
      md: 'h-10 px-4 text-sm rounded-lg',
      lg: 'h-11 px-6 text-base rounded-lg',
      xl: 'h-12 px-8 text-lg rounded-xl',
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          isLoading && 'cursor-wait',
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children && <span className="truncate">{children}</span>}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
