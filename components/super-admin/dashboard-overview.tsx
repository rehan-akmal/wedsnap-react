'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Package,
  FileText,
  Calendar,
  Database,
  Server,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardOverviewProps {
  data: any
}

const metricCards = [
  {
    title: 'Total Users',
    value: 'users',
    icon: Users,
    color: 'bg-blue-500',
    description: 'Registered users'
  },
  {
    title: 'Total Gigs',
    value: 'gigs',
    icon: Briefcase,
    color: 'bg-green-500',
    description: 'Active gigs'
  },
  {
    title: 'Conversations',
    value: 'conversations',
    icon: MessageSquare,
    color: 'bg-purple-500',
    description: 'Active conversations'
  },
  {
    title: 'Messages',
    value: 'messages',
    icon: BarChart3,
    color: 'bg-orange-500',
    description: 'Total messages'
  },
  {
    title: 'Categories',
    value: 'categories',
    icon: Package,
    color: 'bg-indigo-500',
    description: 'Available categories'
  },
  {
    title: 'Packages',
    value: 'packages',
    icon: FileText,
    color: 'bg-pink-500',
    description: 'Service packages'
  },
  {
    title: 'Features',
    value: 'features',
    icon: Calendar,
    color: 'bg-teal-500',
    description: 'Gig features'
  },
  {
    title: 'FAQs',
    value: 'faqs',
    icon: Database,
    color: 'bg-yellow-500',
    description: 'Frequently asked questions'
  }
]

export function DashboardOverview({ data }: DashboardOverviewProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  const getMetricValue = (key: string) => {
    return data[`total_${key}`] || 0
  }

  const getSystemHealthStatus = () => {
    const health = data.system_health
    if (!health) return { status: 'unknown', color: 'gray' }
    
    if (health.database_connected && health.redis_connected && health.storage_available) {
      return { status: 'healthy', color: 'green' }
    } else if (health.database_connected || health.redis_connected) {
      return { status: 'degraded', color: 'yellow' }
    } else {
      return { status: 'critical', color: 'red' }
    }
  }

  const healthStatus = getSystemHealthStatus()

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon
          const value = getMetricValue(metric.value)
          
          return (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest platform activity and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent Users */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Users</h4>
              <div className="space-y-2">
                {data.recent_activity?.recent_users?.slice(0, 3).map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Gigs */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Gigs</h4>
              <div className="space-y-2">
                {data.recent_activity?.recent_gigs?.slice(0, 3).map((gig: any) => (
                  <div key={gig.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium">{gig.title}</span>
                        <p className="text-xs text-gray-500">by {gig.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(gig.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Platform infrastructure status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {healthStatus.status === 'healthy' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {healthStatus.status === 'degraded' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                {healthStatus.status === 'critical' && <AlertCircle className="h-5 w-5 text-red-500" />}
                <span className="font-medium">Overall Status</span>
              </div>
              <Badge 
                variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}
                className={`bg-${healthStatus.color}-100 text-${healthStatus.color}-800`}
              >
                {healthStatus.status.charAt(0).toUpperCase() + healthStatus.status.slice(1)}
              </Badge>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Database</span>
              </div>
              <Badge variant={data.system_health?.database_connected ? 'default' : 'destructive'}>
                {data.system_health?.database_connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>

            {/* Redis Status */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Redis Cache</span>
              </div>
              <Badge variant={data.system_health?.redis_connected ? 'default' : 'destructive'}>
                {data.system_health?.redis_connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>

            {/* Storage Status */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">File Storage</span>
              </div>
              <Badge variant={data.system_health?.storage_available ? 'default' : 'destructive'}>
                {data.system_health?.storage_available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Uptime</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {data.system_health?.uptime || '99.9%'}
              </span>
            </div>

            {/* Last Backup */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Last Backup</span>
              </div>
              <span className="text-sm text-gray-600">
                {data.system_health?.last_backup || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-gray-500">View and edit user accounts</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Briefcase className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Manage Gigs</div>
                <div className="text-xs text-gray-500">Review and moderate gigs</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-gray-500">Detailed platform analytics</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
} 