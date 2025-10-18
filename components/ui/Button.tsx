import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-lg focus:ring-primary'

    const variants = {
      primary: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/95 hover:to-primary focus:ring-primary/50 hover:scale-105 transform shadow-lg shadow-primary/30 border-2 border-primary/20',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-border hover:border-border/80 focus:ring-secondary hover:scale-105 transform shadow-lg',
      outline: 'border-2 border-border bg-transparent text-foreground hover:bg-secondary hover:border-border/80 focus:ring-primary hover:scale-105 transform shadow-lg',
      ghost: 'text-foreground hover:bg-secondary/50 hover:text-foreground focus:ring-primary hover:scale-105 transform',
      destructive: 'bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/95 hover:to-destructive focus:ring-destructive/50 hover:scale-105 transform shadow-lg shadow-destructive/30 border-2 border-destructive/20',
      gradient: 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/95 hover:to-accent/95 focus:ring-primary/50 hover:scale-105 transform shadow-lg hover:shadow-xl border-2 border-primary/20',
      success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500 hover:scale-105 transform shadow-lg hover:shadow-xl border-2 border-emerald-500/20',
      warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500 hover:scale-105 transform shadow-lg hover:shadow-xl border-2 border-amber-500/20',
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
