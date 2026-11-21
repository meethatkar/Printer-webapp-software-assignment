'use client';

/**
-- ==============================================================================
-- REDUX PROVIDER CLIENT WRAPPER (STATE LAYER)
-- ==============================================================================
*/

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

export function StateProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

