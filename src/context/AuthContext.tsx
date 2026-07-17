import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
//import { User } from '../lib';
import type { User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8009/api';

const TOKEN_KEY = 'auth_token';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

const setStoredToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getAuthHeaders = () => {
  const token = getStoredToken();

  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};


// Helper to extract the user object from a few common response shapes:
// { status, data: { id, name, role } }
// { status, user: { id, name, role } }
// { id, name, role } (user returned directly)
const isUserLike = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === 'object' &&
  'id' in value &&
  'name' in value;

const extractUser = (data: unknown): Record<string, unknown> | null => {
  if (!data || typeof data !== 'object') return null;

  const candidate =
    ('data' in data && data.data) || ('user' in data && data.user) || null;

  if (isUserLike(candidate)) {
    return candidate;
  }

  // Some backends return the user object at the top level of the response.
  if (isUserLike(data)) {
    return data;
  }

  return null;
};

// Helper to extract the access token whether it is at the top level
// or nested inside a `data` object.
const extractAccessToken = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') return null;

  const topLevel = 'access_token' in data ? data.access_token : null;
  if (typeof topLevel === 'string') return topLevel;

  const nested = 'data' in data && data.data && typeof data.data === 'object'
    ? (data.data as Record<string, unknown>).access_token
    : null;

  return typeof nested === 'string' ? nested : null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------
   * Restore session on page refresh
   * --------------------------------------------- */
  useEffect(() => {
    const checkSession = async () => {
      const token = getStoredToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/illovo/auth/me`;
        console.log('[Auth] Validating session at:', url);

        const res = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include',
        });

        if (!res.ok) {
          console.warn('[Auth] Session check failed with status:', res.status, res.statusText);

          // Only clear the token if the server explicitly rejected it (401).
          // Other failures (CORS, 500, network) should not destroy a potentially valid session.
          if (res.status === 401) {
            clearStoredToken();
          }
          setUser(null);
          return;
        }

        const data = await res.json();
        const sessionUser = extractUser(data);

        if (sessionUser) {
          console.log('[Auth] Session restored for:', sessionUser.name ?? sessionUser.email);
          setUser(sessionUser);
        } else {
          console.warn('[Auth] Session check returned no user:', data);
          clearStoredToken();
          setUser(null);
        }
      } catch (error) {
        console.error('[Auth] Session check network/error:', error);
        // Don't clear token on network/CORS errors; the token may still be valid.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  /* ---------------------------------------------
   * LOGIN
   * --------------------------------------------- */
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/illovo/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Handle error status codes explicitly
      switch (res.status) {
        case 401:
          return { success: false, error: 'Invalid email or password.' };
        case 403:
          return { success: false, error: data.message || 'Your account has been suspended. Please contact support.' };
        case 422:
          return { success: false, error: data.message || 'Please check your input and try again.' };
        case 500:
          return { success: false, error: 'A server error occurred. Please try again later.' };
      }

      if (!res.ok) {
        return { success: false, error: data.message || 'Login failed. Please try again.' };
      }

      if (data.status === 'success') {
        const token = extractAccessToken(data);

        if (!token) {
          return {
            success: false,
            error: 'Login succeeded but no access token was returned.',
          };
        }

        setStoredToken(token);

        const sessionUser = extractUser(data);
        setUser(sessionUser);

        return { success: true };
      }

      return { success: false, error: data.message || 'Login failed.' };

    } catch {
      return { success: false, error: 'Unable to reach the server. Check your connection.' };
    }
  };

  /* ---------------------------------------------
   * REGISTER
   * --------------------------------------------- */
  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API_BASE}/illovo/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setUser(extractUser(data));
        return { success: true };
      }

      return {
        success: false,
        error: data.message || data.error || 'Registration failed.',
      };
    } catch {
      return { success: false, error: 'Unable to reach the server. Check your connection.' };
    }
  };

  /* ---------------------------------------------
   * LOGOUT
   * --------------------------------------------- */
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/illovo/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch {
      // Logout failed silently — clear user regardless
    } finally {
      clearStoredToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------------------------------------
 * Hook
 * --------------------------------------------- */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}