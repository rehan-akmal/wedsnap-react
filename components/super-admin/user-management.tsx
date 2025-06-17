'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  Shield,
  User
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: number
  name: string
  email: string
  role: string
  phone: string
  location: string
  bio: string
  created_at: string
  updated_at: string
  gigs_count: number
  conversations_count: number
  availabilities_count: number
}

interface UserManagementData {
  users: User[]
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
  }
}

export function UserManagement() {
  const [data, setData] = useState<UserManagementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/super_admin/users?page=${currentPage}&per_page=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const usersData = await response.json()
      setData(usersData)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/super_admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      toast.success('User role updated successfully')
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Failed to update user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/super_admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      toast.success('User deleted successfully')
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'admin':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Badge variant="destructive">Super Admin</Badge>
      case 'admin':
        return <Badge variant="default">Admin</Badge>
      default:
        return <Badge variant="secondary">User</Badge>
    }
  }

  const filteredUsers = data?.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user accounts and roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {data?.pagination.total_count || 0} total users
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Gigs</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.location || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.gigs_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about {user.name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Name</label>
                                  <p className="text-sm text-gray-600">{selectedUser.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-sm text-gray-600">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Location</label>
                                  <p className="text-sm text-gray-600">{selectedUser.location || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Role</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    {getRoleIcon(selectedUser.role)}
                                    {getRoleBadge(selectedUser.role)}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Joined</label>
                                  <p className="text-sm text-gray-600">
                                    {new Date(selectedUser.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Bio</label>
                                <p className="text-sm text-gray-600 mt-1">
                                  {selectedUser.bio || 'No bio provided'}
                                </p>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">{selectedUser.gigs_count}</div>
                                  <div className="text-sm text-gray-600">Gigs</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">{selectedUser.conversations_count}</div>
                                  <div className="text-sm text-gray-600">Conversations</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">{selectedUser.availabilities_count}</div>
                                  <div className="text-sm text-gray-600">Availabilities</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleUpdate(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {data && data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing page {data.pagination.current_page} of {data.pagination.total_pages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(data.pagination.total_pages, currentPage + 1))}
                  disabled={currentPage === data.pagination.total_pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 