const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { db, auth } = require('./firebaseConfig');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret';

app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:4000'], credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'fallback-session-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const findUser = async (query) => {
  if (query.google_id) {
    const snapshot = await db.collection('users').where('google_id', '==', query.google_id).get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
  if (query.id) {
    const doc = await db.collection('users').doc(query.id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
  return null;
};

const createUser = async (userData) => {
  const newUser = { ...userData, theme: 'dark', plan: 'FREE', planExpiry: null, created_at: new Date().toISOString() };
  const docRef = await db.collection('users').add(newUser);
  return { id: docRef.id, ...newUser };
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await findUser({ google_id: profile.id });
      if (!user) {
        user = await createUser({
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));

  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3000' }), (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, JWT_SECRET);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
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
    const snapshot = await db.collection('projects').where('user_id', '==', req.userId).orderBy('updated_at', 'desc').get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

const checkPlanExpiry = async (user) => {
  if (user.plan !== 'FREE' && user.planExpiry && new Date() > new Date(user.planExpiry)) {
    await db.collection('users').doc(user.id).update({ plan: 'FREE', planExpiry: null });
    return { ...user, plan: 'FREE', planExpiry: null };
  }
  return user;
};

app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const { title, files, messages } = req.body;
    let user = await findUser({ id: req.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await checkPlanExpiry(user);

    const today = new Date().toDateString();
    const snapshot = await db.collection('projects').where('user_id', '==', req.userId).get();
    const todayProjects = snapshot.docs.filter(doc => new Date(doc.data().created_at).toDateString() === today);

    let dailyLimit = user.plan === 'MONTHLY' ? 20 : user.plan === 'SIXMONTHS' || user.plan === 'YEARLY' ? Infinity : 5;
    if (todayProjects.length >= dailyLimit) {
      return res.status(403).json({ error: 'Daily limit reached', message: `Your plan allows ${dailyLimit} projects per day. Upgrade for more!` });
    }

    const newProject = { user_id: req.userId, title, files, messages, is_favorite: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const docRef = await db.collection('projects').add(newProject);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { title, files, messages } = req.body;
    const docRef = db.collection('projects').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().user_id !== req.userId) return res.status(404).json({ error: 'Project not found' });
    await docRef.update({ title, files, messages, updated_at: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const docRef = db.collection('projects').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().user_id !== req.userId) return res.status(404).json({ error: 'Project not found' });
    await docRef.delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/projects/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const { is_favorite } = req.body;
    const docRef = db.collection('projects').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().user_id !== req.userId) return res.status(404).json({ error: 'Project not found' });
    await docRef.update({ is_favorite });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/user/theme', authMiddleware, async (req, res) => {
  try {
    const { theme } = req.body;
    await db.collection('users').doc(req.userId).update({ theme });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    let user = await findUser({ id: req.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await checkPlanExpiry(user);
    const { id, email, name, picture, theme, plan, planExpiry } = user;
    res.json({ id, email, name, picture, theme, plan: plan || 'FREE', planExpiry });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/devops-projects', async (req, res) => {
  try {
    const snapshot = await db.collection('devops_projects').get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/devops-projects', async (req, res) => {
  try {
    const docRef = await db.collection('devops_projects').add(req.body);
    res.json({ id: docRef.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/user/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const now = new Date();
    const expiryDate = plan === 'MONTHLY' ? new Date(now.setMonth(now.getMonth() + 1)) : plan === 'SIXMONTHS' ? new Date(now.setMonth(now.getMonth() + 6)) : plan === 'YEARLY' ? new Date(now.setFullYear(now.getFullYear() + 1)) : null;
    if (!expiryDate) return res.status(400).json({ error: 'Invalid plan' });
    await db.collection('users').doc(req.userId).update({ plan, planExpiry: expiryDate.toISOString() });
    res.json({ success: true, plan, planExpiry: expiryDate.toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/payment-request', authMiddleware, async (req, res) => {
  try {
    const { plan, transactionId, amount } = req.body;
    const user = await findUser({ id: req.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await db.collection('payment_requests').add({ userId: req.userId, userName: user.name, userEmail: user.email, plan, amount, transactionId, status: 'PENDING', createdAt: new Date().toISOString() });
    res.json({ success: true, message: 'Payment request submitted. Admin will verify shortly.' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
