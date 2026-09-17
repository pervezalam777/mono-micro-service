import { AuthorCardProps } from '../types';

export function AuthorCard({ author, onClick }: AuthorCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(author);
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {author.firstName.charAt(0)}
          {author.lastName.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {author.firstName} {author.lastName}
          </h3>
          <p className="text-sm text-gray-500">{author.email}</p>
          <div className="mt-2">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${author.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {author.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      {author.bio && (
        <p className="mt-4 text-gray-700 line-clamp-2">{author.bio}</p>
      )}
    </div>
  );
}
