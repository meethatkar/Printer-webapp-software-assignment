/**
-- ==============================================================================
-- USE CATALOGUE HOOK (HOOK LAYER)
-- ==============================================================================
*/

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setLoading,
  setError,
  setDivisions,
  setActiveProduct,
  setGallery,
  setQuote,
} from '../state/slices/catalogueSlice';
import { catalogueService } from '../services/catalogueService';

export function useCatalogue() {
  const dispatch = useAppDispatch();
  const { divisions, activeProduct, templates, gallery, quote, loading, error } = useAppSelector(
    (s) => s.catalogue
  );

  const fetchDivisions = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await catalogueService.getDivisions();
      dispatch(setDivisions(data));
      return data;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch divisions'));
      return [];
    }
  }, [dispatch]);

  const fetchProductBySlug = useCallback(
    async (slug: string) => {
      dispatch(setLoading(true));
      try {
        const data = await catalogueService.getProductBySlug(slug);
        dispatch(setActiveProduct(data));
        return data;
      } catch (err: any) {
        dispatch(setError(err.message || `Failed to fetch product '${slug}'`));
        return null;
      }
    },
    [dispatch]
  );

  const fetchGallery = useCallback(
    async (division?: string) => {
      dispatch(setLoading(true));
      try {
        const items = await catalogueService.getGallery(division);
        dispatch(setGallery(items));
        return items;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to fetch gallery items'));
        return [];
      }
    },
    [dispatch]
  );

  const calculatePrice = useCallback(
    async (payload: {
      product_id: string;
      width_mm: number;
      height_mm: number;
      quantity: number;
      material_id: string;
      double_sided?: boolean;
    }) => {
      try {
        const result = await catalogueService.calculatePrice(payload);
        dispatch(setQuote(result));
        return result;
      } catch (err: any) {
        dispatch(setError(err.message || 'Pricing calculation error'));
        return null;
      }
    },
    [dispatch]
  );

  return {
    divisions,
    activeProduct,
    templates,
    gallery,
    quote,
    loading,
    error,
    fetchDivisions,
    fetchProductBySlug,
    fetchGallery,
    calculatePrice,
  };
}

