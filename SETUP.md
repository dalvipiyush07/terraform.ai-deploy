# Setup Instructions

## Backend Setup

1. Install backend dependencies:
```bash
cd server
npm install
```

2. Start backend server:
```bash
npm start
```
Server will run on http://localhost:5000

## Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Start frontend:
```bash
npm run dev
```
Frontend will run on http://localhost:3000

## Features Implemented

✅ User Authentication (Login/Signup/Logout)
✅ Local SQLite Database
✅ Project History with Timestamps
✅ Save Projects to Database
✅ Load Saved Projects
✅ JWT Token Authentication
✅ Secure Password Hashing

## Database

- SQLite database file: `server/database.db`
- Tables: `users`, `projects`
- Auto-created on first run
