/**
-- ==============================================================================
-- REDUX STORE CONFIGURATION (STATE LAYER)
-- ==============================================================================
*/

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import catalogueReducer from './slices/catalogueSlice';
import designerReducer from './slices/designerSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalogue: catalogueReducer,
    designer: designerReducer,
    order: orderReducer,
    admin: adminReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

