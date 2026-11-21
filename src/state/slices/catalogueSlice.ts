/**
-- ==============================================================================
-- CATALOGUE SLICE (STATE LAYER)
-- ==============================================================================
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDivision, Product, Template, GalleryItem, QuoteBreakdown } from '../../types';

export interface CatalogueState {
  divisions: ProductDivision[];
  activeProduct: Product | null;
  templates: Template[];
  gallery: GalleryItem[];
  quote: QuoteBreakdown | null;
  loading: boolean;
  error: string | null;
}

const initialState: CatalogueState = {
  divisions: [],
  activeProduct: null,
  templates: [],
  gallery: [],
  quote: null,
  loading: false,
  error: null,
};

export const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setDivisions(state, action: PayloadAction<ProductDivision[]>) {
      state.divisions = action.payload;
      state.loading = false;
    },
    setActiveProduct(state, action: PayloadAction<{ product: Product; templates: Template[] }>) {
      state.activeProduct = action.payload.product;
      state.templates = action.payload.templates;
      state.loading = false;
      state.error = null;
    },
    setGallery(state, action: PayloadAction<GalleryItem[]>) {
      state.gallery = action.payload;
      state.loading = false;
    },
    setQuote(state, action: PayloadAction<QuoteBreakdown | null>) {
      state.quote = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setDivisions,
  setActiveProduct,
  setGallery,
  setQuote,
} = catalogueSlice.actions;

export default catalogueSlice.reducer;

