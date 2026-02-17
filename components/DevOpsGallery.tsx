import React, { useState, useEffect } from 'react';

interface DevOpsProject {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  tags: string[];
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface DevOpsGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProject: (project: DevOpsProject) => void;
}

const DevOpsGallery: React.FC<DevOpsGalleryProps> = ({ isOpen, onClose, onImportProject }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<DevOpsProject[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadProjects()
    }
  }, [isOpen])

  const loadProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/devops-projects')
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
      setProjects([])
    }
  }

  if (!isOpen) return null;

  const filteredProjects = projects.filter(project => {
    const matchesDifficulty = selectedDifficulty === 'All' || project.difficulty === selectedDifficulty;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/30';
      case 'Intermediate': return 'text-[#d29922] bg-[#d29922]/10 border-[#d29922]/30';
      case 'Advanced': return 'text-[#f85149] bg-[#f85149]/10 border-[#f85149]/30';
      default: return 'text-[#8b949e] bg-[#8b949e]/10 border-[#8b949e]/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1c2333] border border-[#21262d] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
          <div>
            <h2 className="text-lg font-semibold text-[#f0f6fc]">DevOps Projects Gallery</h2>
            <p className="text-sm text-[#8b949e]">Import ready-to-use DevOps projects from GitHub</p>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#f0f6fc] p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[#21262d] space-y-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] text-[#f0f6fc] placeholder-[#8b949e] rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedDifficulty === level
                    ? 'bg-[#58a6ff] text-white'
                    : 'bg-[#0d1117] text-[#8b949e] hover:text-[#f0f6fc] border border-[#21262d]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 hover:border-[#58a6ff]/50 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{project.icon}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                <h3 className="text-[#f0f6fc] font-semibold mb-2">{project.title}</h3>
                <p className="text-[#8b949e] text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-[#58a6ff]/10 text-[#58a6ff] rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onImportProject(project)}
                    className="flex-1 bg-[#58a6ff] hover:bg-[#79c0ff] text-white text-sm font-medium py-2 rounded-md transition-all"
                  >
                    Import
                  </button>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-[#1c2333] hover:bg-[#161b22] border border-[#21262d] rounded-md transition-all"
                  >
                    <svg className="w-4 h-4 text-[#8b949e]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-[#8b949e]">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevOpsGallery;
