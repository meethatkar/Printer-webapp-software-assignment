/**
-- ==============================================================================
-- ADMIN SLICE (STATE LAYER)
-- ==============================================================================
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, AdminAnalytics, User, PipelineStatus } from '../../types';

export interface AdminFilters {
  status?: PipelineStatus;
  is_archived?: boolean;
  search?: string;
}

export interface AdminState {
  allOrders: Order[];
  analytics: AdminAnalytics | null;
  users: User[];
  filters: AdminFilters;
  generatingOrderId: string | null;
  generationStep: string | null;
  activeTab: 'pipeline' | 'analytics' | 'users';
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  allOrders: [],
  analytics: null,
  users: [],
  filters: { is_archived: false },
  generatingOrderId: null,
  generationStep: null,
  activeTab: 'pipeline',
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
      state.generatingOrderId = null;
      state.generationStep = null;
    },
    setAllOrders(state, action: PayloadAction<Order[]>) {
      state.allOrders = action.payload;
      state.loading = false;
    },
    setAnalytics(state, action: PayloadAction<AdminAnalytics>) {
      state.analytics = action.payload;
      state.loading = false;
    },
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.loading = false;
    },
    setFilters(state, action: PayloadAction<Partial<AdminFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setActiveTab(state, action: PayloadAction<'pipeline' | 'analytics' | 'users'>) {
      state.activeTab = action.payload;
    },
    setGeneratingState(state, action: PayloadAction<{ orderId: string | null; step: string | null }>) {
      state.generatingOrderId = action.payload.orderId;
      state.generationStep = action.payload.step;
    },
    updateAdminOrder(state, action: PayloadAction<Order>) {
      const idx = state.allOrders.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) {
        state.allOrders[idx] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setAllOrders,
  setAnalytics,
  setUsers,
  setFilters,
  setActiveTab,
  setGeneratingState,
  updateAdminOrder,
} = adminSlice.actions;

export default adminSlice.reducer;

