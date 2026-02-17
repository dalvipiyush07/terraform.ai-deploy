'use client'

import Header from '@/components/Header'
import { useState, useEffect } from 'react'

interface DevOpsProject {
  id: string
  title: string
  description: string
  githubUrl: string
  tags: string[]
  icon: string
  difficulty: string
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('devops')
  const [projects, setProjects] = useState<DevOpsProject[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<DevOpsProject | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    tags: '',
    icon: '📦',
    difficulty: 'Beginner'
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/devops-projects')
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  const saveProjects = async (updatedProjects: DevOpsProject[]) => {
    setProjects(updatedProjects)
  }

  const handleAdd = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      githubUrl: '',
      tags: '',
      icon: '📦',
      difficulty: 'Beginner'
    })
    setShowModal(true)
  }

  const handleEdit = (project: DevOpsProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl,
      tags: project.tags.join(', '),
      icon: project.icon,
      difficulty: project.difficulty
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    const newProject: DevOpsProject = {
      id: editingProject?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      githubUrl: formData.githubUrl,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      icon: formData.icon,
      difficulty: formData.difficulty
    }

    try {
      if (editingProject) {
        await fetch(`http://localhost:5000/api/devops-projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        })
      } else {
        await fetch('http://localhost:5000/api/devops-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        })
      }
      await loadProjects()
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save project:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      try {
        await fetch(`http://localhost:5000/api/devops-projects/${id}`, {
          method: 'DELETE'
        })
        await loadProjects()
      } catch (err) {
        console.error('Failed to delete project:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Content Management" />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['devops', 'announcements', 'faq'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-aws text-aws'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'devops' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">DevOps Projects Gallery</h3>
                  <button 
                    onClick={handleAdd}
                    className="bg-aws hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg"
                  >
                    Add Project
                  </button>
                </div>
                
                {projects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No DevOps projects available. Click "Add Project" to create one.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-aws">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{project.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-900">{project.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {project.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                            <a href={project.githubUrl} target="_blank" className="text-xs text-blue-600 hover:underline block mb-2">
                              {project.githubUrl}
                            </a>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEdit(project)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(project.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="text-center py-12 text-gray-500">
                No announcements available
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="text-center py-12 text-gray-500">
                No FAQs available
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editingProject ? 'Edit' : 'Add'} DevOps Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Kubernetes Multi-Cluster Setup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Production-ready Kubernetes cluster with monitoring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Kubernetes, Docker, Helm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="☸️"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-aws hover:bg-orange-600 text-white font-medium py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
