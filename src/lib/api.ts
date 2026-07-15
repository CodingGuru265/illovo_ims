// src/lib/api.ts

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type UserRole = 'Admin' | 'User' | 'admin' | 'user' | string;

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export interface LoginResponseData {
  id: number;
  name: string;
  role: UserRole;
  access_token: string;
  session_token: string;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error' | string;
  msg?: string;
  message?: string;
  data?: T;
  errors?: unknown;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  access_token?: string;
  session_token?: string;
  error?: string;
}

export interface DashboardData {
  server_rack_1_temp_hot_aisle: number | null;
  server_rack_1_humi_hot_aisle: number | null;
  server_rack_1_temp_cold_aisle: number | null;
  server_rack_1_humi_cold_aisle: number | null;
  server_rack_1_temp_lower_threshold: number | null;
  server_rack_1_temp_upper_threshold: number | null;
  server_rack_2_temp_hot_aisle: number | null;
  server_rack_2_humi_hot_aisle: number | null;
  server_rack_2_temp_cold_aisle: number | null;
  server_rack_2_humi_cold_aisle: number | null;
  server_rack_2_temp_lower_threshold: number | null;
  server_rack_2_temp_upper_threshold: number | null;
  average_temp: number;
  average_humi: number;
  last_posted_data: string | null;
}

export interface UserApiItem {
  id: string;
  user_role: string;
  email: string;
  name: string;
  phone_number: string | null;
  last_logged_in: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  user_role: string;
  phone_number?: string | null;
  password: string;
  password_confirmation?: string;
}

export interface CreateUserResult {
  success: boolean;
  user?: UserApiItem;
  error?: string;
}

export interface ReportsParams {
  rack: string;
  aisle: string;
  from_date: string;
  to_date: string;
}

export interface ReportsDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

export interface ReportsResponse {
  data: ReportsDataPoint[];
  thresholds: {
    temp_upper: number;
    temp_lower: number;
    humi_upper: number;
    humi_lower: number;
  };
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8009/api';

const TOKEN_KEY = 'auth_token';

// ============================================================================
// TOKEN HELPERS
// ============================================================================

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export const getAuthHeaders = (): HeadersInit => {
  const token = authStorage.getToken();

  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ============================================================================
// API IMPLEMENTATION
// ============================================================================

export const api = {
  // ---------- AUTH ----------

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_BASE}/illovo/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result: ApiResponse<LoginResponseData> = await response.json();

      if (!response.ok || result.status !== 'success' || !result.data) {
        return {
          success: false,
          error: result.msg || result.message || 'Login failed.',
        };
      }

      const { id, name, role, access_token, session_token } = result.data;

      const user: User = {
        id,
        name,
        role,
      };

      authStorage.setToken(access_token);

      return {
        success: true,
        user,
        access_token,
        session_token,
      };
    } catch {
      return {
        success: false,
        error: 'Unable to reach the server. Check your connection.',
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE}/illovo/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        authStorage.clearToken();
        return null;
      }

      const result = await response.json();

      const user = result?.data ?? result?.user ?? null;

      if (!user) {
        authStorage.clearToken();
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        role: user.role ?? 'User',
      };
    } catch {
      authStorage.clearToken();
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/illovo/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      authStorage.clearToken();
    }
  },

  async getDashboard(): Promise<DashboardData | null> {
    try {
      const response = await fetch(`${API_BASE}/illovo/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error('Dashboard API returned status:', response.status);
        return null;
      }

      const result: ApiResponse<DashboardData> = await response.json();
      return result.data ?? null;
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      return null;
    }
  },

  async getUsers(): Promise<UserApiItem[]> {
    try {
      const response = await fetch(`${API_BASE}/illovo/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error('Users API returned status:', response.status);
        return [];
      }

      const result: ApiResponse<UserApiItem[]> = await response.json();
      return result.data ?? [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  },

  async createUser(payload: CreateUserPayload): Promise<CreateUserResult> {
    try {
      const response = await fetch(`${API_BASE}/illovo/users`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse<UserApiItem> = await response.json();

      if (!response.ok || result.status === 'error') {
        return {
          success: false,
          error: result.msg || result.message || `Failed to create user (${response.status})`,
        };
      }

      return {
        success: true,
        user: result.data,
      };
    } catch {
      return {
        success: false,
        error: 'Unable to reach the server. Check your connection.',
      };
    }
  },

  async getReports(params: ReportsParams): Promise<ReportsResponse | null> {
    try {
      const query = new URLSearchParams({
        rack: params.rack,
        aisle: params.aisle,
        from_date: params.from_date,
        to_date: params.to_date,
      });

      const response = await fetch(`${API_BASE}/illovo/reports?${query.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error('Reports API returned status:', response.status);
        return null;
      }

      const result = (await response.json()) as {
        status?: string;
        data?: ReportsDataPoint[];
        thresholds?: ReportsResponse['thresholds'];
      };

      if (!Array.isArray(result.data)) {
        console.error('Reports API returned unexpected data shape:', result);
        return null;
      }

      return {
        data: result.data,
        thresholds: result.thresholds ?? {
          temp_upper: 25,
          temp_lower: 17,
          humi_upper: 44,
          humi_lower: 25,
        },
      };
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      return null;
    }
  },
};