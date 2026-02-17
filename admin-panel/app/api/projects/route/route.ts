import { NextRequest, NextResponse } from 'next/server'
import { getMainWebsiteProjects, getMainWebsiteUsers } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await getMainWebsiteProjects()
    const users = await getMainWebsiteUsers()
    
    // Enrich projects with user data
    const enrichedProjects = projects.map((project: any) => {
      const user = users.find((u: any) => u.id === project.user_id)
      return {
        ...project,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'N/A'
      }
    })
    
    return NextResponse.json({ projects: enrichedProjects, total: projects.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
