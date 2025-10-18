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
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-cyan-50/30" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-xl" />
      
      <div className="relative z-10">
        {icon && (
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-200">
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
        
        <h3 className="text-2xl font-bold text-black mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
          {description}
        </p>
        
        <Link href={actionHref}>
          <Button variant="gradient" className="px-8 py-3 text-lg font-semibold">
            {actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}
