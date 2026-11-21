/**
-- ==============================================================================
-- USE ORDERS HOOK (HOOK LAYER)
-- ==============================================================================
*/

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setLoading,
  setSubmitting,
  setError,
  setMyOrders,
  setOrderCreated,
  setOrderProofs,
  updateOrderStatus,
  clearCheckoutState,
} from '../state/slices/orderSlice';
import { orderService } from '../services/orderService';
import { proofService } from '../services/proofService';
import { DesignConfig, DesignData } from '../types';

export function useOrders() {
  const dispatch = useAppDispatch();
  const orderState = useAppSelector((s) => s.order);

  const checkoutOrder = useCallback(
    async (payload: {
      product_id: string;
      saved_design_id?: string;
      config_json: DesignConfig;
      design_json?: DesignData;
      csv_rows_json?: Record<string, string | number>[];
      quantity: number;
      payment_ref?: string;
    }) => {
      dispatch(setSubmitting(true));
      try {
        const res = await orderService.createOrder(payload);
        dispatch(setOrderCreated({ order: res.order, initialProof: res.initial_proof }));
        return res;
      } catch (err: any) {
        dispatch(setError(err.message || 'Order checkout failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const fetchMyOrders = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const orders = await orderService.listMyOrders();
      dispatch(setMyOrders(orders));
      return orders;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch orders'));
      return [];
    }
  }, [dispatch]);

  const fetchOrderProofs = useCallback(
    async (orderId: string) => {
      try {
        const proofs = await proofService.getOrderProofs(orderId);
        dispatch(setOrderProofs({ orderId, proofs }));
        return proofs;
      } catch {
        return [];
      }
    },
    [dispatch]
  );

  const submitProofRevision = useCallback(
    async (orderId: string, design_snapshot_json: DesignData) => {
      dispatch(setLoading(true));
      try {
        const newProof = await proofService.createProofRevision(orderId, { design_snapshot_json });
        dispatch(updateOrderStatus({ orderId, status: 'PROOF' }));
        fetchOrderProofs(orderId);
        dispatch(setLoading(false));
        return newProof;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to submit proof revision'));
        throw err;
      }
    },
    [dispatch, fetchOrderProofs]
  );

  const approveCustomerProof = useCallback(
    async (proofId: string, orderId: string) => {
      dispatch(setLoading(true));
      try {
        const res = await proofService.approveProof(proofId);
        dispatch(updateOrderStatus({ orderId, status: 'PRODUCTION', approvedProofId: proofId }));
        fetchOrderProofs(orderId);
        dispatch(setLoading(false));
        return res;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to approve proof'));
        throw err;
      }
    },
    [dispatch, fetchOrderProofs]
  );

  const requestProofChanges = useCallback(
    async (proofId: string, orderId: string, notes: string) => {
      dispatch(setLoading(true));
      try {
        const res = await proofService.requestChanges(proofId, notes);
        dispatch(updateOrderStatus({ orderId, status: 'ARTWORK' }));
        fetchOrderProofs(orderId);
        dispatch(setLoading(false));
        return res;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to request changes'));
        throw err;
      }
    },
    [dispatch, fetchOrderProofs]
  );

  const reorderPastOrder = useCallback(
    async (orderId: string) => {
      dispatch(setSubmitting(true));
      try {
        const res = await orderService.reorderOrder(orderId);
        dispatch(setOrderCreated({ order: res.order, initialProof: res.initial_proof }));
        return res;
      } catch (err: any) {
        dispatch(setError(err.message || 'Reorder failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const downloadInvoice = useCallback(async (orderId: string) => {
    try {
      const invoice = await orderService.downloadInvoice(orderId);
      return invoice;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to download invoice');
    }
  }, []);

  return {
    ...orderState,
    checkoutOrder,
    fetchMyOrders,
    fetchOrderProofs,
    submitProofRevision,
    approveCustomerProof,
    requestProofChanges,
    reorderPastOrder,
    downloadInvoice,
    resetCheckout: () => dispatch(clearCheckoutState()),
  };
}

