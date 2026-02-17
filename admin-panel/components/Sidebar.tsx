import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Users', path: '/users', icon: '👥' },
  { name: 'Projects', path: '/projects', icon: '📁' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'Monitoring', path: '/monitoring', icon: '🔍' },
  { name: 'Content', path: '/content', icon: '📝' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (!token && !location.pathname.includes('/api')) {
      navigate('/')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/')
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 h-screen z-50">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Terra.Ai</h1>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-gray-800 border-l-4 border-aws'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-aws rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'Super Admin'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
