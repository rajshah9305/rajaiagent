import Link from 'next/link'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  actionHref: string
  icon?: React.ReactNode
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  icon 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        {icon && (
          <div className="mx-auto mb-6 w-20 h-20 icon-container icon-indigo group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
        )}
        
        <h3 className="text-2xl font-bold text-gradient mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed text-lg">
          {description}
        </p>
        
        <Link href={actionHref}>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform">
            {actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}
