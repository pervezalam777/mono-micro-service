import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Book, Author } from '../types';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async (bookId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/books/${bookId}`);
      const bookData = response.data.data;
      setBook(bookData);

      // Fetch author details
      if (bookData.authorId) {
        try {
          const authorResponse = await api.get(`/authors/${bookData.authorId}`);
          setAuthor(authorResponse.data.data);
        } catch (err) {
          console.error('Failed to fetch author:', err);
        }
      }

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch book');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-gray-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-red-500">{error || 'Book not found'}</p>
          <Link to="/books" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Books
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
              <Link to="/books" className="text-xl font-medium text-gray-700 hover:text-gray-900">
                Books
              </Link>
              <span className="mx-4 text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{book.title}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 h-32 w-24 rounded bg-gray-100 flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="mt-2 text-gray-600 text-lg">
                by{' '}
                <Link to={`/authors/${book.authorId}`} className="text-blue-600 hover:underline">
                  {author ? `${author.firstName} ${author.lastName}` : 'Loading...'}
                </Link>
              </p>
              {book.description && (
                <p className="mt-4 text-gray-700">{book.description}</p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">ISBN</span>
                <span className="mt-1 block text-gray-900">{book.isbn}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Publisher</span>
                <span className="mt-1 block text-gray-900">{book.publisher || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Publication Date</span>
                <span className="mt-1 block text-gray-900">{book.publicationDate || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Page Count</span>
                <span className="mt-1 block text-gray-900">{book.pageCount || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Language</span>
                <span className="mt-1 block text-gray-900">{book.language || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Category</span>
                <span className="mt-1 block text-gray-900">{book.category || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Status</span>
                <span className={`mt-1 block px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {book.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/books" className="text-blue-600 hover:underline">
              Back to Books
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
