import { store } from './store';
import { authorsSlice, AuthorsState } from '@app/author';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * Tracks if the author reducer has been injected
 */
let isAuthorReducerInjected = false;

/**
 * Tracks the current root reducer being used
 */
let currentRootReducer: any = null;

/**
 * Inject the author reducer into the web app store
 * This enables lazy loading of author state management
 */
export function injectAuthorReducer() {
  if (isAuthorReducerInjected) {
    return;
  }

  // Create a new root reducer that includes authors
  const newRootReducer = combineReducers({
    auth: authReducer,
    authors: authorsSlice.reducer,
  }) as any;

  // Replace the reducer
  store.replaceReducer(newRootReducer);

  isAuthorReducerInjected = true;
  currentRootReducer = newRootReducer;
  console.log('[DynamicStore] Author reducer injected into store');
}

/**
 * Eject (remove) the author reducer from the web app store
 * This cleans up state when the author package is no longer needed
 */
export function ejectAuthorReducer() {
  if (!isAuthorReducerInjected) {
    return;
  }

  // Create a new root reducer without authors
  const newRootReducer = combineReducers({
    auth: authReducer,
  }) as any;

  // Replace the reducer
  store.replaceReducer(newRootReducer);

  isAuthorReducerInjected = false;
  currentRootReducer = newRootReducer;
  console.log('[DynamicStore] Author reducer ejected from store');
}

/**
 * Get the current state of the author slice
 * Returns null if reducer is not injected
 */
export function getAuthorState(): AuthorsState | null {
  if (!isAuthorReducerInjected) {
    return null;
  }
  // Type assertion is needed because TypeScript doesn't know authors is in the state
  // We use any here because the store type was created without authors
  const state: any = store.getState();
  return state.authors as AuthorsState;
}

/**
 * Check if author reducer is currently injected
 */
export function isAuthorInjected() {
  return isAuthorReducerInjected;
}

/**
 * Get the current root reducer
 * Useful for debugging or SSR scenarios
 */
export function getRootReducer() {
  return currentRootReducer;
}
