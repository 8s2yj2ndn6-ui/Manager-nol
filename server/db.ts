import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SERVERS_LIST, ServerDefinition } from './data/serverNames.ts';
import { generateAllClubs, ClubRecord } from './data/clubSeed.ts';

export type PlayerRank = 'Weak' | 'Average' | 'Strong' | 'Worldclass' | 'Top Tier';
export type StaminaCondition = 'Great' | 'Tired' | 'Exhausted';

export interface Player {
  id: string;
  name: string;
  rank: PlayerRank;
  stamina: number;
  condition: StaminaCondition;
}

export interface LineupConfig {
  formation: string;
  startingPlayers: { playerId: string; position: string; effort: 'Medium' | 'High' | 'Extreme' }[];
}

export interface ClubRecord {
  id: string;
  serverId: string;
  serverCode: string;
  name: string;
  shortCode: string;
  city: string;
  stadiumName: string;
  stadiumCapacity: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  foundedYear: number;
  managerId: string | null;
  managerUsername: string | null;
  transferBudget: number;
  claimedAt: string | null;
  squad: Player[];
  lineup: LineupConfig | null;
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  activeServerId: string | null;
  activeClubId: string | null;
}

export interface SessionRecord {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  version: number;
  servers: ServerDefinition[];
  clubs: Record<string, ClubRecord>; 
  users: Record<string, UserRecord>;
  sessions: Record<string, SessionRecord>;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

let db: DatabaseSchema | null = null;

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

export function initDatabase(): DatabaseSchema {
  if (db) return db;
  ensureDirectoryExists(DB_DIR);

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(raw);
      if (db && db.servers && db.servers.length === 30 && Object.keys(db.clubs).length === 900) {
        // Migration: ensure squad and lineup exist for existing clubs
        for (const clubId in db.clubs) {
          if (!db.clubs[clubId].squad) {
            db.clubs[clubId].squad = generateSquad();
            db.clubs[clubId].lineup = null;
          }
        }
        return db;
      }
    } catch (err) {
      console.warn('Error reading existing database, regenerating:', err);
    }
  }

  console.log('Seeding initial database...');
  const clubsList = generateAllClubs();
  const clubsMap: Record<string, ClubRecord> = {};
  for (const c of clubsList) {
    const squad = generateSquad();
    clubsMap[c.id] = { ...c, squad, lineup: null };
  }

  db = { version: 2, servers: SERVERS_LIST, clubs: clubsMap, users: {}, sessions: {} };
  saveDatabaseSync();
  return db;
}

