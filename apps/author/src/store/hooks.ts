import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AuthorRootState, AuthorAppDispatch } from './store';

// Typed hooks for the author store
export const useAppDispatch = () => useDispatch<AuthorAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AuthorRootState> = useSelector;
