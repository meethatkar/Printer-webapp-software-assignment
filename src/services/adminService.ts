/**
-- ==============================================================================
-- ADMIN SERVICE (SERVICE LAYER)
-- ==============================================================================
*/

import { apiClient } from './apiClient';
import { Order, AdminAnalytics, User, PipelineStatus } from '../types';

export interface GeneratePrintResponse {
  file_name: string;
  row_count: number;
  file_size_bytes: number;
}

export interface PrintFileDownloadResponse {
  file_id: string;
  file_name: string;
  file_format: string;
  download_url: string;
  row_count: number;
}

export const adminService = {
  async listAllOrders(filters?: {
    status?: PipelineStatus;
    is_archived?: boolean;
    search?: string;
  }): Promise<Order[]> {
    return apiClient<Order[]>('/api/admin/orders', {
      params: filters,
    });
  },

  async advanceStage(orderId: string, status: PipelineStatus): Promise<Order> {
    return apiClient<Order>(`/api/admin/orders/${orderId}/advance`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async archiveOrder(orderId: string, is_archived = true): Promise<{ order_id: string; is_archived: boolean }> {
    return apiClient<{ order_id: string; is_archived: boolean }>(`/api/admin/orders/${orderId}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ is_archived }),
    });
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    return apiClient<AdminAnalytics>('/api/admin/analytics');
  },

  async exportXeroOrders(): Promise<{ invoices: any[]; count: number }> {
    return apiClient<{ invoices: any[]; count: number }>('/api/admin/reports/xero-export');
  },

  async listUsers(): Promise<User[]> {
    return apiClient<User[]>('/api/admin/users');
  },

  async updateUserRole(userId: string, role: 'customer' | 'admin'): Promise<User> {
    return apiClient<User>(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async generatePrintOutput(orderId: string): Promise<GeneratePrintResponse> {
    return apiClient<GeneratePrintResponse>(`/api/admin/orders/${orderId}/generate-print`, {
      method: 'POST',
    });
  },

  async downloadPrintFile(orderId: string): Promise<PrintFileDownloadResponse> {
    return apiClient<PrintFileDownloadResponse>(`/api/admin/orders/${orderId}/print-file`);
  },
};

