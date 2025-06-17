'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  Package,
  Tag,
  Server,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SuperAdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  user: any
}

const navigationItems = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        href: 'overview',
        icon: LayoutDashboard
      }
    ]
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'User Analytics',
        href: 'users',
        icon: Users
      },
      {
        title: 'Gig Analytics',
        href: 'gigs',
        icon: Briefcase
      },
      {
        title: 'Communication Analytics',
        href: 'communications',
        icon: MessageSquare
      },
      {
        title: 'System Analytics',
        href: 'system',
        icon: BarChart3
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        title: 'User Management',
        href: 'user-management',
        icon: UserCheck
      },
      {
        title: 'Gig Management',
        href: 'gig-management',
        icon: Package
      },
      {
        title: 'Category Management',
        href: 'category-management',
        icon: Tag
      }
    ]
  },
  {
    title: 'System',
    items: [
      {
        title: 'System Settings',
        href: 'settings',
        icon: Settings
      }
    ]
  }
]

export function SuperAdminSidebar({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  user 
}: SuperAdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col bg-white border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-bold text-lg">Super Admin</h2>
              <p className="text-xs text-gray-500">WedSnap Platform</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Super Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@admin.com'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.href
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-auto p-3",
                        collapsed && "justify-center p-2"
                      )}
                      onClick={() => onTabChange(item.href)}
                    >
                      <Icon className={cn(
                        "h-4 w-4",
                        collapsed ? "mr-0" : "mr-3"
                      )} />
                      {!collapsed && (
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.title}</div>
                        </div>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className={cn(
            "h-4 w-4",
            collapsed ? "mr-0" : "mr-3"
          )} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  )
} 