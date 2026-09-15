import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from '../store/authorsSlice';
import { Author } from '../types';

// Hook to manage authors list
export function useAuthors() {
  const dispatch = useAppDispatch();
  const { items, loading, error, success } = useAppSelector((state) => state.authors);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  const handleCreate = async (data: Partial<Author>) => {
    await dispatch(createAuthor(data));
  };

  const handleUpdate = async (id: string, data: Partial<Author>) => {
    await dispatch(updateAuthor({ id, data }));
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteAuthor(id));
  };

  const handleReset = () => {
    dispatch({ type: 'authors/resetAuthors' });
  };

  return {
    authors: items,
    loading,
    error,
    success,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onReset: handleReset,
  };
}

// Hook to manage a single author
export function useAuthor(id?: string) {
  const dispatch = useAppDispatch();
  const { items, loading, error, success } = useAppSelector((state) => state.authors);

  const author = id ? items.find((a) => a.id === id) : undefined;

  useEffect(() => {
    if (id) {
      // Note: In a real app, you'd have a fetchAuthor(id) endpoint
      // For now, we assume authors are pre-fetched
      dispatch(fetchAuthors());
    }
  }, [dispatch, id]);

  const handleUpdate = async (data: Partial<Author>) => {
    if (!id) return;
    await dispatch(updateAuthor({ id, data }));
  };

  return {
    author,
    loading,
    error,
    success,
    onUpdate: handleUpdate,
  };
}
