/**
-- ==============================================================================
-- USE DESIGNER HOOK (HOOK LAYER)
-- ==============================================================================
*/

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setLoading,
  setError,
  setConfig,
  setElements,
  addElement as sliceAddElement,
  updateElement as sliceUpdateElement,
  removeElement as sliceRemoveElement,
  setSelectedElementId,
  setUploadedArtwork,
  setCsvData,
  setActiveCsvRowIndex,
  setActiveTab,
  togglePreviewProof,
  setSavedDesigns,
  addSavedDesign,
  loadSavedDesign as sliceLoadSavedDesign,
} from '../state/slices/designerSlice';
import { designService } from '../services/designService';
import { CanvasElement, DesignConfig, SavedDesign } from '../types';

export function useDesigner() {
  const dispatch = useAppDispatch();
  const designerState = useAppSelector((s) => s.designer);

  const updateDimensions = useCallback(
    (width_mm: number, height_mm: number, minW = 20, maxW = 1200, minH = 20, maxH = 1200) => {
      const clampedW = Math.max(minW, Math.min(maxW, width_mm));
      const clampedH = Math.max(minH, Math.min(maxH, height_mm));
      dispatch(setConfig({ width_mm: clampedW, height_mm: clampedH }));
    },
    [dispatch]
  );

  const updateMaterial = useCallback(
    (material_id: string) => {
      dispatch(setConfig({ material_id }));
    },
    [dispatch]
  );

  const updateOrientation = useCallback(
    (orientation: 'portrait' | 'landscape') => {
      dispatch(setConfig({ orientation }));
    },
    [dispatch]
  );

  const addTextElement = useCallback(
    (text = 'New Text', x = 15, y = 20, fontSize = 12) => {
      const newEl: CanvasElement = {
        id: `el-${Date.now()}`,
        type: 'text',
        text,
        x,
        y,
        fontSize,
        fontFamily: 'Inter',
        fill: '#18181B',
        rotation: 0,
      };
      dispatch(sliceAddElement(newEl));
    },
    [dispatch]
  );

  const updateElementProps = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      dispatch(sliceUpdateElement({ id, updates }));
    },
    [dispatch]
  );

  const deleteElement = useCallback(
    (id: string) => {
      dispatch(sliceRemoveElement(id));
    },
    [dispatch]
  );

  const selectElement = useCallback(
    (id: string | null) => {
      dispatch(setSelectedElementId(id));
    },
    [dispatch]
  );

  const uploadArtworkFile = useCallback(
    async (file: File) => {
      dispatch(setLoading(true));
      try {
        const res = await designService.uploadArtwork({
          fileName: file.name,
          contentType: file.type || 'application/pdf',
        });
        dispatch(setUploadedArtwork({ url: res.file_url, name: file.name }));
        dispatch(setLoading(false));
        return res.file_url;
      } catch (err: any) {
        dispatch(setError(err.message || 'Artwork upload failed'));
        return null;
      }
    },
    [dispatch]
  );

  const parseCsv = useCallback(
    async (csvText: string) => {
      dispatch(setLoading(true));
      try {
        const res = await designService.parseCsvVariables(csvText);
        dispatch(setCsvData({ headers: res.headers, rows: res.rows }));
        dispatch(setLoading(false));
        return res;
      } catch (err: any) {
        dispatch(setError(err.message || 'CSV parse failed'));
        return null;
      }
    },
    [dispatch]
  );

  const saveCurrentDesign = useCallback(
    async (productId: string, title: string) => {
      dispatch(setLoading(true));
      try {
        const saved = await designService.saveDesign({
          product_id: productId,
          title,
          config_json: designerState.config,
          design_json: {
            elements: designerState.elements,
          },
          uploaded_file_url: designerState.uploadedFileUrl || undefined,
        });
        dispatch(addSavedDesign(saved));
        dispatch(setLoading(false));
        return saved;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to save design'));
        throw err;
      }
    },
    [dispatch, designerState.config, designerState.elements, designerState.uploadedFileUrl]
  );

  const fetchMySavedDesigns = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const list = await designService.listMyDesigns();
      dispatch(setSavedDesigns(list));
      return list;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch saved designs'));
      return [];
    }
  }, [dispatch]);

  const loadDesign = useCallback(
    (design: SavedDesign) => {
      dispatch(sliceLoadSavedDesign(design));
    },
    [dispatch]
  );

  return {
    ...designerState,
    selectedElement: designerState.elements.find((el) => el.id === designerState.selectedElementId) || null,
    updateDimensions,
    updateMaterial,
    updateOrientation,
    addTextElement,
    updateElementProps,
    deleteElement,
    selectElement,
    uploadArtworkFile,
    parseCsv,
    setActiveCsvIndex: (idx: number) => dispatch(setActiveCsvRowIndex(idx)),
    setTab: (tab: 'designer' | 'upload' | 'csv') => dispatch(setActiveTab(tab)),
    toggleProof: () => dispatch(togglePreviewProof()),
    saveCurrentDesign,
    fetchMySavedDesigns,
    loadDesign,
  };
}

