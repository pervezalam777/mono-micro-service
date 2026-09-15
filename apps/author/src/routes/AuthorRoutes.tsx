import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthorsPage } from '../pages/AuthorsPage';
import { AuthorDetailPage } from '../pages/AuthorDetailPage';

/**
 * AuthorRoutes - Self-contained routing for the author package
 * This component defines all routes related to authors and should be
 * integrated into the host application's routing structure.
 */
export function AuthorRoutes() {
  return (
    <Routes>
      {/* Author list page */}
      <Route path="/" element={<AuthorsPage />} />
      <Route path="/authors" element={<AuthorsPage />} />

      {/* Author detail pages */}
      <Route path="/authors/:id" element={<AuthorDetailPage />} />
      <Route path="/authors/:id/edit" element={<AuthorDetailPage />} />
      <Route path="/authors/new" element={<AuthorDetailPage isNew />} />

      {/* Redirect to authors list */}
      <Route path="*" element={<Navigate to="/authors" replace />} />
    </Routes>
  );
}
