import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

// Admin panel's own database
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'terraai_admin',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

// Main website database connection (read-only access to user data)
const mainWebsitePool = new Pool({
  host: process.env.MAIN_DB_HOST || 'localhost',
  port: parseInt(process.env.MAIN_DB_PORT || '5432'),
  database: 'terraai_main',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

// Helper to read main website's JSON database
const MAIN_DB_PATH = path.join(process.cwd(), '..', 'server', 'database')

export async function getMainWebsiteUsers() {
  try {
    const data = fs.readFileSync(path.join(MAIN_DB_PATH, 'users.json'), 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function getMainWebsiteProjects() {
  try {
    const data = fs.readFileSync(path.join(MAIN_DB_PATH, 'projects.json'), 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export { adminPool as default, mainWebsitePool }
