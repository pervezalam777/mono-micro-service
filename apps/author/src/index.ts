// Components
export { AuthorForm } from './components/AuthorForm';
export { AuthorCard } from './components/AuthorCard';
export { AuthorList } from './components/AuthorList';

// Pages
export { AuthorsPage } from './pages/AuthorsPage';
export { AuthorDetailPage } from './pages/AuthorDetailPage';

// Routes
export { AuthorRoutes } from './routes/AuthorRoutes';

// Hooks
export { useAuthors, useAuthor } from './hooks/useAuthors';

// Store
export { authorStore } from './store/store';
export type { AuthorRootState, AuthorAppDispatch } from './store/store';
export { authorsSlice, fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from './store/authorsSlice';
export type { AuthorsState } from './store/types';
export { authorReducer } from './store/store';

// Types - import first then re-export
import type { Author, AuthorFormProps, AuthorFormData, AuthorListProps, AuthorCardProps } from './types';
export type { Author, AuthorFormProps, AuthorFormData, AuthorListProps, AuthorCardProps };
