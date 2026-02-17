'use client'

import Header from '@/components/Header'
import { useState, useEffect } from 'react'

interface Project {
  id: number
  user_id: number
  title: string
  files: any
  messages: any
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/projects')
      const data = await res.json()
      setProjects(data.projects || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setLoading(false)
    }
  }

  const getServiceFromFiles = (files: any) => {
    const content = JSON.stringify(files).toLowerCase()
    if (content.includes('aws_instance') || content.includes('ec2')) return 'EC2'
    if (content.includes('aws_db') || content.includes('rds')) return 'RDS'
    if (content.includes('aws_s3') || content.includes('bucket')) return 'S3'
    if (content.includes('aws_vpc') || content.includes('vpc')) return 'VPC'
    return 'Other'
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase())
    const service = getServiceFromFiles(project.files)
    const matchesService = serviceFilter === 'All' || service === serviceFilter
    return matchesSearch && matchesService
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Projects" />
        <div className="p-8 text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Projects" />
      
      <div className="p-8">
        <div className="mb-6 flex gap-4">
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws focus:border-transparent"
          />
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws focus:border-transparent"
          >
            <option>All</option>
            <option>EC2</option>
            <option>RDS</option>
            <option>S3</option>
            <option>VPC</option>
          </select>
          <button 
            onClick={fetchProjects}
            className="bg-aws hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-600">No projects found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Project Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">AWS Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Files</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const service = getServiceFromFiles(project.files)
                  const fileCount = Object.keys(project.files || {}).length
                  
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{project.userName}</p>
                          <p className="text-xs text-gray-500">{project.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {service}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fileCount} files</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-aws hover:text-orange-600 font-medium text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
