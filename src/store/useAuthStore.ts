import { create } from 'zustand';
import { User, AuthResponse, Role } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (authData: AuthResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hasRole: (allowedRoles: Role[]) => boolean;
}

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user_data');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = getStoredToken();
  const initialUser = getStoredUser();

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,

    setAuth: (authData) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authData.token);
        const userData: User = {
          id: authData.userId,
          username: authData.username,
          email: authData.email,
          role: authData.role,
        };
        localStorage.setItem('user_data', JSON.stringify(userData));
        set({ user: userData, token: authData.token, isAuthenticated: true });
      }
    },

    setUser: (user) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      set({ user });
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
      }
      set({ user: null, token: null, isAuthenticated: false });
    },

    hasRole: (allowedRoles: Role[]) => {
      const currentUser = get().user;
      if (!currentUser || !currentUser.role) return false;
      return allowedRoles.includes(currentUser.role);
    },
  };
});
