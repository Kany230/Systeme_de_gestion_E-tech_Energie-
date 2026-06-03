import { type ReactNode } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
  className?: string
}


export default function Card({ children, title, className = '', ...props }: CardProps) {
  return (
    <div 
      {...props} 
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}