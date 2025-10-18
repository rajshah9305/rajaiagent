import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variants = {
    default: 'border-border border-t-primary',
    primary: 'border-primary/20 border-t-primary',
    secondary: 'border-secondary/20 border-t-secondary',
    success: 'border-success/20 border-t-success',
    warning: 'border-warning/20 border-t-warning',
    destructive: 'border-destructive/20 border-t-destructive',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div 
        className={cn(
          'animate-spin rounded-full border-2',
          variants[variant],
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Alternative spinner styles
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-primary rounded-full animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export const LoadingPulse: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-3 h-3 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

export const LoadingSkeleton: React.FC<{ className?: string; lines?: number }> = ({ 
  className, 
  lines = 3 
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-muted rounded animate-pulse"
        style={{ 
          width: `${Math.random() * 40 + 60}%`,
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
  </div>
);
