'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Activity,
  TrendingUp,
  UserPlus,
  Package,
  FileText,
  Calendar,
  Database,
  Server,
  Shield,
  LogOut
} from 'lucide-react'
import { toast } from 'sonner'
import { SuperAdminSidebar } from '@/components/super-admin/sidebar'
import { DashboardOverview } from '@/components/super-admin/dashboard-overview'
import { UserAnalytics } from '@/components/super-admin/user-analytics'
import { GigAnalytics } from '@/components/super-admin/gig-analytics'
import { CommunicationAnalytics } from '@/components/super-admin/communication-analytics'
import { SystemAnalytics } from '@/components/super-admin/system-analytics'
import { UserManagement } from '@/components/super-admin/user-management'
import { GigManagement } from '@/components/super-admin/gig-management'
import { CategoryManagement } from '@/components/super-admin/category-management'
import { SystemSettings } from '@/components/super-admin/system-settings'

interface SuperAdminData {
  total_users: number
  total_gigs: number
  total_conversations: number
  total_messages: number
  total_categories: number
  total_packages: number
  total_features: number
  total_faqs: number
  total_availabilities: number
  recent_activity: {
    recent_users: Array<{ id: number; name: string; created_at: string }>
    recent_gigs: Array<{ id: number; title: string; user: string; created_at: string }>
    recent_conversations: Array<{ id: number; created_at: string }>
  }
  system_health: {
    database_connected: boolean
    redis_connected: boolean
    storage_available: boolean
    last_backup: string
    uptime: string
  }
}

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState<SuperAdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('http://localhost:3001/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const userData = await response.json()
      if (userData.role !== 'superadmin') {
        toast.error('Access denied. Super admin privileges required.')
        router.push('/dashboard')
        return
      }

      setUser(userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth/login')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/v1/super_admin/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth/login')
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SuperAdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'users' && 'User Analytics'}
                {activeTab === 'gigs' && 'Gig Analytics'}
                {activeTab === 'communications' && 'Communication Analytics'}
                {activeTab === 'system' && 'System Analytics'}
                {activeTab === 'user-management' && 'User Management'}
                {activeTab === 'gig-management' && 'Gig Management'}
                {activeTab === 'category-management' && 'Category Management'}
                {activeTab === 'settings' && 'System Settings'}
              </h1>
              <p className="text-gray-600 mt-1">
                Super Admin Dashboard - {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="w-4 h-4 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <DashboardOverview data={dashboardData} />
          )}
          {activeTab === 'users' && (
            <UserAnalytics />
          )}
          {activeTab === 'gigs' && (
            <GigAnalytics />
          )}
          {activeTab === 'communications' && (
            <CommunicationAnalytics />
          )}
          {activeTab === 'system' && (
            <SystemAnalytics />
          )}
          {activeTab === 'user-management' && (
            <UserManagement />
          )}
          {activeTab === 'gig-management' && (
            <GigManagement />
          )}
          {activeTab === 'category-management' && (
            <CategoryManagement />
          )}
          {activeTab === 'settings' && (
            <SystemSettings />
          )}
        </main>
      </div>
    </div>
  )
} 