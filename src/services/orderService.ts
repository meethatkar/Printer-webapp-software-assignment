/**
-- ==============================================================================
-- ORDER SERVICE (SERVICE LAYER)
-- ==============================================================================
*/

import { apiClient } from './apiClient';
import { Order, ProofVersion, QuoteBreakdown, DesignConfig, DesignData } from '../types';

export interface CreateOrderResponse {
  order: Order;
  initial_proof: ProofVersion;
  quote: QuoteBreakdown;
}

export interface InvoiceData {
  invoice_number: string;
  order_code: string;
  date: string;
  customer_name: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  payment_status: string;
  payment_ref?: string;
}

export const orderService = {
  async createOrder(payload: {
    product_id: string;
    saved_design_id?: string;
    config_json: DesignConfig;
    design_json?: DesignData;
    csv_rows_json?: Record<string, string | number>[];
    quantity: number;
    payment_ref?: string;
  }): Promise<CreateOrderResponse> {
    return apiClient<CreateOrderResponse>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listMyOrders(): Promise<Order[]> {
    return apiClient<Order[]>('/api/orders');
  },

  async getMyOrder(id: string): Promise<Order> {
    return apiClient<Order>(`/api/orders/${id}`);
  },

  async reorderOrder(id: string): Promise<CreateOrderResponse> {
    return apiClient<CreateOrderResponse>(`/api/orders/${id}/reorder`, {
      method: 'POST',
    });
  },

  async downloadInvoice(id: string): Promise<InvoiceData> {
    return apiClient<InvoiceData>(`/api/orders/${id}/invoice`);
  },
};

