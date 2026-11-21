/**
-- ==============================================================================
-- CATALOGUE SERVICE (SERVICE LAYER)
-- ==============================================================================
*/

import { apiClient } from './apiClient';
import { ProductDivision, Product, Template, GalleryItem, QuoteBreakdown } from '../types';

export interface ProductDetailResponse {
  product: Product;
  templates: Template[];
}

export const catalogueService = {
  async getDivisions(): Promise<ProductDivision[]> {
    return apiClient<ProductDivision[]>('/api/catalogue/divisions');
  },

  async getProductBySlug(slug: string): Promise<ProductDetailResponse> {
    return apiClient<ProductDetailResponse>(`/api/catalogue/products/${slug}`);
  },

  async getGallery(division?: string): Promise<GalleryItem[]> {
    return apiClient<GalleryItem[]>('/api/catalogue/gallery', {
      params: division ? { division } : undefined,
    });
  },

  async calculatePrice(payload: {
    product_id: string;
    width_mm: number;
    height_mm: number;
    quantity: number;
    material_id: string;
    double_sided?: boolean;
  }): Promise<QuoteBreakdown> {
    return apiClient<QuoteBreakdown>('/api/catalogue/calculate-price', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

