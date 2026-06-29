const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const PLAYERS = ['Martin', 'Joaquin', 'Pablo', 'Franco', 'Fede', 'Juan'];

app.use(express.json());

// Custom middleware to block direct HTML access
app.use((req, res, next) => {
  if (req.path.endsWith('.html') && req.path !== '/login.html' && req.path !== '/admin.html' && req.path !== '/view.html' && req.path !== '/index.html') {
    return res.status(404).send('Not found');
  }
  next();
});

// Serve static assets (CSS, JS, etc.)
app.use(express.static('public', {
  index: false
}));

// Session configuration
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production'
  }
});

sessionStore.on('error', function(error) {
  console.error('Session store error:', error);
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
  },
  name: 'prode.sid'
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    };
    return done(null, user);
  }
));

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  res.status(403).json({ error: 'Unauthorized' });
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

function calculatePoints(prediction, actual) {
  if (!actual) return 0;

  const [predHome, predAway] = prediction.split('-').map(Number);
  const [actHome, actAway] = actual.split('-').map(Number);

  if (predHome === actHome && predAway === actAway) {
    return 3;
  }

  const predOutcome = predHome > predAway ? 'home' : predHome < predAway ? 'away' : 'draw';
  const actOutcome = actHome > actAway ? 'home' : actHome < actAway ? 'away' : 'draw';

  if (predOutcome === actOutcome) {
    return 1;
  }

  return 0;
}

// Serve static files with route protection
app.get('/', (req, res) => {
  res.redirect('/view');
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.email === process.env.ADMIN_EMAIL) {
      return res.redirect('/admin');
    } else {
      return res.redirect('/view');
    }
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.redirect('/view');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

app.get('/index.html', (req, res) => {
  res.redirect('/view');
});

// Redirect old .html URLs to clean URLs
app.get('/login.html', (req, res) => res.redirect('/login'));
app.get('/admin.html', (req, res) => res.redirect('/admin'));
app.get('/view.html', (req, res) => res.redirect('/view'));

// Authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('OAuth callback - User:', req.user?.email);
    console.log('Session ID:', req.sessionID);
    console.log('Is authenticated:', req.isAuthenticated());

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/login');
      }

      if (req.user.email === process.env.ADMIN_EMAIL) {
        res.redirect('/admin');
      } else {
        res.redirect('/view');
      }
    });
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect('/login');
  });
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      isAdmin: req.user.email === process.env.ADMIN_EMAIL,
      user: {
        name: req.user.name,
        email: req.user.email
      }
    });
  } else {
    res.json({ authenticated: false, isAdmin: false });
  }
});

// Public routes
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await db.getMatches();
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.get('/api/rankings', async (req, res) => {
  try {
    const matches = await db.getMatches();

    const rankings = PLAYERS.map(player => {
      let points = 0;
      let exactos = 0;
      let acertados = 0;
      let errados = 0;

      matches.forEach(match => {
        const prediction = match.predictions[player];
        if (prediction && match.actualResult) {
          const pts = calculatePoints(prediction, match.actualResult);
          points += pts;

          if (pts === 3) {
            exactos++;
            acertados++;
          } else if (pts === 1) {
            acertados++;
          } else {
            errados++;
          }
        }
      });

      return { player, points, exactos, acertados, errados };
    });

    rankings.sort((a, b) => b.points - a.points);
    res.json(rankings);
  } catch (error) {
    console.error('Error calculating rankings:', error);
    res.status(500).json({ error: 'Failed to calculate rankings' });
  }
});

// Protected admin routes
app.post('/api/matches', isAdmin, async (req, res) => {
  try {
    const { teamA, teamB } = req.body;
    const nextId = await db.getNextMatchId();

    const match = {
      id: nextId,
      teamA,
      teamB,
      actualResult: null,
      predictions: {}
    };

    PLAYERS.forEach(player => {
      match.predictions[player] = null;
    });

    await db.createMatch(match);
    res.json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

app.put('/api/matches/:id/prediction', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { player, prediction } = req.body;

    const update = {};
    update[`predictions.${player}`] = prediction;

    const match = await db.updateMatch(id, update);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    console.error('Error updating prediction:', error);
    res.status(500).json({ error: 'Failed to update prediction' });
  }
});

app.put('/api/matches/:id/result', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = req.body;

    const match = await db.updateMatch(id, { actualResult: result });
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'Failed to update result' });
  }
});

app.delete('/api/matches/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteMatch(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

// Initialize database connection and start server
db.connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`World Cup Tracker running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
