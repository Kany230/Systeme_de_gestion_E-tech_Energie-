import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../config/navigation'
import { ChevronDown, LogOut } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-800">E-tech</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const hasChildren = item.children && item.children.length > 0
                const isExpanded = expandedItems.has(item.path)

                return (
                  <li key={item.path}>
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.path)}
                          className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="flex items-center">
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {item.children?.map((child) => {
                              const ChildIcon = child.icon
                              return (
                                <li key={child.path}>
                                  <NavLink
                                    to={child.path}
                                    onClick={() => onClose()}
                                    className={({ isActive }) =>
                                      `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                        isActive
                                          ? 'bg-blue-50 text-blue-600 font-medium'
                                          : 'text-gray-600 hover:bg-gray-50'
                                      }`
                                    }
                                  >
                                    <ChildIcon className="w-4 h-4 mr-3" />
                                    {child.label}
                                  </NavLink>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.path}
                        onClick={() => onClose()}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
