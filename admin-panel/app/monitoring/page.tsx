'use client'

import Header from '@/components/Header'
import { useState, useEffect } from 'react'

const metrics = [
  { label: 'Server Health', value: '98%', color: 'text-green-600' },
  { label: 'Avg Response Time', value: '120ms', color: 'text-blue-600' },
  { label: 'Active Users', value: '0', color: 'text-purple-600' },
]

export default function MonitoringPage() {
  const [stats, setStats] = useState({ activeUsers: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      })
      const data = await res.json()
      const uniqueUsers = new Set(data.map((p: any) => p.user_id)).size
      setStats({ activeUsers: uniqueUsers })
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Monitoring" />
      
      <div className="p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Server Health</p>
            <p className="text-4xl font-bold text-green-600">98%</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Avg Response Time</p>
            <p className="text-4xl font-bold text-blue-600">120ms</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Active Users</p>
            <p className="text-4xl font-bold text-purple-600">{stats.activeUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Login Activity</h3>
          <div className="text-center py-12 text-gray-500">
            No login activity logs available
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Error Logs</h3>
          <div className="text-center py-12 text-gray-500">
            No error logs available
          </div>
        </div>
      </div>
    </div>
  )
}
