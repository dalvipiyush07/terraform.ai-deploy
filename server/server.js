const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret';

app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:4000'], credentials: true }));
app.use(express.json());
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'fallback-session-secret', 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

// JSON Database Helper Functions
const DB_PATH = {
  users: path.join(__dirname, 'database', 'users.json'),
  projects: path.join(__dirname, 'database', 'projects.json')
};

const readDB = async (type) => {
  try {
    const data = await fs.readFile(DB_PATH[type], 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeDB = async (type, data) => {
  try {
    // Validate JSON before writing
    const jsonString = JSON.stringify(data, null, 2);
    JSON.parse(jsonString); // Validate it's valid JSON
    await fs.writeFile(DB_PATH[type], jsonString);
  } catch (err) {
    console.error('Error writing to database:', err);
    throw err;
  }
};

const findUser = async (query) => {
  const users = await readDB('users');
  return users.find(user => {
    if (query.google_id) return user.google_id === query.google_id;
    if (query.id) return user.id === query.id;
    return false;
  });
};

const createUser = async (userData) => {
  const users = await readDB('users');
  const newUser = {
    id: users.length + 1,
    ...userData,
    theme: 'dark',
    plan: 'FREE',
    planExpiry: null,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  await writeDB('users', users);
  return newUser;
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findUser({ google_id: profile.id });
        if (user) return done(null, user);
        
        user = await createUser({
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  ));

  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3000' }),
    (req, res) => {
      const token = jwt.sign({ userId: req.user.id }, JWT_SECRET);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
  );
} else {
  app.get('/api/auth/google', (req, res) => {
    res.status(503).json({ error: 'Google OAuth not configured' });
  });
  
  app.get('/api/auth/google/callback', (req, res) => {
    res.status(503).json({ error: 'Google OAuth not configured' });
  });
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUser({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await readDB('projects');
    const userProjects = projects.filter(p => p.user_id === req.userId)
                                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    res.json(userProjects);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Check and auto-downgrade expired plans
const checkPlanExpiry = async (user) => {
  if (user.plan !== 'FREE' && user.planExpiry) {
    const expiryDate = new Date(user.planExpiry);
    const now = new Date();
    if (now > expiryDate) {
      const users = await readDB('users');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].plan = 'FREE';
        users[userIndex].planExpiry = null;
        await writeDB('users', users);
        return { ...users[userIndex] };
      }
    }
  }
  return user;
};

app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const { title, files, messages } = req.body;
    
    // Get user and check plan expiry
    let user = await findUser({ id: req.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await checkPlanExpiry(user);
    
    // Check daily limit based on plan
    const projects = await readDB('projects');
    const today = new Date().toDateString();
    const todayProjects = projects.filter(p => 
      p.user_id === req.userId && 
      new Date(p.created_at).toDateString() === today
    );
    
    let dailyLimit = 5; // FREE
    if (user.plan === 'MONTHLY') dailyLimit = 20;
    else if (user.plan === 'SIXMONTHS' || user.plan === 'YEARLY') dailyLimit = Infinity;
    
    if (todayProjects.length >= dailyLimit) {
      return res.status(403).json({ 
        error: 'Daily limit reached',
        message: `Your plan allows ${dailyLimit} projects per day. Upgrade for more!`
      });
    }
    
    const newProject = {
      id: projects.length + 1,
      user_id: req.userId,
      title,
      files,
      messages,
      is_favorite: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    projects.push(newProject);
    await writeDB('projects', projects);
    res.json({ id: newProject.id });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { title, files, messages } = req.body;
    const projects = await readDB('projects');
    const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id) && p.user_id === req.userId);
    
    if (projectIndex === -1) return res.status(404).json({ error: 'Project not found' });
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      title,
      files,
      messages,
      updated_at: new Date().toISOString()
    };
    
    await writeDB('projects', projects);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const projects = await readDB('projects');
    const filteredProjects = projects.filter(p => !(p.id === parseInt(req.params.id) && p.user_id === req.userId));
    await writeDB('projects', filteredProjects);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/projects/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const { is_favorite } = req.body;
    const projects = await readDB('projects');
    const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id) && p.user_id === req.userId);
    
    if (projectIndex === -1) return res.status(404).json({ error: 'Project not found' });
    
    projects[projectIndex].is_favorite = is_favorite;
    await writeDB('projects', projects);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/user/theme', authMiddleware, async (req, res) => {
  try {
    const { theme } = req.body;
    const users = await readDB('users');
    const userIndex = users.findIndex(u => u.id === req.userId);
    
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    
    users[userIndex].theme = theme;
    await writeDB('users', users);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    let user = await findUser({ id: req.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check and auto-downgrade if expired
    user = await checkPlanExpiry(user);
    
    const { id, email, name, picture, theme, plan, planExpiry } = user;
    res.json({ id, email, name, picture, theme, plan: plan || 'FREE', planExpiry });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin API endpoints (no auth required for admin panel)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await readDB('users');
    const projects = await readDB('projects');
    
    const usersWithStats = users.map(user => {
      const userProjects = projects.filter(p => p.user_id === user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        google_id: user.google_id,
        created_at: user.created_at,
        projectCount: userProjects.length
      };
    });
    
    res.json({ users: usersWithStats, total: usersWithStats.length });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/admin/projects', async (req, res) => {
  try {
    const projects = await readDB('projects');
    const users = await readDB('users');
    
    const enrichedProjects = projects.map(project => {
      const user = users.find(u => u.id === project.user_id);
      return {
        ...project,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'N/A'
      };
    }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    res.json({ projects: enrichedProjects, total: enrichedProjects.length });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const users = await readDB('users');
    const projects = await readDB('projects');
    
    res.json({
      totalUsers: users.length,
      totalProjects: projects.length,
      awsDeployments: projects.length,
      errorLogs: 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// DevOps Projects API
const DEVOPS_DB_PATH = path.join(__dirname, 'database', 'devops_projects.json');

const readDevOpsDB = async () => {
  try {
    const data = await fs.readFile(DEVOPS_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeDevOpsDB = async (data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    JSON.parse(jsonString);
    await fs.writeFile(DEVOPS_DB_PATH, jsonString);
  } catch (err) {
    console.error('Error writing devops database:', err);
    throw err;
  }
};

app.get('/api/devops-projects', async (req, res) => {
  try {
    const projects = await readDevOpsDB();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/devops-projects', async (req, res) => {
  try {
    const projects = await readDevOpsDB();
    const newProject = {
      id: Date.now().toString(),
      ...req.body
    };
    projects.push(newProject);
    await writeDevOpsDB(projects);
    res.json(newProject);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/devops-projects/:id', async (req, res) => {
  try {
    const projects = await readDevOpsDB();
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    
    projects[index] = { ...projects[index], ...req.body };
    await writeDevOpsDB(projects);
    res.json(projects[index]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/devops-projects/:id', async (req, res) => {
  try {
    const projects = await readDevOpsDB();
    const filtered = projects.filter(p => p.id !== req.params.id);
    await writeDevOpsDB(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Upgrade user plan
app.post('/api/user/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body; // 'MONTHLY', 'SIXMONTHS', 'YEARLY'
    const users = await readDB('users');
    const userIndex = users.findIndex(u => u.id === req.userId);
    
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    
    // Calculate expiry date
    const now = new Date();
    let expiryDate;
    if (plan === 'MONTHLY') {
      expiryDate = new Date(now.setMonth(now.getMonth() + 1));
    } else if (plan === 'SIXMONTHS') {
      expiryDate = new Date(now.setMonth(now.getMonth() + 6));
    } else if (plan === 'YEARLY') {
      expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    users[userIndex].plan = plan;
    users[userIndex].planExpiry = expiryDate.toISOString();
    await writeDB('users', users);
    
    res.json({ success: true, plan, planExpiry: expiryDate.toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit payment request
app.post('/api/payment-request', authMiddleware, async (req, res) => {
  try {
    const { plan, transactionId, amount } = req.body;
    const user = await findUser({ id: req.userId });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const paymentRequests = await readDB('payment_requests') || [];
    
    const newRequest = {
      id: paymentRequests.length + 1,
      userId: req.userId,
      userName: user.name,
      userEmail: user.email,
      plan,
      amount,
      transactionId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    paymentRequests.push(newRequest);
    await writeDB('payment_requests', paymentRequests);
    
    res.json({ success: true, message: 'Payment request submitted. Admin will verify shortly.' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: Get all payment requests
app.get('/api/admin/payment-requests', async (req, res) => {
  try {
    const paymentRequests = await readDB('payment_requests') || [];
    res.json({ requests: paymentRequests.reverse(), total: paymentRequests.length });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: Approve payment
app.post('/api/admin/approve-payment/:id', async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const paymentRequests = await readDB('payment_requests') || [];
    const requestIndex = paymentRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return res.status(404).json({ error: 'Request not found' });
    
    const request = paymentRequests[requestIndex];
    
    // Upgrade user
    const users = await readDB('users');
    const userIndex = users.findIndex(u => u.id === request.userId);
    
    if (userIndex !== -1) {
      const now = new Date();
      let expiryDate;
      
      if (request.plan === 'MONTHLY') {
        expiryDate = new Date(now.setMonth(now.getMonth() + 1));
      } else if (request.plan === 'SIXMONTHS') {
        expiryDate = new Date(now.setMonth(now.getMonth() + 6));
      } else if (request.plan === 'YEARLY') {
        expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
      }
      
      users[userIndex].plan = request.plan;
      users[userIndex].planExpiry = expiryDate.toISOString();
      await writeDB('users', users);
      
      // Update request status
      paymentRequests[requestIndex].status = 'APPROVED';
      paymentRequests[requestIndex].approvedAt = new Date().toISOString();
      await writeDB('payment_requests', paymentRequests);
      
      res.json({ success: true, message: 'Payment approved and user upgraded' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: Reject payment
app.post('/api/admin/reject-payment/:id', async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { reason } = req.body;
    const paymentRequests = await readDB('payment_requests') || [];
    const requestIndex = paymentRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return res.status(404).json({ error: 'Request not found' });
    
    paymentRequests[requestIndex].status = 'REJECTED';
    paymentRequests[requestIndex].rejectedAt = new Date().toISOString();
    paymentRequests[requestIndex].rejectionReason = reason;
    await writeDB('payment_requests', paymentRequests);
    
    res.json({ success: true, message: 'Payment request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
