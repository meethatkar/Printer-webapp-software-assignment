/**
-- ==============================================================================
-- PROOF SERVICE (SERVICE LAYER)
-- ==============================================================================
*/

import { apiClient } from './apiClient';
import { ProofVersion, Order, DesignData } from '../types';

export interface ApproveProofResponse {
  proof: ProofVersion;
  order: Order;
  message: string;
}

export const proofService = {
  async getOrderProofs(orderId: string): Promise<ProofVersion[]> {
    return apiClient<ProofVersion[]>(`/api/orders/${orderId}/proofs`);
  },

  async createProofRevision(orderId: string, payload: {
    design_snapshot_json: DesignData;
    uploaded_file_url?: string;
  }): Promise<ProofVersion> {
    return apiClient<ProofVersion>(`/api/orders/${orderId}/proofs`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async approveProof(proofId: string): Promise<ApproveProofResponse> {
    return apiClient<ApproveProofResponse>(`/api/proofs/${proofId}/approve`, {
      method: 'POST',
    });
  },

  async requestChanges(proofId: string, notes: string): Promise<ProofVersion> {
    return apiClient<ProofVersion>(`/api/proofs/${proofId}/request-changes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },
};

