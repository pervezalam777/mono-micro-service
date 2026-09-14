export interface Book {
  id: string;
  title: string;
  isbn: string;
  authorId: string;
  author?: Author;
  description?: string;
  coverImageUrl?: string;
  publicationDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormProps {
  book?: Book;
  authors: Author[];
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface BookFormData {
  title: string;
  isbn: string;
  authorId: string;
  description?: string;
  coverImageUrl?: string;
  publicationDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  category?: string;
}

export interface BookListProps {
  books: Book[];
  authors: Author[];
  onSelect?: (book: Book) => void;
  isLoading?: boolean;
}

export interface BookCardProps {
  book: Book;
  author?: Author;
  onClick?: () => void;
}
