/**
-- ==============================================================================
-- DESIGN SERVICE (SERVICE LAYER)
-- ==============================================================================
*/

import { apiClient } from './apiClient';
import { SavedDesign, DesignConfig, DesignData } from '../types';

export interface CsvParseResponse {
  total_rows: number;
  headers: string[];
  preview: Record<string, string>[];
  rows: Record<string, string>[];
}

export const designService = {
  async listMyDesigns(): Promise<SavedDesign[]> {
    return apiClient<SavedDesign[]>('/api/designs');
  },

  async saveDesign(payload: {
    product_id: string;
    title: string;
    config_json: DesignConfig;
    design_json: DesignData;
    uploaded_file_url?: string;
  }): Promise<SavedDesign> {
    return apiClient<SavedDesign>('/api/designs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async uploadArtwork(payload: { fileName: string; contentType: string }): Promise<{ file_url: string }> {
    return apiClient<{ file_url: string }>('/api/designs/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async parseCsvVariables(csvContent: string): Promise<CsvParseResponse> {
    return apiClient<CsvParseResponse>('/api/designs/parse-csv', {
      method: 'POST',
      body: JSON.stringify({ csvContent }),
    });
  },
};

