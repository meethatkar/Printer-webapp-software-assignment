/**
-- ==============================================================================
-- DESIGNER SLICE (STATE LAYER)
-- ==============================================================================
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasElement, DesignConfig, SavedDesign } from '../../types';

export interface DesignerState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  uploadedFileUrl: string | null;
  uploadedFileName: string | null;
  csvRows: Record<string, string>[];
  csvHeaders: string[];
  activeCsvRowIndex: number;
  config: DesignConfig;
  savedDesigns: SavedDesign[];
  activeTab: 'designer' | 'upload' | 'csv';
  previewProof: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: DesignerState = {
  elements: [
    {
      id: 'default-text',
      type: 'text',
      text: 'Your Custom Text',
      x: 10,
      y: 15,
      fontSize: 14,
      fontFamily: 'Inter',
      fill: '#18181B',
      rotation: 0,
    },
  ],
  selectedElementId: 'default-text',
  uploadedFileUrl: null,
  uploadedFileName: null,
  csvRows: [],
  csvHeaders: [],
  activeCsvRowIndex: 0,
  config: {
    width_mm: 85,
    height_mm: 55,
    material_id: 'default',
    orientation: 'landscape',
    double_sided: false,
  },
  savedDesigns: [],
  activeTab: 'designer',
  previewProof: false,
  loading: false,
  error: null,
};

export const designerSlice = createSlice({
  name: 'designer',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setConfig(state, action: PayloadAction<Partial<DesignConfig>>) {
      state.config = { ...state.config, ...action.payload };
    },
    setElements(state, action: PayloadAction<CanvasElement[]>) {
      state.elements = action.payload;
    },
    addElement(state, action: PayloadAction<CanvasElement>) {
      state.elements.push(action.payload);
      state.selectedElementId = action.payload.id;
    },
    updateElement(state, action: PayloadAction<{ id: string; updates: Partial<CanvasElement> }>) {
      const idx = state.elements.findIndex((el) => el.id === action.payload.id);
      if (idx !== -1) {
        state.elements[idx] = { ...state.elements[idx], ...action.payload.updates };
      }
    },
    removeElement(state, action: PayloadAction<string>) {
      state.elements = state.elements.filter((el) => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = state.elements[0]?.id || null;
      }
    },
    setSelectedElementId(state, action: PayloadAction<string | null>) {
      state.selectedElementId = action.payload;
    },
    setUploadedArtwork(state, action: PayloadAction<{ url: string; name: string }>) {
      state.uploadedFileUrl = action.payload.url;
      state.uploadedFileName = action.payload.name;
    },
    setCsvData(state, action: PayloadAction<{ headers: string[]; rows: Record<string, string>[] }>) {
      state.csvHeaders = action.payload.headers;
      state.csvRows = action.payload.rows;
      state.activeCsvRowIndex = 0;
    },
    setActiveCsvRowIndex(state, action: PayloadAction<number>) {
      state.activeCsvRowIndex = action.payload;
    },
    setActiveTab(state, action: PayloadAction<'designer' | 'upload' | 'csv'>) {
      state.activeTab = action.payload;
    },
    togglePreviewProof(state) {
      state.previewProof = !state.previewProof;
    },
    setSavedDesigns(state, action: PayloadAction<SavedDesign[]>) {
      state.savedDesigns = action.payload;
      state.loading = false;
    },
    addSavedDesign(state, action: PayloadAction<SavedDesign>) {
      state.savedDesigns.unshift(action.payload);
    },
    loadSavedDesign(state, action: PayloadAction<SavedDesign>) {
      state.config = action.payload.config_json;
      state.elements = action.payload.design_json?.elements || [];
      state.uploadedFileUrl = action.payload.uploaded_file_url || null;
    },
  },
});

export const {
  setLoading,
  setError,
  setConfig,
  setElements,
  addElement,
  updateElement,
  removeElement,
  setSelectedElementId,
  setUploadedArtwork,
  setCsvData,
  setActiveCsvRowIndex,
  setActiveTab,
  togglePreviewProof,
  setSavedDesigns,
  addSavedDesign,
  loadSavedDesign,
} = designerSlice.actions;

export default designerSlice.reducer;

