# Terra.Ai Admin Panel

Production-ready admin panel for managing Terra.Ai AWS infrastructure platform.

## Features

- ✅ Dashboard with KPIs and charts
- ✅ User management
- ✅ Project monitoring
- ✅ Analytics and insights
- ✅ Login/Error logs monitoring
- ✅ Content management (Templates, DevOps Projects, Announcements, FAQ)
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ Isolated from main website

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Recharts
- PostgreSQL
- JWT Auth

## Setup

### 1. Install Dependencies

```bash
cd admin-panel
npm install
```

### 2. Setup PostgreSQL Database

```bash
# Create database
createdb terraai_admin

# Run schema
psql -d terraai_admin -f schema.sql
```

### 3. Configure Environment

Copy `.env.local` and update values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=terraai_admin
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-secret-key
```

### 4. Run Development Server

```bash
npm run dev
```

Admin panel runs on: http://localhost:4000

### 5. Default Login

```
Email: admin@terraai.com
Password: admin123
```

## Database Sync

Admin panel has its own database but can sync data from main website database.

Main website runs on port 3000 (independent).
Admin panel runs on port 4000 (independent).

## Production Deployment

```bash
npm run build
npm start
```

## Architecture

```
admin-panel/
├── app/
│   ├── dashboard/      # Dashboard page
│   ├── users/          # User management
│   ├── projects/       # Project monitoring
│   ├── analytics/      # Analytics
│   ├── monitoring/     # Logs
│   ├── content/        # Content management
│   └── api/            # API routes
├── components/         # Reusable components
├── lib/                # Utilities (db, auth)
└── schema.sql          # Database schema
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Separate database from main website
- Environment variable protection
