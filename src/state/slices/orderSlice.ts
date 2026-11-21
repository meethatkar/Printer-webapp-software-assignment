/**
-- ==============================================================================
-- ORDER SLICE (STATE LAYER)
-- ==============================================================================
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, ProofVersion } from '../../types';

export interface OrderState {
  myOrders: Order[];
  activeOrderProofs: Record<string, ProofVersion[]>;
  lastCreatedOrder: Order | null;
  lastInitialProof: ProofVersion | null;
  submitting: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  myOrders: [],
  activeOrderProofs: {},
  lastCreatedOrder: null,
  lastInitialProof: null,
  submitting: false,
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSubmitting(state, action: PayloadAction<boolean>) {
      state.submitting = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.submitting = false;
      state.loading = false;
    },
    setMyOrders(state, action: PayloadAction<Order[]>) {
      state.myOrders = action.payload;
      state.loading = false;
    },
    setOrderCreated(state, action: PayloadAction<{ order: Order; initialProof: ProofVersion }>) {
      state.lastCreatedOrder = action.payload.order;
      state.lastInitialProof = action.payload.initialProof;
      state.myOrders.unshift(action.payload.order);
      state.submitting = false;
      state.error = null;
    },
    setOrderProofs(state, action: PayloadAction<{ orderId: string; proofs: ProofVersion[] }>) {
      state.activeOrderProofs[action.payload.orderId] = action.payload.proofs;
    },
    updateOrderStatus(state, action: PayloadAction<{ orderId: string; status: Order['pipeline_status']; approvedProofId?: string }>) {
      const order = state.myOrders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.pipeline_status = action.payload.status;
        if (action.payload.approvedProofId) {
          order.approved_proof_id = action.payload.approvedProofId;
        }
      }
    },
    clearCheckoutState(state) {
      state.lastCreatedOrder = null;
      state.lastInitialProof = null;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setError,
  setMyOrders,
  setOrderCreated,
  setOrderProofs,
  updateOrderStatus,
  clearCheckoutState,
} = orderSlice.actions;

export default orderSlice.reducer;