export function saveDatabaseSync(): void {
  if (!db) return;
  ensureDirectoryExists(DB_DIR);
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

function generateSquad(): Player[] {
  const squad: Player[] = [];
  const names = ['Silva', 'Santos', 'Müller', 'Schmidt', 'Smith', 'Jones', 'Garcia', 'Hernandez', 'Kim', 'Tanaka', 'Ibrahim', 'Okonkwo', 'Rossi', 'Bianchi', 'Dupont', 'Martin', 'Petrov', 'Ivanov', 'Kovács', 'Nagy'];
  
  for (let i = 0; i < 22; i++) {
    squad.push({
      id: crypto.randomUUID(),
      name: `${names[i % names.length]} ${String.fromCharCode(65 + i)}`,
      rank: getRandomRank(),
      stamina: 100,
      condition: 'Great'
    });
  }
  return squad;
}

function getRandomRank(): PlayerRank {
  const rand = Math.random() * 100;
  if (rand < 25) return 'Weak';
  if (rand < 60) return 'Average';
  if (rand < 85) return 'Strong';
  if (rand < 97) return 'Worldclass';
  return 'Top Tier';
}

// Auth & Operations
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function registerUser(username: string, email: string, password: string) {
  const database = initDatabase();
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  for (const u of Object.values(database.users)) {
    if (u.username.toLowerCase() === cleanUsername.toLowerCase()) throw new Error('Username taken');
    if (u.email.toLowerCase() === cleanEmail) throw new Error('Email exists');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = `usr_${crypto.randomUUID()}`;

  const newUser: UserRecord = { id: userId, username: cleanUsername, email: cleanEmail, passwordHash, salt, createdAt: new Date().toISOString(), activeServerId: null, activeClubId: null };
  database.users[userId] = newUser;

  const token = crypto.randomBytes(32).toString('hex');
  database.sessions[token] = { token, userId, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };

  saveDatabaseSync();
  const { passwordHash: _, salt: __, ...safeUser } = newUser;
  return { user: safeUser, token };
}

export function loginUser(identifier: string, password: string) {
  const database = initDatabase();
  const cleanId = identifier.trim().toLowerCase();

  const user = Object.values(database.users).find((u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId);
  if (!user || hashPassword(password, user.salt) !== user.passwordHash) throw new Error('Invalid credentials');

  const token = crypto.randomBytes(32).toString('hex');
  database.sessions[token] = { token, userId: user.id, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };

  saveDatabaseSync();

  const activeClub = user.activeClubId ? database.clubs[user.activeClubId] || null : null;
  const activeServer = user.activeServerId ? database.servers.find(s => s.id === user.activeServerId) || null : null;

  const { passwordHash: _, salt: __, ...safeUser } = user;
  return { user: safeUser, token, activeClub, activeServer };
}

export function getSessionUser(token: string) {
  const database = initDatabase();
  const session = database.sessions[token];
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;

  const user = database.users[session.userId];
  if (!user) return null;

  const activeClub = user.activeClubId ? database.clubs[user.activeClubId] || null : null;
  const activeServer = user.activeServerId ? database.servers.find(s => s.id === user.activeServerId) || null : null;

  const { passwordHash: _, salt: __, ...safeUser } = user;
  return { user: safeUser, activeClub, activeServer };
}

export function logoutSession(token: string): void {
  const database = initDatabase();
  if (database.sessions[token]) {
    delete database.sessions[token];
    saveDatabaseSync();
  }
}

export function getServersWithStats() {
  const database = initDatabase();
  const countsByServer: Record<string, number> = {};
  for (const club of Object.values(database.clubs)) {
    if (club.managerId) countsByServer[club.serverId] = (countsByServer[club.serverId] || 0) + 1;
  }
  return database.servers.map((s) => ({ ...s, claimedClubs: countsByServer[s.id] || 0, totalClubs: 30 }));
}

export function getServerClubs(serverId: string) {
  const database = initDatabase();
  const server = database.servers.find((s) => s.id === serverId);
  if (!server) throw new Error('Server not found');
  const clubs = Object.values(database.clubs).filter((c) => c.serverId === serverId);
  return { server, clubs };
}

export function claimClub(userId: string, serverId: string, clubId: string): { club: ClubRecord; server: ServerDefinition } {
  const database = initDatabase();
  const user = database.users[userId];
  const server = database.servers.find((s) => s.id === serverId);
  const club = database.clubs[clubId];

  if (!user || !server || !club || club.serverId !== serverId) throw new Error('Invalid claim request');
  if (club.managerId) throw new Error('Club already claimed');

  club.managerId = userId;
  club.managerUsername = user.username;
  club.transferBudget = 100000000;
  club.claimedAt = new Date().toISOString();

  user.activeClubId = club.id;
  user.activeServerId = server.id;

  saveDatabaseSync();
  return { club, server };
}

export function resignClub(userId: string): void {
  const database = initDatabase();
  const user = database.users[userId];
  if (!user || !user.activeClubId) throw new Error('No club to resign from');

  const club = database.clubs[user.activeClubId];
  if (club) {
    club.managerId = null;
    club.managerUsername = null;
    club.lineup = null; // Clear lineup on resign
  }

  user.activeClubId = null;
  user.activeServerId = null;

  saveDatabaseSync();
}

export function updateLineup(userId: string, lineup: LineupConfig): ClubRecord {
  const database = initDatabase();
  const user = database.users[userId];
  if (!user || !user.activeClubId) throw new Error('No active club');

  const club = database.clubs[user.activeClubId];
  if (!club || club.managerId !== userId) throw new Error('Unauthorized');

  // Validate Lineup: 11 unique players belonging to club
  if (lineup.startingPlayers.length !== 11) throw new Error('Lineup must have 11 players');
  const playerIds = new Set(lineup.startingPlayers.map(p => p.playerId));
  if (playerIds.size !== 11) throw new Error('Duplicate players in lineup');
  
  const squadIds = new Set(club.squad.map(p => p.id));
  for (const pid of playerIds) {
    if (!squadIds.has(pid)) throw new Error('Player not in squad');
  }

  club.lineup = lineup;
  saveDatabaseSync();
  return club;
}
