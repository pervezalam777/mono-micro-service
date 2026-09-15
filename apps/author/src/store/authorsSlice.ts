import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Author } from '../types';

// Async thunks for author operations
export const fetchAuthors = createAsyncThunk<
  Author[],
  void,
  { rejectValue: string }
>('authors/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await fetch('/api/authors');
    if (!response.ok) {
      throw new Error('Failed to fetch authors');
    }
    return await response.json();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch authors');
  }
});

export const createAuthor = createAsyncThunk<
  Author,
  Partial<Author>,
  { rejectValue: string }
>('authors/create', async (authorData, thunkAPI) => {
  try {
    const response = await fetch('/api/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
    });
    if (!response.ok) {
      throw new Error('Failed to create author');
    }
    return await response.json();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to create author');
  }
});

export const updateAuthor = createAsyncThunk<
  Author,
  { id: string; data: Partial<Author> },
  { rejectValue: string }
>('authors/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await fetch(`/api/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update author');
    }
    return await response.json();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to update author');
  }
});

export const deleteAuthor = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('authors/delete', async (id, thunkAPI) => {
  try {
    const response = await fetch(`/api/authors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete author');
    }
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to delete author');
  }
});

// Types
export interface AuthorsState {
  items: Author[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthorsState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

// Slice
export const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetAuthors: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.success = true;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch authors';
      });

    // Create
    builder
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = true;
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create author';
      });

    // Update
    builder
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update author';
      });

    // Delete
    builder
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((a) => a.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete author';
      });
  },
});

export const { clearError, clearSuccess, resetAuthors } = authorsSlice.actions;

export default authorsSlice.reducer;
