'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Tag, 
  Trash2, 
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
  gigs_count: number
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/v1/super_admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    console.log('handleCreateCategory called with:', newCategory)
    if (!newCategory.trim()) {
      toast.error('Please enter a category name')
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authentication required. Please log in again.')
      return
    }
    
    setCreating(true)
    try {
      console.log('Sending request to create category:', { category: { name: newCategory } })
      
      const response = await fetch('http://localhost:3001/api/v1/super_admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: { name: newCategory } })
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          toast.error(data.errors.join(', '))
        } else {
          toast.error(data.error || 'Failed to create category')
        }
        return
      }
      
      toast.success('Category created successfully')
      setNewCategory('')
      fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    } finally {
      setCreating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !creating) {
      handleCreateCategory()
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/super_admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete category')
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Category Management</h2>
          <p className="text-gray-600">Manage categories and tags</p>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">{categories.length} total categories</span>
        </div>
      </div>

      {/* Create Category */}
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <Input
            placeholder="New category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="max-w-xs"
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleCreateCategory} variant="default" disabled={creating}>
            <Plus className="h-4 w-4 mr-1" />
            {creating ? 'Creating...' : 'Add Category'}
          </Button>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage and organize categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gigs</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.gigs_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(category.created_at).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(category.updated_at).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
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
        </CardContent>
      </Card>
    </div>
  )
} 