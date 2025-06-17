'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Briefcase, 
  Search, 
  Eye, 
  Trash2, 
  User,
  Package,
  Tag,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'

interface Gig {
  id: number
  title: string
  description: string
  location: string
  phone_number: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
  }
  packages_count: number
  features_count: number
  faqs_count: number
  categories: Array<{
    id: number
    name: string
  }>
}

interface GigManagementData {
  gigs: Gig[]
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
  }
}

export function GigManagement() {
  const [data, setData] = useState<GigManagementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchGigs()
  }, [currentPage])

  const fetchGigs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/super_admin/gigs?page=${currentPage}&per_page=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch gigs')
      }

      const gigsData = await response.json()
      setData(gigsData)
    } catch (error) {
      console.error('Failed to fetch gigs:', error)
      toast.error('Failed to load gigs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGig = async (gigId: number) => {
    if (!confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/super_admin/gigs/${gigId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete gig')
      }

      toast.success('Gig deleted successfully')
      fetchGigs() // Refresh the list
    } catch (error) {
      console.error('Failed to delete gig:', error)
      toast.error('Failed to delete gig')
    }
  }

  const filteredGigs = data?.gigs.filter(gig =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading gigs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gig Management</h2>
          <p className="text-gray-600">Manage gigs and their content</p>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {data?.pagination.total_count || 0} total gigs
          </span>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search gigs by title, user, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gigs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gigs</CardTitle>
          <CardDescription>
            Manage gigs, packages, features, and FAQs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gig</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGigs.map((gig) => (
                <TableRow key={gig.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{gig.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {gig.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{gig.user.name}</div>
                        <div className="text-sm text-gray-500">{gig.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{gig.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {gig.categories.map((category) => (
                        <Badge key={category.id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Package className="h-3 w-3 mr-1" />
                        {gig.packages_count}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {gig.features_count}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(gig.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedGig(gig)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Gig Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about {gig.title}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedGig && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Title</label>
                                  <p className="text-sm text-gray-600">{selectedGig.title}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Location</label>
                                  <p className="text-sm text-gray-600">{selectedGig.location}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-sm text-gray-600">{selectedGig.phone_number}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Created</label>
                                  <p className="text-sm text-gray-600">
                                    {new Date(selectedGig.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm text-gray-600 mt-1">{selectedGig.description}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Categories</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedGig.categories.map((category) => (
                                    <Badge key={category.id} variant="outline">
                                      {category.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">{selectedGig.packages_count}</div>
                                  <div className="text-sm text-gray-600">Packages</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">{selectedGig.features_count}</div>
                                  <div className="text-sm text-gray-600">Features</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">{selectedGig.faqs_count}</div>
                                  <div className="text-sm text-gray-600">FAQs</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGig(gig.id)}
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