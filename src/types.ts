export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  activeServerId: string | null;
  activeClubId: string | null;
}

export interface ServerItem {
  id: string;
  code: string;
  name: string;
  region: string;
  continent: 'Europe' | 'Americas' | 'Asia-Pacific' | 'International';
  basePing: number;
  claimedClubs: number;
  totalClubs: number;
}

export interface ClubItem {
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
  transferBudget: number; // strictly 100,000,000
  claimedAt: string | null;
}

export type ViewState = 'landing' | 'servers' | 'clubs' | 'dashboard';
