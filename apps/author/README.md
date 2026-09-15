# Author Package

A plugin-based React package for managing authors with lazy loading and dynamic Redux reducer injection.

## Features

- **Lazy Loading**: Components are loaded on-demand when the author routes are accessed
- **Dynamic Reducer Injection**: Redux reducer is injected into the host app's store only when needed
- **Self-Contained**: All routing, state management, and components are internal to the package
- **Zero Tight Coupling**: Works with any React app without deep integration

## Architecture

### Lazy Loading

The package uses React's `lazy()` and `Suspense` for code splitting:

```tsx
// In the host app
const AuthorRoutes = lazy(() => import('@app/author'));

<Suspense fallback={<div>Loading...</div>}>
  <AuthorRoutes />
</Suspense>
```

### Dynamic Reducer Injection

The Redux reducer is injected at runtime using Redux Toolkit's `replaceReducer`:

```tsx
// In the host app's dynamicStore.ts
export function injectAuthorReducer() {
  const newRootReducer = combineReducers({
    auth: authReducer,
    authors: authorsSlice.reducer,
  });
  store.replaceReducer(newRootReducer);
}
```

## Installation

### In Host App

1. Install the package:
```bash
npm install @app/author
```

2. Configure path mapping in `vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app/author': path.resolve(__dirname, '../author/src/index.ts'),
    },
  },
});
```

3. Configure TypeScript in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@app/author": ["../author/src/index.ts"]
    }
  }
}
```

4. Integrate routes:
```tsx
import { lazy, Suspense } from 'react';
import { AuthorRoutes } from '@app/author';
import { injectAuthorReducer, isAuthorInjected } from './store/dynamicStore';

const AuthorRoutesContainer = lazy(() => {
  if (!isAuthorInjected()) {
    injectAuthorReducer();
  }
  return import('@app/author').then(module => ({ default: module.AuthorRoutes }));
});

// In your App.tsx
<Route
  path="/authors/*"
  element={
    <Suspense fallback={<div>Loading author pages...</div>}>
      <AuthorRoutesContainer />
    </Suspense>
  }
/>
```

## Usage

### Importing Components

```tsx
import { AuthorForm, AuthorList, AuthorCard } from '@app/author';

// Use the components directly
<AuthorList />
<AuthorForm />
<AuthorCard author={author} />
```

### Using Hooks

```tsx
import { useAuthors, useAuthor } from '@app/author';

function MyComponent() {
  const { authors, loading, error, onCreate, onUpdate, onDelete } = useAuthors();
  
  // ... component logic
}
```

### Accessing Store

```tsx
import { authorStore } from '@app/author';

// Use the store directly if needed
authorStore.dispatch(fetchAuthors());
```

## File Structure

```
apps/author/
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── AuthorForm.tsx
│   │   ├── AuthorCard.tsx
│   │   └── AuthorList.tsx
│   ├── pages/         # Page containers
│   │   ├── AuthorsPage.tsx
│   │   └── AuthorDetailPage.tsx
│   ├── routes/        # Internal routing
│   │   └── AuthorRoutes.tsx
│   ├── store/         # Redux state management
│   │   ├── store.ts
│   │   ├── authorsSlice.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   ├── hooks/         # Custom React hooks
│   │   └── useAuthors.ts
│   ├── types/         # TypeScript types
│   │   ├── Author.ts
│   │   └── Store.ts
│   └── index.ts       # Plugin API entry point
└── vite.config.ts     # Vite configuration
```

## API Reference

### Components

| Component | Description |
|-----------|-------------|
| `AuthorForm` | Form for creating/editing authors |
| `AuthorCard` | Card display for author information |
| `AuthorList` | List view of all authors |

### Pages

| Page | Description |
|------|-------------|
| `AuthorsPage` | Main page for authors list view |
| `AuthorDetailPage` | Page for author detail/edit view |

### Routes

The package manages its own routing:

- `/authors` - List of all authors
- `/authors/:id` - Detail view for a specific author
- `/authors/new` - Form for creating a new author

### Hooks

| Hook | Description |
|------|-------------|
| `useAuthors()` | Hook for managing the authors collection |
| `useAuthor(id)` | Hook for managing a single author |

### Store

| Export | Description |
|--------|-------------|
| `authorStore` | Pre-configured Redux store |
| `authorsSlice` | Redux slice for author state |
| `AuthorRootState` | Type for author store state |
| `AuthorAppDispatch` | Type for store dispatch |

### Async Thunks

| Thunk | Description |
|-------|-------------|
| `fetchAuthors()` | Fetch all authors |
| `createAuthor(data)` | Create a new author |
| `updateAuthor(id, data)` | Update an existing author |
| `deleteAuthor(id)` | Delete an author |

## Development

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
```

## License

MIT
