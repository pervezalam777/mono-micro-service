import { combineSlices, configureStore } from '@reduxjs/toolkit';
import authorsReducer from './authorsSlice';

// Use combineSlices for dynamic reducer injection support
const _combinedReducer = combineSlices({ authors: authorsReducer });

// Create the store with the combined reducer
export const authorStore = configureStore({
  reducer: _combinedReducer,
});

// Type definitions
export type AuthorRootState = ReturnType<typeof authorStore.getState>;
export type AuthorAppDispatch = typeof authorStore.dispatch;

// Export the combined reducer for dynamic injection
export const authorReducer = _combinedReducer;
