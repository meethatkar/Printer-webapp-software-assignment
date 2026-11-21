/**
-- ==============================================================================
-- USE AUTH HOOK (HOOK LAYER)
-- ==============================================================================
*/

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setLoading,
  setError,
  setAuthSuccess,
  setUser,
  setNotifications,
  markNotificationAsRead as sliceMarkRead,
  markAllNotificationsAsRead as sliceMarkAllRead,
  logout as sliceLogout,
} from '../state/slices/authSlice';
import { authService } from '../services/authService';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, role, notifications, loading, error } = useAppSelector((s) => s.auth);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      dispatch(setLoading(true));
      try {
        const data = await authService.login(credentials);
        dispatch(setAuthSuccess({ user: data.profile || { id: data.user.id, email: data.user.email, role: 'customer' }, token: data.access_token }));
        return data;
      } catch (err: any) {
        dispatch(setError(err.message || 'Login failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const signup = useCallback(
    async (payload: { email: string; password: string; full_name?: string; company_name?: string }) => {
      dispatch(setLoading(true));
      try {
        const data = await authService.signup(payload);
        dispatch(setAuthSuccess({ user: data.profile || { id: data.user.id, email: data.user.email, role: 'customer' }, token: data.access_token }));
        return data;
      } catch (err: any) {
        dispatch(setError(err.message || 'Registration failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout().catch(() => {});
    } finally {
      dispatch(sliceLogout());
    }
  }, [dispatch]);

  const fetchProfile = useCallback(async () => {
    if (!token) return null;
    try {
      const profile = await authService.getProfile();
      dispatch(setUser(profile));
      return profile;
    } catch {
      return null;
    }
  }, [token, dispatch]);

  const updateProfile = useCallback(
    async (payload: { full_name?: string; company_name?: string }) => {
      dispatch(setLoading(true));
      try {
        const updated = await authService.updateProfile(payload);
        dispatch(setUser(updated));
        dispatch(setLoading(false));
        return updated;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to update profile'));
        throw err;
      }
    },
    [dispatch]
  );

  const fetchNotifications = useCallback(async () => {
    if (!token) return [];
    try {
      const items = await authService.getNotifications();
      dispatch(setNotifications(items));
      return items;
    } catch {
      return [];
    }
  }, [token, dispatch]);

  const markNotificationRead = useCallback(
    async (id: string) => {
      dispatch(sliceMarkRead(id));
      await authService.markNotificationRead(id).catch(() => {});
    },
    [dispatch]
  );

  const markAllNotificationsRead = useCallback(async () => {
    dispatch(sliceMarkAllRead());
    await authService.markAllNotificationsRead().catch(() => {});
  }, [dispatch]);

  return {
    user,
    token,
    role,
    isAuthenticated: Boolean(token && user),
    isAdmin: role === 'admin',
    notifications,
    unreadNotificationsCount: notifications.filter((n) => !n.is_read).length,
    loading,
    error,
    login,
    signup,
    logout,
    fetchProfile,
    updateProfile,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  };
}

