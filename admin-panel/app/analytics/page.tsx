'use client'

import Header from '@/components/Header'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const metricsData = [
  { label: 'Deployment Success Rate', value: '94.5%', icon: '✅', color: 'bg-green-500' },
  { label: 'Avg Deployment Time', value: '3.2 min', icon: '⏱️', color: 'bg-blue-500' },
  { label: 'Most Used Service', value: 'EC2', icon: '☁️', color: 'bg-aws' },
  { label: 'Active Users', value: '1,234', icon: '👥', color: 'bg-purple-500' },
]

const growthData = [
  { month: 'Jan', projects: 120 },
  { month: 'Feb', projects: 180 },
  { month: 'Mar', projects: 250 },
  { month: 'Apr', projects: 320 },
  { month: 'May', projects: 450 },
  { month: 'Jun', projects: 580 },
]

const serviceData = [
  { name: 'EC2', value: 450, color: '#FF9900' },
  { name: 'RDS', value: 250, color: '#22C55E' },
  { name: 'S3', value: 200, color: '#3B82F6' },
  { name: 'VPC', value: 100, color: '#8B5CF6' },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Analytics" />
      
      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {metric.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#FF9900" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AWS Service Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
