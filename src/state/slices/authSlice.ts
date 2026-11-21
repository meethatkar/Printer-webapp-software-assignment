/**
-- ==============================================================================
-- AUTH SLICE (STATE LAYER)
-- ==============================================================================
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole, NotificationItem } from '../../types';

export interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
}

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('print_platform_token');
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('print_platform_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  token: getInitialToken(),
  role: initialUser?.role || null,
  notifications: [],
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setAuthSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('print_platform_token', action.payload.token);
        localStorage.setItem('print_platform_user', JSON.stringify(action.payload.user));
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.role = action.payload.role;
      if (typeof window !== 'undefined') {
        localStorage.setItem('print_platform_user', JSON.stringify(action.payload));
      }
    },
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.notifications = action.payload;
    },
    markNotificationAsRead(state, action: PayloadAction<string>) {
      const target = state.notifications.find((n) => n.id === action.payload);
      if (target) target.is_read = true;
    },
    markAllNotificationsAsRead(state) {
      state.notifications.forEach((n) => {
        n.is_read = true;
      });
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.notifications = [];
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('print_platform_token');
        localStorage.removeItem('print_platform_user');
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setAuthSuccess,
  setUser,
  setNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

