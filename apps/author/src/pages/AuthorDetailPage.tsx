import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthor } from '../hooks/useAuthors';
import { AuthorForm } from '../components/AuthorForm';
import { Author } from '../types';

/**
 * AuthorDetailPage - Container component for author detail and edit views
 */
export function AuthorDetailPage({ isNew = false }: { isNew?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { author, loading, error, onUpdate } = useAuthor(isNew ? undefined : id);
  const [formData, setFormData] = useState<Partial<Author>>({});

  useEffect(() => {
    if (author) {
      setFormData({
        firstName: author.firstName,
        lastName: author.lastName,
        email: author.email,
        bio: author.bio,
        profileImageUrl: author.profileImageUrl,
      });
    }
  }, [author]);

  const handleSubmit = async (data: typeof formData) => {
    if (isNew) {
      // For new authors, create directly
      try {
        await onUpdate(data);
        navigate('/authors');
      } catch (error) {
        console.error('Failed to create author:', error);
      }
    } else {
      // For existing authors, update
      if (id) {
        try {
          await onUpdate(data);
        } catch (error) {
          console.error('Failed to update author:', error);
        }
      }
    }
  };

  const handleCancel = () => {
    navigate('/authors');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/authors')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Authors
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'New Author' : 'Edit Author'}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">
          {error}
        </div>
      )}

      <AuthorForm
        author={author}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
}
