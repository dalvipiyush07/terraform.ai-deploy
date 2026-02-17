'use client'

import Header from '@/components/Header'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    awsDeployments: 0,
    errorLogs: 0
  })
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats')
      const stats = await res.json()
      
      const projectsRes = await fetch('http://localhost:5000/api/admin/projects')
      const projectsData = await projectsRes.json()
      
      setStats(stats)
      setProjects(projectsData.projects || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setLoading(false)
    }
  }

  const kpiData = [
    { label: 'Total Users', value: stats.totalUsers.toString(), change: '+12.5%', icon: '👥', color: 'bg-blue-500' },
    { label: 'Total Projects', value: stats.totalProjects.toString(), change: '+8.2%', icon: '📁', color: 'bg-green-500' },
    { label: 'AWS Deployments', value: stats.awsDeployments.toString(), change: '+15.3%', icon: '☁️', color: 'bg-aws' },
    { label: 'Error Logs', value: stats.errorLogs.toString(), change: '-5.1%', icon: '⚠️', color: 'bg-red-500' },
  ]

  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      projects: Math.floor(Math.random() * 100) + 50
    }))
  }

  const getServiceDistribution = () => {
    const services = { EC2: 0, RDS: 0, S3: 0, VPC: 0 }
    projects.forEach(project => {
      const content = JSON.stringify(project.files).toLowerCase()
      if (content.includes('ec2') || content.includes('aws_instance')) services.EC2++
      else if (content.includes('rds') || content.includes('aws_db')) services.RDS++
      else if (content.includes('s3') || content.includes('bucket')) services.S3++
      else if (content.includes('vpc')) services.VPC++
    })
    
    const total = Object.values(services).reduce((a, b) => a + b, 0) || 1
    return Object.entries(services).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
      color: name === 'EC2' ? '#FF9900' : name === 'RDS' ? '#22C55E' : name === 'S3' ? '#3B82F6' : '#8B5CF6'
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard" />
        <div className="p-8 text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <div className="p-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 mb-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Build AWS Infrastructure Smarter</h1>
            <p className="text-gray-300 text-lg mb-6">
              Manage, monitor, and deploy AWS cloud resources with Terra.Ai.
              Gain full visibility into EC2, RDS, S3, and VPC usage from one intelligent admin panel.
            </p>
            <button 
              onClick={fetchData}
              className="bg-aws hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {kpi.icon}
                </div>
                <span className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
              <p className="text-gray-600 text-sm">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projects" fill="#FF9900" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AWS Service Distribution</h3>
            <div className="space-y-4 mt-8">
              {getServiceDistribution().map((service) => (
                <div key={service.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-600">{service.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{ width: `${service.value}%`, backgroundColor: service.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Export Reports</h3>
          <div className="flex gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              📄 Export PDF Report
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              📊 Export Excel Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
