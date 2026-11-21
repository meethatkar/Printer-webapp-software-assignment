/**
-- ==============================================================================
-- AUTH & NOTIFICATIONS SERVICE (SERVICE LAYER)
-- ==============================================================================
*/

import { apiClient } from './apiClient';
import { User, NotificationItem } from '../types';

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string };
  profile: User;
}

export const authService = {
  async signup(payload: { email: string; password: string; full_name?: string; company_name?: string }): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  async getProfile(): Promise<User> {
    return apiClient<User>('/api/auth/profile');
  },

  async updateProfile(payload: { full_name?: string; company_name?: string }): Promise<User> {
    return apiClient<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return apiClient<NotificationItem[]>('/api/notifications');
  },

  async markNotificationRead(id: string): Promise<{ updated: boolean }> {
    return apiClient<{ updated: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllNotificationsRead(): Promise<{ updated: boolean }> {
    return apiClient<{ updated: boolean }>('/api/notifications/read-all', {
      method: 'PATCH',
    });
  },
};

