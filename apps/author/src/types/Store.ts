import { Author } from './Author';

// Redux state types
export interface AuthorsState {
  items: Author[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface RootState {
  authors: AuthorsState;
}

export type AppDispatch = typeof import('../store/store').authorStore.dispatch;
