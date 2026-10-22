import { User, ServerItem, ClubItem } from './types.ts';

const TOKEN_KEY = 'manager_nol_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to store token', err);
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove token', err);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  async register(username: string, email: string, password: string) {
    const data = await request<{ success: boolean; user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async login(identifier: string, password: string) {
    const data = await request<{
      success: boolean;
      user: User;
      token: string;
      activeClub: ClubItem | null;
      activeServer: ServerItem | null;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe() {
    return request<{
      success: boolean;
      user: User;
      activeClub: ClubItem | null;
      activeServer: ServerItem | null;
    }>('/api/auth/me');
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  async getServers() {
    return request<{ success: boolean; totalCount: number; servers: ServerItem[] }>('/api/servers');
  },

  async getServerClubs(serverId: string) {
    return request<{
      success: boolean;
      server: ServerItem;
      totalClubs: number;
      clubs: ClubItem[];
    }>(`/api/servers/${serverId}/clubs`);
  },

  async claimClub(serverId: string, clubId: string) {
    return request<{
      success: boolean;
      message: string;
      club: ClubItem;
      server: ServerItem;
    }>('/api/clubs/claim', {
      method: 'POST',
      body: JSON.stringify({ serverId, clubId }),
    });
  },

  async getDashboard() {
    return request<{
      success: boolean;
      user: User;
      club: ClubItem | null;
      server: ServerItem | null;
      transferBudget: number;
    }>('/api/manager/dashboard');
  },

  async getStats() {
    return request<{
      app: string;
      status: string;
      serverCount: number;
      totalClubsWorldwide: number;
      startingBudgetEur: number;
    }>('/api/stats');
  },
};
