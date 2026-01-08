'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

interface Dress {
  id: string
  name: string
  description: string | null
  price: number
  rentPrice: number
  image: string
  size: string
  style: string
  color: string
  timesRented: number
  isAvailable: boolean
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const styles = ['CLASSIC', 'MODERN', 'PRINCESS', 'MERMAID', 'A_LINE']

export default function AdminDressesPage() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDress, setEditingDress] = useState<Dress | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rentPrice: '',
    image: '',
    size: 'M',
    style: 'CLASSIC',
    color: 'Oq'
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchDresses()
  }, [])

  const fetchDresses = async () => {
    try {
      const res = await fetch('/api/dresses?all=true')
      const data = await res.json()
      setDresses(data.dresses || [])
    } catch (error) {
      console.error('Error fetching dresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDresses = dresses.filter(dress =>
    dress.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAvailability = async (id: string) => {
    const dress = dresses.find(d => d.id === id)
    if (!dress) return
    
    try {
      await fetch(`/api/dresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !dress.isAvailable })
      })
      setDresses(prev => prev.map(d => 
        d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
      ))
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const openAddModal = () => {
    setEditingDress(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      rentPrice: '',
      image: '',
      size: 'M',
      style: 'CLASSIC',
      color: 'Oq'
    })
    setShowModal(true)
  }

  const openEditModal = (dress: Dress) => {
    setEditingDress(dress)
    setFormData({
      name: dress.name,
      description: dress.description || '',
      price: dress.price.toString(),
      rentPrice: dress.rentPrice.toString(),
      image: dress.image,
      size: dress.size,
      style: dress.style,
      color: dress.color
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: parseInt(formData.price),
        rentPrice: parseInt(formData.rentPrice),
        image: formData.image || '/dresses/download.jpg',
        size: formData.size,
        style: formData.style,
        color: formData.color
      }

      if (editingDress) {
        await fetch(`/api/dresses/${editingDress.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        await fetch('/api/dresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setShowModal(false)
      fetchDresses()
    } catch (error) {
      console.error('Error saving dress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ko\'ylakni o\'chirmoqchimisiz?')) return
    
    try {
      await fetch(`/api/dresses/${id}`, { method: 'DELETE' })
      setDresses(prev => prev.filter(d => d.id !== id))
    } catch (error) {
      console.error('Error deleting dress:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelin Ko'ylaklar</h1>
          <p className="text-gray-500">Ko'ylaklar inventarini boshqaring</p>
        </div>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Yangi ko'ylak qo'shish
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Ko'ylak nomini qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dresses.length}</p>
            <p className="text-sm text-gray-500">Jami ko'ylaklar</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{dresses.filter(d => d.isAvailable).length}</p>
            <p className="text-sm text-gray-500">Mavjud</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-500">{dresses.reduce((acc, d) => acc + d.timesRented, 0)}</p>
            <p className="text-sm text-gray-500">Jami ijaralar</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">
              {formatPrice(dresses.reduce((acc, d) => acc + d.rentPrice * d.timesRented, 0))}
            </p>
            <p className="text-sm text-gray-500">Jami daromad</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDresses.map((dress, idx) => (
          <motion.div
            key={dress.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={cn(
              "border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden",
              !dress.isAvailable && "opacity-60"
            )}>
              <div className="relative aspect-[3/4]">
                <img
                  src={dress.image}
                  alt={dress.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={cn(
                    dress.isAvailable 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-500 text-white"
                  )}>
                    {dress.isAvailable ? 'Mavjud' : 'Band'}
                  </Badge>
                </div>
                <button
                  onClick={() => toggleAvailability(dress.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white"
                >
                  {dress.isAvailable ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {dress.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Badge variant="outline">{dress.size}</Badge>
                  <Badge variant="outline">{dress.style}</Badge>
                  <span>{dress.timesRented}x</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Ijara</p>
                    <p className="font-semibold text-rose-500">{formatPrice(dress.rentPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Sotish</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{formatPrice(dress.price)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEditModal(dress)}>
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(dress.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingDress ? 'Ko\'ylakni tahrirlash' : 'Yangi ko\'ylak qo\'shish'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nomi</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ko'ylak nomi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tavsif</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Qisqacha tavsif"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sotish narxi</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="5000000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ijara narxi</label>
                  <Input
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    placeholder="800000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rasm URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/dresses/image.jpg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">O'lcham</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Uslub</label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {styles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rang</label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Oq"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? <Loading size="sm" /> : (editingDress ? 'Saqlash' : 'Qo\'shish')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
