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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-xl" />

      <div className="relative z-10">
        {icon && (
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-200">
            <div className="text-primary-foreground">
              {icon}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold text-foreground mb-4">
          {title}
        </h3>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed text-lg">
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
