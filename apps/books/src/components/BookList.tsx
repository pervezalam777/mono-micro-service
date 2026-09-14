import { BookListProps } from '../types';
import { BookCard } from './BookCard';

export function BookList({ books, authors, onSelect, isLoading }: BookListProps) {
  if (isLoading) {
    return <div className="text-center py-10">Loading books...</div>;
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          author={authors.find((a) => a.id === book.authorId) || undefined}
          onClick={onSelect ? () => onSelect(book) : undefined}
        />
      ))}
      {books.length === 0 && (
        <div className="text-center py-10 text-gray-500">No books found</div>
      )}
    </div>
  );
}
