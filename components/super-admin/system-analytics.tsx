'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Server, 
  Database, 
  HardDrive, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

interface SystemAnalyticsData {
  storage_stats: {
    total_attachments: number
    total_blobs: number
    storage_size: number
  }
  performance_stats: {
    average_response_time: string
    requests_per_minute: string
    error_rate: string
  }
  error_stats: {
    total_errors_today: number
    total_errors_this_week: number
    total_errors_this_month: number
    most_common_errors: string[]
  }
  database_stats: {
    total_tables: number
    total_records: number
    database_size: string
  }
}

export function SystemAnalytics() {
  const [data, setData] = useState<SystemAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemAnalytics()
  }, [])

  const fetchSystemAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/v1/super_admin/analytics/system', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch system analytics')
      }

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Failed to fetch system analytics:', error)
      toast.error('Failed to load system analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading system analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Storage Usage
            </CardTitle>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(data.storage_stats.storage_size)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {data.storage_stats.total_attachments} attachments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Response Time
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance_stats.average_response_time}</div>
            <p className="text-xs text-gray-500 mt-1">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Error Rate
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance_stats.error_rate}</div>
            <p className="text-xs text-gray-500 mt-1">
              Current error rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Database Records
            </CardTitle>
            <Database className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.database_stats.total_records.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Storage Statistics
            </CardTitle>
            <CardDescription>
              File storage and attachment metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Total Attachments</span>
                </div>
                <Badge variant="secondary">{data.storage_stats.total_attachments}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Total Blobs</span>
                </div>
                <Badge variant="secondary">{data.storage_stats.total_blobs}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Storage Size</span>
                </div>
                <span className="font-medium">{formatBytes(data.storage_stats.storage_size)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Statistics
            </CardTitle>
            <CardDescription>
              Database performance and metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Total Tables</span>
                </div>
                <Badge variant="secondary">{data.database_stats.total_tables}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Total Records</span>
                </div>
                <Badge variant="secondary">{data.database_stats.total_records.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Database Size</span>
                </div>
                <span className="font-medium">{data.database_stats.database_size}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance and Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              System performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Response Time</span>
                </div>
                <span className="font-medium">{data.performance_stats.average_response_time}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Requests/Minute</span>
                </div>
                <span className="font-medium">{data.performance_stats.requests_per_minute}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Error Rate</span>
                </div>
                <span className="font-medium">{data.performance_stats.error_rate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Statistics
            </CardTitle>
            <CardDescription>
              System error tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Errors Today</span>
                </div>
                <Badge variant="destructive">{data.error_stats.total_errors_today}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Errors This Week</span>
                </div>
                <Badge variant="secondary">{data.error_stats.total_errors_this_week}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Errors This Month</span>
                </div>
                <Badge variant="secondary">{data.error_stats.total_errors_this_month}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 