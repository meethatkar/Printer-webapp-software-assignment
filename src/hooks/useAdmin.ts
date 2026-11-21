/**
-- ==============================================================================
-- USE ADMIN HOOK (HOOK LAYER)
-- Includes Staged Labor Illusion for print PDF generation:
-- 1. "Checking approval gate..."
-- 2. "Merging CSV variable rows..."
-- 3. "Rendering high-res PDF with bleed & crop marks..."
-- ==============================================================================
*/

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setLoading,
  setError,
  setAllOrders,
  setAnalytics,
  setUsers,
  setFilters,
  setActiveTab,
  setGeneratingState,
  updateAdminOrder,
} from '../state/slices/adminSlice';
import { adminService } from '../services/adminService';
import { PipelineStatus } from '../types';

export function useAdmin() {
  const dispatch = useAppDispatch();
  const adminState = useAppSelector((s) => s.admin);

  const fetchOrders = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const list = await adminService.listAllOrders(adminState.filters);
      dispatch(setAllOrders(list));
      return list;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch admin orders'));
      return [];
    }
  }, [dispatch, adminState.filters]);

  const advanceStage = useCallback(
    async (orderId: string, status: PipelineStatus) => {
      try {
        const updated = await adminService.advanceStage(orderId, status);
        dispatch(updateAdminOrder(updated));
        return updated;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to advance pipeline stage'));
        throw err;
      }
    },
    [dispatch]
  );

  const archiveOrder = useCallback(
    async (orderId: string, is_archived = true) => {
      try {
        await adminService.archiveOrder(orderId, is_archived);
        fetchOrders();
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to archive order'));
      }
    },
    [dispatch, fetchOrders]
  );

  const generatePrintFileWithLaborIllusion = useCallback(
    async (orderId: string) => {
      // Step 1: Checking approval gate
      dispatch(setGeneratingState({ orderId, step: 'Checking approval gate...' }));
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Merging CSV variable rows
      dispatch(setGeneratingState({ orderId, step: 'Merging CSV variable rows & fitting fonts...' }));
      await new Promise((r) => setTimeout(r, 700));

      // Step 3: Rendering high-res PDF
      dispatch(setGeneratingState({ orderId, step: 'Rendering high-res PDF with bleeds & crop marks...' }));

      try {
        const result = await adminService.generatePrintOutput(orderId);
        dispatch(setGeneratingState({ orderId: null, step: null }));
        return result;
      } catch (err: any) {
        dispatch(setError(err.message || 'Print file generation failed. Ensure proof is approved.'));
        dispatch(setGeneratingState({ orderId: null, step: null }));
        throw err;
      }
    },
    [dispatch]
  );

  const downloadPrintFile = useCallback(async (orderId: string) => {
    try {
      const res = await adminService.downloadPrintFile(orderId);
      return res;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to download print file');
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await adminService.getAnalytics();
      dispatch(setAnalytics(data));
      return data;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch analytics'));
      return null;
    }
  }, [dispatch]);

  const exportXero = useCallback(async () => {
    try {
      const res = await adminService.exportXeroOrders();
      return res;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to export Xero data');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const users = await adminService.listUsers();
      dispatch(setUsers(users));
      return users;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch users'));
      return [];
    }
  }, [dispatch]);

  const updateUserRole = useCallback(
    async (userId: string, role: 'customer' | 'admin') => {
      try {
        const updated = await adminService.updateUserRole(userId, role);
        fetchUsers();
        return updated;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to update user role'));
        throw err;
      }
    },
    [dispatch, fetchUsers]
  );

  return {
    ...adminState,
    fetchOrders,
    advanceStage,
    archiveOrder,
    generatePrintFileWithLaborIllusion,
    downloadPrintFile,
    fetchAnalytics,
    exportXero,
    fetchUsers,
    updateUserRole,
    setFilterState: (filters: Partial<typeof adminState.filters>) => dispatch(setFilters(filters)),
    setTab: (tab: 'pipeline' | 'analytics' | 'users') => dispatch(setActiveTab(tab)),
  };
}

