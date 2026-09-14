import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Author } from '../types';

export default function AuthorDetail() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAuthor(id);
    }
  }, [id]);

  const fetchAuthor = async (authorId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/authors/${authorId}`);
      setAuthor(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch author');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-gray-500">Loading author details...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-red-500">{error || 'Author not found'}</p>
          <Link to="/authors" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/authors" className="text-xl font-medium text-gray-700 hover:text-gray-900">
                Authors
              </Link>
              <span className="mx-4 text-gray-300">/</span>
              <span className="text-gray-900 font-medium">
                {author.firstName} {author.lastName}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
              {author.firstName.charAt(0)}
              {author.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {author.firstName} {author.lastName}
              </h1>
              <p className="mt-2 text-gray-600">{author.email}</p>
              {author.bio && (
                <p className="mt-4 text-gray-700">{author.bio}</p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Author Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">First Name</span>
                <span className="mt-1 block text-gray-900">{author.firstName}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Last Name</span>
                <span className="mt-1 block text-gray-900">{author.lastName}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Email</span>
                <span className="mt-1 block text-gray-900">{author.email}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Status</span>
                <span className={`mt-1 block px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${author.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {author.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/authors" className="text-blue-600 hover:underline">
              Back to Authors
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
