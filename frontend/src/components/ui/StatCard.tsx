import type { ElementType } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ElementType
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          {trend && (
            <div className="flex items-center gap-1 text-sm mt-2">
              {trend.isPositive ? (
                <span className="text-green-600">↑</span>
              ) : (
                <span className="text-red-600">↓</span>
              )}
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="ml-4 p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  )
}
