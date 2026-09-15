import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Initial reducer without authors - will be replaced when authors are injected
const initialReducer = {
  auth: authReducer,
};

export const store = configureStore({
  reducer: initialReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define types for store that supports dynamic injection
// These are used by the dynamicStore to manage reducer injection
export type DynamicThunkAction<R = void> = ThunkAction<R, RootState, unknown, Action<string>>;
