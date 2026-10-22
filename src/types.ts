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

export type PlayerRank = 'Weak' | 'Average' | 'Strong' | 'Worldclass' | 'Top Tier';
export type StaminaCondition = 'Great' | 'Tired' | 'Exhausted';
export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'ST';
export type PositionCategory = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker';

export interface Player {
  id: string;
  number: number;
  name: string;
  position: PlayerPosition;
  positionCategory: PositionCategory;
  rank: PlayerRank;
  age: number;
  nationality: string;
  preferredFoot: 'Right' | 'Left' | 'Both';
  stamina: number;
  condition: StaminaCondition;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface LineupConfig {
  formation: string;
  teamEffort: 'Medium' | 'High' | 'Extreme';
  startingPlayers: { playerId: string; position: string }[];
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
  squad: Player[];
  lineup: LineupConfig | null;
}

export type ViewState = 'landing' | 'servers' | 'clubs' | 'dashboard';
export type DashboardTab = 'tactics' | 'squad' | 'overview' | 'servers';
