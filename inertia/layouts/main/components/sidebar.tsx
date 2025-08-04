import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Home,
  type LucideIcon,
  Settings,
  Shield,
  Upload,
  Users,
} from 'lucide-react'

import { cn } from '~/utils/cn'
import type { User as UserType } from '~/types'

interface MenuItem {
  title: string
  href?: string
  icon?: LucideIcon
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Users',
    icon: Users,
    children: [
      { title: 'All Users', href: '/users' },
      { title: 'Roles', href: '/roles' },
      { title: 'Permissions', href: '/permissions' },
    ],
  },
  {
    title: 'Files',
    href: '/files',
    icon: Upload,
  },
  {
    title: 'Security',
    icon: Shield,
    children: [
      { title: 'Audit Logs', href: '/audit-logs' },
      { title: 'Sessions', href: '/sessions' },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  isCollapsed?: boolean
}

export function Sidebar({ isOpen, onClose, isCollapsed = false }: SidebarProps) {
  const { url, auth } = usePage().props as unknown as { url: string; auth?: { user?: UserType } }
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  const isActive = (href?: string) => {
    if (!href || !url) return false
    return url === href || url.startsWith(href + '/')
  }

  const isParentActive = (item: MenuItem) => {
    if (item.href && isActive(item.href)) return true
    if (item.children) {
      return item.children.some((child) => isActive(child.href))
    }
    return false
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-[260px] border-r bg-background transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed && 'lg:w-[80px]'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar content */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const isExpanded = expandedItems.includes(item.title)
              const isItemActive = isParentActive(item)

              return (
                <div key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isItemActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isItemActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {item.children && (
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 shrink-0 transition-transform',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          )}
                        </>
                      )}
                    </button>
                  )}

                  {/* Submenu */}
                  {item.children && isExpanded && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href!}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isActive(child.href)
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Sidebar footer with user info */}
          {!isCollapsed && auth?.user && (
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {auth.user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{auth.user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
