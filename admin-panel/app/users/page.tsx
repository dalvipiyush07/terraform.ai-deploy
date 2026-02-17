'use client'

import Header from '@/components/Header'
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  google_id?: string
  picture?: string
  created_at: string
  projectCount: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Users" />
        <div className="p-8 text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Users" />
      
      <div className="p-8">
        <div className="mb-6 flex gap-4">
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws focus:border-transparent"
          />
          <button 
            onClick={fetchUsers}
            className="bg-aws hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-aws rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Projects</p>
                    <p className="text-xl font-bold text-gray-900">{user.projectCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="text-xl font-bold text-gray-900">{user.id}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg">
                    View Projects
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
