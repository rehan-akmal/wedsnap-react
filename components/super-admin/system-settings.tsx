'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server, Database, Settings, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface SystemSettingsData {
  app_name: string
  version: string
  environment: string
  database: string
  redis_connected: boolean
  storage: string
}

export function SystemSettings() {
  const [data, setData] = useState<SystemSettingsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemSettings()
  }, [])

  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/v1/super_admin/system/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch system settings')
      }

      const settingsData = await response.json()
      setData(settingsData)
    } catch (error) {
      console.error('Failed to fetch system settings:', error)
      toast.error('Failed to load system settings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading system settings...</p>
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Application configuration and environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">App Name</label>
              <p className="text-sm text-gray-600">{data.app_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Version</label>
              <p className="text-sm text-gray-600">{data.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Environment</label>
              <Badge variant="outline">{data.environment}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Database</label>
              <p className="text-sm text-gray-600">{data.database}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Redis Connected</label>
              <Badge variant={data.redis_connected ? 'default' : 'destructive'}>
                {data.redis_connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Storage</label>
              <p className="text-sm text-gray-600">{data.storage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 