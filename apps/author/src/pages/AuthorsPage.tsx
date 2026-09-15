import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthors } from '../hooks/useAuthors';
import { AuthorList } from '../components/AuthorList';
import { AuthorForm } from '../components/AuthorForm';
import { Author, AuthorFormData } from '../types';

/**
 * AuthorsPage - Container component for the authors list view
 */
export function AuthorsPage() {
  const navigate = useNavigate();
  const { authors, loading, error, onCreate } = useAuthors();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | undefined>();

  const handleSelect = (author: Author) => {
    navigate(`/authors/${author.id}`);
  };

  const handleCreateNew = () => {
    setSelectedAuthor(undefined);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (data: AuthorFormData) => {
    try {
      await onCreate(data);
      setIsFormVisible(false);
      setSelectedAuthor(undefined);
    } catch (error) {
      console.error('Failed to create author:', error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedAuthor(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Author
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {isFormVisible ? (
        <AuthorForm
          author={selectedAuthor}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isLoading={loading}
        />
      ) : (
        <AuthorList
          authors={authors}
          onSelect={handleSelect}
          isLoading={loading}
        />
      )}
    </div>
  );
}
