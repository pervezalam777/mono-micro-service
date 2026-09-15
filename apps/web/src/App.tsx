import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { Suspense, lazy } from 'react';
import { injectAuthorReducer, isAuthorInjected } from './store/dynamicStore';

// Lazy load auth components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Lazy load author package (will inject reducer on first load)
const AuthorRoutes = lazy(() => {
  // Inject the author reducer when the package is first loaded
  if (!isAuthorInjected()) {
    injectAuthorReducer();
  }
  return import('@app/author').then((module) => ({ default: module.AuthorRoutes }));
});

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Author plugin routes - lazy loaded */}
        <Route
          path="/authors/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading author pages...</div>}>
                <AuthorRoutes />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Books routes */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Dashboard /> {/* Placeholder - to be implemented */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <Dashboard /> {/* Placeholder - to be implemented */}
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
