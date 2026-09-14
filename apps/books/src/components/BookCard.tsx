import { BookCardProps } from '../types';

export function BookCard({ book, author, onClick }: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            by {author ? `${author.firstName} ${author.lastName}` : 'Unknown Author'}
          </p>
          <p className="mt-2 text-sm text-gray-600">ISBN: {book.isbn}</p>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {book.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      {book.description && (
        <p className="mt-4 text-gray-700 line-clamp-2">{book.description}</p>
      )}
    </div>
  );
}
