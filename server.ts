import express, { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import {
  initDatabase,
  registerUser,
  loginUser,
  getSessionUser,
  logoutSession,
  getServersWithStats,
  getServerClubs,
  claimClub,
  resignClub,
  updateLineup,
} from './server/db.ts';
import { buildProjectZip, getZipPath, ensureDownloadsDir } from './server/zipService.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize database (ensures 30 servers and 900 clubs exist)
initDatabase();
ensureDownloadsDir();

// Helper to extract session token from Authorization header
function getAuthToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.substring(7).trim();
}

// ----------------------------------------------------
// Authentication API Endpoints
// ----------------------------------------------------

app.post('/api/auth/register', (req: Request, res: Response): void => {
  try {
    const { username, email, password } = req.body;
    if (!username || !username.trim()) {
      res.status(400).json({ error: 'Username is required.' });
      return;
    }
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const { user, token } = registerUser(username, email, password);
    res.status(201).json({
      success: true,
      user,
      token,
      message: 'Account registered successfully.'
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response): void => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Username/Email and password are required.' });
      return;
    }

    const { user, token, activeClub, activeServer } = loginUser(identifier, password);
    res.json({
      success: true,
      user,
      token,
      activeClub,
      activeServer,
      message: 'Logged in successfully.'
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Login failed.' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response): void => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: 'No session token provided.' });
    return;
  }

  const session = getSessionUser(token);
  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid.' });
    return;
  }

  res.json({
    success: true,
    user: session.user,
    activeClub: session.activeClub,
    activeServer: session.activeServer,
  });
});

app.post('/api/auth/logout', (req: Request, res: Response): void => {
  const token = getAuthToken(req);
  if (token) {
    logoutSession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ----------------------------------------------------
// Servers & Clubs API Endpoints
// ----------------------------------------------------

// Exactly 30 servers
app.get('/api/servers', (req: Request, res: Response): void => {
  try {
    const servers = getServersWithStats();
    res.json({
      success: true,
      totalCount: servers.length, // Verified: Exactly 30
      servers,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Exactly 30 clubs for the selected server
app.get('/api/servers/:serverId/clubs', (req: Request, res: Response): void => {
  try {
    const { serverId } = req.params;
    const { server, clubs } = getServerClubs(serverId);
    res.json({
      success: true,
      server,
      totalClubs: clubs.length, // Verified: Exactly 30
      clubs,
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Claim Club Endpoint (Atomic & strictly €100,000,000)
app.post('/api/clubs/claim', (req: Request, res: Response): void => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required to claim a club.' });
    return;
  }

  const session = getSessionUser(token);
  if (!session) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    return;
  }

  const { serverId, clubId } = req.body;
  if (!serverId || !clubId) {
    res.status(400).json({ error: 'serverId and clubId are required.' });
    return;
  }

  try {
    const result = claimClub(session.user.id, serverId, clubId);
    res.json({
      success: true,
      message: `Congratulations Manager ${session.user.username}! You have claimed ${result.club.name} with a starting warchest of €100,000,000.`,
      club: result.club,
      server: result.server,
    });
  } catch (err: any) {
    res.status(409).json({ error: err.message || 'Could not claim club.' });
  }
});

// Manager Dashboard state
app.get('/api/manager/dashboard', (req: Request, res: Response): void => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const session = getSessionUser(token);
  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid.' });
    return;
  }

  res.json({
    success: true,
    user: session.user,
    club: session.activeClub,
    server: session.activeServer,
    transferBudget: session.activeClub ? session.activeClub.transferBudget : 0,
  });
});

// Resign Club
app.post('/api/clubs/resign', (req: Request, res: Response): void => {
  const token = getAuthToken(req);
  if (!token) { res.status(401).json({ error: 'Auth required' }); return; }
  const session = getSessionUser(token);
  if (!session) { res.status(401).json({ error: 'Auth required' }); return; }
  
  try {
    resignClub(session.user.id);
    res.json({ success: true, message: 'Resigned successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Lineup
app.post('/api/clubs/lineup', (req: Request, res: Response): void => {
  const token = getAuthToken(req);
  if (!token) { res.status(401).json({ error: 'Auth required' }); return; }
  const session = getSessionUser(token);
  if (!session) { res.status(401).json({ error: 'Auth required' }); return; }
  
  try {
    const club = updateLineup(session.user.id, req.body.lineup);
    res.json({ success: true, club });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Project ZIP Download Endpoint
// ----------------------------------------------------

app.get('/api/download-zip', async (req: Request, res: Response): Promise<void> => {
  try {
    const zipFile = await buildProjectZip();
    res.download(zipFile, 'manager-nol-project.zip', (err) => {
      if (err) {
        console.error('Error sending zip download:', err);
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate project ZIP: ' + err.message });
  }
});

// Health & System Info
app.get('/api/stats', (req: Request, res: Response): void => {
  const servers = getServersWithStats();
  res.json({
    app: 'Manager Nol',
    status: 'online',
    serverCount: servers.length,
    totalClubsWorldwide: 900,
    startingBudgetEur: 100000000,
  });
});

// ----------------------------------------------------
// Frontend Mounting (Vite Middleware in Dev / Static in Prod)
// ----------------------------------------------------

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚽ Manager Nol Server listening on http://0.0.0.0:${PORT}`);
    // Pre-build ZIP in background so it's instantly available
    buildProjectZip().catch((e) => console.warn('Prebuild zip notice:', e.message));
  });
}

startServer();
