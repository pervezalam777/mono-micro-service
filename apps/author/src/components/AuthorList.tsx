import { AuthorListProps } from '../types';
import { AuthorCard } from './AuthorCard';

export function AuthorList({ authors, onSelect, isLoading }: AuthorListProps) {
  if (isLoading) {
    return <div className="text-center py-10">Loading authors...</div>;
  }

  const renderNoAuthors = () => (
    <div className="text-center py-10 text-gray-500">No authors found</div>
  );

  if (!authors || authors.length === 0) {
    return renderNoAuthors(); 
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {authors && authors.length > 0 && authors.map((author) => (
        <AuthorCard key={author.id} author={author} onClick={onSelect ? () => onSelect(author) : undefined} />
      ))}
    </div>
  );
}
